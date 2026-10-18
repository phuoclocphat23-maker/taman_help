import React, { useState } from 'react';
import { DAILY_QUOTES } from '../data/mockData';
import { JournalEntry, EmotionScore } from '../types';
import {
  Sparkles,
  Heart,
  Quote,
  RefreshCw,
  Wind,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Activity,
  Layers,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export interface MoodPreset {
  emoji: string;
  label: string;
  color: string;
  dominant: string;
  scores: EmotionScore;
  message: string;
}

export const MOOD_PRESETS: MoodPreset[] = [
  {
    emoji: '😊',
    label: 'Vui vẻ',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
    dominant: 'Vui vẻ & Hào hứng',
    scores: { joy: 85, optimism: 80, anxiety: 15, sadness: 10, anger: 5 },
    message: 'Thật tuyệt vời! Hãy lưu giữ nguồn năng lượng tích cực này để sưởi ấm cả ngày của bạn nhé 🌸',
  },
  {
    emoji: '😌',
    label: 'Bình yên',
    color: 'bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100',
    dominant: 'Bình yên & Tĩnh lặng',
    scores: { joy: 70, optimism: 90, anxiety: 10, sadness: 10, anger: 5 },
    message: 'Tâm trí bình yên là điểm tựa vững chãi nhất. Chúc bạn có một ngày thư thái và an yên 🍃',
  },
  {
    emoji: '🥺',
    label: 'Buồn bã',
    color: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100',
    dominant: 'Buồn bã & Trầm lắng',
    scores: { joy: 10, optimism: 20, anxiety: 55, sadness: 85, anger: 20 },
    message: 'An An ở đây ôm bạn một cái nè. Bạn có quyền được buồn, đừng gồng mình quá nhé 💙',
  },
  {
    emoji: '😰',
    label: 'Lo âu',
    color: 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100',
    dominant: 'Lo âu & Căng thẳng',
    scores: { joy: 12, optimism: 25, anxiety: 90, sadness: 50, anger: 25 },
    message: 'Bạn đang gánh nhiều âu lo đúng không? Hãy hít thở sâu 3 nhịp cùng mình, từng chút một sẽ ổn thôi 🌿',
  },
  {
    emoji: '😤',
    label: 'Tức giận',
    color: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100',
    dominant: 'Tức giận & Bức xúc',
    scores: { joy: 8, optimism: 15, anxiety: 60, sadness: 35, anger: 88 },
    message: 'Cơn tức giận là hoàn toàn có lý do. Hãy uống một ngụm nước mát để xoa dịu ngọn lửa trong lòng nhé 🔥',
  },
  {
    emoji: '🍃',
    label: 'Thư thái',
    color: 'bg-green-50 text-green-800 border-green-300 hover:bg-green-100',
    dominant: 'Thư thái & Nhẹ nhõm',
    scores: { joy: 75, optimism: 85, anxiety: 10, sadness: 10, anger: 5 },
    message: 'Cảm giác nhẹ nhõm sau những ngày căng thẳng thật quý giá. Hãy tận hưởng trọn vẹn khoảnh khắc này!',
  },
  {
    emoji: '⚡',
    label: 'Áp lực',
    color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
    dominant: 'Áp lực dồn dập',
    scores: { joy: 10, optimism: 20, anxiety: 88, sadness: 45, anger: 60 },
    message: 'Khi bài vở hay kỳ vọng dồn dập, hãy chia nhỏ từng việc và cho bản thân 10 phút nghỉ ngơi nhé ✨',
  },
];

interface HeroSectionProps {
  entries: JournalEntry[];
  onOpenNewJournal: () => void;
  onOpenBreathing: () => void;
  onOpenSafetyHub: () => void;
  onSelectMood: (mood: MoodPreset) => void;
  onResetAllToZero: () => void;
  onLoadMockData: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  entries,
  onOpenNewJournal,
  onOpenBreathing,
  onOpenSafetyHub,
  onSelectMood,
  onResetAllToZero,
  onLoadMockData,
}) => {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
    soundManager.playZenChime(660);
  };

  const currentQuote = DAILY_QUOTES[quoteIndex];

  // Nếu máy mới (entries = []), tất cả tiêu chí đánh giá quay về 0 hết!
  const isZeroState = entries.length === 0;

  const currentScores: EmotionScore = isZeroState
    ? { joy: 0, optimism: 0, anxiety: 0, sadness: 0, anger: 0 }
    : entries[0].emotions;

  const currentDominant = isZeroState ? 'Chưa ghi nhận (0%)' : entries[0].dominantEmotion;
  const currentEmoji = isZeroState ? '🌱' : entries[0].moodEmoji;
  const currentEmpathy = isZeroState
    ? 'Nhấn chọn một cảm xúc bên dưới để bắt đầu thay đổi các tiêu chí đánh giá.'
    : entries[0].empathyMessage;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-teal-50/70 via-emerald-50/40 to-white border border-teal-100 p-6 sm:p-10 shadow-lg shadow-teal-900/5">
      {/* Vòng tròn màu nền mờ ảo */}
      <div className="absolute top-0 right-10 -mt-12 -mr-12 w-64 h-64 rounded-full bg-linear-to-br from-amber-200/40 to-teal-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-12 -ml-12 w-64 h-64 rounded-full bg-linear-to-tr from-cyan-200/40 to-emerald-200/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Cột trái: Lời chào và thông điệp ấm áp */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-teal-800 border border-teal-200/80 text-xs font-bold shadow-2xs hover:brightness-105 hover:opacity-95 hover:border-teal-300 transition-all duration-200 cursor-default">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Không gian an toàn • Thấu hiểu & Bảo mật
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight uppercase">
            NƠI TÂM HỒN ĐƯỢC{' '}
            <span className="text-teal-600 underline decoration-teal-300 decoration-wavy hover:brightness-110 transition-all">
              LẮNG NGHE
            </span>{' '}
            & BẢN THÂN ĐƯỢC{' '}
            <span className="text-emerald-600 hover:brightness-110 transition-all">BẢO VỆ</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl">
            Chào mừng bạn đến với <strong>Tâm An</strong>. Dù bạn đang gặp áp lực học tập, rắc rối tuổi dậy thì hay bối rối trước những ồn ào trên mạng xã hội, bạn luôn có thể trút bỏ gánh nặng tại đây qua cuốn nhật ký cảm xúc AI và người bạn đồng hành 24/7.
          </p>

          {/* Hộp Trích Dẫn Truyền Cảm Hứng Mỗi Ngày */}
          <div className="group relative p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-teal-100 shadow-sm text-xs sm:text-sm hover:brightness-105 hover:opacity-95 hover:shadow-md hover:border-teal-200 transition-all duration-300">
            <div className="flex items-start gap-3">
              <Quote className="w-6 h-6 text-teal-400 shrink-0 transform -scale-x-100 transition-transform duration-300 group-hover:scale-110" />
              <div className="flex-1">
                <p className="text-gray-700 italic font-medium leading-relaxed">
                  "{currentQuote.quote}"
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                  <span className="font-semibold text-teal-700 uppercase">— {currentQuote.author}</span>
                  <button
                    onClick={nextQuote}
                    className="flex items-center gap-1 text-teal-600 hover:text-teal-800 hover:brightness-110 font-bold cursor-pointer transition-all duration-150"
                  >
                    <RefreshCw className="w-3 h-3 transition-transform duration-200 hover:rotate-180" /> Đổi câu khác
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Các nút hành động chính */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenNewJournal}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 hover:bg-teal-700 hover:brightness-105 hover:opacity-95 hover:shadow-teal-600/35 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Viết Nhật Ký Hôm Nay
            </button>

            <button
              onClick={onOpenBreathing}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-teal-200 text-teal-800 font-bold text-xs sm:text-sm hover:bg-teal-50 hover:border-teal-300 hover:brightness-105 hover:opacity-95 transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs"
            >
              <Wind className="w-4 h-4 text-teal-600" />
              Tập Thở 4-7-8
            </button>

            <button
              onClick={onOpenSafetyHub}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-gray-600 hover:text-teal-700 hover:brightness-110 hover:opacity-90 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Trạm An Toàn Mạng <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cột phải: BẢNG TIÊU CHÍ ĐÁNH GIÁ CẢM XÚC (BAN ĐẦU VỀ 0%, CHỌN CẢM XÚC ĐỂ THAY ĐỔI) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-teal-100 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tiêu Chí Đánh Giá Cảm Xúc
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                  isZeroState
                    ? 'bg-gray-100 text-gray-600 border border-gray-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isZeroState ? 'Mới truy cập (Tất cả: 0%)' : `${entries.length} trang đã ghi`}
              </span>
            </div>

            {/* Trạng thái cảm xúc hiện tại */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                isZeroState
                  ? 'bg-gray-50/70 border-gray-200/80 text-gray-500'
                  : 'bg-teal-50/70 border-teal-100 text-gray-900'
              }`}
            >
              <span className="text-3xl transition-transform duration-300 transform hover:scale-110">
                {currentEmoji}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">
                    {isZeroState ? 'Chưa chọn cảm xúc' : entries[0].title}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {isZeroState ? 'Khởi tạo' : entries[0].date}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold block mt-0.5 ${
                    isZeroState ? 'text-gray-400' : 'text-teal-700'
                  }`}
                >
                  {currentDominant}
                </span>
              </div>
            </div>

            {/* CÁC TIÊU CHÍ ĐÁNH GIÁ (5 DẢI CẢM XÚC: Joy, Optimism, Anxiety, Sadness, Anger) */}
            <div className="my-3 space-y-2">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>Chỉ số đánh giá:</span>
                <span className="text-gray-400 lowercase">
                  {isZeroState ? 'tất cả tiêu chí = 0%' : 'thay đổi theo cảm xúc'}
                </span>
              </div>

              {/* Dải 1: Vui vẻ */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">Vui vẻ (Joy)</span>
                  <span className="font-bold text-emerald-700">{currentScores.joy}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${currentScores.joy}%` }}
                  />
                </div>
              </div>

              {/* Dải 2: Lạc quan / Bình yên */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">Lạc quan / Bình yên (Optimism)</span>
                  <span className="font-bold text-teal-700">{currentScores.optimism}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${currentScores.optimism}%` }}
                  />
                </div>
              </div>

              {/* Dải 3: Lo âu / Căng thẳng */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">Lo âu / Căng thẳng (Anxiety)</span>
                  <span className="font-bold text-purple-700">{currentScores.anxiety}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${currentScores.anxiety}%` }}
                  />
                </div>
              </div>

              {/* Dải 4: Buồn bã */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">Buồn bã (Sadness)</span>
                  <span className="font-bold text-blue-700">{currentScores.sadness}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${currentScores.sadness}%` }}
                  />
                </div>
              </div>

              {/* Dải 5: Tức giận */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600">Tức giận (Anger)</span>
                  <span className="font-bold text-rose-700">{currentScores.anger}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${currentScores.anger}%` }}
                  />
                </div>
              </div>
            </div>

            {/* KHU VỰC NHẤN CHỌN CẢM XÚC ĐỂ THAY ĐỔI CÁC TIÊU CHÍ */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
                <span>👇 Nhấn chọn cảm xúc để thay đổi tiêu chí:</span>
                {isZeroState && (
                  <span className="text-[10px] text-teal-600 font-semibold animate-pulse">
                    Đang ở mức 0%
                  </span>
                )}
              </label>

              <div className="flex flex-wrap gap-1.5">
                {MOOD_PRESETS.map((mood) => {
                  const isCurrent =
                    !isZeroState && entries[0]?.moodLabel === mood.label;
                  return (
                    <button
                      key={mood.label}
                      onClick={() => onSelectMood(mood)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                        isCurrent
                          ? `${mood.color} ring-2 ring-teal-500/40 shadow-xs font-bold scale-105`
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white hover:border-teal-300 hover:shadow-2xs'
                      }`}
                      title={`Đánh giá theo cảm xúc: ${mood.label}`}
                    >
                      <span className="text-sm">{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lời nhắn đồng cảm của An An */}
            <div className="mt-3 p-3 rounded-xl bg-amber-50/70 text-xs text-amber-900 border border-amber-200/60 flex items-start gap-2">
              <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="italic leading-relaxed">{currentEmpathy}</span>
            </div>

            {/* Các nút hỗ trợ kiểm thử: Đặt lại về 0 & Xem dữ liệu mẫu */}
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <button
                onClick={onResetAllToZero}
                className="flex items-center gap-1 hover:text-rose-600 hover:underline transition-colors cursor-pointer"
                title="Đưa tất cả tiêu chí đánh giá về 0%"
              >
                <RotateCcw className="w-3 h-3" /> Đặt lại về 0% (Máy mới)
              </button>

              <button
                onClick={onLoadMockData}
                className="flex items-center gap-1 text-teal-700 hover:underline font-semibold cursor-pointer"
                title="Xem mẫu hành trình hồi phục 7 ngày"
              >
                <Layers className="w-3 h-3" /> Xem dữ liệu mẫu 7 ngày
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
