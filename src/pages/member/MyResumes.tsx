import { useState, useRef, useCallback } from 'react';
import { FileText, Download, Trash2, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RightDrawer from '@/components/panels/RightDrawer';
import { motion } from 'framer-motion';
import LoginRequired from '@/components/gatekeeper/LoginRequired';
import { useResumes, type ResumeItem } from '@/contexts/ResumeContext';
import { ResumeTemplateRenderer, TEMPLATE_THEMES } from '@/components/resume/ResumeTemplates';
import AlertModal from '@/components/modals/AlertModal';
import html2pdf from 'html2pdf.js';

/** Clone a rendered DOM element and inline styles for accurate PDF output */
async function exportElementToPdf(element: HTMLElement, filename: string) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = '794px';
  clone.style.padding = '24px';
  clone.style.margin = '0';
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.backgroundColor = '#ffffff';
  clone.style.fontFamily = "'Noto Sans TC', 'Microsoft JhengHei', sans-serif";
  // Remove any scale transform from preview
  clone.style.transform = 'none';

  // Remove scaled inner wrapper if present
  const scaledChild = clone.querySelector('[data-pdf-scale-wrapper]') as HTMLElement | null;
  if (scaledChild) {
    scaledChild.style.transform = 'none';
    scaledChild.style.width = '100%';
  }

  // Force responsive grid layouts to desktop
  clone.querySelectorAll('[class*="md\\:grid-cols"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const classes = htmlEl.className;
    const mdMatch = classes.match(/md:grid-cols-\[([^\]]+)\]/);
    if (mdMatch) {
      htmlEl.style.display = 'grid';
      htmlEl.style.gridTemplateColumns = mdMatch[1];
    }
    const mdSimple = classes.match(/md:grid-cols-(\d+)/);
    if (mdSimple) {
      htmlEl.style.display = 'grid';
      htmlEl.style.gridTemplateColumns = `repeat(${mdSimple[1]}, minmax(0, 1fr))`;
    }
  });

  clone.querySelectorAll('[class*="md\\:flex-row"]').forEach((el) => {
    (el as HTMLElement).style.flexDirection = 'row';
  });
  clone.querySelectorAll('[class*="md\\:text-left"]').forEach((el) => {
    (el as HTMLElement).style.textAlign = 'left';
  });
  clone.querySelectorAll('[class*="md\\:justify-start"]').forEach((el) => {
    (el as HTMLElement).style.justifyContent = 'flex-start';
  });
  clone.querySelectorAll('[class*="flex-wrap"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.display = 'flex';
    htmlEl.style.flexWrap = 'wrap';
  });
  clone.querySelectorAll('[class*="gap-"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const gapMatch = htmlEl.className.match(/\bgap-(\d+)\b/);
    if (gapMatch) {
      htmlEl.style.gap = `${parseInt(gapMatch[1]) * 4}px`;
    }
  });
  clone.querySelectorAll('[class*="rounded-full"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.borderRadius = '9999px';
    htmlEl.style.display = 'inline-block';
    if (htmlEl.className.includes('px-3')) htmlEl.style.paddingLeft = htmlEl.style.paddingRight = '12px';
    if (htmlEl.className.includes('py-1')) htmlEl.style.paddingTop = htmlEl.style.paddingBottom = '4px';
    if (htmlEl.className.includes('text-sm')) htmlEl.style.fontSize = '14px';
  });
  clone.querySelectorAll('[class*="space-y-"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const m = htmlEl.className.match(/\bspace-y-(\d+)\b/);
    if (m) {
      const gap = parseInt(m[1]) * 4;
      Array.from(htmlEl.children).forEach((child, i) => {
        if (i > 0) (child as HTMLElement).style.marginTop = `${gap}px`;
      });
    }
  });

  // Wait for images
  const images = clone.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(
      (img) => new Promise<void>((resolve) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
      })
    )
  );

  document.body.appendChild(clone);

  clone.querySelectorAll('[data-pdf-section]').forEach((section) => {
    (section as HTMLElement).style.pageBreakInside = 'avoid';
    (section as HTMLElement).style.breakInside = 'avoid';
  });

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false, width: 794, windowWidth: 794 },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: ['[data-pdf-section]', '.avoid-break'] },
  };

  await html2pdf().set(opt).from(clone).save();
  document.body.removeChild(clone);
}

