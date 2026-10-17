import React, { useState } from 'react';
import { CompanionChat } from './CompanionChat';
import { MessageCircleHeart, X, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface FloatingChatButtonProps {
  onOpenBreathingModal?: () => void;
  onOpenEmergencyModal?: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  onOpenBreathingModal,
  onOpenEmergencyModal,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleChat = () => {
    if (!isOpen) {
      soundManager.playZenChime(660);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Cửa sổ chat nổi (Floating window) */}
      {isOpen && (
        <div className="mb-4 animate-in fade-in slide-in-from-bottom-5">
          <CompanionChat
            isFloating={true}
            onCloseFloating={() => setIsOpen(false)}
            onOpenBreathingModal={onOpenBreathingModal}
            onOpenEmergencyModal={onOpenEmergencyModal}
          />
        </div>
      )}

      {/* Nút bấm tròn nổi luôn hiển thị */}
      <button
        onClick={toggleChat}
        className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer ${
          isOpen
            ? 'bg-gray-800 text-white hover:brightness-110 hover:opacity-95'
            : 'bg-linear-to-r from-teal-500 via-teal-600 to-emerald-600 text-white hover:shadow-teal-500/40 hover:scale-105 hover:brightness-110 hover:opacity-95'
        }`}
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
          </span>
        )}

        {isOpen ? (
          <>
            <X className="w-5 h-5" />
            <span className="text-xs font-bold pr-1">Đóng Chat</span>
          </>
        ) : (
          <>
            <span className="text-lg">🌸</span>
            <div className="text-left">
              <span className="block text-xs font-bold leading-none">Tâm Sự Cùng An An</span>
              <span className="text-[10px] text-teal-100/90">AI Lắng Nghe 24/7</span>
            </div>
          </>
        )}
      </button>
    </div>
  );
};
