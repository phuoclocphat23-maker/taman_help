/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_JOURNAL_ENTRIES } from './data/mockData';
import { JournalEntry } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EmotionChart } from './components/EmotionChart';
import { JournalView } from './components/JournalView';
import { SafetyHub } from './components/SafetyHub';
import { CompanionChat } from './components/CompanionChat';
import { FloatingChatButton } from './components/FloatingChatButton';
import { BreathingWidget } from './components/BreathingWidget';
import { EmergencyModal } from './components/EmergencyModal';
import { Footer } from './components/Footer';
import { X, Sparkles, Heart } from 'lucide-react';

import { MoodPreset } from './components/HeroSection';
import { soundManager } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<'journal' | 'safety' | 'chat'>('journal');

  // Khởi tạo danh sách nhật ký: khi máy mới truy cập lần đầu, mặc định về 0 hết!
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('taman_entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn('Lỗi đọc dữ liệu nhật ký từ localStorage:', e);
      }
    }
    // Lần đầu mở: tất cả tiêu chí đánh giá quay về 0 hết!
    return [];
  });

  // Nhật ký được chọn từ biểu đồ để xem chi tiết
  const [selectedEntryForView, setSelectedEntryForView] = useState<JournalEntry | null>(null);

  // Modal điều khiển
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  // Lưu entries vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('taman_entries', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (newEntry: JournalEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Khi nhấn chọn cảm xúc thì các tiêu chí bắt đầu thay đổi tương ứng!
  const handleSelectMood = (mood: MoodPreset) => {
    soundManager.playZenChime(660);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    const moodEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      title: `Cảm xúc hôm nay: ${mood.label}`,
      content: `Hôm nay mình đang cảm thấy ${mood.label.toLowerCase()}. ${mood.message}`,
      date: dateStr,
      time: timeStr,
      moodEmoji: mood.emoji,
      moodLabel: mood.label,
      tags: ['Cảm xúc hôm nay', mood.label],
      emotions: mood.scores,
      dominantEmotion: mood.dominant,
      sentimentScore: Math.round(
        (mood.scores.joy + mood.scores.optimism - mood.scores.sadness - mood.scores.anxiety) / 2
      ),
      triggers: ['Tâm trạng trong ngày'],
      empathyMessage: mood.message,
      selfCareTips: [
        'Hít thở chậm 3 nhịp để cơ thể thư giãn',
        'Uống một ngụm nước ấm hoặc trà thảo mộc',
        'Lắng nghe một bài nhạc êm dịu',
      ],
    };

    setEntries((prev) => [moodEntry, ...prev.filter((e) => e.date !== dateStr)]);
  };

  // Đặt lại toàn bộ tiêu chí về 0% (như máy mới truy cập)
  const handleResetAllToZero = () => {
    soundManager.playZenChime(440);
    setEntries([]);
    setSelectedEntryForView(null);
    localStorage.removeItem('taman_entries');
  };

  // Nạp bộ dữ liệu mẫu 7 ngày
  const handleLoadMockData = () => {
    soundManager.playZenChime(528);
    setEntries(INITIAL_JOURNAL_ENTRIES);
  };

  const handleSelectEntryFromChart = (entry: JournalEntry) => {
    setSelectedEntryForView(entry);
    // Cuộn xuống khu vực nhật ký
    const journalElem = document.getElementById('journal-section');
    if (journalElem) {
      journalElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-gray-900 font-sans flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Header điều hướng */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBreathingModal={() => setIsBreathingModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section chung */}
        <HeroSection
          entries={entries}
          onOpenNewJournal={() => {
            setActiveTab('journal');
            const journalElem = document.getElementById('journal-section');
            if (journalElem) {
              journalElem.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onOpenBreathing={() => setIsBreathingModalOpen(true)}
          onOpenSafetyHub={() => {
            setActiveTab('safety');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectMood={handleSelectMood}
          onResetAllToZero={handleResetAllToZero}
          onLoadMockData={handleLoadMockData}
        />

        {/* Nội dung theo Tab đang chọn */}
        {activeTab === 'journal' && (
          <div className="space-y-12 animate-in fade-in">
            {/* 1. Phần Trực quan hóa Biểu Đồ Cảm Xúc (NLP Visualization & Trends) */}
            <section id="chart-section">
              <EmotionChart
                entries={entries}
                onSelectEntry={handleSelectEntryFromChart}
              />
            </section>

            {/* 2. Cuốn Sổ Tay Kỹ Thuật Số (Digital Journal & NLP Insights) */}
            <section id="journal-section">
              <JournalView
                entries={entries}
                onAddEntry={handleAddEntry}
                onDeleteEntry={handleDeleteEntry}
                selectedEntryForView={selectedEntryForView}
                onClearSelectedEntry={() => setSelectedEntryForView(null)}
              />
            </section>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="animate-in fade-in">
            <SafetyHub onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)} />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="animate-in fade-in py-4">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Trò Chuyện Chuyên Sâu Cùng An An
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Người bạn AI lắng nghe mọi bí mật, nỗi niềm và lo âu của bạn trong không gian riêng tư
              </p>
            </div>
            <CompanionChat
              isFloating={false}
              onOpenBreathingModal={() => setIsBreathingModalOpen(true)}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenBreathingModal={() => setIsBreathingModalOpen(true)}
      />

      {/* Nút Chatbot nổi 24/7 ở góc dưới bên phải */}
      <FloatingChatButton
        onOpenBreathingModal={() => setIsBreathingModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Modal Tập Thở 4-7-8 khi người dùng bấm */}
      {isBreathingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setIsBreathingModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-gray-700 shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <BreathingWidget onClose={() => setIsBreathingModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Modal Cứu Trợ SOS Khẩn Cấp */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
