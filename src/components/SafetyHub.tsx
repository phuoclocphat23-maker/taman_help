import React, { useState } from 'react';
import { SAFETY_TOPICS, SAFETY_QUIZZES, HOTLINES } from '../data/mockData';
import { SafetyTopic, SafetyQuiz } from '../types';
import {
  ShieldAlert,
  Lock,
  Sparkles,
  HeartHandshake,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
  PhoneCall,
  UserX,
  MapPinOff,
  EyeOff,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';

interface SafetyHubProps {
  onOpenEmergencyModal?: () => void;
}

export const SafetyHub: React.FC<SafetyHubProps> = ({ onOpenEmergencyModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<SafetyTopic | null>(null);

  // Trạng thái mini quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const handleSelectQuizOption = (quizId: string, optionIndex: number) => {
    if (quizSubmitted[quizId]) return;
    setQuizAnswers({ ...quizAnswers, [quizId]: optionIndex });
  };

  const handleVerifyQuiz = (quiz: SafetyQuiz) => {
    const chosenIndex = quizAnswers[quiz.id];
    if (chosenIndex === undefined || chosenIndex === null) return;

    setQuizSubmitted({ ...quizSubmitted, [quiz.id]: true });
    const isCorrect = quiz.options[chosenIndex].isCorrect;

    if (isCorrect) {
      soundManager.playZenChime(660);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#0d9488', '#10b981', '#f59e0b'],
      });
    }
  };

  const filteredTopics = SAFETY_TOPICS.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-rose-600" />;
      case 'Lock':
        return <Lock className="w-6 h-6 text-emerald-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-indigo-600" />;
      default:
        return <ShieldAlert className="w-6 h-6 text-teal-600" />;
    }
  };

  const getComicIcon = (icon: string) => {
    switch (icon) {
      case 'UserX':
        return <UserX className="w-8 h-8 text-rose-500" />;
      case 'MapPinOff':
        return <MapPinOff className="w-8 h-8 text-emerald-500" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-8 h-8 text-amber-500" />;
      case 'EyeOff':
        return <EyeOff className="w-8 h-8 text-indigo-500" />;
      default:
        return <ShieldAlert className="w-8 h-8 text-teal-500" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Banner Trạm An Toàn */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-teal-700 via-teal-800 to-cyan-900 text-white p-6 sm:p-10 shadow-xl shadow-teal-950/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-teal-100 text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Cẩm Nang Tự Vệ Số Cho Học Sinh & Gen Z
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Trạm An Toàn Không Gian Mạng
          </h2>
          <p className="text-teal-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
            Internet là sân chơi tuyệt vời, nhưng cũng tiềm ẩn những cái bẫy vô hình. Trang bị ngay
            những "tấm khiên số" để tự bảo vệ sự an yên của chính mình và bạn bè.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <a
              href="#topics"
              className="px-5 py-2.5 rounded-2xl bg-white text-teal-900 font-bold text-xs sm:text-sm hover:bg-teal-50 transition-all shadow-md"
            >
              Xem Các Chủ Đề Thiết Yếu
            </a>
            <a
              href="#quiz"
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
            >
              Thử Thách Tình Huống Thực Tế
            </a>
          </div>
        </div>

        {/* Hoạt ảnh trang trí nền */}
        <div className="absolute right-6 -bottom-10 opacity-15 pointer-events-none hidden md:block">
          <ShieldAlert className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Bộ Lọc Chủ Đề */}
      <div id="topics" className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Tất cả chủ đề ({SAFETY_TOPICS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('cyberbullying')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'cyberbullying'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Bạo lực mạng (Cyberbullying)
        </button>
        <button
          onClick={() => setSelectedCategory('privacy')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'privacy'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Dấu chân số & Quyền riêng tư
        </button>
        <button
          onClick={() => setSelectedCategory('fakenews')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'fakenews'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Bộ lọc tin giả & Deepfake
        </button>
        <button
          onClick={() => setSelectedCategory('grooming')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'grooming'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Phòng ngừa dụ dỗ & tống tiền
        </button>
      </div>

      {/* Grid Danh Sách Các Thẻ Kiến Thức Dạng Poster Trực Quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className={`rounded-3xl border ${topic.colorBorder} bg-white p-6 sm:p-7 shadow-lg shadow-teal-950/5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl`}
          >
            <div>
              {/* Header card */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className={`p-3 rounded-2xl ${topic.colorBg} border ${topic.colorBorder}`}>
                  {getTopicIcon(topic.iconName)}
                </div>
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full ${topic.colorBg} ${topic.colorAccent} border ${topic.colorBorder}`}
                >
                  {topic.badge}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {topic.title}
              </h3>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">{topic.subtitle}</p>

              <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                {topic.summary}
              </p>

              {/* Poster / Comic Visual Box (Trực quan hóa, giảm text-heavy) */}
              <div
                className={`my-4 p-4 rounded-2xl ${topic.colorBg} border ${topic.colorBorder} flex items-center gap-4`}
              >
                <div className="p-2.5 rounded-2xl bg-white shadow-xs shrink-0">
                  {getComicIcon(topic.comicVisual.icon)}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-800">{topic.comicVisual.title}</h5>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    {topic.comicVisual.description}
                  </p>
                </div>
              </div>

              {/* Các quy tắc then chốt */}
              <div className="space-y-2 mt-4">
                {topic.keyRules.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-800">{item.rule}: </strong>
                      <span className="text-gray-600">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút xem cẩm nang đầy đủ */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">
                {topic.actionGuide.length} bước hành động chuẩn
              </span>
              <button
                onClick={() => setSelectedTopic(topic)}
                className={`flex items-center gap-1.5 text-xs font-bold ${topic.colorAccent} hover:underline cursor-pointer`}
              >
                Đọc Hướng Dẫn Chi Tiết <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup Xem Toàn Bộ Hướng Dẫn Chủ Đề Khi Bấm */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${selectedTopic.colorBg}`}>
                  {getTopicIcon(selectedTopic.iconName)}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedTopic.title}</h3>
                  <span className="text-xs text-gray-500">{selectedTopic.subtitle}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-6 text-sm text-gray-700">
              {/* Tất cả quy tắc then chốt */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600" /> Các nguyên tắc cốt lõi:
                </h4>
                <div className="space-y-3">
                  {selectedTopic.keyRules.map((kr, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                      <strong className="block text-gray-900 font-semibold mb-1">{kr.rule}</strong>
                      <p className="text-xs text-gray-600 leading-relaxed">{kr.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Các bước hành động cụ thể */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Các bước xử lý ngay lập tức:
                </h4>
                <div className="space-y-2">
                  {selectedTopic.actionGuide.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 text-xs text-emerald-950 border border-emerald-100">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dấu hiệu cảnh báo nguy hiểm */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Dấu hiệu nhận diện kẻ xấu:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
                  {selectedTopic.cautionSigns.map((sign, idx) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </div>

              {/* Đường dẫn nguồn chính thống uy tín */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600" /> Nguồn tin cậy & Tổ chức bảo trợ:
                </h4>
                <div className="space-y-2">
                  {selectedTopic.verifiedSources.map((src, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-teal-900 font-semibold">{src.name}</strong>
                        <p className="text-gray-500 text-[11px] mt-0.5">{src.desc}</p>
                      </div>
                      <span className="text-teal-700 text-xs font-bold px-2 py-1 rounded-md bg-white border border-teal-200">
                        Chính thống
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-5 py-2.5 rounded-2xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
              >
                Đã hiểu rõ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHẦN MINI QUIZ: Thử Thách Tình Huống Thực Tế (Interactive Scenarios) */}
      <div id="quiz" className="bg-linear-to-br from-amber-50/70 via-teal-50/40 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-amber-200/50 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Thử Thách Tình Huống: Bạn Sẽ Xử Lý Thế Nào?
              </h3>
              <p className="text-xs text-gray-500">
                Thực hành đưa ra quyết định an toàn qua các tình huống số thực tế
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            {SAFETY_QUIZZES.length} Tình Huống
          </span>
        </div>

        <div className="space-y-6">
          {SAFETY_QUIZZES.map((quiz, qIdx) => {
            const chosen = quizAnswers[quiz.id];
            const isDone = quizSubmitted[quiz.id];

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
                    Tình huống #{qIdx + 1}
                  </span>
                  <span className="text-xs text-gray-400">• {quiz.category}</span>
                </div>

                <h4 className="font-bold text-gray-800 text-sm sm:text-base leading-snug mb-3">
                  {quiz.question}
                </h4>

                {/* Các phương án lựa chọn */}
                <div className="space-y-2 mb-4">
                  {quiz.options.map((opt, optIdx) => {
                    const isSelected = chosen === optIdx;
                    let style = 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';

                    if (isDone) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold';
                      } else if (isSelected && !opt.isCorrect) {
                        style = 'bg-rose-50 border-rose-300 text-rose-950';
                      }
                    } else if (isSelected) {
                      style = 'bg-teal-50 border-teal-500 text-teal-900 font-semibold ring-2 ring-teal-500/20';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizOption(quiz.id, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {isDone && opt.isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Nút kiểm tra & Giải thích đáp án */}
                {!isDone ? (
                  <button
                    onClick={() => handleVerifyQuiz(quiz)}
                    disabled={chosen === undefined || chosen === null}
                    className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all disabled:opacity-40 disabled:hover:bg-teal-600 cursor-pointer"
                  >
                    Kiểm Tra Đáp Án
                  </button>
                ) : (
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                      quiz.options[chosen!].isCorrect
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                        : 'bg-rose-50 text-rose-950 border border-rose-200'
                    }`}
                  >
                    <strong className="block font-bold mb-1">
                      {quiz.options[chosen!].isCorrect
                        ? '🎉 Rất xuất sắc! Bạn đã chọn giải pháp an toàn nhất.'
                        : '💡 Chưa hoàn toàn chính xác. Hãy cùng xem lời khuyên:'}
                    </strong>
                    <p>{quiz.options[chosen!].explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DANH BẠ ĐƯỜNG DÂY NÓNG KHẨN CẤP (Hotline Cards) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                Đường Dây Nóng Hỗ Trợ Khẩn Cấp Miễn Phí
              </h3>
              <p className="text-xs text-gray-500">
                Lưu lại các đầu số này vào danh bạ – Họ luôn bảo mật tuyệt đối danh tính của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOTLINES.map((h) => (
            <div
              key={h.number}
              className="p-4 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-teal-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                  {h.badge}
                </span>
                <h4 className="font-bold text-gray-800 text-sm mt-2">{h.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{h.shortDesc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-teal-700 block">{h.number}</span>
                  <span className="text-[10px] text-gray-400">{h.available}</span>
                </div>
                <a
                  href={`tel:${h.number}`}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-xs"
                >
                  Gọi Ngay
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
