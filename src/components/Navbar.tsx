import React, { useState } from 'react';
import {
  BookOpen,
  Shield,
  MessageCircleHeart,
  Wind,
  PhoneCall,
  Volume2,
  VolumeX,
  CloudRain,
  Waves,
  Sparkles,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface NavbarProps {
  activeTab: 'journal' | 'safety' | 'chat';
  onSelectTab: (tab: 'journal' | 'safety' | 'chat') => void;
  onOpenBreathingModal: () => void;
  onOpenEmergencyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenBreathingModal,
  onOpenEmergencyModal,
}) => {
  const [ambientSound, setAmbientSound] = useState<'rain' | 'ocean' | 'none'>('none');
  const [showSoundMenu, setShowSoundMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleSound = (type: 'rain' | 'ocean') => {
    if (ambientSound === type) {
      soundManager.stopAmbient();
      setAmbientSound('none');
    } else {
      if (type === 'rain') soundManager.startRain();
      if (type === 'ocean') soundManager.startOcean();
      setAmbientSound(type);
    }
  };

  const navItems = [
    {
      id: 'journal',
      label: 'Nhật Ký Cảm Xúc',
      icon: BookOpen,
      badge: 'NLP AI',
    },
    {
      id: 'safety',
      label: 'Trạm An Toàn Mạng',
      icon: Shield,
      badge: 'Tự vệ số',
    },
    {
      id: 'chat',
      label: 'Bạn Đồng Hành 24/7',
      icon: MessageCircleHeart,
      badge: 'An An',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-teal-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Slogan */}
        <div
          onClick={() => onSelectTab('journal')}
          className="flex items-center gap-3 cursor-pointer group transition-all duration-300"
          title="Về trang chủ Nhật ký Cảm xúc"
        >
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-teal-500 via-emerald-400 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-teal-500/40 transition-all duration-300">
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-6">🌱</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-gray-900 uppercase group-hover:text-teal-700 group-hover:brightness-105 transition-all duration-200">
                TÂM AN
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider group-hover:brightness-105 group-hover:border-teal-300 group-hover:opacity-95 transition-all duration-200">
                SafeSpace
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <p className="text-[11px] text-gray-500 font-medium group-hover:text-gray-700 group-hover:opacity-90 transition-all duration-200">
                Không gian an toàn cho bạn
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-gray-100/70 p-1.5 rounded-2xl border border-gray-200/50 hover:bg-gray-100/90 transition-all duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as any)}
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-teal-800 shadow-sm hover:brightness-105 hover:opacity-95'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-white/70 hover:brightness-105 hover:opacity-90'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-600'
                  }`}
                />
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-100 text-teal-800 group-hover:brightness-105'
                      : 'bg-gray-200/80 text-gray-600 group-hover:bg-teal-50 group-hover:text-teal-700'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Notification Bell, Ambient Sounds, Breathing, SOS Hotline */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Icon Thông Báo (Notification Bell) với hiệu ứng hover nhẹ nhàng */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSoundMenu(false);
              }}
              title="Thông báo an toàn & Lời nhắc mỗi ngày"
              className={`relative p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                showNotifications
                  ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-xs brightness-105'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-teal-50/80 hover:text-teal-700 hover:border-teal-200 hover:brightness-105 hover:opacity-90 hover:shadow-xs active:scale-95'
              }`}
            >
              <Bell className="w-4 h-4 transition-transform duration-200 hover:rotate-12" />
              {hasUnreadNotification && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-white" />
                </span>
              )}
            </button>

            {/* Dropdown Menu Thông Báo */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-teal-100 p-4 text-xs space-y-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-gray-900 text-sm">Thông Báo & Lời Nhắc</span>
                  </div>
                  <button
                    onClick={() => {
                      setHasUnreadNotification(false);
                      setShowNotifications(false);
                    }}
                    className="text-[11px] text-teal-600 hover:text-teal-800 font-semibold cursor-pointer"
                  >
                    Đã đọc tất cả
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 transition-all hover:brightness-105 hover:opacity-95">
                    <div className="flex items-center justify-between text-[10px] text-teal-800 font-bold mb-1">
                      <span>🌸 Lời Nhắc Tự Chăm Sóc</span>
                      <span className="text-gray-400 font-normal">Hôm nay</span>
                    </div>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      "Hãy uống một ngụm nước ấm và đứng dậy vươn vai sau mỗi 45 phút học bài nhé!"
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 transition-all hover:brightness-105 hover:opacity-95">
                    <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-1">
                      <span>🛡️ Cảnh Báo An Toàn Mạng</span>
                      <span className="text-gray-400 font-normal">Mới</span>
                    </div>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      Cục An toàn thông tin khuyến nghị: Tuyệt đối không bấm vào các đường link lạ hứa hẹn tặng skin game miễn phí.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 transition-all hover:brightness-105 hover:opacity-95">
                    <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold mb-1">
                      <span>📞 Tổng Đài 111 Sẵn Sàng</span>
                      <span className="text-gray-400 font-normal">24/7</span>
                    </div>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      Đường dây nóng Quốc gia Bảo vệ Trẻ em luôn mở miễn phí để lắng nghe mọi lo lắng của bạn.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menu Âm Thanh Thư Giãn (Soundscape) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSoundMenu(!showSoundMenu);
                setShowNotifications(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                ambientSound !== 'none'
                  ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-xs brightness-105'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-teal-200 hover:brightness-105 hover:opacity-90 hover:shadow-xs active:scale-95'
              }`}
              title="Âm thanh thư giãn"
            >
              {ambientSound === 'none' ? (
                <VolumeX className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
              ) : (
                <Volume2 className="w-4 h-4 text-teal-600 animate-pulse" />
              )}
              <span>
                {ambientSound === 'none'
                  ? 'Tiếng êm dịu'
                  : ambientSound === 'rain'
                  ? 'Mưa rơi rào'
                  : 'Sóng biển'}
              </span>
            </button>

            {showSoundMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 text-xs space-y-1 animate-in fade-in zoom-in-95 z-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  Âm thanh thư giãn:
                </div>
                <button
                  onClick={() => toggleSound('rain')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 ${
                    ambientSound === 'rain'
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'hover:bg-gray-50 hover:brightness-105 hover:opacity-95 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CloudRain className="w-3.5 h-3.5 text-teal-600" /> Tiếng mưa rào
                  </span>
                  {ambientSound === 'rain' && <span className="text-[10px] text-teal-600">Đang bật</span>}
                </button>
                <button
                  onClick={() => toggleSound('ocean')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 ${
                    ambientSound === 'ocean'
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'hover:bg-gray-50 hover:brightness-105 hover:opacity-95 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Waves className="w-3.5 h-3.5 text-teal-600" /> Tiếng sóng biển
                  </span>
                  {ambientSound === 'ocean' && <span className="text-[10px] text-teal-600">Đang bật</span>}
                </button>
                <button
                  onClick={() => soundManager.playZenChime(528)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-800 hover:brightness-105 hover:opacity-95 text-gray-700 cursor-pointer transition-all duration-150"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Gõ chuông tĩnh tâm
                </button>
                {ambientSound !== 'none' && (
                  <button
                    onClick={() => {
                      soundManager.stopAmbient();
                      setAmbientSound('none');
                    }}
                    className="w-full text-center px-3 py-1.5 text-rose-600 hover:bg-rose-50 hover:brightness-105 rounded-xl font-medium cursor-pointer transition-all"
                  >
                    Tắt âm thanh
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Nút Nhịp Thở Xả Stress với hiệu ứng hover nhẹ nhàng */}
          <button
            onClick={onOpenBreathingModal}
            className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold hover:bg-teal-100/90 hover:border-teal-300 hover:brightness-105 hover:opacity-95 hover:shadow-xs transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
          >
            <Wind className="w-4 h-4 text-teal-600 transition-transform duration-200 group-hover:rotate-12" />
            <span>Tập Thở 4-7-8</span>
          </button>

          {/* Nút SOS Khẩn Cấp với hiệu ứng hover sáng bừng ấm áp */}
          <button
            onClick={onOpenEmergencyModal}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:brightness-110 hover:opacity-95 hover:shadow-md hover:shadow-rose-600/20 transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
          >
            <PhoneCall className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12" />
            <span>SOS 111</span>
          </button>
        </div>

        {/* Mobile menu controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:brightness-105 hover:opacity-90 transition-all relative"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadNotification && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
            )}
          </button>
          <button
            onClick={onOpenEmergencyModal}
            className="p-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:brightness-110 hover:opacity-90 transition-all"
          >
            SOS
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:brightness-105 hover:opacity-90 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold ${
                    isActive ? 'bg-teal-50 text-teal-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-teal-600" />
                    {item.label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-200 text-gray-700">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenBreathingModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold text-center"
            >
              🌿 Tập Thở Sâu
            </button>
            <button
              onClick={() => {
                onOpenEmergencyModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold text-center"
            >
              📞 SOS Khẩn Cấp
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
