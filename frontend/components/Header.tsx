import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { t, i18n } = useTranslation();
  
  // Функция переключения языка
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Загрузка количества проектов
  useEffect(() => {
    const fetchProjectCount = async () => {
      const response = await apiClient.getProjects();
      if (response.data) {
        setProjectCount(response.data.total);
      }
    };
    
    fetchProjectCount();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (isHome) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate home, then wait a bit to scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-md py-4' 
          : 'bg-transparent py-6 md:py-10 mix-blend-difference'
      }`}
    >
      <div className="w-full mx-auto max-w-screen-2xl px-4 md:px-10">
        <div className="flex items-center justify-between w-full text-white">
          
          {/* DESKTOP LAYOUT */}
          <div className="hidden md:flex items-center justify-between w-full font-medium tracking-wide uppercase">
            {/* Element 1 */}
            <Link to="/" className="text-base font-semibold hover:opacity-70 transition-opacity cursor-pointer">
              {t('header.title')}
            </Link>

            {/* Element 2 */}
            <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer">
              {t('header.projects')}
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isScrolled ? 'bg-white text-black' : 'bg-white text-black'}`}>
                {projectCount}
              </span>
            </a>

            {/* Element 3 */}
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:opacity-70 transition-opacity cursor-pointer">
              {t('header.about')}
            </a>

            {/* Element 4 */}
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:opacity-70 transition-opacity cursor-pointer">
              {t('header.contact')}
            </a>
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer"
              title={t('common.switchLanguage')}
            >
              <Globe size={18} />
              <span className="text-xs">{i18n.language.toUpperCase()}</span>
            </button>
          </div>

          {/* MOBILE LAYOUT */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Link to="/" className="text-sm font-semibold tracking-wide uppercase">
              {t('header.title')}
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="focus:outline-none flex items-center gap-1"
                aria-label="Toggle language"
              >
                <Globe size={18} />
                <span className="text-xs">{i18n.language.toUpperCase()}</span>
              </button>
              
              <button 
                className="focus:outline-none" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md text-white p-6 md:hidden flex flex-col space-y-4 shadow-lg border-t border-white/10">
          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, 'projects')}
            className="text-lg font-medium hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            {t('header.projects')}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
              {projectCount}
            </span>
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, 'about')}
            className="text-lg font-medium hover:text-gray-300 transition-colors"
          >
            {t('header.about')}
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="text-lg font-medium hover:text-gray-300 transition-colors"
          >
            {t('header.contact')}
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;