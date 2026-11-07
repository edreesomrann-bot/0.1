import React from 'react';
import { 
  Wrench, 
  FileCode2, 
  Sparkles, 
  ClipboardList, 
  UserCheck, 
  Globe, 
  User, 
  Briefcase,
  LayoutGrid
} from 'lucide-react';
import { Language, UserMode } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  userMode: UserMode;
  onUserModeChange: (mode: UserMode) => void;
  activeTab: 'services' | 'bookings' | 'ai_diagnostic' | 'craftsman_dashboard';
  onTabChange: (tab: 'services' | 'bookings' | 'ai_diagnostic' | 'craftsman_dashboard') => void;
  onOpenGradleModal: () => void;
  activeBookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  userMode,
  onUserModeChange,
  activeTab,
  onTabChange,
  onOpenGradleModal,
  activeBookingsCount,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange(userMode === 'craftsman' ? 'craftsman_dashboard' : 'services')}
              className="flex items-center gap-3 text-left focus:outline-none group"
              aria-label="Hirafi Home"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                    {isAr ? 'حِـرفي' : 'Hirafi'}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {isAr ? 'منصة الحِرفيين والصيانة المنزلية المعتمدة' : 'On-Demand Certified Craftsmen & Maintenance'}
                </p>
              </div>
            </button>

            {/* Gradle Asset Button */}
            <button
              onClick={onOpenGradleModal}
              title="Open build.gradle_6cca4793.kts"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-amber-300 hover:text-amber-200 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
              <span>build.gradle.kts</span>
              <span className="text-[10px] text-slate-400">com.aistudio.hirafi</span>
            </button>
          </div>

          {/* Navigation Tabs (Customer Mode) */}
          {userMode === 'customer' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => onTabChange('services')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'services'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{isAr ? 'الخدمات والحِرفيين' : 'Services & Craftsmen'}</span>
              </button>

              <button
                onClick={() => onTabChange('bookings')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                  activeTab === 'bookings'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>{isAr ? 'متابعة الطلبات' : 'My Bookings'}</span>
                {activeBookingsCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === 'bookings'
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {activeBookingsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('ai_diagnostic')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'ai_diagnostic'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'تشخيص ذكي للأعطال' : 'AI Fault Diagnosis'}</span>
              </button>
            </nav>
          )}

          {/* Right Controls: Role Mode + Lang Toggle */}
          <div className="flex items-center gap-2">
            
            {/* Gradle Mobile Button */}
            <button
              onClick={onOpenGradleModal}
              title="Open build.gradle.kts"
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700"
              aria-label="View Gradle config"
            >
              <FileCode2 className="w-4 h-4" />
            </button>

            {/* Mode Switcher (Customer vs Craftsman) */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  onUserModeChange('customer');
                  if (activeTab === 'craftsman_dashboard') onTabChange('services');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                  userMode === 'customer'
                    ? 'bg-slate-800 text-amber-400 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={isAr ? 'تصفح كعميل' : 'Browse as Customer'}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'عميل' : 'Customer'}</span>
              </button>

              <button
                onClick={() => {
                  onUserModeChange('craftsman');
                  onTabChange('craftsman_dashboard');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                  userMode === 'craftsman'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={isAr ? 'لوحة الحرفي المحترف' : 'Craftsman Pro Dashboard'}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'لوحة الحِرفي' : 'Craftsman Pro'}</span>
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => onLanguageChange(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-medium transition-colors"
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        {userMode === 'customer' && (
          <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => onTabChange('services')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md ${
                activeTab === 'services' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isAr ? 'الخدمات' : 'Services'}</span>
            </button>
            <button
              onClick={() => onTabChange('bookings')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md relative ${
                activeTab === 'bookings' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-400'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{isAr ? 'الطلبات' : 'Bookings'}</span>
              {activeBookingsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('ai_diagnostic')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md ${
                activeTab === 'ai_diagnostic' ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'تشخيص ذكي' : 'AI Doctor'}</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
