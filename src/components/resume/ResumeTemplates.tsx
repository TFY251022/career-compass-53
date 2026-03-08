import { Briefcase, GraduationCap, Mail, Phone, Linkedin, Code, FileText, FolderOpen, Sparkles } from 'lucide-react';
import logoCat from '@/assets/logocat.png';

export interface ThemeColors {
  name: string;
  main: string;
  secondary: string;
  accent: string;
  text: string;
}

export const TEMPLATE_THEMES: Record<string, ThemeColors[]> = {
  corporate: [
    { name: '深海藍經典', main: '#1F3A5F', secondary: '#4A6FA5', accent: '#C8A951', text: '#2B2B2B' },
    { name: '石墨灰商務', main: '#2E2E2E', secondary: '#5A5A5A', accent: '#2E7D73', text: '#1A1A1A' },
    { name: '酒紅權威', main: '#6A1B2E', secondary: '#A63D40', accent: '#E9C46A', text: '#333333' },
    { name: '深綠金融系', main: '#1B4332', secondary: '#2D6A4F', accent: '#D8F3DC', text: '#2B2B2B' },
  ],
  modern: [
    { name: '科技藍', main: '#2563EB', secondary: '#1E3A8A', accent: '#60A5FA', text: '#111827' },
    { name: '冷灰＋電光綠', main: '#374151', secondary: '#6B7280', accent: '#10B981', text: '#111111' },
    { name: '黑白極簡', main: '#111111', secondary: '#E5E7EB', accent: '#6366F1', text: '#000000' },
    { name: '靜謐藍灰', main: '#334155', secondary: '#94A3B8', accent: '#22D3EE', text: '#1E293B' },
  ],
  creative: [
    { name: '莫蘭迪粉橘', main: '#E07A5F', secondary: '#C9604A', accent: '#E8A87C', text: '#2B2B2B' },
    { name: '紫藍創意系', main: '#6D28D9', secondary: '#5320A8', accent: '#9F6CEE', text: '#1F1F1F' },
    { name: '活力橘藍對比', main: '#F97316', secondary: '#D95F0E', accent: '#FDBA74', text: '#222222' },
    { name: '黑底霓虹', main: '#0F172A', secondary: '#1E293B', accent: '#475569', text: '#2B2B2B' },
  ],
};

import type { ResumeData } from '@/types/resume';

// ── Section Helpers ──

export const TemplateSectionWithColor = ({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: ThemeColors;
}) => (
  <div>
    <h2
      className="text-lg font-bold pb-1 mb-3"
      style={{
        color: theme.main,
        borderBottom: `1px solid ${theme.main}40`,
      }}
    >
      {title}
    </h2>
    <div className="text-sm">{children}</div>
  </div>
);

export const CreativeSectionWithColor = ({
  title,
  children,
  theme,
  useSecondary = false,
  fullWidth = false,
}: {
  title: string;
  children: React.ReactNode;
  theme: ThemeColors;
  useSecondary?: boolean;
  fullWidth?: boolean;
}) => (
  <div
    className={`p-4 rounded-lg bg-white/50 dark:bg-white/5 ${fullWidth ? 'col-span-full' : ''}`}
    style={{ borderLeft: `4px solid ${useSecondary ? theme.secondary : theme.main}` }}
  >
    <h3
      className="font-semibold mb-3"
      style={{ color: useSecondary ? theme.secondary : theme.main }}
    >
      {title}
    </h3>
    <div className="text-sm">{children}</div>
  </div>
);

// ── Corporate Template ──

