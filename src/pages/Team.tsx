import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const Team = () => {
  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">團隊介紹</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          認識我們專業的團隊成員
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="text-center">
            <CardHeader>
              <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4" />
              <CardTitle>團隊成員 {i}</CardTitle>
              <CardDescription>職位名稱</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                團隊成員簡介內容待補充
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;
