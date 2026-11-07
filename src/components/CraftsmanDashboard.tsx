import React, { useState } from 'react';
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  MessageSquare, 
  Phone, 
  AlertCircle, 
  Check, 
  X, 
  Play, 
  Power,
  ShieldCheck,
  TrendingUp,
  User
} from 'lucide-react';
import { Booking, Craftsman, Language } from '../types';
import { JobStatus, formatETA } from '../utils/bookingState';
import { formatCurrency } from '../utils/pricing';

interface CraftsmanDashboardProps {
  craftsman: Craftsman;
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, status: JobStatus) => void;
  onOpenChat: (booking: Booking) => void;
  language: Language;
}

export const CraftsmanDashboard: React.FC<CraftsmanDashboardProps> = ({
  craftsman,
  bookings,
  onUpdateBookingStatus,
  onOpenChat,
  language,
}) => {
  const isAr = language === 'ar';
  const [isOnline, setIsOnline] = useState(true);

  // Incoming offer simulation
  const [incomingOffer, setIncomingOffer] = useState<{
    id: string;
    customerName: string;
    trade: string;
    tradeAr: string;
    district: string;
    districtAr: string;
    amount: number;
    distanceKm: number;
  } | null>({
    id: 'inc-99',
    customerName: 'Nasser Al-Ghamdi',
    trade: 'Circuit Breaker Sparkling Repair',
    tradeAr: 'إصلاح شرار وتماس في القاطع الرئيسي',
    district: 'Al Sahafa District',
    districtAr: 'حي الصحافة، الرياض',
    amount: 140,
    distanceKm: 1.9,
  });

  const myBookings = bookings.filter((b) => b.craftsmanId === craftsman.id);

  const handleAcceptOffer = () => {
    if (!incomingOffer) return;
    onUpdateBookingStatus(bookings[0]?.id || 'book-101', 'accepted');
    setIncomingOffer(null);
  };

  const handleDeclineOffer = () => {
    setIncomingOffer(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Pro Banner & Status Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={craftsman.avatar}
              alt={craftsman.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {isAr ? craftsman.nameAr : craftsman.name}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO CRAFTSMAN
              </span>
            </div>
            <p className="text-xs text-amber-400 font-medium">
              {isAr ? craftsman.titleAr : craftsman.title}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              ID: {craftsman.id} • {craftsman.phone}
            </p>
          </div>
        </div>

        {/* Online Dispatch Toggle */}
        <div className="flex items-center gap-3 bg-slate-950/60 p-2 rounded-2xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="px-3">
            <span className="text-[11px] text-slate-400 block">{isAr ? 'حالة التواجد للطلب' : 'Dispatch Status'}</span>
            <span className={`text-xs font-bold ${isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isOnline ? (isAr ? 'متاح لاستقبال البلاغات' : 'Online & Receiving Jobs') : (isAr ? 'غير متاح (استراحة)' : 'Offline (On Break)')}
            </span>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
              isOnline
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? (isAr ? 'متصل' : 'Online') : (isAr ? 'غير متصل' : 'Offline')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>{isAr ? 'أرباح اليوم' : "Today's Earnings"}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </span>
          <div className="text-2xl font-black text-emerald-400">
            {formatCurrency(420, language)}
          </div>
          <span className="text-[10px] text-slate-500">{isAr ? 'تم تحصيل 3 مهمات' : '3 jobs collected'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>{isAr ? 'رصيد المحفظة المتاح' : 'Wallet Balance'}</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </span>
          <div className="text-2xl font-black text-white">
            {formatCurrency(2450, language)}
          </div>
          <span className="text-[10px] text-slate-500">{isAr ? 'تحويل بنكي فوري متاح' : 'Instant IBAN payout'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>{isAr ? 'تقييم العملاء' : 'Customer Rating'}</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </span>
          <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
            <span>{craftsman.rating}</span>
            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <span className="text-[10px] text-slate-500">{craftsman.reviewsCount} {isAr ? 'مراجعة معتمدة' : 'reviews'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 flex items-center justify-between">
            <span>{isAr ? 'المهمات المنجزة' : 'Total Completed'}</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </span>
          <div className="text-2xl font-black text-white">
            {craftsman.completedJobs}
          </div>
          <span className="text-[10px] text-slate-500">{isAr ? 'نسبة قبول 98%' : '98% acceptance rate'}</span>
        </div>
      </div>

      {/* Incoming Job Alert Banner if any */}
      {incomingOffer && isOnline && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900 border-2 border-amber-500/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 animate-bounce">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  {isAr ? 'طلب جديد طارئ بالقرب منك!' : 'New Instant Request Nearby!'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {incomingOffer.distanceKm} {isAr ? 'كم' : 'km'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {isAr ? incomingOffer.tradeAr : incomingOffer.trade}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isAr ? incomingOffer.customerName : incomingOffer.customerName} • {isAr ? incomingOffer.districtAr : incomingOffer.district}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="text-right pr-3 border-r border-slate-700 hidden sm:block">
              <span className="text-[10px] text-slate-400 block">{isAr ? 'أجر المهمة' : 'Fee'}</span>
              <span className="text-base font-bold text-amber-400">
                {formatCurrency(incomingOffer.amount, language)}
              </span>
            </div>

            <button
              onClick={handleDeclineOffer}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              {isAr ? 'تخطي' : 'Decline'}
            </button>

            <button
              onClick={handleAcceptOffer}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
            >
              <Check className="w-4 h-4" />
              <span>{isAr ? 'قبول وانطلاق الآن' : 'Accept & Dispatch'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Assigned Jobs List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-400" />
          <span>{isAr ? 'الطلبات الجارية والمجدولة لك' : 'Your Active & Scheduled Jobs'}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">
            {myBookings.length}
          </span>
        </h3>

        {myBookings.length > 0 ? (
          <div className="space-y-4">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {b.referenceNumber}
                      </span>
                      <span className="text-xs text-slate-400">• {b.timeSlot}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      {isAr ? b.serviceNameAr : b.serviceName}
                    </h4>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.address}, {b.city}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      {b.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => onOpenChat(b)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <a
                      href="tel:+966501234567"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400"
                      title="Call Customer"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Problem description */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-slate-500 font-bold block mb-1">{isAr ? 'وصف العميل:' : 'Customer Note:'}</span>
                  <p>{b.issueDescription}</p>
                </div>

                {/* Craftsman Action Buttons to Update Job Progression */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">
                    {isAr ? 'تحديث حالة العمل:' : 'Update job status:'}
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {b.status === 'requested' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'accepted')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                      >
                        {isAr ? 'قبول الطلب وجدولة الموعد' : 'Accept Request'}
                      </button>
                    )}

                    {b.status === 'accepted' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'en_route')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تحرك الآن (في الطريق)' : 'Start Driving (En Route)'}</span>
                      </button>
                    )}

                    {b.status === 'en_route' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'arrived')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                      >
                        {isAr ? 'وصلت إلى موقع العميل' : 'I Have Arrived'}
                      </button>
                    )}

                    {b.status === 'arrived' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'in_progress')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                      >
                        {isAr ? 'بدء الفحص والإصلاح الفعلي' : 'Start Diagnostic & Repair'}
                      </button>
                    )}

                    {b.status === 'in_progress' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isAr ? 'اكتمال العمل وإصدار الفاتورة' : 'Finish Job & Invoice'}</span>
                      </button>
                    )}

                    {b.status === 'completed' && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isAr ? 'تم تحصيل أتعاب الخدمة وإغلاق الطلب' : 'Payment Settled'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            {isAr ? 'لا توجد طلبات جارية حالياً لك' : 'No active jobs assigned at the moment'}
          </div>
        )}
      </div>
    </div>
  );
};
