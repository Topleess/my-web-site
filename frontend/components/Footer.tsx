import React from 'react';
import { Instagram, Linkedin, Send, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="w-full bg-black text-white border-t border-white/10 pt-16 pb-8 px-4 md:px-10">
      <div className="w-full mx-auto max-w-screen-2xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
          
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold uppercase tracking-tight">Alexander Shamshurin</h3>
            <p className="text-gray-500 text-sm">Design & Development Portfolio</p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-8">
            <a href="#about" className="text-sm font-medium hover:text-[#FF4533] transition-colors uppercase tracking-wider">
              {t('header.about')}
            </a>
            <a href="#projects" className="text-sm font-medium hover:text-[#FF4533] transition-colors uppercase tracking-wider">
              {t('header.projects')}
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-[#FF4533] transition-colors uppercase tracking-wider">
              {t('header.contact')}
            </a>
          </div>

          {/* Scroll Top Button */}
          <button 
            onClick={scrollToTop}
            className="hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
          
          {/* Copyright */}
          <div className="text-xs text-gray-600 font-mono">
            &copy; {new Date().getFullYear()} AS-SHAMSHURIN. ALL RIGHTS RESERVED.
          </div>

          {/* Social Icons */}
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Send size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={18} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;