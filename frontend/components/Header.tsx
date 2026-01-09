import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const projectCount = 5; 
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
              as-shamshurin
            </Link>

            {/* Element 2 */}
            <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer">
              Проекты
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isScrolled ? 'bg-white text-black' : 'bg-white text-black'}`}>
                {projectCount}
              </span>
            </a>

            {/* Element 3 */}
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:opacity-70 transition-opacity cursor-pointer">
              Обо мне
            </a>

            {/* Element 4 */}
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:opacity-70 transition-opacity cursor-pointer">
              Связаться
            </a>
          </div>

          {/* MOBILE LAYOUT */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Link to="/" className="text-sm font-semibold tracking-wide uppercase">
              as-shamshurin
            </Link>

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

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md text-white p-6 md:hidden flex flex-col space-y-4 shadow-lg border-t border-white/10">
          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, 'projects')}
            className="text-lg font-medium hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            Проекты
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
              {projectCount}
            </span>
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, 'about')}
            className="text-lg font-medium hover:text-gray-300 transition-colors"
          >
            Обо мне
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="text-lg font-medium hover:text-gray-300 transition-colors"
          >
            Связаться
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;