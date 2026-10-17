import React from 'react';
import { ShieldCheck, Heart, PhoneCall, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenEmergencyModal: () => void;
  onOpenBreathingModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEmergencyModal, onOpenBreathingModal }) => {
  return (
    <footer className="mt-20 border-t border-teal-100/80 bg-white/80 backdrop-blur-md pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-100">
          {/* Cột 1: Giới thiệu dự án */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-lg shadow-sm">
                🌱
              </div>
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">
                Tâm An - SafeSpace
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md">
              Nền tảng hỗ trợ tâm lý học đường và cung cấp kỹ năng an toàn không gian mạng dành riêng
              cho trẻ em và thanh thiếu niên Việt Nam. Chúng mình tin rằng mọi cảm xúc đều đáng được
              lắng nghe và mọi bạn trẻ đều xứng đáng có một môi trường số an lành.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-teal-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bảo mật danh tính • Không phán xét • Hoàn toàn miễn phí</span>
            </div>
          </div>

          {/* Cột 2: Đường dây nóng khẩn cấp */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Đường Dây Nóng Khẩn Cấp
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="tel:111"
                  className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                  111 - Bảo vệ Trẻ em (24/7 Miễn phí)
                </a>
              </li>
              <li>
                <a
                  href="tel:0963061414"
                  className="text-gray-700 hover:text-teal-800 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                  096 306 1414 - Đường dây Ngày Mai
                </a>
              </li>
              <li>
                <a
                  href="tel:02438693731"
                  className="text-gray-700 hover:text-teal-800 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-gray-500" />
                  024 3869 3731 - BV Bạch Mai
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Cam kết bảo mật & Lối tắt */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Tiện Ích Chữa Lành
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <button
                  onClick={onOpenBreathingModal}
                  className="hover:text-teal-700 font-medium cursor-pointer"
                >
                  🌿 Bài tập thở sâu 4-7-8
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenEmergencyModal}
                  className="hover:text-rose-600 font-medium text-rose-600 cursor-pointer"
                >
                  🆘 Hỗ trợ khủng hoảng SOS
                </button>
              </li>
              <li className="text-[11px] text-gray-400 pt-2 flex items-start gap-1">
                <Lock className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                <span>Nhật ký được lưu trữ cục bộ trên trình duyệt của bạn (Local Storage).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bản quyền và thông điệp chân thành */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Tâm An - SafeSpace. Dành tặng tất cả các bạn trẻ trên hành trình trưởng thành.</p>
          <div className="flex items-center gap-1 text-gray-500">
            <span>Được tạo nên với sự thấu hiểu &</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
