import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  AlertCircle, 
  ShieldCheck, 
  Calendar,
  XCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { Booking, Language } from '../types';
import { JobStatus, canTransitionStatus, formatETA } from '../utils/bookingState';
import { formatCurrency } from '../utils/pricing';

interface OrderTrackerProps {
  bookings: Booking[];
  selectedBookingId: string | null;
  onSelectBooking: (id: string) => void;
  onUpdateBookingStatus: (bookingId: string, nextStatus: JobStatus) => void;
  onOpenChat: (booking: Booking) => void;
  language: Language;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  bookings,
  selectedBookingId,
  onSelectBooking,
  onUpdateBookingStatus,
  onOpenChat,
  language,
}) => {
  const isAr = language === 'ar';

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  if (!activeBooking) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <Clock className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">
          {isAr ? 'لا توجد طلبات نشطة حالياً' : 'No active bookings found'}
        </h3>
        <p className="text-xs text-slate-400">
          {isAr ? 'يمكنك حجز فني أو صيانة من تبويب الخدمات الرئيسية' : 'Browse categories to request your first verified craftsman'}
        </p>
      </div>
    );
  }

  const steps: { key: JobStatus; titleAr: string; titleEn: string }[] = [
    { key: 'requested', titleAr: 'تم الطلب', titleEn: 'Requested' },
    { key: 'accepted', titleAr: 'تأكيد الحرفي', titleEn: 'Accepted' },
    { key: 'en_route', titleAr: 'في الطريق', titleEn: 'En Route' },
    { key: 'arrived', titleAr: 'وصل للموقع', titleEn: 'Arrived' },
    { key: 'in_progress', titleAr: 'جاري العمل', titleEn: 'Working' },
    { key: 'completed', titleAr: 'اكتملت الخدمة', titleEn: 'Completed' },
  ];

  const getStepIndex = (status: JobStatus) => {
    switch (status) {
      case 'requested': return 0;
      case 'accepted': return 1;
      case 'en_route': return 2;
      case 'arrived': return 3;
      case 'in_progress': return 4;
      case 'completed': return 5;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(activeBooking.status);

  return (
    <div className="space-y-6">
      {/* Booking Selector Tabs if multiple */}
      {bookings.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {bookings.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelectBooking(b.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                b.id === activeBooking.id
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="font-mono">{b.referenceNumber}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/20">
                {isAr ? b.serviceNameAr : b.serviceName}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Tracker Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 to-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                {activeBooking.referenceNumber}
              </span>
              <span className="text-xs text-slate-400">
                {activeBooking.date} • {activeBooking.timeSlot}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <span>{isAr ? activeBooking.serviceNameAr : activeBooking.serviceName}</span>
              {activeBooking.isUrgent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  {isAr ? 'طارئ 30 د' : 'Urgent'}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeBooking.address}, {activeBooking.city}</span>
            </p>
          </div>

          {/* Status Badge & ETA */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              {isAr ? 'حالة الطلب المباشرة' : 'Live Order Status'}
            </span>
            <div className="flex items-center gap-2">
              {activeBooking.status === 'en_route' && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 animate-pulse">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{formatETA(activeBooking.etaMinutes || 12, language)}</span>
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                activeBooking.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : activeBooking.status === 'cancelled'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {activeBooking.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Stepper */}
        {activeBooking.status !== 'cancelled' ? (
          <div className="p-6 bg-slate-950/40 border-b border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {steps.map((st, idx) => {
                const isPassed = currentIndex >= idx;
                const isCurrent = currentIndex === idx;
                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : isPassed
                        ? 'bg-slate-800/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5">
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                      ) : (
                        <span className="text-slate-500">{idx + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs font-bold ${isCurrent ? 'text-amber-300' : isPassed ? 'text-white' : 'text-slate-500'}`}>
                      {isAr ? st.titleAr : st.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-red-950/20 border-b border-red-500/20 text-center text-red-300 text-sm">
            {isAr ? 'تم إلغاء هذا الطلب بناء على طلبك' : 'This booking has been cancelled'}
          </div>
        )}

        {/* Craftsman Info & Communication */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Craftsman Card */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={activeBooking.craftsmanAvatar}
                alt={activeBooking.craftsmanName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/70"
              />
              <div>
                <span className="text-[10px] text-slate-400 block">{isAr ? 'الحرفي المباشر للخدمة' : 'Assigned Technician'}</span>
                <h4 className="font-bold text-white text-sm">
                  {isAr ? activeBooking.craftsmanNameAr : activeBooking.craftsmanName}
                </h4>
                <p className="text-xs text-amber-400">
                  {isAr ? activeBooking.craftsmanTradeAr : activeBooking.craftsmanTrade}
                </p>
              </div>
            </div>

            {/* Quick Actions: Chat & Phone */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenChat(activeBooking)}
                className="p-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold transition-all flex items-center gap-1.5 text-xs shadow-md shadow-amber-500/20"
                title={isAr ? 'محادثة فورية مع الحرفي' : 'Live Chat with Craftsman'}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'محادثة' : 'Chat'}</span>
              </button>

              <a
                href="tel:+966508924110"
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Call Craftsman"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Pricing & Invoice Snippet */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between text-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span>{isAr ? 'رسوم المعاينة والكشف' : 'Diagnostic Base'}</span>
                <span>{formatCurrency(activeBooking.pricing.baseServiceFee, language)}</span>
              </div>
              {activeBooking.isUrgent && (
                <div className="flex items-center justify-between text-amber-300">
                  <span>{isAr ? 'إرسال طوارئ' : 'Urgent Dispatch'}</span>
                  <span>+{formatCurrency(activeBooking.pricing.urgencySurcharge, language)}</span>
                </div>
              )}
              {activeBooking.pricing.discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>{isAr ? 'خصم الكوبون' : 'Voucher Discount'}</span>
                  <span>-{formatCurrency(activeBooking.pricing.discountAmount, language)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-400">
                <span>{isAr ? 'الضريبة (15%)' : 'VAT (15%)'}</span>
                <span>{formatCurrency(activeBooking.pricing.vatAmount, language)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between font-bold text-white">
              <span>{isAr ? 'المبلغ الإجمالي' : 'Total Amount'}</span>
              <span className="text-sm text-amber-400">
                {formatCurrency(activeBooking.pricing.total, language)}
              </span>
            </div>
          </div>
        </div>

        {/* Issue Details Note */}
        <div className="px-6 pb-6 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-400 block">{isAr ? 'ملاحظات المشكلة المبلغ عنها:' : 'Customer Reported Problem:'}</span>
            <p className="text-slate-200">{activeBooking.issueDescription}</p>
          </div>
        </div>

        {/* Interactive Simulation Bar (advance job stage) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Play className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">{isAr ? 'محاكاة تقدم مسار الطلب:' : 'Simulate Order Progression:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeBooking.status === 'requested' && (
              <button
                onClick={() => onUpdateBookingStatus(activeBooking.id, 'accepted')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-amber-500/30"
              >
                {isAr ? 'محاكاة: قبول الحرفي' : 'Simulate: Accept'}
              </button>
            )}

            {activeBooking.status === 'accepted' && (
              <button
                onClick={() => onUpdateBookingStatus(activeBooking.id, 'en_route')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                {isAr ? 'محاكاة: انطلاق الحرفي (في الطريق)' : 'Simulate: Dispatched (En Route)'}
              </button>
            )}

            {activeBooking.status === 'en_route' && (
              <button
                onClick={() => onUpdateBookingStatus(activeBooking.id, 'arrived')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                {isAr ? 'محاكاة: وصل الحرفي للموقع' : 'Simulate: Arrived At Location'}
              </button>
            )}

            {activeBooking.status === 'arrived' && (
              <button
                onClick={() => onUpdateBookingStatus(activeBooking.id, 'in_progress')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                {isAr ? 'محاكاة: بدء العمل الفعلي' : 'Simulate: Start Repair'}
              </button>
            )}

            {activeBooking.status === 'in_progress' && (
              <button
                onClick={() => onUpdateBookingStatus(activeBooking.id, 'completed')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                {isAr ? 'محاكاة: إنجاز العمل والدفع' : 'Simulate: Complete & Pay'}
              </button>
            )}

            {activeBooking.status === 'completed' && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تم إغلاق الطلب وتقييم الخدمة بنجاح' : 'Job Completed & Settled'}</span>
              </span>
            )}

            {/* Cancel option */}
            {canTransitionStatus(activeBooking.status, 'cancelled', 'customer').allowed && (
              <button
                onClick={() => onUpdateBookingStatus(activeBooking.id, 'cancelled')}
                className="px-2.5 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-300 font-medium border border-red-700/50"
              >
                {isAr ? 'إلغاء الطلب' : 'Cancel Booking'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