export const CorporateTemplate = ({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ThemeColors;
}) => (
  <div className="font-serif space-y-6" style={{ color: theme.text }}>
    <div
      className="text-center pb-4 avoid-break"
      data-pdf-section
      style={{ borderBottom: `2px solid ${theme.main}` }}
    >
      <h1 className="text-3xl font-bold tracking-wide" style={{ color: theme.main }}>
        {data.name}
      </h1>
      <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm" style={{ color: theme.secondary }}>
        <span>{data.email}</span>
        <span>|</span>
        <span>{data.phone}</span>
        {data.linkedin && <><span>|</span><span>{data.linkedin}</span></>}
        {data.github && <><span>|</span><span>{data.github}</span></>}
      </div>
    </div>

    {data.professional_summary && (
      <div data-pdf-section className="avoid-break">
        <TemplateSectionWithColor title="專業摘要" theme={theme}>
          <span className="whitespace-pre-line">{data.professional_summary}</span>
        </TemplateSectionWithColor>
      </div>
    )}

    <div data-pdf-section className="avoid-break">
      <TemplateSectionWithColor title="學歷" theme={theme}>
        <span className="whitespace-pre-line">{data.education}</span>
      </TemplateSectionWithColor>
    </div>

    <div data-pdf-section className="avoid-break">
      <TemplateSectionWithColor title="工作經驗" theme={theme}>
        <span className="whitespace-pre-line">{data.professional_experience}</span>
      </TemplateSectionWithColor>
    </div>

    <div data-pdf-section className="avoid-break">
      <TemplateSectionWithColor title="技能專長" theme={theme}>
        <span className="whitespace-pre-line">{data.core_skills}</span>
      </TemplateSectionWithColor>
    </div>

    {data.projects && (
      <div data-pdf-section className="avoid-break">
        <TemplateSectionWithColor title="專案作品集" theme={theme}>
          <span className="whitespace-pre-line">{data.projects}</span>
        </TemplateSectionWithColor>
      </div>
    )}

    {data.autobiography && (
      <div data-pdf-section className="avoid-break">
        <TemplateSectionWithColor title="自傳" theme={theme}>
          <span className="whitespace-pre-line">{data.autobiography}</span>
        </TemplateSectionWithColor>
      </div>
    )}
  </div>
);

// ── Modern Template ──

