import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { TrendingUp, BarChart3, Activity, AlertCircle, Compass, Calendar, Sparkles } from 'lucide-react';

interface EmotionChartProps {
  entries: JournalEntry[];
  onSelectEntry?: (entry: JournalEntry) => void;
}

export const EmotionChart: React.FC<EmotionChartProps> = ({ entries, onSelectEntry }) => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [activeMetric, setActiveMetric] = useState<string>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Lọc dữ liệu theo thời gian
  const filteredEntries = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((entry) => {
      if (timeFilter === 'all') return true;
      const entryTime = new Date(entry.date).getTime();
      const now = new Date('2026-10-16').getTime();
      const diffDays = (now - entryTime) / (1000 * 3600 * 24);
      if (timeFilter === 'week') return diffDays <= 7;
      if (timeFilter === 'month') return diffDays <= 30;
      return true;
    });

  // Tính toán cảm xúc trung bình
  const avg = filteredEntries.reduce(
    (acc, curr) => ({
      joy: acc.joy + curr.emotions.joy,
      sadness: acc.sadness + curr.emotions.sadness,
      anger: acc.anger + curr.emotions.anger,
      anxiety: acc.anxiety + curr.emotions.anxiety,
      optimism: acc.optimism + curr.emotions.optimism,
    }),
    { joy: 0, sadness: 0, anger: 0, anxiety: 0, optimism: 0 }
  );

  const avgScores = filteredEntries.length === 0
    ? { joy: 0, sadness: 0, anger: 0, anxiety: 0, optimism: 0 }
    : {
        joy: Math.round(avg.joy / filteredEntries.length),
        sadness: Math.round(avg.sadness / filteredEntries.length),
        anger: Math.round(avg.anger / filteredEntries.length),
        anxiety: Math.round(avg.anxiety / filteredEntries.length),
        optimism: Math.round(avg.optimism / filteredEntries.length),
      };

  // Tổng hợp tác nhân gây căng thẳng (Triggers)
  const triggerMap: Record<string, number> = {};
  filteredEntries.forEach((e) => {
    e.triggers?.forEach((t) => {
      triggerMap[t] = (triggerMap[t] || 0) + 1;
    });
  });
  const sortedTriggers = Object.entries(triggerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Kích thước SVG
  const svgWidth = 640;
  const svgHeight = 240;
  const paddingX = 45;
  const paddingY = 30;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  // Tính tọa độ đường cong SVG
  const getCoordinates = (metricKey: 'joy' | 'sadness' | 'anger' | 'anxiety' | 'optimism') => {
    if (filteredEntries.length === 0) return '';
    const points = filteredEntries.map((e, i) => {
      const x =
        filteredEntries.length === 1
          ? svgWidth / 2
          : paddingX + (i / (filteredEntries.length - 1)) * plotWidth;
      const val = e.emotions[metricKey];
      const y = paddingY + plotHeight - (val / 100) * plotHeight;
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const emotionMeta = [
    { key: 'joy', label: 'Vui vẻ', color: '#10B981', bg: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'optimism', label: 'Lạc quan / Bình yên', color: '#0D9488', bg: 'bg-teal-600', light: 'bg-teal-50 text-teal-700 border-teal-200' },
    { key: 'anxiety', label: 'Lo âu / Căng thẳng', color: '#8B5CF6', bg: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'sadness', label: 'Buồn bã', color: '#3B82F6', bg: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'anger', label: 'Tức giận', color: '#F43F5E', bg: 'bg-rose-500', light: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100/80 shadow-xl shadow-teal-900/5">
      {/* Header Biểu Đồ & Bộ Lọc */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Trực quan hóa NLP & Dữ liệu phục hồi
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Hành Trình Chuyển Hóa Cảm Xúc
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Theo dõi xu hướng tâm lý giúp bạn nhận diện sớm các tác nhân gây lo âu
          </p>
        </div>

        {/* Bộ lọc tuần / tháng / tất cả */}
        <div className="flex items-center bg-gray-100/80 p-1 rounded-2xl text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeFilter === 'week'
                ? 'bg-white text-teal-800 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            7 ngày qua
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeFilter === 'month'
                ? 'bg-white text-teal-800 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            30 ngày qua
          </button>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeFilter === 'all'
                ? 'bg-white text-teal-800 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tất cả ({entries.length})
          </button>
        </div>
      </div>

      {/* Bộ chọn hiển thị đường cảm xúc */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Hiển thị:</span>
        <button
          onClick={() => setActiveMetric('all')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
            activeMetric === 'all'
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
          }`}
        >
          Tất cả dải cảm xúc
        </button>
        {emotionMeta.map((em) => (
          <button
            key={em.key}
            onClick={() => setActiveMetric(em.key)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
              activeMetric === em.key
                ? `${em.light} font-bold shadow-xs`
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${em.bg}`} />
            {em.label}
          </button>
        ))}
      </div>

      {/* Khu vực vẽ biểu đồ đường xu hướng (SVG Line Chart) */}
      <div className="relative bg-linear-to-b from-gray-50/70 to-white rounded-2xl p-4 border border-gray-100">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[500px] overflow-visible"
          >
            <defs>
              <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Các đường gióng ngang 0%, 25%, 50%, 75%, 100% */}
            {[0, 25, 50, 75, 100].map((level) => {
              const y = paddingY + plotHeight - (level / 100) * plotHeight;
              return (
                <g key={level}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray={level === 50 ? '4 4' : '2 2'}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94A3B8"
                    fontFamily="inherit"
                  >
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Vẽ từng đường cảm xúc */}
            {emotionMeta.map((em) => {
              if (activeMetric !== 'all' && activeMetric !== em.key) return null;
              const points = getCoordinates(em.key as any);
              if (!points) return null;

              return (
                <g key={em.key}>
                  <polyline
                    fill="none"
                    stroke={em.color}
                    strokeWidth={activeMetric === em.key ? '3.5' : '2.2'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className="transition-all duration-300 drop-shadow-xs"
                  />
                  {/* Điểm nút trên đường */}
                  {filteredEntries.map((e, i) => {
                    const x =
                      filteredEntries.length === 1
                        ? svgWidth / 2
                        : paddingX + (i / (filteredEntries.length - 1)) * plotWidth;
                    const val = e.emotions[em.key as keyof typeof e.emotions];
                    const y = paddingY + plotHeight - (val / 100) * plotHeight;
                    const isHovered = hoveredIndex === i;

                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4}
                        fill="#FFFFFF"
                        stroke={em.color}
                        strokeWidth={isHovered ? 3 : 2}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => onSelectEntry && onSelectEntry(e)}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Nhãn ngày trục X */}
            {filteredEntries.map((e, i) => {
              const x =
                filteredEntries.length === 1
                  ? svgWidth / 2
                  : paddingX + (i / (filteredEntries.length - 1)) * plotWidth;
              const labelDate = e.date.slice(5); // MM-DD
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={svgHeight - paddingY + 3}
                    x2={x}
                    y2={svgHeight - paddingY + 8}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={svgHeight - paddingY + 20}
                    textAnchor="middle"
                    fontSize="10"
                    fill={hoveredIndex === i ? '#0F766E' : '#64748B'}
                    fontWeight={hoveredIndex === i ? '700' : '500'}
                    fontFamily="inherit"
                  >
                    {labelDate}
                  </text>
                  <text
                    x={x}
                    y={svgHeight - paddingY + 33}
                    textAnchor="middle"
                    fontSize="11"
                  >
                    {e.moodEmoji}
                  </text>
                </g>
              );
            })}

            {/* Thông báo trạng thái 0% ban đầu khi máy mới truy cập */}
            {filteredEntries.length === 0 && (
              <g>
                <rect
                  x={paddingX + 30}
                  y={paddingY + 30}
                  width={plotWidth - 60}
                  height={plotHeight - 60}
                  rx="16"
                  fill="#ffffff"
                  fillOpacity="0.9"
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
                <text
                  x={svgWidth / 2}
                  y={paddingY + plotHeight / 2 - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#334155"
                  fontFamily="inherit"
                >
                  🌱 Máy mới truy cập: Tất cả tiêu chí cảm xúc đang ở mức 0%
                </text>
                <text
                  x={svgWidth / 2}
                  y={paddingY + plotHeight / 2 + 14}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#0D9488"
                  fontWeight="600"
                  fontFamily="inherit"
                >
                  Nhấn chọn cảm xúc của bạn phía trên để bắt đầu vẽ biểu đồ
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Chi tiết tooltip khi rê chuột vào điểm */}
        {hoveredIndex !== null && filteredEntries[hoveredIndex] && (
          <div className="mt-3 p-3.5 bg-teal-900 text-white rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in zoom-in-95">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{filteredEntries[hoveredIndex].moodEmoji}</span>
                <span className="font-bold text-teal-200">
                  {filteredEntries[hoveredIndex].title}
                </span>
                <span className="text-teal-300/80">({filteredEntries[hoveredIndex].date})</span>
              </div>
              <p className="text-teal-100 text-[11px] mt-1 line-clamp-1">
                "{filteredEntries[hoveredIndex].empathyMessage}"
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                Vui: {filteredEntries[hoveredIndex].emotions.joy}%
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                Lo âu: {filteredEntries[hoveredIndex].emotions.anxiety}%
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">
                Buồn: {filteredEntries[hoveredIndex].emotions.sadness}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thống kê đa chiều: Điểm trung bình & Tác nhân gây stress (Triggers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Điểm cân bằng cảm xúc trung bình */}
        <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              Mức Độ Cảm Xúc Bình Quân Trong Kỳ
            </h4>
            <span className="text-xs text-teal-700 font-medium bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
              {filteredEntries.length} nhật ký
            </span>
          </div>

          <div className="space-y-3">
            {emotionMeta.map((em) => {
              const val = avgScores[em.key as keyof typeof avgScores];
              return (
                <div key={em.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{em.label}</span>
                    <span className="font-bold text-gray-900">{val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${em.bg}`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tác nhân kích hoạt cảm xúc (Triggers từ NLP) */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Tác Nhân Gây Cảm Xúc Hàng Đầu (Triggers)
            </h4>
            <span className="text-xs text-amber-800 font-medium bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
              Bóc tách bởi AI
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Các chủ đề hoặc sự kiện xuất hiện nhiều nhất khi bạn cảm thấy áp lực hay hạnh phúc:
          </p>

          <div className="space-y-2">
            {sortedTriggers.length > 0 ? (
              sortedTriggers.map(([trigger, hits], index) => (
                <div
                  key={trigger}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200/60 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[11px]">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">{trigger}</span>
                  </div>
                  <span className="text-gray-500 font-semibold">{hits} lần ghi nhận</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">Chưa có đủ dữ liệu tác nhân.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
