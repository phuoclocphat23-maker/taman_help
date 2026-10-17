import React from 'react';
import { HOTLINES } from '../data/mockData';
import { PhoneCall, AlertTriangle, ShieldCheck, Heart, X, ExternalLink } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleQuickExit = () => {
    // Thoát nhanh sang trang Google tìm kiếm học tập để bảo vệ sự riêng tư
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-rose-200 animate-in fade-in zoom-in-95">
        {/* Header SOS */}
        <div className="flex items-start justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-rose-950">
                  Hỗ Trợ Khẩn Cấp & Đường Dây Nóng
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  24/7 SOS
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Bạn không hề đơn độc. Luôn có những người sẵn sàng lắng nghe và bảo vệ bạn.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lời khuyên bình tĩnh tức thời */}
        <div className="my-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <Heart className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-amber-900 mb-0.5">
              Nếu bạn đang cảm thấy nghẹt thở hoặc muốn làm đau bản thân:
            </strong>
            <p className="leading-relaxed">
              1. Hãy đặt chân trần chạm xuống mặt đất, uống một ngụm nước lọc mát.<br />
              2. Đặt tay lên ngực và hít thở thật sâu trong 10 giây.<br />
              3. Hãy nhớ rằng cơn bão cảm xúc này sẽ qua đi, sự an toàn và tính mạng của bạn là vô giá!
            </p>
          </div>
        </div>

        {/* Danh bạ gọi điện nhanh */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Bấm để gọi ngay (Miễn phí cước cuộc gọi):
          </h4>
          {HOTLINES.map((h) => (
            <div
              key={h.number}
              className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between hover:bg-white hover:border-rose-300 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold text-gray-900">{h.name}</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-semibold">
                    {h.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{h.shortDesc}</p>
              </div>

              <a
                href={`tel:${h.number}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-sm hover:bg-rose-700 transition-all shadow-md active:scale-95 shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                {h.number}
              </a>
            </div>
          ))}
        </div>

        {/* Nút thoát nhanh bảo mật riêng tư */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleQuickExit}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
          >
            🔒 Thoát nhanh về Google
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
