import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();

  return (
    <div className="container py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">職缺名稱 #{id}</CardTitle>
                <CardDescription className="text-lg">公司名稱</CardDescription>
              </div>
              <Button className="gradient-primary">立即應徵</Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                台北市
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                面議
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                全職
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">職缺描述</h3>
              <p className="text-muted-foreground">職缺詳細描述內容待補充</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">所需技能</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">技能 1</Badge>
                <Badge variant="secondary">技能 2</Badge>
                <Badge variant="secondary">技能 3</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">工作要求</h3>
              <p className="text-muted-foreground">工作要求內容待補充</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobDetail;
