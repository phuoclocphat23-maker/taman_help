import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import {
  Send,
  Sparkles,
  Wind,
  PhoneCall,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  X,
  Copy,
  Check,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowRight,
  BookmarkCheck,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface CompanionChatProps {
  isFloating?: boolean;
  onCloseFloating?: () => void;
  onOpenBreathingModal?: () => void;
  onOpenEmergencyModal?: () => void;
}

const CATEGORY_PROMPTS = [
  {
    category: 'all',
    label: '✨ Phổ biến',
    prompts: [
      'Mình đang bị áp lực học tập và sợ thi rớt 😰',
      'Có bạn trong lớp chế meme nói xấu mình trên mạng 🥺',
      'Bố mẹ không hiểu và luôn so sánh mình với người khác 💔',
      'Mình cảm thấy ngột ngạt và buồn vô cớ 🌧️',
    ],
  },
  {
    category: 'study',
    label: '🎓 Học tập & Thi cử',
    prompts: [
      'Làm sao để tập trung khi bài vở quá nhiều và đầu óc cứ phân tâm?',
      'Mình sợ thi trượt và sợ làm bố mẹ thất vọng, phải làm sao?',
      'Cách sắp xếp thời gian ôn thi theo phương pháp Pomodoro?',
    ],
  },
  {
    category: 'safety',
    label: '🛡️ Bạo lực mạng & Tự vệ',
    prompts: [
      'Bị tạo nhóm chat nói xấu hoặc bêu rếu ảnh, mình nên xử lý thế nào?',
      'Có người dọa tung tin nhắn riêng tư hoặc tống tiền, mình phải làm gì?',
      'Làm sao để biết một đường link nhận quà game có phải lừa đảo?',
    ],
  },
  {
    category: 'family',
    label: '👨‍👩‍👦 Gia đình & Bố mẹ',
    prompts: [
      'Bố mẹ luôn so sánh mình với con nhà người ta khiến mình rất tự ti.',
      'Làm sao để nói chuyện với bố mẹ khi họ luôn áp đặt ý kiến?',
      'Mình cảm thấy cô đơn ngay trong chính ngôi nhà của mình.',
    ],
  },
  {
    category: 'friends',
    label: '💬 Tình bạn & Tình cảm',
    prompts: [
      'Bạn thân đột nhiên lạnh nhạt và đi chơi với nhóm khác.',
      'Mình thích một bạn cùng lớp nhưng không biết nên bày tỏ thế nào.',
      'Bị bạn bè cô lập hoặc ép làm điều mình không thích (peer pressure).',
    ],
  },
  {
    category: 'emotion',
    label: '🧘 Sơ cứu cảm xúc & Stress',
    prompts: [
      'Hướng dẫn mình kỹ thuật neo đậu 5-4-3-2-1 để hết hoảng loạn.',
      'Làm sao để vượt qua cảm giác tự ti về ngoại hình (body shaming)?',
      'Mình bị mất ngủ vì suy nghĩ quá nhiều vào ban đêm.',
    ],
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'assistant',
    text: `Chào bạn! Mình là **An An** 🌸 - người bạn đồng hành và cố vấn tâm lý an toàn của bạn.

Mọi lời khuyên của mình đều dựa trên các **tài liệu chính thống từ UNICEF, Cục An toàn Thông tin (Bộ TT&TT), Luật Trẻ em 2016 và Viện Sức khỏe Tâm thần**.

Đây là không gian an toàn tuyệt đối, không có bất kỳ sự phán xét nào. Bạn đang gặp phải chuyện gì, hãy tâm sự cùng mình nhé!`,
    timestamp: 'Vừa xong',
    officialSources: ['UNICEF Việt Nam', 'Cục An toàn thông tin (Bộ TT&TT)', 'Tổng đài Quốc gia 111'],
    suggestedActions: [
      '🎓 Áp lực học tập & thi cử',
      '🛡️ Bị bêu rếu trên mạng xã hội',
      '🌿 Hướng dẫn tập thở xả stress',
    ],
  },
];

// Helper hiển thị Markdown đơn giản cho tin nhắn
function renderFormattedMessage(text: string) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Tiêu đề dạng bullet hoặc số thứ tự
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.)\s*(.*)/);
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 my-1">
              <span className="font-bold text-teal-700 shrink-0 text-xs">{match?.[1]}</span>
              <span className="flex-1">{formatInline(match?.[2] || '')}</span>
            </div>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5 my-0.5">
              <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1">{formatInline(trimmed.substring(2))}</span>
            </div>
          );
        }

        return <p key={idx}>{formatInline(trimmed)}</p>;
      })}
    </div>
  );
}