/** Export plain text content as PDF */
async function exportTextToPdf(name: string, content: string) {
  const { exportHtmlToPdf, buildResumeContentHtml } = await import('@/utils/pdfExport');
  await exportHtmlToPdf({
    filename: `${name.replace(/\.[^.]+$/, '')}.pdf`,
    htmlContent: buildResumeContentHtml(name, content),
  });
}

const MyResumes = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeItem | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { resumes, removeResume } = useResumes();
  const [deleteTarget, setDeleteTarget] = useState<ResumeItem | null>(null);

  const handlePreview = (resume: ResumeItem) => {
    setSelectedResume(resume);
    setDrawerOpen(true);
  };

  const isSiteOptimized = (resume: ResumeItem) =>
    resume.version === 'site-optimized' && resume.optimizedData && resume.templateId;

  const downloadResume = useCallback(async (resume: ResumeItem, fromDrawer = false) => {
    const pdfName = `${resume.name.replace(/\.[^.]+$/, '')}.pdf`;

    if (isSiteOptimized(resume)) {
      // For drawer download, use the rendered preview DOM
      if (fromDrawer && previewRef.current) {
        await exportElementToPdf(previewRef.current, pdfName);
        return;
      }
      // For list download, create a temporary off-screen render
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '794px';
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.fontFamily = "'Noto Sans TC', 'Microsoft JhengHei', sans-serif";
      document.body.appendChild(tempDiv);

      // We need to render the template into this div via React
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      root.render(
        <ResumeTemplateRenderer
          templateId={resume.templateId!}
          themeIndex={resume.themeIndex ?? 0}
          data={resume.optimizedData!}
        />
      );

      // Wait for render
      await new Promise((r) => setTimeout(r, 500));

      await exportElementToPdf(tempDiv, pdfName);
      root.unmount();
      document.body.removeChild(tempDiv);
    } else {
      await exportTextToPdf(resume.name, resume.content);
    }
  }, []);

  const handleDrawerDownload = async () => {
    if (!selectedResume) return;
    setIsDownloading(true);
    try {
      await downloadResume(selectedResume, true);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleListDownload = async (resume: ResumeItem) => {
    setDownloadingId(resume.id);
    try {
      await downloadResume(resume, false);
    } finally {
      setDownloadingId(null);
    }
  };

  const renderPreviewContent = (resume: ResumeItem) => {
    if (isSiteOptimized(resume)) {
      return (
        <div ref={previewRef} className="bg-white rounded-lg overflow-hidden">
          <div
            data-pdf-scale-wrapper
            style={{
              transform: 'scale(0.55)',
              transformOrigin: 'top left',
              width: '182%',
            }}
          >
            <ResumeTemplateRenderer
              templateId={resume.templateId!}
              themeIndex={resume.themeIndex ?? 0}
              data={resume.optimizedData!}
            />
          </div>
        </div>
      );
    }

    return (
      <div ref={previewRef} className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed bg-muted/30 p-3 md:p-4 rounded-lg font-mono">
        {resume.content}
      </div>
    );
  };

  return (
    <LoginRequired>
      <div className="container py-8 md:py-12 animate-fade-in">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 mb-4 md:mb-6">
            <FileText className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">我的履歷</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            管理您已上傳的履歷檔案
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-4 md:mb-6">
            <Link to="/member/upload-resume">
              <Button className="gradient-primary text-sm md:text-base">上傳新履歷</Button>
            </Link>
          </div>

          <div className="space-y-3 md:space-y-4">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-medium transition-shadow">
                  <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 md:py-4 gap-3">
                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm md:text-base truncate">{resume.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">更新於 {resume.updatedAt}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 md:gap-2 w-full sm:w-auto justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handlePreview(resume)} className="h-8 w-8 md:h-9 md:w-9">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 md:h-9 md:w-9"
                        disabled={downloadingId === resume.id}
                        onClick={() => handleListDownload(resume)}
                      >
                        {downloadingId === resume.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 md:h-9 md:w-9" onClick={() => setDeleteTarget(resume)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <RightDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="履歷預覽"
          subtitle={selectedResume?.name}
          showDownload
          onDownload={handleDrawerDownload}
          isDownloading={isDownloading}
        >
          {selectedResume && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {renderPreviewContent(selectedResume)}
            </motion.div>
          )}
        </RightDrawer>
      </div>
    </LoginRequired>
  );
};

export default MyResumes;
