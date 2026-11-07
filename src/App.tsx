/**
 * Hirafi (حِـرفي) - Craftsman & Home Services Platform
 * Application ID: com.aistudio.hirafi.qtwz
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ServiceBrowser } from './components/ServiceBrowser';
import { CraftsmenList } from './components/CraftsmenList';
import { CraftsmanProfileModal } from './components/CraftsmanProfileModal';
import { BookingModal } from './components/BookingModal';
import { OrderTracker } from './components/OrderTracker';
import { LiveChatModal } from './components/LiveChatModal';
import { AIDiagnosisPanel } from './components/AIDiagnosisPanel';
import { CraftsmanDashboard } from './components/CraftsmanDashboard';
import { GradleInspectorModal } from './components/GradleInspectorModal';

import { 
  SERVICE_CATEGORIES, 
  CRAFTSMEN, 
  INITIAL_ACTIVE_BOOKINGS,
  GRADLE_FILE_PATH 
} from './data/mockData';
import { 
  Language, 
  UserMode, 
  ServiceCategory, 
  Craftsman, 
  Booking, 
  ChatMessage 
} from './types';
import { JobStatus } from './utils/bookingState';
import { FileCode2, ShieldCheck, Heart, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [userMode, setUserMode] = useState<UserMode>('customer');
  const [activeTab, setActiveTab] = useState<'services' | 'bookings' | 'ai_diagnostic' | 'craftsman_dashboard'>('services');

  const [categories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);
  const [craftsmen] = useState<Craftsman[]>(CRAFTSMEN);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_ACTIVE_BOOKINGS);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(INITIAL_ACTIVE_BOOKINGS[0]?.id || null);

  // Filters & Selected states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [viewingCraftsman, setViewingCraftsman] = useState<Craftsman | null>(null);
  
  // Modals
  const [isGradleModalOpen, setIsGradleModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<ServiceCategory | null>(null);
  const [bookingCraftsman, setBookingCraftsman] = useState<Craftsman | null>(null);
  const [bookingPrefilledIssue, setBookingPrefilledIssue] = useState<string>('');
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);

  // Sync HTML dir and lang
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const isAr = language === 'ar';

  // Booking handlers
  const handleOpenBooking = (
    category: ServiceCategory | null = null,
    craftsman: Craftsman | null = null,
    prefilledIssue: string = ''
  ) => {
    setBookingCategory(category);
    setBookingCraftsman(craftsman);
    setBookingPrefilledIssue(prefilledIssue);
    setIsBookingModalOpen(true);
  };

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setSelectedBookingId(newBooking.id);
    setActiveTab('bookings');
  };

  const handleUpdateBookingStatus = (bookingId: string, nextStatus: JobStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: nextStatus,
          etaMinutes: nextStatus === 'en_route' ? 12 : nextStatus === 'arrived' ? 0 : b.etaMinutes,
        };
      })
    );
  };

  // Chat message send & simulated reply
  const handleSendMessage = (bookingId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const updated = {
          ...b,
          chatMessages: [...b.chatMessages, newMsg],
        };
        if (chatBooking?.id === bookingId) {
          setChatBooking(updated);
        }
        return updated;
      })
    );

    // Simulated craftsman auto-response after 1.2 seconds
    setTimeout(() => {
      const craftsmanRepliesAr = [
        'تمام يا غالي، مسافة الطريق وأكون عندك.',
        'أنا متواجد قريب منك في الحي، دقيقتين وأرن جرس الباب.',
        'تم تسجيل الملاحظة ومعي كافة القطع والأجهزة المطلوبة.',
        'ممتاز، شكراً لتوضيح التفاصيل، جاري الفحص بمجرد الوصول.',
      ];
      const craftsmanRepliesEn = [
        'Got it, I am currently navigating and almost there.',
        'I am on your street right now, will ring the doorbell in 2 minutes.',
        'Noted, I have all needed tools and diagnostic gear with me.',
        'Thank you for the extra details, will inspect right away upon arrival.',
      ];
      const replyPool = isAr ? craftsmanRepliesAr : craftsmanRepliesEn;
      const chosenReply = replyPool[Math.floor(Math.random() * replyPool.length)];

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'craftsman',
        text: chosenReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          const updated = {
            ...b,
            chatMessages: [...b.chatMessages, replyMsg],
          };
          if (chatBooking?.id === bookingId) {
            setChatBooking(updated);
          }
          return updated;
        })
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Global Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        userMode={userMode}
        onUserModeChange={setUserMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenGradleModal={() => setIsGradleModalOpen(true)}
        activeBookingsCount={bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 1: CUSTOMER SERVICES & CRAFTSMEN */}
        {userMode === 'customer' && activeTab === 'services' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Service Categories Browser */}
            <ServiceBrowser
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              language={language}
              onQuickBookCategory={(cat, issue) => handleOpenBooking(cat, null, issue)}
              onOpenAIDiagnostic={() => setActiveTab('ai_diagnostic')}
            />

            {/* Verified Craftsmen Grid */}
            <CraftsmenList
              craftsmen={craftsmen}
              selectedCategoryId={selectedCategoryId}
              language={language}
              onBookCraftsman={(craftsman) => handleOpenBooking(null, craftsman)}
              onViewProfile={(craftsman) => setViewingCraftsman(craftsman)}
            />
          </div>
        )}

        {/* VIEW 2: ORDER TRACKER */}
        {userMode === 'customer' && activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isAr ? 'متابعة الطلبات المباشرة' : 'Live Bookings & Dispatch'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr ? 'تتبع مسار الحرفي بالـ GPS، وتواصل معه مباشرة عبر المحادثة' : 'Track arrival in real time and message your technician'}
                </p>
              </div>

              <button
                onClick={() => handleOpenBooking()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
              >
                + {isAr ? 'طلب صيانة جديد' : 'New Service Request'}
              </button>
            </div>

            <OrderTracker
              bookings={bookings}
              selectedBookingId={selectedBookingId}
              onSelectBooking={setSelectedBookingId}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onOpenChat={(booking) => setChatBooking(booking)}
              language={language}
            />
          </div>
        )}

        {/* VIEW 3: AI FAULT DIAGNOSIS */}
        {userMode === 'customer' && activeTab === 'ai_diagnostic' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AIDiagnosisPanel
              language={language}
              categories={categories}
              onBookDiagnosis={(categoryId, summary) => {
                const matchedCategory = categories.find((c) => c.id === categoryId) || categories[0];
                handleOpenBooking(matchedCategory, null, summary);
              }}
            />
          </div>
        )}

        {/* VIEW 4: CRAFTSMAN PRO DASHBOARD */}
        {userMode === 'craftsman' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <CraftsmanDashboard
              craftsman={craftsmen[0]} // Primary active craftsman
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onOpenChat={(booking) => setChatBooking(booking)}
              language={language}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <GradleInspectorModal
        isOpen={isGradleModalOpen}
        onClose={() => setIsGradleModalOpen(false)}
        language={language}
      />

      <CraftsmanProfileModal
        craftsman={viewingCraftsman}
        isOpen={!!viewingCraftsman}
        onClose={() => setViewingCraftsman(null)}
        language={language}
        onBook={(craftsman) => {
          setViewingCraftsman(null);
          handleOpenBooking(null, craftsman);
        }}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        language={language}
        categories={categories}
        craftsmen={craftsmen}
        preSelectedCategory={bookingCategory}
        preSelectedCraftsman={bookingCraftsman}
        preFilledIssue={bookingPrefilledIssue}
        onBookingCreated={handleBookingCreated}
      />

      <LiveChatModal
        booking={chatBooking}
        isOpen={!!chatBooking}
        onClose={() => setChatBooking(null)}
        language={language}
        onSendMessage={handleSendMessage}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/90 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">
                {isAr ? 'حِـرفي (Hirafi Platform)' : 'Hirafi Pro Platform'}
              </span>
              <p className="text-[11px] text-slate-400 font-mono">
                applicationId: com.aistudio.hirafi.qtwz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsGradleModalOpen(true)}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-mono"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>build.gradle.kts ({GRADLE_FILE_PATH})</span>
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'ضمان جودة الأعمال' : '100% Quality Guaranteed'}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            © 2026 Hirafi Inc. {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
          </div>
        </div>
      </footer>

    </div>
  );
}