// Format in đậm **text** và in nghiêng *text*
function formatInline(str: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|📞.*?111|096\s*306\s*1414)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-teal-950">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-gray-700">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      parts.push(
        <span key={match.index} className="font-bold text-rose-600 underline">
          {token}
        </span>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts;
}

export const CompanionChat: React.FC<CompanionChatProps> = ({
  isFloating = false,
  onCloseFloating,
  onOpenBreathingModal,
  onOpenEmergencyModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('taman_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasCrisisAlert, setHasCrisisAlert] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('taman_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Hủy TTS nếu unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading) return;

    // Tắt giọng đọc cũ nếu đang đọc
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error('Không thể kết nối máy chủ');

      const data = await res.json();
      const replyText = data.reply;
      const isSafety = data.safetyTriggered;

      if (isSafety) {
        setHasCrisisAlert(true);
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        safetyTriggered: isSafety,
        suggestedActions: data.suggestedActions,
        officialSources: data.officialSources,
      };

      setMessages((prev) => [...prev, botMessage]);
      soundManager.playZenChime(660);
    } catch (err) {
      console.warn('Lỗi khi chat:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `An An luôn ở đây lắng nghe bạn 🌸. Dù áp lực học tập, chuyện bạn bè hay mâu thuẫn gia đình, bạn cứ chậm rãi kể cho mình nghe nhé.

Theo khuyến nghị của **UNICEF & Viện Sức khỏe Tâm thần**, khi tâm trí đang rối bời, việc hít thở sâu vài nhịp hoặc viết ra giấy là bước đầu tiên để bình tâm lại.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        officialSources: ['UNICEF Việt Nam', 'Viện Sức khỏe Tâm thần'],
        suggestedActions: ['🌿 Tập thở 4-7-8', '📝 Ghi vào nhật ký', '💬 Kể tiếp câu chuyện'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.includes('thở') || action.includes('4-7-8')) {
      onOpenBreathingModal?.();
      return;
    }
    if (action.includes('111') || action.includes('Đường dây nóng') || action.includes('SOS')) {
      onOpenEmergencyModal?.();
      return;
    }
    // Gửi tiếp như một câu hỏi
    const cleanAction = action.replace(/^[🌿📝💬🛡️✉️📞🔒🎓👨‍👩‍👦✨]+\s*/, '');
    handleSendMessage(cleanAction);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ giọng đọc.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Lọc bớt markdown trước khi đọc
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Giọng đọc hơi chậm rãi ấm áp

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    if (confirm('Bạn có muốn xóa toàn bộ lịch sử trò chuyện này không?')) {
      setMessages(INITIAL_MESSAGES);
      setHasCrisisAlert(false);
      localStorage.removeItem('taman_chat_history');
    }
  };

  const currentCategoryObj =
    CATEGORY_PROMPTS.find((c) => c.category === activeCategory) || CATEGORY_PROMPTS[0];

  return (
    <div
      className={`bg-white rounded-3xl border border-teal-100 flex flex-col overflow-hidden shadow-2xl shadow-teal-900/10 ${
        isFloating ? 'h-[620px] w-full sm:w-[430px]' : 'h-[700px] w-full max-w-4xl mx-auto'
      }`}
    >
      {/* Header Chatbot */}
      <div className="bg-linear-to-r from-teal-600 via-teal-700 to-emerald-700 px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
              🌸
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-teal-700 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base leading-none">An An - Đồng Hành & Cố Vấn</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
                Chuẩn Y Khoa & Luật
              </span>
            </div>
            <p className="text-[11px] text-teal-100/90 mt-0.5">
              Đối chiếu UNICEF, Cục An toàn Thông tin & Tổng đài 111
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={clearChat}
            title="Làm mới cuộc trò chuyện"
            className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {isFloating && onCloseFloating && (
            <button
              onClick={onCloseFloating}
              className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Cảnh báo an toàn khẩn cấp (Crisis Protocol Banner) khi phát hiện từ khóa nguy hiểm */}
      {hasCrisisAlert && (
        <div className="bg-rose-50 border-b border-rose-200 p-3.5 flex items-start gap-3 shrink-0 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 flex-1">
            <strong className="block font-bold mb-0.5">Bạn không đơn độc! Chúng mình luôn ở đây.</strong>
            <span>Nếu bạn đang trong trạng thái bế tắc hoặc nguy hiểm, hãy kết nối ngay với:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <a
                href="tel:111"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
              >
                <PhoneCall className="w-3 h-3" /> Gọi 111 (Bảo vệ Trẻ em - Miễn phí)
              </a>
              <a
                href="tel:0963061414"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-rose-800 font-bold text-xs hover:bg-rose-100 transition-colors"
              >
                <PhoneCall className="w-3 h-3" /> 096 306 1414 (Ngày Mai)
              </a>
            </div>
          </div>
          <button
            onClick={() => setHasCrisisAlert(false)}
            className="text-rose-400 hover:text-rose-700 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Danh mục chủ đề chuyên sâu (Topic Filter Tabs) */}
      <div className="bg-teal-50/50 border-b border-teal-100/70 px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider shrink-0 mr-1">
          Chủ đề:
        </span>
        {CATEGORY_PROMPTS.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.category
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-teal-100 hover:bg-teal-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-linear-to-b from-gray-50/50 via-white to-teal-50/20">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs shrink-0 font-bold mb-1 shadow-2xs">
                  🌸
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-br-xs shadow-xs font-medium'
                    : msg.safetyTriggered
                    ? 'bg-rose-50 text-rose-950 border border-rose-200 rounded-bl-xs shadow-xs'
                    : 'bg-white text-gray-800 border border-teal-100/90 rounded-bl-xs shadow-sm'
                }`}
              >
                {/* Nội dung tin nhắn (định dạng Markdown) */}
                <div className="text-inherit">
                  {renderFormattedMessage(msg.text)}
                </div>

                {/* Huy hiệu tài liệu chính thống tham chiếu */}
                {!isUser && msg.officialSources && msg.officialSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-100/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400">Tài liệu tham chiếu:</span>
                    {msg.officialSources.map((source, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-semibold border border-teal-100 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-teal-600" />
                        {source}
                      </span>
                    ))}
                  </div>
                )}

                {/* Các nút hành động gợi ý tiếp nối (Interactive Action Chips) */}
                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Gợi ý bước tiếp theo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(action)}
                          className="px-2.5 py-1 rounded-xl bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-300 text-gray-700 hover:text-teal-800 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{action}</span>
                          <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer tin nhắn: Thời gian, Đọc giọng nói & Sao chép */}
                <div
                  className={`text-[10px] mt-2 pt-1 flex items-center justify-between ${
                    isUser ? 'text-teal-200' : 'text-gray-400 border-t border-gray-100/60'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakMessage(msg.id, msg.text)}
                        title={speakingId === msg.id ? 'Dừng đọc' : 'Nghe giọng đọc An An'}
                        className="hover:text-teal-700 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Sao chép lời khuyên"
                        className="hover:text-teal-700 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Hiệu ứng đang gõ tin nhắn (Typing Indicator) */}
        {isLoading && (
          <div className="flex items-end gap-2.5 justify-start animate-in fade-in">
            <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs shrink-0 font-bold shadow-2xs">
              🌸
            </div>
            <div className="bg-white border border-teal-100 rounded-3xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-teal-700 font-semibold ml-1">
                An An đang đối chiếu tài liệu & soạn lời giải...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Gợi ý câu hỏi nhanh theo danh mục đang chọn (Suggested Pills) */}
      <div className="px-4 py-2 bg-gray-50/90 border-t border-gray-100 overflow-x-auto whitespace-nowrap shrink-0">
        <div className="flex gap-1.5 text-xs">
          {currentCategoryObj.prompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-full bg-white border border-teal-200/80 text-gray-700 hover:border-teal-500 hover:text-teal-800 hover:bg-teal-50 transition-all shrink-0 cursor-pointer text-[11px] font-medium shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Thanh công cụ hỗ trợ nhanh: Bài tập thở & Hotline SOS */}
      <div className="px-4 py-1.5 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
        <div className="flex items-center gap-3">
          {onOpenBreathingModal && (
            <button
              onClick={onOpenBreathingModal}
              className="flex items-center gap-1 text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
            >
              <Wind className="w-3.5 h-3.5" /> Tập thở xả stress
            </button>
          )}
          {onOpenEmergencyModal && (
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Đường dây nóng SOS 111
            </button>
          )}
        </div>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Bảo mật cục bộ trên thiết bị
        </span>
      </div>

      {/* Khung nhập tin nhắn */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập bất kỳ câu hỏi, trăn trở hay tâm sự nào của bạn..."
          className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-gray-50/50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-40 disabled:hover:bg-teal-600 shadow-md shadow-teal-600/20 active:scale-95 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
