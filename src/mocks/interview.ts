import type { InterviewTopic } from '@/types/interview';

// TODO: Replace with API call
export const mockTopics: InterviewTopic[] = [
  { title: '自我介紹', description: '如何有效地展現自己' },
  { title: '技術面試', description: '常見技術問題與解答技巧' },
  { title: '行為面試', description: 'STAR 法則與實例演練' },
  { title: '薪資談判', description: '如何談出理想薪資' },
];

// TODO: Replace with API call
export const mockThankYouLetter = `親愛的 [面試官姓名]：

非常感謝您今天撥冗與我進行面試，讓我有機會更深入地了解貴公司及這個職位。

在面試過程中，我對於 [討論的專案/技術/團隊文化] 印象深刻。這更加堅定了我希望加入貴公司的意願。

我相信我在 [相關技能/經驗] 方面的專業能力，能夠為團隊帶來價值。

如有任何問題或需要補充資料，請隨時與我聯繫。

再次感謝您的時間與考慮。

祝好

[您的姓名]
[聯絡方式]`;
