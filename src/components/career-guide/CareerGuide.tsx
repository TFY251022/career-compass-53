import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CareerGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      icon: '✨',
      title: '歡迎來到職星領航員！',
      description: '我是你的專屬職涯接待員 🚀 讓我帶你快速了解這個平台！',
    },
    {
      icon: '📄',
      title: '上傳你的履歷',
      description: '首先上傳你的履歷，我們會幫你分析技能並提供優化建議。',
      action: () => navigate('/member/upload-resume'),
      actionLabel: '上傳履歷',
    },
    {
      icon: '🎯',
      title: '探索職缺匹配',
      description: '根據你的技能和偏好，我們會推薦最適合的職缺給你。',
      action: () => navigate('/jobs/recommendations'),
      actionLabel: '查看推薦',
    },
    {
      icon: '💼',
      title: '準備面試',
      description: '使用我們的面試輔助工具，模擬練習並生成感謝函！',
      action: () => navigate('/interview/prep'),
      actionLabel: '開始準備',
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleAction = () => {
    const slide = slides[currentSlide];
    if (slide.action) {
      slide.action();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full gradient-primary shadow-large flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Guide Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="bg-background rounded-2xl shadow-large border overflow-hidden">
              {/* Header */}
              <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">職星接待員</h3>
                    <p className="text-xs opacity-80">Career Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-1.5 py-3 bg-muted/30">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'w-6 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-4">{slides[currentSlide].icon}</div>
                    <h4 className="text-lg font-semibold mb-2">
                      {slides[currentSlide].title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {slides[currentSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="p-4 border-t bg-muted/20">
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    上一步
                  </Button>

                  {slides[currentSlide].action ? (
                    <Button
                      size="sm"
                      className="gradient-primary gap-1"
                      onClick={handleAction}
                    >
                      {slides[currentSlide].actionLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : currentSlide < slides.length - 1 ? (
                    <Button
                      size="sm"
                      className="gradient-primary gap-1"
                      onClick={nextSlide}
                    >
                      開始導覽
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      完成
                    </Button>
                  )}

                  {currentSlide < slides.length - 1 && slides[currentSlide].action && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextSlide}
                      className="gap-1"
                    >
                      下一步
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CareerGuide;
