import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Calendar,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { Craftsman, Language } from '../types';
import { formatCurrency } from '../utils/pricing';

interface CraftsmenListProps {
  craftsmen: Craftsman[];
  selectedCategoryId: string | null;
  language: Language;
  onBookCraftsman: (craftsman: Craftsman) => void;
  onViewProfile: (craftsman: Craftsman) => void;
}

export const CraftsmenList: React.FC<CraftsmenListProps> = ({
  craftsmen,
  selectedCategoryId,
  language,
  onBookCraftsman,
  onViewProfile,
}) => {
  const isAr = language === 'ar';
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredCraftsmen = craftsmen.filter((c) => {
    if (selectedCategoryId && c.categoryId !== selectedCategoryId) return false;
    if (onlyAvailable && !c.isAvailable) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{isAr ? 'الحِرفيين المعتمدين والمتواجدين بالقرب منك' : 'Verified Tradesmen Near You'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold">
              {filteredCraftsmen.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr ? 'جميع الفنيين مفحوصو السجل الجنائي ومطابقون للمعايير الفنية' : 'All professionals are background verified and insured'}
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800 w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isAr ? 'المتاحون للطلب الفوري الآن' : 'Available for dispatch now'}</span>
            </span>
          </label>
        </div>
      </div>

      {/* Craftsmen Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredCraftsmen.map((craftsman) => (
          <div
            key={craftsman.id}
            className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 p-5 transition-all duration-200 flex flex-col justify-between shadow-lg relative group"
          >
            {/* Top row: Avatar + Details + Rate */}
            <div>
              <div className="flex items-start gap-4">
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <img
                    src={craftsman.avatar}
                    alt={isAr ? craftsman.nameAr : craftsman.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-amber-500/80 transition-colors"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                      craftsman.isAvailable ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                    title={craftsman.isAvailable ? (isAr ? 'متاح' : 'Available') : (isAr ? 'مشغول حالياً' : 'Busy')}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <h3 className="font-bold text-white text-base truncate">
                        {isAr ? craftsman.nameAr : craftsman.name}
                      </h3>
                      {craftsman.verified && (
                        <span title={isAr ? 'موثق ومعتمد' : 'Verified Pro'}>
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>

                    {/* Hourly Rate */}
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-amber-400">
                        {formatCurrency(craftsman.hourlyRate, language)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{isAr ? '/ساعة' : '/hr'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-amber-400/90 font-medium mt-0.5 truncate">
                    {isAr ? craftsman.titleAr : craftsman.title}
                  </p>

                  {/* Ratings & Completed Jobs */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1 font-bold text-white">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{craftsman.rating}</span>
                      <span className="text-slate-400 text-[11px] font-normal">
                        ({craftsman.reviewsCount})
                      </span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 text-[11px]">
                      {craftsman.completedJobs} {isAr ? 'مهمة منجزة' : 'jobs done'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{craftsman.distanceKm} {isAr ? 'كم' : 'km'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                {(isAr ? craftsman.badgesAr : craftsman.badges).map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[10px] font-medium border border-slate-700/60"
                  >
                    {badge}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-medium border border-amber-500/20">
                  {craftsman.experienceYears} {isAr ? 'سنوات خبرة' : 'yrs exp'}
                </span>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                {isAr ? craftsman.bioAr : craftsman.bio}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => onViewProfile(craftsman)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isAr ? 'الملف والتقييمات' : 'View Profile'}</span>
              </button>

              <button
                onClick={() => onBookCraftsman(craftsman)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 transition-all hover:scale-[1.01]"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-950" />
                <span>{isAr ? 'حجز فوري' : 'Book Instantly'}</span>
              </button>
            </div>
          </div>
        ))}

        {filteredCraftsmen.length === 0 && (
          <div className="col-span-full p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="font-bold text-white text-base">
              {isAr ? 'لا يوجد حرفيون مطابقون للشروط حالياً' : 'No craftsmen match this filter right now'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'يرجى تغيير التخصص أو إلغاء تصفية المتاحين فوراً' : 'Try clearing the "available now" filter or select another trade'}
            </p>
            <button
              onClick={() => setOnlyAvailable(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold"
            >
              {isAr ? 'عرض جميع الحِرفيين' : 'Show All Craftsmen'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
