import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';
import { Language } from '../types';

interface GradleInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const GradleInspectorModal: React.FC<GradleInspectorModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isAr = language === 'ar';
  const [copied, setCopied] = useState(false);
  const [rawGradleText, setRawGradleText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'code' | 'overview' | 'dependencies'>('overview');

  const assetPath = '/public/assets/aistudio/build.gradle_6cca4793.kts';
  // Served statically by Vite:
  const browserAccessiblePath = '/assets/aistudio/build.gradle_6cca4793.kts';

  useEffect(() => {
    // Attempt fetching the exact uploaded asset file
    fetch(browserAccessiblePath)
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error('Not reachable via fetch');
      })
      .then((text) => setRawGradleText(text))
      .catch(() => {
        // Fallback to embedded canonical representation if static fetch varies
        setRawGradleText(`import com.google.gms.googleservices.GoogleServicesPlugin.MissingGoogleServicesStrategy

plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.kotlin.compose)
  alias(libs.plugins.google.devtools.ksp)
  alias(libs.plugins.secrets)
  alias(libs.plugins.google.services)
}

android {
  namespace = "com.example"
  compileSdk { version = release(36) { minorApiLevel = 1 } }

  defaultConfig {
    applicationId = "com.aistudio.hirafi.qtwz"
    minSdk = 24
    targetSdk = 36
    versionCode = 1
    versionName = "1.0"
    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
  }
...
dependencies {
  implementation(platform(libs.androidx.compose.bom))
  implementation(platform(libs.firebase.bom))
  implementation(libs.androidx.compose.material3)
  implementation(libs.firebase.firestore)
  implementation(libs.firebase.auth)
  implementation(libs.androidx.room.runtime)
  implementation(libs.retrofit)
}`);
      });
  }, [browserAccessiblePath]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawGradleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dependenciesList = [
    { name: 'Android Jetpack Compose BOM', category: 'UI Framework', desc: 'Material3, Foundation, UI Graphics' },
    { name: 'Firebase Firestore & Auth', category: 'Backend & Data', desc: 'Realtime database, User Auth & Security' },
    { name: 'AndroidX Room DB (KSP)', category: 'Local Storage', desc: 'Offline cache, job drafts & preferences' },
    { name: 'Retrofit & OkHttp & Moshi', category: 'Networking', desc: 'API clients, JSON serialization' },
    { name: 'Kotlinx Coroutines', category: 'Concurrency', desc: 'Asynchronous dispatch & state flows' },
    { name: 'Firebase AI (GenAI)', category: 'Smart Assistant', desc: 'Fault diagnosis & smart estimations' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {isAr ? 'مواصفات مشروع حِرفي (build.gradle.kts)' : 'Hirafi Android Project Spec (build.gradle.kts)'}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  v1.0 (SDK 36)
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                applicationId: <span className="text-amber-300">com.aistudio.hirafi.qtwz</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-slate-800 flex items-center gap-4 bg-slate-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isAr ? 'نظرة عامة والهندسة' : 'Overview & Architecture'}</span>
          </button>

          <button
            onClick={() => setActiveTab('dependencies')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'dependencies'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{isAr ? 'المكتبات والتبعيات' : 'Dependencies & SDKs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'code'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>{isAr ? 'عرض الكود المصدري' : 'Raw Gradle Code'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-200 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xs text-slate-400">{isAr ? 'معرّف الحزمة' : 'Application ID'}</div>
                  <div className="font-mono text-sm font-bold text-amber-300 mt-1 break-all">
                    com.aistudio.hirafi.qtwz
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xs text-slate-400">{isAr ? 'إصدار أندرويد المستهدف' : 'Target & Compile SDK'}</div>
                  <div className="font-semibold text-sm text-emerald-400 mt-1">
                    Android 16 / SDK 36 (Min 24)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xs text-slate-400">{isAr ? 'مسار الملف المرفق' : 'Local Asset Path'}</div>
                  <div className="font-mono text-xs text-slate-300 mt-1 break-all">
                    {assetPath}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-2">
                <h3 className="font-bold text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {isAr ? 'عن تطبيق حِرفي (Hirafi)' : 'About Hirafi Platform'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isAr
                    ? 'منصة حِرفي تتيح لأصحاب المنازل والعقارات طلب أفضل الحِرفيين المعتمدين والمفحوصين فورياً (سباكة، كهرباء، تكييف، نجارة، دهان، وأجهزة). يحتوي التطبيق على نظام تسعير فوري، تتبع مسار الحرفي بالـ GPS، محادثة مباشرة، ولوحة تحكم مخصصة للحِرفي لإدارة الحجوزات والأرباح.'
                    : 'Hirafi is an on-demand platform connecting homeowners and businesses with verified professional tradesmen (plumbers, electricians, HVAC mechanics, carpenters, appliance repair technicians). Features include instant upfront quotes, live craftsman dispatch tracking, in-app messaging, and a pro craftsman dashboard.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                  {isAr ? 'ميزات البنية التحتية للمشروع' : 'Architecture Highlights'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">{isAr ? 'دعم كامل للغتين والـ RTL' : 'Full RTL & Bilingual Arabic/English'}</div>
                      <div className="text-slate-400">{isAr ? 'واجهة تفاعلية مصممة خصيصاً للمستخدم العربي ومرنة للإنجليزية.' : 'Native right-to-left layout tuned for Arab craftsmen and clients.'}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">{isAr ? 'محرك تشخيص الأعطال بالذكاء الاصطناعي' : 'AI-Powered Fault Diagnostics'}</div>
                      <div className="text-slate-400">{isAr ? 'تشخيص أسباب الأعطال، تقدير التكلفة، وإرشادات السلامة الفورية.' : 'Identifies root causes, hazards, price estimates, and required trades.'}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">{isAr ? 'نمط ثنائي: عميل + حِرفي' : 'Dual Mode: Client & Craftsman Pro'}</div>
                      <div className="text-slate-400">{isAr ? 'إمكانية تجربة التطبيق كعميل يحجز أو كحرفي يستقبل الطلبات ويدير أرباحه.' : 'Toggle freely between requesting service and managing pro dispatch.'}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">{isAr ? 'حساب أسعار دقيق وشفاف' : 'Transparent Pricing & Voucher Engine'}</div>
                      <div className="text-slate-400">{isAr ? 'حساب الضريبة المضافة (15%)، رسوم الطوارئ، وكوبونات الخصم مثل HIRAFI20.' : 'Calculates 15% VAT, emergency 1-hour surcharges, and voucher codes.'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dependencies' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                {isAr 
                  ? 'قائمة المكتبات والتبعيات المحددة في ملف build.gradle.kts للمشروع:' 
                  : 'Key dependencies and SDKs declared in build.gradle.kts:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dependenciesList.map((dep, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-xs">{dep.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-amber-300 font-mono">
                        {dep.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{dep.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="relative font-mono text-xs">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
                {rawGradleText}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-900 text-xs text-slate-400">
          <span>{isAr ? 'المرجع المحلي:' : 'Local File Ref:'} <code className="text-amber-400">{assetPath}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
          >
            {isAr ? 'إغلاق ومتابعة المنصة' : 'Close & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
