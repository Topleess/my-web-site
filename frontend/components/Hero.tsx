import React from 'react';
import { Instagram, Linkedin, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-black">
      {/* Background Image */}
      {/* Increased brightness and contrast so the background is light enough to turn difference-text black */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.ibb.co/tpSw6kW8/Frame-20.png"
          alt="Background Portrait"
          className="w-full h-full object-cover grayscale brightness-110 contrast-150"
        />
      </div>

      {/* Main Content Layer - Centered Text with Blend Mode */}
      {/* Moved mix-blend-difference to the container for better stacking context handling */}
      <div className="relative z-10 w-full px-4 md:px-10 flex flex-col items-center justify-center h-full pointer-events-none mix-blend-difference">
        {/* Changed leading from 0.85 to 0.95 to increase spacing between lines */}
        <h1 className="text-white font-black text-[12vw] md:text-[13vw] leading-[0.95] tracking-tighter text-center uppercase select-none">
          {i18n.language === 'en' ? (
            <>
              Alexander
              <br />
              <span className="ml-[10vw] md:ml-[15vw]">Shamshurin</span>
            </>
          ) : (
            <>
              Александр
              <br />
              <span className="ml-[10vw] md:ml-[15vw]">Шамшурин</span>
            </>
          )}
        </h1>
      </div>

      {/* Bottom Info Layer - Absolute Positioning */}
      <div className="absolute bottom-0 w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-end z-20 text-white mix-blend-difference">
        
        {/* Social Links */}
        <div className="flex flex-col space-y-3 mb-6 md:mb-0">
          <a href="#" className="flex items-center space-x-2 hover:opacity-70 transition-opacity group">
            <Send size={20} className="group-hover:scale-110 transition-transform"/>
            <span className="text-sm font-medium">Telegram</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:opacity-70 transition-opacity group">
            <Linkedin size={20} className="group-hover:scale-110 transition-transform"/>
            <span className="text-sm font-medium">LinkedIn</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:opacity-70 transition-opacity group">
            <Instagram size={20} className="group-hover:scale-110 transition-transform"/>
            <span className="text-sm font-medium">Instagram</span>
          </a>
        </div>

        {/* Role / Description */}
        <div className="text-right">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            {i18n.language === 'en' ? (
              <>
                // Development,
                <br />
                Design &
                <br />
                Management
              </>
            ) : (
              <>
                // Разработка,
                <br />
                Дизайн &
                <br />
                Менеджмент
              </>
            )}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Hero;