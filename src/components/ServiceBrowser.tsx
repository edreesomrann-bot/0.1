import React, { useState } from 'react';
import { 
  Search, 
  Wrench, 
  Zap, 
  Snowflake, 
  Hammer, 
  Paintbrush, 
  Tv, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { ServiceCategory, Language } from '../types';
import { formatCurrency } from '../utils/pricing';

interface ServiceBrowserProps {
  categories: ServiceCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  language: Language;
  onQuickBookCategory: (category: ServiceCategory, issueText?: string) => void;
  onOpenAIDiagnostic: () => void;
}

export const ServiceBrowser: React.FC<ServiceBrowserProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  language,
  onQuickBookCategory,
  onOpenAIDiagnostic,
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-6 h-6 text-amber-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Snowflake': return <Snowflake className="w-6 h-6 text-sky-400" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-amber-500" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6 text-emerald-400" />;
      case 'Tv': return <Tv className="w-6 h-6 text-purple-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-pink-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-teal-400" />;
      default: return <Wrench className="w-6 h-6 text-amber-400" />;
    }
  };

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = cat.name.toLowerCase().includes(query) || cat.nameAr.includes(query);
    const descMatch = cat.description.toLowerCase().includes(query) || cat.descriptionAr.includes(query);
    const tagMatch = cat.tags.some((tag) => tag.toLowerCase().includes(query));
    return nameMatch || descMatch || tagMatch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border border-slate-800 p-6 sm:p-10 shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isAr ? 'حرفيون محترفون على بعد دقائق من منزلك' : 'Certified craftsmen dispatched within minutes'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {isAr ? (
              <>
                صيانة منزلك صارت <span className="text-amber-400 underline decoration-amber-500/50">أسهل وأضمن</span> مع حِرفي
              </>
            ) : (
              <>
                Home repairs made <span className="text-amber-400 underline decoration-amber-500/50">reliable & effortless</span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'اختر الخدمة، استعرض تقييمات الحِرفيين المعتمدين، واحصل على تسعير فوري مع ضمان الجودة ومتابعة مباشرة عبر الخريطة.'
              : 'Browse verified technicians with transparent hourly quotes, live GPS ETA dispatch, and automated quality guarantees.'}
          </p>

          {/* Search Bar + AI Doctor Trigger */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن عطل أو خدمة (مثال: تسريب مياه، قاطع كهرباء، غسيل مكيف)...' : 'Search service or issue (e.g., pipe leak, AC cooling, circuit breaker)...'}
                className={`w-full py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all ${
                  isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 ${
                    isAr ? 'left-3' : 'right-3'
                  }`}
                >
                  {isAr ? 'مسح' : 'Clear'}
                </button>
              )}
            </div>

            <button
              onClick={onOpenAIDiagnostic}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'فحص العطل بالذكاء الاصطناعي' : 'AI Fault Diagnosis'}</span>
            </button>
          </div>

          {/* Quick Stats Badges */}
          <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">
                {isAr ? 'حرفيون موثقون 100%' : '100% Background Checked'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-300 font-medium">
                {isAr ? 'وصول سريع خلال 30 د' : 'Average 30-min Arrival'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
              <span className="text-xs text-slate-300 font-medium">
                {isAr ? 'تقييم 4.9 من 5' : '4.95/5 Client Satisfaction'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'تصنيفات الصيانة والحِرف' : 'Maintenance & Trade Categories'}</span>
              {selectedCategoryId && (
                <button
                  onClick={() => onSelectCategory(null)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-normal underline"
                >
                  {isAr ? '(عرض كل الحِرف)' : '(Show All Trades)'}
                </button>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              {isAr ? 'اختر التخصص المطلوب لعرض أفضل الفنيين المتاحين حالياً' : 'Select a domain to see top available certified technicians'}
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(isSelected ? null : category.id)}
                className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 group-hover:bg-slate-700/80 border border-slate-700/50 flex items-center justify-center transition-colors">
                      {getIcon(category.icon)}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">{isAr ? 'يبدأ من' : 'Starts at'}</span>
                      <span className="text-xs font-bold text-amber-400">
                        {formatCurrency(category.basePrice, language)}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                    {isAr ? category.nameAr : category.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {isAr ? category.descriptionAr : category.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {category.popularIssues.length} {isAr ? 'أعطال شائعة' : 'common issues'}
                  </span>
                  <div className="flex items-center gap-1 font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>{isSelected ? (isAr ? 'محدد' : 'Active') : (isAr ? 'استعراض' : 'Explore')}</span>
                    {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Issues Quick-Booking Drawer for Selected Category */}
      {selectedCategoryId && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
          {(() => {
            const currentCat = categories.find((c) => c.id === selectedCategoryId);
            if (!currentCat) return null;
            return (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{isAr ? 'حجز فوري حسب العطل:' : 'Instant Booking by Common Issue:'}</span>
                      <span className="text-amber-400">{isAr ? currentCat.nameAr : currentCat.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isAr ? 'انقر على المشكلة لبدء الحجز المباشر فوراً مع حِرفي معتمد' : 'Click any frequent issue to launch instant quote & booking wizard'}
                    </p>
                  </div>

                  <button
                    onClick={() => onQuickBookCategory(currentCat)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>{isAr ? 'طلب فني عام لهذا التخصص' : 'Book General Technician'}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {currentCat.popularIssues.map((issue, idx) => (
                    <button
                      key={idx}
                      onClick={() => onQuickBookCategory(currentCat, isAr ? issue.ar : issue.en)}
                      className="p-3 rounded-xl bg-slate-950/70 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex items-start justify-between gap-2"
                      dir={isAr ? 'rtl' : 'ltr'}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-slate-200 group-hover:text-amber-300 block">
                          {isAr ? issue.ar : issue.en}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isAr ? 'كشف وإصلاح فوري' : 'Diagnostic & Repair'}
                        </span>
                      </div>
                      <span className="p-1 rounded-md bg-slate-800 group-hover:bg-amber-500 text-slate-400 group-hover:text-slate-950 shrink-0">
                        {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
