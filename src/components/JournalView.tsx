import React, { useState } from 'react';
import { JournalEntry, EmotionScore } from '../types';
import { BookOpen, Sparkles, Send, Trash2, Heart, ShieldAlert, Tag, CheckCircle2, RefreshCw, PlusCircle, Search, Calendar, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';

interface JournalViewProps {
  entries: JournalEntry[];
  onAddEntry: (newEntry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  selectedEntryForView?: JournalEntry | null;
  onClearSelectedEntry?: () => void;
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Vui vẻ', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { emoji: '😌', label: 'Bình yên', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { emoji: '🥺', label: 'Buồn bã', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { emoji: '😰', label: 'Lo âu', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { emoji: '😤', label: 'Tức giận', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { emoji: '🍃', label: 'Thư thái', color: 'bg-green-100 text-green-800 border-green-300' },
  { emoji: '⚡', label: 'Áp lực', color: 'bg-amber-100 text-amber-800 border-amber-300' },
];

const PRESET_TAGS = ['Học tập', 'Thi cử', 'Gia đình', 'Tình bạn', 'Mạng xã hội', 'Bản thân', 'Tình cảm', 'Sức khỏe'];

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  selectedEntryForView,
  onClearSelectedEntry,
}) => {
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Học tập']);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [detailedEntry, setDetailedEntry] = useState<JournalEntry | null>(selectedEntryForView || null);

  // Cập nhật khi prop selectedEntryForView thay đổi từ ngoài
  React.useEffect(() => {
    if (selectedEntryForView) {
      setDetailedEntry(selectedEntryForView);
    }
  }, [selectedEntryForView]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsAnalyzing(true);

    try {
      // Gọi API phân tích NLP trên server (sử dụng Gemini Flash hoặc local fallback)
      const res = await fetch('/api/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      let analysisResult;
      if (res.ok) {
        analysisResult = await res.json();
      } else {
        throw new Error('API request failed');
      }

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().slice(0, 5);

      const newEntry: JournalEntry = {
        id: `entry-${Date.now()}`,
        title,
        content,
        date: dateStr,
        time: timeStr,
        moodEmoji: selectedMood.emoji,
        moodLabel: selectedMood.label,
        tags: selectedTags.length > 0 ? selectedTags : ['Nhật ký thường nhật'],
        emotions: analysisResult.emotions || {
          joy: 50,
          sadness: 20,
          anger: 10,
          anxiety: 20,
          optimism: 60,
        },
        dominantEmotion: analysisResult.dominantEmotion || 'Bình yên',
        sentimentScore: analysisResult.sentimentScore || 20,
        triggers: analysisResult.triggers || ['Suy nghĩ cá nhân'],
        empathyMessage:
          analysisResult.empathyMessage ||
          'Cảm ơn bạn đã viết ra những trăn trở của mình. Bạn luôn có một người bạn đồng hành bên cạnh.',
        selfCareTips: analysisResult.selfCareTips || [
          'Hít thở sâu 3 nhịp và thả lỏng đôi vai.',
          'Nghỉ ngơi và uống một ngụm nước ấm.',
        ],
        safetyRisk: analysisResult.safetyRisk,
      };

      onAddEntry(newEntry);
      setDetailedEntry(newEntry);

      // Âm thanh và hiệu ứng ăn mừng
      soundManager.playZenChime(528);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0d9488', '#14b8a6', '#fcd34d', '#f43f5e'],
      });

      // Reset form
      setTitle('');
      setContent('');
      setIsWriting(false);
    } catch (err) {
      console.error('Lỗi khi phân tích:', err);
      // Fallback cục bộ nếu mất mạng
      const now = new Date();
      const newEntry: JournalEntry = {
        id: `entry-${Date.now()}`,
        title,
        content,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        moodEmoji: selectedMood.emoji,
        moodLabel: selectedMood.label,
        tags: selectedTags,
        emotions: { joy: 40, sadness: 20, anger: 10, anxiety: 30, optimism: 50 },
        dominantEmotion: 'Bình tâm ghi nhận',
        sentimentScore: 10,
        triggers: ['Cảm xúc thường ngày'],
        empathyMessage: 'An An luôn ở đây đồng hành cùng bạn. Bạn đã làm rất tốt hôm nay rồi!',
        selfCareTips: ['Hãy cho phép bản thân nghỉ ngơi một chút nhé.'],
      };
      onAddEntry(newEntry);
      setDetailedEntry(newEntry);
      setIsWriting(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredList = entries.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = tagFilter === 'all' || item.tags.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8">
      {/* Thanh tác vụ: Viết bài mới & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-teal-100 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsWriting(true);
              setDetailedEntry(null);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-sm shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Viết Nhật Ký Hôm Nay
          </button>

          {isWriting && (
            <button
              onClick={() => setIsWriting(false)}
              className="px-4 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all cursor-pointer"
            >
              Thu nhỏ
            </button>
          )}
        </div>

        {/* Ô tìm kiếm & lọc tag */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo từ khóa..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-white"
            />
          </div>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            <option value="all">Tất cả chủ đề</option>
            {PRESET_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form viết nhật ký kỹ thuật số (Digital Notebook UI) */}
      {isWriting && (
        <form
          onSubmit={handleSaveAndAnalyze}
          className="relative bg-amber-50/40 rounded-3xl p-6 sm:p-8 border-2 border-dashed border-teal-200/80 shadow-lg animate-in fade-in slide-in-from-top-4"
        >
          {/* Huy hiệu cuốn sổ */}
          <div className="flex items-center justify-between pb-4 border-b border-teal-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">Cuốn Sổ Tay Bí Mật</h3>
                <p className="text-xs text-gray-500">Mọi lời tâm sự đều được giữ an toàn và bảo mật</p>
              </div>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-800">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
            </span>
          </div>

          {/* Chọn Emoji Tâm Trạng */}
          <div className="my-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Tâm trạng của bạn lúc này thế nào?
            </label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  type="button"
                  key={mood.label}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                    selectedMood.label === mood.label
                      ? `${mood.color} ring-2 ring-teal-500/50 shadow-sm scale-105 font-bold`
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tiêu đề nhật ký */}
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Đặt tiêu đề cho trang nhật ký hôm nay... (Ví dụ: Một ngày bỡ ngỡ ở trường mới)"
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-base font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-white"
            />
          </div>

          {/* Nội dung nhật ký */}
          <div className="mb-4">
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hãy thoải mái viết ra bất kỳ suy nghĩ nào trong đầu bạn... Bạn đã gặp chuyện gì? Bạn đang cảm thấy ra sao? Đừng lo lắng về ngữ pháp hay chính tả, cứ để dòng cảm xúc tự nhiên tuôn trào nhé..."
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-white resize-y"
            />
          </div>

          {/* Chọn Tag chủ đề */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              Gắn thẻ chủ đề liên quan:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-teal-100">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-xs sm:text-sm shadow-md hover:bg-teal-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI Đang Phân Tích NLP & Cảm Xúc...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Lưu & Phân Tích Cảm Xúc Bằng AI
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Chi tiết một trang nhật ký đang được xem (Modal/Card chuyên sâu với phân tích NLP) */}
      {detailedEntry && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-200 shadow-xl shadow-teal-700/5 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{detailedEntry.moodEmoji}</span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{detailedEntry.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {detailedEntry.date} lúc {detailedEntry.time}
                  </span>
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    {detailedEntry.dominantEmotion}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa trang nhật ký này?')) {
                    onDeleteEntry(detailedEntry.id);
                    setDetailedEntry(null);
                    onClearSelectedEntry?.();
                  }
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Xóa nhật ký"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setDetailedEntry(null);
                  onClearSelectedEntry?.();
                }}
                className="px-3 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                Đóng
              </button>
            </div>
          </div>

          {/* Nội dung bài viết */}
          <div className="my-5 text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
            {detailedEntry.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {detailedEntry.tags?.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-medium">
                #{t}
              </span>
            ))}
          </div>

          {/* KẾT QUẢ PHÂN TÍCH NLP TỪ AI */}
          <div className="rounded-2xl p-5 bg-linear-to-br from-teal-50 via-emerald-50/50 to-amber-50/40 border border-teal-100">
            <div className="flex items-center justify-between pb-3 border-b border-teal-100/70 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h4 className="font-bold text-gray-800 text-sm">
                  Góc Thấu Hiểu Từ Người Bạn AI (NLP Analysis)
                </h4>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
                Chỉ số tích cực: {detailedEntry.sentimentScore > 0 ? `+${detailedEntry.sentimentScore}` : detailedEntry.sentimentScore}
              </span>
            </div>

            {/* Thông điệp đồng cảm từ An An */}
            <div className="flex items-start gap-3 mb-4 bg-white/90 p-4 rounded-xl border border-teal-100/70">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 fill-current text-rose-400" />
              </div>
              <div>
                <strong className="text-xs font-bold text-teal-900 block mb-0.5">Lời nhắn gửi của An An:</strong>
                <p className="text-xs sm:text-sm text-gray-700 italic">
                  "{detailedEntry.empathyMessage}"
                </p>
              </div>
            </div>

            {/* Bảng phân tích 5 dải cảm xúc */}
            <div className="mb-4">
              <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Điểm số dải cảm xúc nhận diện:
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-emerald-700 font-bold text-base">{detailedEntry.emotions.joy}%</div>
                  <div className="text-gray-500 text-[11px]">Vui vẻ</div>
                </div>
                <div className="p-2 bg-teal-50 rounded-xl border border-teal-100">
                  <div className="text-teal-700 font-bold text-base">{detailedEntry.emotions.optimism}%</div>
                  <div className="text-gray-500 text-[11px]">Lạc quan</div>
                </div>
                <div className="p-2 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-purple-700 font-bold text-base">{detailedEntry.emotions.anxiety}%</div>
                  <div className="text-gray-500 text-[11px]">Lo âu</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-blue-700 font-bold text-base">{detailedEntry.emotions.sadness}%</div>
                  <div className="text-gray-500 text-[11px]">Buồn bã</div>
                </div>
                <div className="p-2 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="text-rose-700 font-bold text-base">{detailedEntry.emotions.anger}%</div>
                  <div className="text-gray-500 text-[11px]">Tức giận</div>
                </div>
              </div>
            </div>

            {/* Gợi ý tự chăm sóc (Self-care tips) */}
            {detailedEntry.selfCareTips && detailedEntry.selfCareTips.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Gợi ý hành động nhỏ để tinh thần dễ chịu hơn:
                </h5>
                <div className="space-y-1.5">
                  {detailedEntry.selfCareTips.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 bg-white/70 px-3 py-2 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Danh sách các bài nhật ký đã viết (Grid Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Lịch Sử Nhật Ký ({filteredList.length})
          </h3>
          <span className="text-xs text-gray-400">Bấm vào từng bài để xem phân tích chi tiết</span>
        </div>

        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
            <span className="text-4xl block mb-2">📖</span>
            <h4 className="font-bold text-gray-800 text-base mb-1">Chưa tìm thấy nhật ký phù hợp</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              Hãy viết bài nhật ký đầu tiên để bắt đầu ghi dấu hành trình cảm xúc của chính bạn.
            </p>
            <button
              onClick={() => setIsWriting(true)}
              className="px-4 py-2 rounded-2xl bg-teal-600 text-white font-bold text-xs"
            >
              Viết nhật ký ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredList.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setDetailedEntry(entry)}
                className={`group bg-white rounded-3xl p-5 border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${
                  detailedEntry?.id === entry.id
                    ? 'border-teal-500 ring-2 ring-teal-500/20'
                    : 'border-gray-100 hover:border-teal-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{entry.moodEmoji}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700">
                        {entry.dominantEmotion}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">{entry.date}</span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-teal-700 transition-colors">
                    {entry.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-3 leading-relaxed">
                    {entry.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {entry.tags?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                    Xem NLP <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
