import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AILoadingSpinner, ContentTransition, CardSkeleton } from '@/components/loading/LoadingStates';
import { motion } from 'framer-motion';

interface JobResult {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
}

const SkillSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<JobResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResults([
      { id: 1, title: '前端工程師', company: '科技公司 A', location: '台北市', salary: '60K-80K', skills: ['React', 'TypeScript', 'CSS'] },
      { id: 2, title: '全端工程師', company: '新創公司 B', location: '新竹市', salary: '70K-100K', skills: ['React', 'Node.js', 'PostgreSQL'] },
      { id: 3, title: '資深前端工程師', company: '外商公司 C', location: '台北市', salary: '80K-120K', skills: ['React', 'Vue', 'Angular'] },
    ]);
    
    setIsLoading(false);
  }, [searchTerm]);

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">技能搜尋職缺</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          輸入您的技能，找到最匹配的職缺
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <Input 
            placeholder="輸入技能關鍵字，例如：React, Python, 專案管理..." 
            className="flex-1" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button className="gradient-primary" onClick={handleSearch} disabled={isLoading}>
            搜尋
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <ContentTransition
          isLoading={isLoading}
          skeleton={
            <div className="space-y-4">
              <AILoadingSpinner message="正在為您尋找合適職缺..." />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          }
        >
          {hasSearched && results.length > 0 ? (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-muted-foreground mb-4">
                找到 {results.length} 個符合的職缺
              </p>
              {results.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-medium transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription>{job.company} · {job.location}</CardDescription>
                        </div>
                        <Badge variant="secondary">{job.salary}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/jobs/${job.id}`}>查看詳情</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : hasSearched ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">沒有找到符合的職缺，請嘗試其他關鍵字</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="hover:shadow-medium transition-shadow">
              <CardHeader>
                <CardTitle>職缺搜尋結果</CardTitle>
                <CardDescription>請輸入技能關鍵字開始搜尋</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">搜尋結果將顯示在此處</p>
              </CardContent>
            </Card>
          )}
        </ContentTransition>
      </div>
    </div>
  );
};

export default SkillSearch;
