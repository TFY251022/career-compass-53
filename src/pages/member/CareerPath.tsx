import { useState } from 'react';
import { Map, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RightDrawer from '@/components/panels/RightDrawer';
import { motion } from 'framer-motion';

const CareerPath = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  const milestones = [
    { 
      year: '現在', 
      title: '軟體工程師', 
      status: 'current',
      details: {
        description: '專注於前端開發與使用者體驗優化',
        skills: ['React', 'TypeScript', 'CSS'],
        salary: '50K - 70K',
        tasks: ['開發維護產品前端', '與設計師合作優化 UI/UX', '程式碼審查與重構'],
      }
    },
    { 
      year: '2年後', 
      title: '資深工程師', 
      status: 'future',
      details: {
        description: '帶領小型專案，指導初階工程師',
        skills: ['系統設計', '技術領導', '效能優化'],
        salary: '80K - 100K',
        tasks: ['技術決策與架構設計', '帶領專案團隊', '制定開發規範'],
      }
    },
    { 
      year: '5年後', 
      title: '技術主管', 
      status: 'future',
      details: {
        description: '管理工程團隊，規劃技術路線圖',
        skills: ['團隊管理', '策略規劃', '跨部門溝通'],
        salary: '120K - 150K',
        tasks: ['招募與培育人才', '技術路線規劃', '預算管理'],
      }
    },
    { 
      year: '10年後', 
      title: '技術總監', 
      status: 'future',
      details: {
        description: '制定公司技術策略，推動技術創新',
        skills: ['企業策略', '技術願景', '高階管理'],
        salary: '200K+',
        tasks: ['技術策略制定', '技術投資決策', '建立技術文化'],
      }
    },
  ];

  const handleMilestoneClick = (milestone: any) => {
    setSelectedMilestone(milestone);
    setDrawerOpen(true);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Map className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">職涯地圖</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          規劃您的職涯發展藍圖
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>職涯發展時程</CardTitle>
            <CardDescription>根據您的技能與目標規劃的發展路徑，點擊查看詳情</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center gap-6 pl-10 cursor-pointer group"
                    onClick={() => handleMilestoneClick(milestone)}
                  >
                    <div className={`absolute left-2 w-5 h-5 rounded-full border-2 transition-all ${
                      milestone.status === 'current' 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-muted-foreground group-hover:border-primary'
                    }`} />
                    <div className="flex-1 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <p className="text-sm text-muted-foreground">{milestone.year}</p>
                      <p className="font-semibold text-lg">{milestone.title}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedMilestone?.title || ''}
        subtitle={`目標時程：${selectedMilestone?.year || ''}`}
      >
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h4 className="font-medium mb-2">職位描述</h4>
              <p className="text-muted-foreground text-sm">{selectedMilestone.details.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">所需技能</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMilestone.details.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">預期薪資</h4>
              <p className="text-lg font-semibold text-primary">NT$ {selectedMilestone.details.salary}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">主要職責</h4>
              <ul className="space-y-2">
                {selectedMilestone.details.tasks.map((task: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </RightDrawer>
    </div>
  );
};

export default CareerPath;
