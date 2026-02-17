import { BarChart3, RefreshCw, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import type { PersonalityResult, Dimension } from '@/data/personalityScoring';
import { DIMENSIONS, DIMENSION_LABELS } from '@/data/personalityScoring';

interface Props {
  result: PersonalityResult;
  onReset: () => void;
}

const PersonalityTestResult = ({ result, onReset }: Props) => {
  const navigate = useNavigate();
  const { scaledScores, archetypes } = result;

  const radarData = DIMENSIONS.map((dim) => ({
    dimension: DIMENSION_LABELS[dim],
    score: scaledScores[dim],
    fullMark: 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Archetype Card */}
      <Card className="rounded-2xl border-0 bg-white shadow-[0_4px_20px_rgba(150,105,73,0.08)]">
        <CardContent className="p-6 md:p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-3">您的人格原型</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {archetypes.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary"
              >
                {a.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart Card */}
      <Card className="rounded-2xl border-0 bg-white shadow-[0_4px_20px_rgba(150,105,73,0.08)]">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-base font-semibold text-center mb-4">五大維度分析</h3>
          <div className="w-full h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="hsl(27, 30%, 85%)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: 'hsl(23, 21%, 33%)', fontSize: 13, fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="分數"
                  dataKey="score"
                  stroke="#8d4903"
                  fill="#8d4903"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Score Bars Card */}
      <Card className="rounded-2xl border-0 bg-white shadow-[0_4px_20px_rgba(150,105,73,0.08)]">
        <CardContent className="p-6 md:p-8 space-y-4">
          <h3 className="text-base font-semibold text-center mb-2">各維度標準化分數</h3>
          {DIMENSIONS.map((dim) => (
            <div key={dim} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">{DIMENSION_LABELS[dim]}</span>
                <span className="font-semibold">{scaledScores[dim]}</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#8d4903' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${scaledScores[dim]}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button onClick={() => navigate('/analysis/skills')} className="gradient-primary h-12">
          <BarChart3 className="h-4 w-4 mr-2" />
          查看職能圖譜
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="h-12 border-primary/40 text-primary hover:bg-primary/5"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          重新填寫問卷
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonalityTestResult;
