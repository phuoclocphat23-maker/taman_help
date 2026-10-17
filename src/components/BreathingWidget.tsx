import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Volume2, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface BreathingWidgetProps {
  onClose?: () => void;
  compact?: boolean;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export const BreathingWidget: React.FC<BreathingWidgetProps> = ({ onClose, compact = false }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [mode, setMode] = useState<'4-7-8' | 'box'>('4-7-8');
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding'>('breathing');

  // Cấu hình thời gian cho các bài thở
  const timings = mode === '4-7-8' 
    ? { inhale: 4, hold: 7, exhale: 8, rest: 0 }
    : { inhale: 4, hold: 4, exhale: 4, rest: 4 };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          }

          // Chuyển giai đoạn
          if (phase === 'inhale') {
            soundManager.playZenChime(660);
            setPhase('hold');
            return timings.hold;
          } else if (phase === 'hold') {
            soundManager.playZenChime(528);
            setPhase('exhale');
            return timings.exhale;
          } else if (phase === 'exhale') {
            if (timings.rest > 0) {
              setPhase('rest');
              return timings.rest;
            } else {
              soundManager.playZenChime(440);
              setPhase('inhale');
              setCycleCount((c) => c + 1);
              return timings.inhale;
            }
          } else {
            soundManager.playZenChime(440);
            setPhase('inhale');
            setCycleCount((c) => c + 1);
            return timings.inhale;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, mode, timings]);

  const toggleActive = () => {
    if (!isActive) {
      soundManager.playZenChime(528);
      setPhase('inhale');
      setSecondsLeft(timings.inhale);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(timings.inhale);
    setCycleCount(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Hít vào nhẹ nhàng...';
      case 'hold':
        return 'Giữ hơi tĩnh lặng...';
      case 'exhale':
        return 'Thở ra chầm chậm...';
      case 'rest':
        return 'Nghỉ ngơi thả lỏng...';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-teal-300 via-emerald-200 to-cyan-300 border-teal-400 text-teal-900';
      case 'hold':
        return 'from-amber-200 via-yellow-100 to-orange-200 border-amber-300 text-amber-900';
      case 'exhale':
        return 'from-sky-200 via-indigo-100 to-blue-300 border-sky-400 text-sky-900';
      case 'rest':
        return 'from-purple-200 via-pink-100 to-rose-200 border-purple-300 text-purple-900';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 'scale-90 opacity-90';
    switch (phase) {
      case 'inhale':
        return 'scale-125 transition-all duration-[4000ms] ease-out';
      case 'hold':
        return 'scale-125 transition-all duration-300 ease-linear';
      case 'exhale':
        return 'scale-75 transition-all duration-[8000ms] ease-in-out';
      case 'rest':
        return 'scale-85 transition-all duration-[4000ms] ease-linear';
    }
  };

  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-teal-100 shadow-xl shadow-teal-500/5 ${compact ? 'max-w-md' : 'max-w-lg'} mx-auto`}>
      {/* Tab chuyển đổi bài thở / kỹ thuật 5-4-3-2-1 */}
      <div className="flex items-center justify-between border-b border-teal-100/70 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">Góc Bình Yên & Thở Sâu</h3>
            <p className="text-xs text-gray-500">Giảm nhịp tim & xoa dịu cơn hoảng loạn</p>
          </div>
        </div>

        <div className="flex bg-teal-50 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'breathing' ? 'bg-white text-teal-800 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Nhịp thở
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'grounding' ? 'bg-white text-teal-800 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Quy tắc 5-4-3-2-1
          </button>
        </div>
      </div>

      {activeTab === 'breathing' ? (
        <div>
          {/* Lựa chọn kỹ thuật thở */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => {
                setMode('4-7-8');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                mode === '4-7-8'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Kỹ thuật 4-7-8 (Giảm lo âu & dễ ngủ)
            </button>
            <button
              onClick={() => {
                setMode('box');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                mode === 'box'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Thở Hộp 4-4-4-4 (Tập trung)
            </button>
          </div>

          {/* Vòng tròn nhịp thở tương tác */}
          <div className="flex flex-col items-center justify-center my-6 py-4">
            <div className="relative flex items-center justify-center w-56 h-56">
              {/* Vòng sáng ngoài mờ ảo */}
              <div
                className={`absolute w-52 h-52 rounded-full bg-linear-to-tr ${getPhaseColor()} filter blur-xl opacity-60 transform ${getCircleScale()}`}
              />

              {/* Vòng tròn trung tâm */}
              <div
                className={`relative w-44 h-44 rounded-full bg-linear-to-tr ${getPhaseColor()} border-4 shadow-lg flex flex-col items-center justify-center transform ${getCircleScale()}`}
              >
                <span className="text-4xl font-extrabold tracking-tight">{isActive ? secondsLeft : '🌸'}</span>
                <span className="text-xs font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full bg-white/70">
                  {phase}
                </span>
              </div>
            </div>

            <p className="mt-4 text-base font-semibold text-gray-700 min-h-[28px] text-center">
              {isActive ? getPhaseText() : 'Bấm Bắt đầu và hít thở theo nhịp vòng tròn'}
            </p>

            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Chu kỳ đã hoàn thành: <strong className="text-teal-700 font-bold">{cycleCount}</strong></span>
            </div>
          </div>

          {/* Nút điều khiển */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={toggleActive}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 ${
                isActive
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 fill-current" /> Tạm dừng
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Bắt đầu thở
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              title="Đặt lại"
              className="p-2.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => soundManager.playZenChime(528)}
              title="Tiếng chuông tĩnh tâm (528Hz)"
              className="p-2.5 rounded-2xl border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Grounding 5-4-3-2-1 Technique */
        <div className="space-y-3 py-2 text-sm text-gray-700">
          <p className="text-xs text-gray-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            🌱 Khi não bộ bị cuốn vào cơn hoảng loạn hay suy nghĩ tiêu cực dồn dập, hãy dùng 5 giác quan để kéo bạn trở về thực tại:
          </p>

          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">5</span>
              <div>
                <strong className="text-gray-800">5 đồ vật bạn nhìn thấy:</strong>
                <p className="text-xs text-gray-500">Cây bút, khung cửa sổ, chiếc lá, cái cốc, màn hình máy tính.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs shrink-0">4</span>
              <div>
                <strong className="text-gray-800">4 thứ bạn có thể chạm vào:</strong>
                <p className="text-xs text-gray-500">Mặt bàn gỗ mát rượi, vạt áo cotton, bàn chân chạm đất, mái tóc.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs shrink-0">3</span>
              <div>
                <strong className="text-gray-800">3 âm thanh bạn nghe thấy:</strong>
                <p className="text-xs text-gray-500">Tiếng quạt máy ro ro, tiếng chim ngoài vườn, tiếng xe cộ xa xa.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">2</span>
              <div>
                <strong className="text-gray-800">2 mùi hương bạn ngửi thấy:</strong>
                <p className="text-xs text-gray-500">Mùi giấy vở mới, mùi dầu gội hoặc mùi không khí sau mưa.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">1</span>
              <div>
                <strong className="text-gray-800">1 điều tuyệt vời về chính bạn:</strong>
                <p className="text-xs text-gray-500">"Hôm nay mình đã rất dũng cảm và kiên trì."</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
