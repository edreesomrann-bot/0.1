import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCheck,
  Sparkles
} from 'lucide-react';
import { Booking, ChatMessage, Language } from '../types';

interface LiveChatModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSendMessage: (bookingId: string, messageText: string) => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  booking,
  isOpen,
  onClose,
  language,
  onSendMessage,
}) => {
  if (!isOpen || !booking) return null;
  const isAr = language === 'ar';

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [booking.chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    onSendMessage(booking.id, inputVal.trim());
    setInputVal('');
  };

  const quickTemplates = isAr
    ? [
        'أنا متواجد بالمنزل في انتظارك',
        'العمارة رقم 42 الدور الثاني شقة 5',
        'كم دقيقة متبقية على وصولك؟',
        'هل تحتاج شراء قطع غيار إضافية؟',
      ]
    : [
        'I am at home waiting for you',
        'Building 42, 2nd floor, Apt 5',
        'How many minutes until arrival?',
        'Do you need additional spare parts?',
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg h-[80vh] flex flex-col shadow-2xl overflow-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={booking.craftsmanAvatar}
                alt={booking.craftsmanName}
                className="w-11 h-11 rounded-xl object-cover border border-amber-500/80"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm">
                  {isAr ? booking.craftsmanNameAr : booking.craftsmanName}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-amber-400">
                {isAr ? booking.craftsmanTradeAr : booking.craftsmanTrade} • {isAr ? 'متصل الآن' : 'Active now'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+966508924110"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reference banner */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>{isAr ? 'الطلب:' : 'Booking:'} <strong className="text-slate-200 font-mono">{booking.referenceNumber}</strong></span>
          <span className="text-amber-400">{isAr ? booking.serviceNameAr : booking.serviceName}</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {booking.chatMessages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-[10px] border border-slate-700">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-md ${
                    isCustomer
                      ? 'bg-amber-500 text-slate-950 rounded-br-none font-medium'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 text-[9px] mt-1 ${isCustomer ? 'text-slate-800' : 'text-slate-400'} justify-end`}>
                    <span>{msg.timestamp}</span>
                    {isCustomer && <CheckCheck className="w-3 h-3 text-slate-800" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {quickTemplates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSendMessage(booking.id, t);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/10 border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 whitespace-nowrap transition-colors shrink-0"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isAr ? 'اكتب رسالتك للحِرفي...' : 'Type a message to technician...'}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
