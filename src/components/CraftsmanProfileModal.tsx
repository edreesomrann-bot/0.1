import React from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  Clock, 
  Image as ImageIcon 
} from 'lucide-react';
import { Craftsman, Language } from '../types';
import { formatCurrency } from '../utils/pricing';

interface CraftsmanProfileModalProps {
  craftsman: Craftsman | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onBook: (craftsman: Craftsman) => void;
}

export const CraftsmanProfileModal: React.FC<CraftsmanProfileModalProps> = ({
  craftsman,
  isOpen,
  onClose,
  language,
  onBook,
}) => {
  if (!isOpen || !craftsman) return null;
  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/90">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={craftsman.avatar}
                alt={isAr ? craftsman.nameAr : craftsman.name}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-amber-500/80 shadow-md"
              />
              <span 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  craftsman.isAvailable ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {isAr ? craftsman.nameAr : craftsman.name}
                </h2>
                {craftsman.verified && (
                  <span title={isAr ? 'موثق ومعتمد' : 'Verified'}>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-400 font-medium mt-0.5">
                {isAr ? craftsman.titleAr : craftsman.title}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1 font-bold text-white">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{craftsman.rating}</span>
                  <span className="text-slate-400 text-[11px] font-normal">
                    ({craftsman.reviewsCount} {isAr ? 'تقييم' : 'reviews'})
                  </span>
                </div>
                <span>•</span>
                <span className="text-slate-300">
                  {craftsman.completedJobs} {isAr ? 'مهمة منجزة' : 'completed jobs'}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{craftsman.distanceKm} {isAr ? 'كم' : 'km'}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-200">
          
          {/* Rate & Status Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-xs text-slate-400">{isAr ? 'سعر المعاينة والساعة' : 'Hourly / Diagnostic'}</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">
                {formatCurrency(craftsman.hourlyRate, language)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{isAr ? 'سنوات الخبرة' : 'Experience'}</div>
              <div className="text-base font-bold text-white mt-0.5">
                {craftsman.experienceYears} {isAr ? 'سنوات معتمدة' : 'Years Pro'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{isAr ? 'الحالة الحالية' : 'Current Status'}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${craftsman.isAvailable ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">
                  {craftsman.isAvailable ? (isAr ? 'متاح للطلب الآن' : 'Available Now') : (isAr ? 'في مهمة حالياً' : 'On Active Job')}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'نبذة عن الحِرفي والخبرات' : 'About & Professional Background'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              {isAr ? craftsman.bioAr : craftsman.bio}
            </p>
          </div>

          {/* Skills & Badges */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'التخصصات والمهارات الدقيقة' : 'Technical Skills & Certifications'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(isAr ? craftsman.skillsAr : craftsman.skills).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio gallery */}
          {craftsman.portfolioImages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'معرض الأعمال السابقة' : 'Past Work Samples'}</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {craftsman.portfolioImages.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video">
                    <img src={img} alt="Past Work" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>{isAr ? 'تقييمات وآراء العملاء' : 'Customer Reviews'}</span>
              <span className="text-amber-400 font-bold">{craftsman.rating} / 5</span>
            </h3>
            <div className="space-y-2.5">
              {craftsman.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{rev.userName}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-white font-bold">{rev.rating}</span>
                      <span className="text-[10px] text-slate-500 mr-2">({rev.date})</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isAr ? rev.commentAr : rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900 gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-slate-300">{craftsman.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              {isAr ? 'رجوع' : 'Back'}
            </button>

            <button
              onClick={() => {
                onClose();
                onBook(craftsman);
              }}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>{isAr ? `حجز موعد مع ${craftsman.nameAr}` : `Book with ${craftsman.name}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
