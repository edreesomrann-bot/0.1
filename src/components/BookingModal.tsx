import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Phone,
  Zap,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { ServiceCategory, Craftsman, Language, Booking } from '../types';
import { calculateBookingQuote, formatCurrency, validatePromoCode } from '../utils/pricing';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  categories: ServiceCategory[];
  craftsmen: Craftsman[];
  preSelectedCategory: ServiceCategory | null;
  preSelectedCraftsman: Craftsman | null;
  preFilledIssue?: string;
  onBookingCreated: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  language,
  categories,
  craftsmen,
  preSelectedCategory,
  preSelectedCraftsman,
  preFilledIssue,
  onBookingCreated,
}) => {
  if (!isOpen) return null;
  const isAr = language === 'ar';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    preSelectedCategory?.id || preSelectedCraftsman?.categoryId || categories[0]?.id || 'plumbing'
  );
  const [selectedCraftsmanId, setSelectedCraftsmanId] = useState<string>(
    preSelectedCraftsman?.id || ''
  );
  const [issueDescription, setIssueDescription] = useState<string>(preFilledIssue || '');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('Al Malqa District, Anas Ibn Malik Rd');
  const [city, setCity] = useState<string>('Riyadh');
  const [date, setDate] = useState<string>('Today');
  const [timeSlot, setTimeSlot] = useState<string>('Afternoon (1:00 PM - 4:00 PM)');
  const [customerName, setCustomerName] = useState<string>('Edrees Omran');
  const [customerPhone, setCustomerPhone] = useState<string>('+966 50 123 4567');
  const [promoCode, setPromoCode] = useState<string>('HIRAFI20');
  const [appliedPromo, setAppliedPromo] = useState<string>('HIRAFI20');
  const [promoError, setPromoError] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const fallbackCraftsman = craftsmen[0];
  const assignedCraftsman: Craftsman = (
    selectedCraftsmanId
      ? craftsmen.find((c) => c.id === selectedCraftsmanId)
      : craftsmen.find((c) => c.categoryId === selectedCategoryId && c.isAvailable)
  ) || fallbackCraftsman;

  const basePrice = assignedCraftsman?.hourlyRate || activeCategory.basePrice;

  const quote = calculateBookingQuote({
    baseServiceFee: basePrice,
    isUrgent: isUrgent,
    discountCode: appliedPromo,
  });

  const handleApplyPromo = () => {
    const res = validatePromoCode(promoCode);
    if (res.valid) {
      setAppliedPromo(promoCode.trim().toUpperCase());
      setPromoError(null);
    } else {
      setPromoError(isAr ? 'كوبون الخصم غير صحيح أو منتهي' : 'Invalid promo code');
    }
  };

  const handleFinalSubmit = () => {
    const randomRef = `HRF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      referenceNumber: randomRef,
      customerName,
      customerPhone,
      craftsmanId: assignedCraftsman.id,
      craftsmanName: assignedCraftsman.name,
      craftsmanNameAr: assignedCraftsman.nameAr,
      craftsmanAvatar: assignedCraftsman.avatar,
      craftsmanTrade: assignedCraftsman.title,
      craftsmanTradeAr: assignedCraftsman.titleAr,
      categoryId: activeCategory.id,
      serviceName: activeCategory.name,
      serviceNameAr: activeCategory.nameAr,
      issueDescription: issueDescription || (isAr ? 'طلب صيانة وكشف عام' : 'General inspection & repair request'),
      address,
      city,
      date,
      timeSlot: isUrgent ? (isAr ? 'إرسال طارئ (خلال 30 دقيقة)' : 'Urgent Dispatch (Within 30 mins)') : timeSlot,
      isUrgent,
      pricing: quote,
      status: 'accepted',
      createdAt: new Date().toISOString(),
      etaMinutes: isUrgent ? 18 : 45,
      chatMessages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'system',
          text: isAr 
            ? `تم تأكيد حجزك برقم مرجعي ${randomRef}. الحرفي ${assignedCraftsman.nameAr} قبل طلبك وجاري الاستعداد.`
            : `Booking confirmed with ref ${randomRef}. ${assignedCraftsman.name} accepted your request.`,
          timestamp: 'Just now',
        },
        {
          id: `msg-${Date.now()}-2`,
          sender: 'craftsman',
          text: isAr
            ? `أهلاً بك أخي ${customerName}، يسعدني خدمتك. أنا في طريقي لتجهيز الأدوات اللازمة للمعاينة والإصلاح.`
            : `Hello ${customerName}, I have received your request and preparing diagnostic tools for your location.`,
          timestamp: 'Just now',
        },
      ],
    };

    onBookingCreated(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {isAr ? 'حجز موعد خدمة صيانة منزلية' : 'Book a Certified Home Service'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {isAr ? `خطوة ${step} من 3` : `Step ${step} of 3`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {step === 1 && (isAr ? 'تحديد العطل ونوع الخدمة' : 'Specify the issue and service type')}
              {step === 2 && (isAr ? 'الموقع والموعد المفضل' : 'Location and preferred time slot')}
              {step === 3 && (isAr ? 'مراجعة التسعير وتأكيد الحجز' : 'Review quote and confirm booking')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</span>
            <span>{isAr ? 'تفاصيل العطل' : 'Issue Details'}</span>
          </div>
          <div className="w-8 h-px bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</span>
            <span>{isAr ? 'الموعد والموقع' : 'Schedule & Place'}</span>
          </div>
          <div className="w-8 h-px bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</span>
            <span>{isAr ? 'التسعير والتأكيد' : 'Review & Pay'}</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm text-slate-200">
          
          {/* STEP 1: ISSUE DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isAr ? 'تخصص الخدمة' : 'Service Domain'}
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.nameAr : c.name} ({formatCurrency(c.basePrice, language)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isAr ? 'وصف المشكلة أو العطل بالتفصيل' : 'Describe the problem in detail'}
                </label>
                <textarea
                  rows={3}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: يوجد تسريب مياه مستمر في الحمام الأرضي تحت المغسلة، أو المكيف يفصل بعد 10 دقائق...'
                      : 'e.g. Water dripping under the master bathroom sink, or the main breaker trips whenever AC turns on...'
                  }
                  className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Popular quick-select symptom chips */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  {isAr ? 'أعراض شائعة سريعة (انقر للإضافة):' : 'Common symptom quick-tags:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCategory.popularIssues.map((issue, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const text = isAr ? issue.ar : issue.en;
                        setIssueDescription((prev) => (prev ? `${prev} - ${text}` : text));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/15 border border-slate-700 hover:border-amber-500/40 text-[11px] text-slate-300 transition-colors"
                    >
                      + {isAr ? issue.ar : issue.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgent Express Toggle */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">
                      {isAr ? 'طلب طوارئ فوري (وصول خلال 30 دقيقة)' : 'Emergency Urgent Dispatch (Within 30 mins)'}
                    </span>
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isAr 
                      ? 'يتم توجيه أقرب حرفي متاح فوراً لحل المشكلة الطارئة (+35% على رسوم الخدمة الأساسية).' 
                      : 'Immediately routes the closest active professional to your location (+35% urgency surcharge).'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULE & LOCATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'تاريخ الزيارة' : 'Service Date'}
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Today">{isAr ? 'اليوم (السبت، 7 نوفمبر)' : 'Today (Sat, Nov 7)'}</option>
                    <option value="Tomorrow">{isAr ? 'غداً (الأحد، 8 نوفمبر)' : 'Tomorrow (Sun, Nov 8)'}</option>
                    <option value="In 2 Days">{isAr ? 'بعد يومين (الإثنين، 9 نوفمبر)' : 'In 2 days (Mon, Nov 9)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'الفترة الزمنية المفضلة' : 'Preferred Window'}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    disabled={isUrgent}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-50"
                  >
                    {isUrgent ? (
                      <option>{isAr ? 'طوارئ (خلال 30 دقيقة)' : 'Emergency (within 30m)'}</option>
                    ) : (
                      <>
                        <option value="Morning (9:00 AM - 12:00 PM)">{isAr ? 'صباحاً (9:00 ص - 12:00 م)' : 'Morning (9:00 AM - 12:00 PM)'}</option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">{isAr ? 'ظهراً (1:00 م - 4:00 م)' : 'Afternoon (1:00 PM - 4:00 PM)'}</option>
                        <option value="Evening (5:00 PM - 9:00 PM)">{isAr ? 'مساءً (5:00 م - 9:00 م)' : 'Evening (5:00 PM - 9:00 PM)'}</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isAr ? 'العنوان والحي' : 'Street & District Address'}
                </label>
                <div className="relative">
                  <MapPin className={`w-4 h-4 text-slate-400 absolute top-3 ${isAr ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isAr ? 'اسم الحي، الشارع، رقم الفيلا أو الشقة' : 'District, Street name, building/villa #'}
                    className={`w-full py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'اسم العميل' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'رقم الجوال للتواصل' : 'Mobile Phone'}
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Assigned Craftsman info */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={assignedCraftsman.avatar}
                    alt={assignedCraftsman.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-600"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isAr ? 'الحرفي المخصص لهذا الطلب:' : 'Assigned Craftsman:'}</span>
                    <span className="font-bold text-white text-xs">{isAr ? assignedCraftsman.nameAr : assignedCraftsman.name}</span>
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-bold">
                  {formatCurrency(assignedCraftsman.hourlyRate, language)}/hr
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: QUOTE & CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Promo Code Input */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'كوبون الخصم الترويجي' : 'Promo Voucher Code'}</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. HIRAFI20"
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 uppercase font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                  >
                    {isAr ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}
                {quote.appliedDiscountName && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{quote.appliedDiscountName} (-{formatCurrency(quote.discountAmount, language)})</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown Table */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-2.5 text-xs">
                <h4 className="font-bold text-white border-b border-slate-700 pb-2">
                  {isAr ? 'تفاصيل الفاتورة التقديرية' : 'Estimated Pricing Breakdown'}
                </h4>

                <div className="flex items-center justify-between text-slate-300">
                  <span>{isAr ? 'رسوم المعاينة والتشخيص الأساسية' : 'Base Diagnostic & Labor Fee'}</span>
                  <span>{formatCurrency(quote.baseServiceFee, language)}</span>
                </div>

                {isUrgent && (
                  <div className="flex items-center justify-between text-amber-300">
                    <span>{isAr ? 'رسوم إرسال طارئ فوري (+35%)' : 'Urgent Express Surcharge (+35%)'}</span>
                    <span>+{formatCurrency(quote.urgencySurcharge, language)}</span>
                  </div>
                )}

                {quote.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-medium">
                    <span>{isAr ? 'خصم الكوبون' : 'Voucher Discount'}</span>
                    <span>-{formatCurrency(quote.discountAmount, language)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-400">
                  <span>{isAr ? 'ضريبة القيمة المضافة (15% VAT)' : 'VAT (15%)'}</span>
                  <span>{formatCurrency(quote.vatAmount, language)}</span>
                </div>

                <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-sm font-bold text-white">
                  <span>{isAr ? 'الإجمالي التقديري المطلوب' : 'Estimated Total'}</span>
                  <span className="text-base text-amber-400">
                    {formatCurrency(quote.total, language)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isAr 
                    ? 'ضمان حِرفي الذهبي: الدفع يتم فقط بعد اكتمال الخدمة ورضاك التام عن النتيجة.' 
                    : 'Hirafi Golden Guarantee: Payment is released only after the job is completed to your satisfaction.'}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with step controls */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900 gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? 'السابق' : 'Previous'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3)}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <span>{isAr ? 'متابعة' : 'Next Step'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'تأكيد الحجز والإرسال' : 'Confirm & Dispatch Pro'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
