import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>修改基本資料</DialogTitle>
          <DialogDescription>
            更新您的個人資訊，完成後點擊儲存。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" placeholder="請輸入姓名" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">電子郵件</Label>
            <Input id="email" type="email" placeholder="請輸入電子郵件" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">電話</Label>
            <Input id="phone" placeholder="請輸入電話號碼" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">職稱</Label>
            <Input id="title" placeholder="請輸入目前職稱" />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => onOpenChange(false)} className="gradient-primary">
            儲存變更
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
