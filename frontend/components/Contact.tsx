import React from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <section id="contact" className="w-full bg-[#050505] text-white py-24 px-4 md:px-10 flex flex-col justify-center min-h-[70vh]">
      <div className="w-full mx-auto max-w-screen-2xl flex flex-col relative">
        
        {/* Sticky Label (Text Only) - Left Aligned */}
        <div className="sticky top-20 z-20 mb-8 self-start mix-blend-difference pointer-events-none">
           <span className="text-[#FF4533] font-bold text-sm tracking-widest uppercase inline-block">
            // {t('contact.title')}
          </span>
        </div>

        {/* Centered Content Container */}
        <div className="flex flex-col items-center text-center w-full">
          {/* Big Headline */}
          <h2 className="text-[12vw] leading-[0.9] font-black uppercase tracking-tighter mb-8 md:mb-12">
            {i18n.language === 'en' ? (
              <>Have an <span className="text-[#FF4533]">Idea?</span></>
            ) : (
              <>Есть <span className="text-[#FF4533]">Идея?</span></>
            )}
          </h2>

          {/* Subtext */}
          <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mb-16 font-light leading-relaxed">
            {t('contact.description')}
          </p>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto items-center justify-center">
            
            {/* Telegram Button Only */}
            <a 
              href="https://t.me/ShamshurinAS"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#FF4533] text-white rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95 w-full md:w-auto"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Send size={24} />
              <span className="font-bold uppercase tracking-wider relative z-10">
                {i18n.language === 'en' ? 'Contact on Telegram' : 'Связаться в Telegram'}
              </span>
            </a>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;