export const ModernTemplate = ({
  data,
  theme,
  avatarUrl,
}: {
  data: ResumeData;
  theme: ThemeColors;
  avatarUrl: string | null;
}) => {
  const skills = data.core_skills.split(',').map(s => s.trim());
  const avatarSrc = avatarUrl || logoCat;

  return (
    <div className="grid md:grid-cols-[1fr_2.5fr] gap-6">
      {/* Left Sidebar */}
      <div
        className="space-y-6 p-4 rounded-lg avoid-break"
        data-pdf-section
        style={{ backgroundColor: `${theme.main}10` }}
      >
        <div
          className="h-32 w-32 mx-auto rounded-full flex items-center justify-center overflow-hidden border-2"
          style={{ borderColor: theme.main }}
        >
          <img src={avatarSrc} alt={data.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" style={{ color: theme.main }} />
            <span className="text-xs">{data.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" style={{ color: theme.main }} />
            <span className="text-xs">{data.phone}</span>
          </div>
          {data.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" style={{ color: theme.main }} />
              <span className="text-xs">{data.linkedin}</span>
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" style={{ color: theme.main }} />
              <span className="text-xs">{data.github}</span>
            </div>
          )}
        </div>

        {/* Skills with Progress Bars */}
        <div className="space-y-3">
          <h3
            className="font-semibold text-sm pb-1"
            style={{ borderBottom: `1px solid ${theme.main}30` }}
          >
            技能專長
          </h3>
          <div className="space-y-2">
            {skills.slice(0, 6).map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{skill}</span>
                  <span>{95 - i * 8}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.secondary}30` }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${95 - i * 8}%`,
                      backgroundColor: theme.main,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="space-y-6">
        <div data-pdf-section className="avoid-break">
          <h1 className="text-3xl font-bold" style={{ color: theme.main }}>
            {data.name}
          </h1>
          {data.professional_summary && (
            <p className="mt-1 whitespace-pre-line" style={{ color: theme.text }}>
              {data.professional_summary}
            </p>
          )}
        </div>

        <div className="space-y-4" data-pdf-section>
          <h3
            className="font-semibold text-lg pb-1 flex items-center gap-2 avoid-break"
            style={{ borderBottom: `1px solid ${theme.main}30` }}
          >
            <Briefcase className="h-4 w-4" style={{ color: theme.main }} />
            工作經驗
          </h3>
          <span className="whitespace-pre-line text-sm">{data.professional_experience}</span>
        </div>

        <div className="space-y-4" data-pdf-section>
          <h3
            className="font-semibold text-lg pb-1 flex items-center gap-2 avoid-break"
            style={{ borderBottom: `1px solid ${theme.main}30` }}
          >
            <GraduationCap className="h-4 w-4" style={{ color: theme.main }} />
            學歷
          </h3>
          <span className="whitespace-pre-line text-sm">{data.education}</span>
        </div>

        {data.projects && (
          <div className="space-y-4" data-pdf-section>
            <h3
              className="font-semibold text-lg pb-1 flex items-center gap-2 avoid-break"
              style={{ borderBottom: `1px solid ${theme.main}30` }}
            >
              <FolderOpen className="h-4 w-4" style={{ color: theme.main }} />
              專案作品集
            </h3>
            <span className="whitespace-pre-line text-sm">{data.projects}</span>
          </div>
        )}

        {data.autobiography && (
          <div className="space-y-4" data-pdf-section>
            <h3
              className="font-semibold text-lg pb-1 flex items-center gap-2 avoid-break"
              style={{ borderBottom: `1px solid ${theme.main}30` }}
            >
              <FileText className="h-4 w-4" style={{ color: theme.main }} />
              自傳
            </h3>
            <span className="whitespace-pre-line text-sm">{data.autobiography}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Creative Template ──

export const CreativeTemplate = ({
  data,
  theme,
  avatarUrl,
}: {
  data: ResumeData;
  theme: ThemeColors;
  avatarUrl: string | null;
}) => {
  const avatarSrc = avatarUrl || logoCat;

  return (
    <div className="relative">
      <div
        className="absolute inset-0 rounded-lg opacity-10"
        style={{ backgroundColor: theme.main }}
      />

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 avoid-break" data-pdf-section>
          <div className="relative">
            <div
              className="h-36 w-36 rounded-full p-1"
              style={{ backgroundColor: theme.main }}
            >
              <div className="h-full w-full rounded-full overflow-hidden">
                <img src={avatarSrc} alt={data.name} className="h-full w-full object-cover" />
              </div>
            </div>
            <div
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.accent }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1
              className="text-4xl font-bold"
              style={{ color: theme.main }}
            >
              {data.name}
            </h1>
            {data.professional_summary && (
              <p className="mt-2 whitespace-pre-line" style={{ color: theme.text }}>
                {data.professional_summary}
              </p>
            )}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1" style={{ color: theme.main }}>
                <Mail className="h-4 w-4" />
                {data.email}
              </span>
              <span className="flex items-center gap-1" style={{ color: theme.secondary }}>
                <Phone className="h-4 w-4" />
                {data.phone}
              </span>
              {data.linkedin && (
                <span className="flex items-center gap-1" style={{ color: theme.main }}>
                  <Linkedin className="h-4 w-4" />
                  {data.linkedin}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div data-pdf-section className="avoid-break">
            <CreativeSectionWithColor title="工作經驗" theme={theme}>
              <span className="whitespace-pre-line">{data.professional_experience}</span>
            </CreativeSectionWithColor>
          </div>

          <div data-pdf-section className="avoid-break">
            <CreativeSectionWithColor title="學歷" theme={theme} useSecondary>
              <span className="whitespace-pre-line">{data.education}</span>
            </CreativeSectionWithColor>
          </div>
        </div>

        {/* Skills as Pills */}
        <div data-pdf-section className="avoid-break">
          <CreativeSectionWithColor title="技能專長" theme={theme} fullWidth>
            <div className="flex flex-wrap gap-2">
              {data.core_skills.split(',').map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: `${theme.accent}20`,
                    color: theme.main,
                  }}
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </CreativeSectionWithColor>
        </div>

        {/* Projects */}
        {data.projects && (
          <div data-pdf-section className="avoid-break">
            <CreativeSectionWithColor title="專案作品集" theme={theme} fullWidth useSecondary>
              <span className="whitespace-pre-line">{data.projects}</span>
            </CreativeSectionWithColor>
          </div>
        )}

        {/* Autobiography */}
        {data.autobiography && (
          <div data-pdf-section className="avoid-break">
            <CreativeSectionWithColor title="自傳" theme={theme} fullWidth>
              <span className="whitespace-pre-line">{data.autobiography}</span>
            </CreativeSectionWithColor>
          </div>
        )}
      </div>
    </div>
  );
};

/** Render the appropriate template by ID */
export const ResumeTemplateRenderer = ({
  templateId,
  themeIndex,
  data,
  avatarUrl = null,
}: {
  templateId: string;
  themeIndex: number;
  data: ResumeData;
  avatarUrl?: string | null;
}) => {
  const themes = TEMPLATE_THEMES[templateId] || TEMPLATE_THEMES.corporate;
  const theme = themes[themeIndex] || themes[0];

  switch (templateId) {
    case 'modern':
      return <ModernTemplate data={data} theme={theme} avatarUrl={avatarUrl} />;
    case 'creative':
      return <CreativeTemplate data={data} theme={theme} avatarUrl={avatarUrl} />;
    case 'corporate':
    default:
      return <CorporateTemplate data={data} theme={theme} />;
  }
};
