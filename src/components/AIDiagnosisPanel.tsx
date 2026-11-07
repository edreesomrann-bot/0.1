import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  DollarSign,
  HelpCircle,
  Zap,
  Snowflake,
  Hammer
} from 'lucide-react';
import { AIDiagnosisResult, Language, ServiceCategory } from '../types';
import { formatCurrency } from '../utils/pricing';

interface AIDiagnosisPanelProps {
  language: Language;
  categories: ServiceCategory[];
  onBookDiagnosis: (categoryId: string, summary: string) => void;
}

export const AIDiagnosisPanel: React.FC<AIDiagnosisPanelProps> = ({
  language,
  categories,
  onBookDiagnosis,
}) => {
  const isAr = language === 'ar';
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<AIDiagnosisResult | null>(null);

  const samplePrompts = [
    {
      titleAr: 'المكيف يخرج هواء حار ويسرب ماء',
      titleEn: 'AC blowing warm air and leaking water',
      query: 'المكيف السبلت ينقط ماء داخل الغرفة والهواء الخارج ليس بارداً بل دافئ ويصدر صوت خفيف.',
    },
    {
      titleAr: 'القاطع الكهربائي يفصل عند تشغيل السخان',
      titleEn: 'Breaker trips when heater is turned on',
      query: 'كل ما أشغل سخان الحمام القاطع الرئيسي يطفي والفيش أصبح دافئاً جداً.',
    },
    {
      titleAr: 'صوت صفير وانسداد مياه في حوض المطبخ',
      titleEn: 'Kitchen sink gurgling and backing up',
      query: 'المياه تتجمع في حوض المطبخ وتخرج رائحة كريهة وهناك صوت قرقرة في المواسير.',
    },
    {
      titleAr: 'الباب الخشبي يحك في البلاط ولا يغلق',
      titleEn: 'Wooden door dragging on tiles',
      query: 'باب الصالة الخشبي هابط ويحك في البلاط عند الفتح ومفصلات الباب تصدر صريراً.',
    },
  ];

  const handleDiagnose = (inputQuery: string) => {
    const q = inputQuery.toLowerCase();
    setIsAnalyzing(true);
    setDiagnosis(null);

    setTimeout(() => {
      let result: AIDiagnosisResult;

      if (q.includes('مكيف') || q.includes('ac') || q.includes('تبريد') || q.includes('cool') || q.includes('سبلت')) {
        result = {
          problemSummary: 'Split AC Freon depletion / Frozen evaporator coil & drain line blockage',
          problemSummaryAr: 'نقص غاز الفريون / تجمد مواسير المبخر مع انسداد مجرى تصريف المياه',
          severity: 'medium',
          probableCauses: [
            { en: 'Clogged drain pipe causing condensation backup', ar: 'انسداد خرطوم تصريف المياه بسبب ترسب الأتربة' },
            { en: 'Freon gas leak reducing cooling capacity below freezing', ar: 'تسريب في غاز الفريون أدى لانخفاض كفاءة التبريد وتجمد الشبك' },
            { en: 'Dirty air filters restricting airflow across coils', ar: 'اتساخ الفلاتر الداخلية مما يمنع سحب الهواء وتدويره' },
          ],
          suggestedAction: 'Power off unit immediately to allow ice thaw. Deep chemical coil wash and freon pressure test required.',
          suggestedActionAr: 'أطفئ المكيف حالياً لإذابة الثلج المتراكم وتجنب احتراق الكمبروسر، ويلزم فحص ضغط الفريون وتنظيف حوض الصرف.',
          recommendedCategory: 'ac_hvac',
          estimatedCostRange: { min: 140, max: 260 },
          safetyWarning: 'Do not pour hot water directly into electrical fan components.',
          safetyWarningAr: 'تحذير: لا تسكب ماء ساخن داخل الوحدة الكهربائية تجنباً للالتماس الكهربائي.',
        };
      } else if (q.includes('كهرب') || q.includes('قاطع') || q.includes('breaker') || q.includes('فيش') || q.includes('سخان') || q.includes('تماس')) {
        result = {
          problemSummary: 'Water heater heating element insulation breakdown / Electrical short',
          problemSummaryAr: 'انهيار عزل شمعة السخان (الهيتر) أو ماس كهربائي في سلك التأريض',
          severity: 'high',
          probableCauses: [
            { en: 'Heating element burned out and touching water tank body', ar: 'تلف قلب الشمعة الداخلية للسخان وملامستها لماء الخزان' },
            { en: 'Undersized circuit breaker rating for high amp draw', ar: 'سعة القاطع غير متناسبة مع استهلاك السخان الكهربائي' },
            { en: 'Loose terminal screw inside socket causing heat melting', ar: 'ارتخاء مسامير ربط الأسلاك في الفيش مما سبب سخونة وتفحم' },
          ],
          suggestedAction: 'Disconnect water heater main switch immediately. Replace internal heating element and inspect breaker amperage.',
          suggestedActionAr: 'افصل قاطع السخان فوراً ولا تلمس جسم السخان أثناء تشغيل الكهرباء. يلزم استبدال الهيتر وفحص الفيش.',
          recommendedCategory: 'electrical',
          estimatedCostRange: { min: 120, max: 220 },
          safetyWarning: 'Critical Risk: Severe electric shock hazard if the tank is not properly grounded. Keep power OFF!',
          safetyWarningAr: 'خطر شديد: احتمال وجود صعق كهربائي عبر المياه في حال عدم وجود تأريض سليم. اترك الكهرباء مطفأة!',
        };
      } else if (q.includes('باب') || q.includes('خشب') || q.includes('door') || q.includes('دولاب') || q.includes('wood') || q.includes('نجار')) {
        result = {
          problemSummary: 'Hinge sagging & humidity wood expansion',
          problemSummaryAr: 'هبوط في مفصلات الباب وتمدد الخشب بسبب الرطوبة',
          severity: 'low',
          probableCauses: [
            { en: 'Hinge screws stripped in the wooden door jamb', ar: 'اتساع فتحات مسامير التثبيت في حلوق الباب' },
            { en: 'Wood swelling due to bathroom / floor mopping moisture', ar: 'انتفاخ أسفل الخشب نتيجة رطوبة الأرضيات أو الحمام' },
          ],
          suggestedAction: 'Plane bottom edge of door by 3mm and reinforce hinges with heavy-duty anchors.',
          suggestedActionAr: 'صنفرة وقشط أسفل الباب بمقدار 3 ملم وتثبيت براغي أطول في المفصلات مع تشحيمها.',
          recommendedCategory: 'carpentry',
          estimatedCostRange: { min: 90, max: 150 },
        };
      } else {
        result = {
          problemSummary: 'Main drain pipe grease accumulation and partial blockage',
          problemSummaryAr: 'تراكم شحوم وتكلسات صلبة مسببة انسداداً جزئياً في خط الصرف',
          severity: 'medium',
          probableCauses: [
            { en: 'Kitchen sink grease and food debris solidification', ar: 'تصلب بقايا الزيوت والدهون داخل سيفون الصرف' },
            { en: 'Air trap venting issue causing gurgling sounds', ar: 'خلل في مسار تصريف الهواء مما يسبب صوت القرقرة' },
          ],
          suggestedAction: 'Professional mechanical snake rotary cleaning and p-trap seal replacement.',
          suggestedActionAr: 'تسليك بآلة السوستة الدوارة وتنظيف سيفون المغسلة وإعادة عزل التوصيلات.',
          recommendedCategory: 'plumbing',
          estimatedCostRange: { min: 110, max: 190 },
          safetyWarning: 'Avoid dumping excessive harsh acid chemicals which can melt PVC joints.',
          safetyWarningAr: 'تنبيه: تجنب سكب الأسيد ومواد كيميائية حارقة لتفادي ذوبان مواسير البلاستيك وانبعاث غازات سامة.',
        };
      }

      setDiagnosis(result);
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'مساعد الفحص الذكي الفوري' : 'Instant AI Repair Assistant'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isAr ? 'صف العطل وسنقوم بتشخيص أسبابه فورياً' : 'Describe your home issue for instant diagnosis'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isAr
              ? 'يساعدك الذكاء الاصطناعي في فهم خطورة العطل، إرشادات السلامة العاجلة، التكلفة المتوقعة، وتوجيهك مباشرة لأفضل حرفي متخصص.'
              : 'Our intelligent assistant analyzes symptoms to determine root causes, safety hazards, estimated repair budgets, and matches the ideal tradesman.'}
          </p>
        </div>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            {isAr ? 'ما الذي يحدث في منزلك الآن؟' : 'What is happening in your home right now?'}
          </label>
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isAr
                ? 'مثال: المكيف يقطر ماء داخل الصالة والهواء حار، أو القاطع الكهربائي يفصل باستمرار...'
                : 'e.g. The AC is dripping water inside and blowing warm air, or the breaker trips repeatedly...'
            }
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Preset suggestions */}
        <div className="space-y-2">
          <span className="text-[11px] text-slate-400 block font-medium">
            {isAr ? 'أمثلة جاهزة يمكنك تجربتها بضغطة واحدة:' : 'Common scenario presets:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(item.query);
                  handleDiagnose(item.query);
                }}
                className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                <span className="group-hover:text-emerald-300 font-medium">
                  {isAr ? item.titleAr : item.titleEn}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {isAr ? 'فحص الآن' : 'Run'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleDiagnose(query)}
          disabled={!query.trim() || isAnalyzing}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{isAr ? 'جاري الفحص ومطابقة الأعطال...' : 'Analyzing problem and risk profile...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'بدء التشخيص الذكي' : 'Diagnose Problem Now'}</span>
            </>
          )}
        </button>
      </div>

      {/* Diagnosis Results Card */}
      {diagnosis && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-6 animate-in fade-in duration-300">
          
          {/* Header of Diagnosis */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'نتيجة التشخيص الفني الأولي' : 'Initial Diagnostic Assessment'}</span>
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {isAr ? diagnosis.problemSummaryAr : diagnosis.problemSummary}
              </h3>
            </div>

            {/* Severity Pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{isAr ? 'مستوى الخطورة:' : 'Severity:'}</span>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                diagnosis.severity === 'critical' || diagnosis.severity === 'high'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {diagnosis.severity}
              </span>
            </div>
          </div>

          {/* Safety Warning if critical/high */}
          {diagnosis.safetyWarning && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-red-400 block">{isAr ? 'تنبيه أمان عاجل:' : 'Urgent Safety Warning:'}</span>
                <p>{isAr ? diagnosis.safetyWarningAr : diagnosis.safetyWarning}</p>
              </div>
            </div>
          )}

          {/* Probable Causes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isAr ? 'الأسباب المرجحة للمشكلة:' : 'Most Probable Root Causes:'}
            </h4>
            <div className="space-y-2">
              {diagnosis.probableCauses.map((cause, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{isAr ? cause.ar : cause.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action & Cost Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-1.5">
              <span className="text-xs text-slate-400 block">{isAr ? 'الإجراء الموصى به' : 'Recommended Action'}</span>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {isAr ? diagnosis.suggestedActionAr : diagnosis.suggestedAction}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-1.5">
              <span className="text-xs text-slate-400 block">{isAr ? 'التكلفة التقديرية المتوقعة للإصلاح' : 'Estimated Repair Cost'}</span>
              <div className="text-xl font-black text-amber-400">
                {formatCurrency(diagnosis.estimatedCostRange.min, language)} - {formatCurrency(diagnosis.estimatedCostRange.max, language)}
              </div>
              <span className="text-[10px] text-slate-400 block">
                {isAr ? 'شامل أجور اليد والكشف ومعاينة القطع' : 'Includes diagnostic and labor estimate'}
              </span>
            </div>
          </div>

          {/* Direct 1-Click Booking CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {isAr ? 'تخصص الحرفي المطلوب:' : 'Required Trade:'} <strong className="text-white">
                {categories.find((c) => c.id === diagnosis.recommendedCategory)?.nameAr || diagnosis.recommendedCategory}
              </strong>
            </div>

            <button
              onClick={() => onBookDiagnosis(
                diagnosis.recommendedCategory,
                isAr ? diagnosis.problemSummaryAr : diagnosis.problemSummary
              )}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Wrench className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'حجز حرفي فوري لهذا العطل' : 'Book Specialist for this Issue'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
