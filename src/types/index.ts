export interface EmotionScore {
  joy: number; // Vui vẻ (0-100)
  sadness: number; // Buồn bã (0-100)
  anger: number; // Tức giận (0-100)
  anxiety: number; // Lo âu / Căng thẳng (0-100)
  optimism: number; // Lạc quan / Bình yên (0-100)
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  moodEmoji: string;
  moodLabel: string;
  tags: string[];
  emotions: EmotionScore;
  dominantEmotion: string;
  sentimentScore: number; // -100 to +100
  triggers: string[];
  empathyMessage: string;
  selfCareTips: string[];
  safetyRisk?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  safetyTriggered?: boolean;
  suggestedActions?: string[];
  officialSources?: string[];
}

export interface SafetyTopic {
  id: string;
  category: 'cyberbullying' | 'privacy' | 'fakenews' | 'grooming';
  title: string;
  badge: string;
  subtitle: string;
  iconName: string;
  colorBg: string;
  colorBorder: string;
  colorAccent: string;
  summary: string;
  comicVisual: {
    title: string;
    description: string;
    icon: string;
  };
  keyRules: {
    rule: string;
    detail: string;
  }[];
  actionGuide: string[];
  cautionSigns: string[];
  verifiedSources: {
    name: string;
    desc: string;
    url?: string;
  }[];
}

export interface SafetyQuiz {
  id: string;
  category: string;
  question: string;
  context: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface HotlineContact {
  name: string;
  number: string;
  shortDesc: string;
  badge: string;
  available: string;
  isFree: boolean;
  type: 'children' | 'mental_health' | 'cyber_safety' | 'police';
}
