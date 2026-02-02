import { Code2, Compass, ArrowRight, RefreshCw } from 'lucide-react';

const Team = () => {
  const leftValues = [
    {
      icon: Code2,
      title: '我們是誰',
      description: '我們是一個由信念驅動的團隊，相信簡單的想法能改變世界。',
    },
    {
      icon: RefreshCw,
      title: '我們的使命',
      description: '每一天，我們都在努力將客戶的夢想轉化為現實。',
    },
  ];

  const rightValues = [
    {
      icon: Compass,
      title: '我們的願景',
      description: '建立一個更好的未來，一次一個項目。',
    },
    {
      icon: ArrowRight,
      title: '我們如何開始',
      description: '從最初的想法到今天的成就，我們從未停止前進。',
    },
  ];

  const partners = [
    { name: 'Partner 1', placeholder: true },
    { name: 'Partner 2', placeholder: true },
    { name: 'Partner 3', placeholder: true },
    { name: 'Partner 4', placeholder: true },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section - 核心理念區 */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-3">關於我們</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">我們的經營理念</h1>
            <p className="text-muted-foreground text-lg">
              我們存在是為了做一件事。將想法轉化為行動，將挑戰轉化為機會。
            </p>
          </div>

          {/* Three Column Value Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Left Column - Desktop: first, Mobile: first */}
            <div className="flex flex-col gap-12 order-1">
              {leftValues.map((item, index) => (
                <div key={index} className="text-center lg:text-center">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-primary/10 mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Center - Image Placeholder: Desktop: second, Mobile: last (order-3) */}
            <div className="order-3 lg:order-2">
              <div className="aspect-[4/5] bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="h-16 w-16 mx-auto mb-4 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-muted-foreground/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">形象圖片預留位</p>
                </div>
              </div>
            </div>

            {/* Right Column - Desktop: third, Mobile: second (order-2) */}
            <div className="flex flex-col gap-12 order-2 lg:order-3">
              {rightValues.map((item, index) => (
                <div key={index} className="text-center lg:text-center">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-primary/10 mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - 合作夥伴區 */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              我們信任的合作夥伴
            </h2>
            <p className="text-muted-foreground">
              這些組織與我們共同推進行業的發展與創新。
            </p>
          </div>

          {/* Logo Wall */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="h-20 bg-background rounded-lg border border-border/50 flex items-center justify-center px-6 hover:border-primary/30 transition-colors"
              >
                <span className="text-muted-foreground font-medium">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
