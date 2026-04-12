import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Case, Category } from '../data/projects';
import { useProjects } from '../hooks/useProjects';
import { apiClient } from '../api/client';
import { useTranslation } from 'react-i18next';

interface CategoryItem {
  name: string;
  name_en?: string;
  name_ru?: string;
  count: number;
}

const CARD_CONFIGS = [
  { w: 240, h: 158, rotate: -5, dx: 0,   dy: 0   },
  { w: 170, h: 112, rotate:  7, dx: 210, dy: 36  },
  { w: 136, h: 90,  rotate: -3, dx: 100, dy: -64 },
  { w: 120, h: 80,  rotate: 10, dx: 248, dy: -22 },
] as const;

const Projects: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>(i18n.language === 'en' ? 'All' : 'Все');
  const { projects: filteredProjects, loading, error } = useProjects({ 
    category: activeCategory 
  });
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [hovered, setHovered] = useState<Case | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getLocalizedCategory = (project: Case) => {
    if (i18n.language === 'en') return project.category_en;
    return project.category_ru;
  };

  const getLocalizedNiche = (project: Case) => {
    if (i18n.language === 'en') return project.niche_en || project.category_en;
    return project.niche_ru || project.category_ru;
  };

  const getLocalizedPeriod = (project: Case) => {
    if (i18n.language === 'en') return project.period_en || '';
    return project.period_ru || '';
  };

  // Загрузка категорий с учетом языка
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiClient.getCategories(i18n.language);
      if (response.data) {
        setCategories(response.data.categories);
      }
    };
    
    fetchCategories();
  }, [i18n.language]);

  // При смене языка переключаем активную категорию на "All"/"Все"
  useEffect(() => {
    setActiveCategory(i18n.language === 'en' ? 'All' : 'Все');
  }, [i18n.language]);

  // Desktop preview: compute base position
  const previewBelow = mousePos.y < 280;
  const previewBaseX = Math.max(8, Math.min(
    mousePos.x - 200,
    (typeof window !== 'undefined' ? window.innerWidth : 1200) - 435
  ));
  const previewBaseY = previewBelow ? mousePos.y + 28 : mousePos.y - 186;
  const pDur = hovered ? '180ms' : '100ms';
  const pDelay = (i: number) => hovered ? `${i * 55}ms` : '0ms';

  // Collect up to 4 unique image URLs for desktop hover cards
  const hoveredImages: string[] = hovered
    ? [
        hovered.image,
        ...(hovered.media?.filter(m => m.type === 'image' && !!m.url).map(m => m.url) ?? [])
      ].filter(Boolean).slice(0, 4) as string[]
    : [];

  // Magazine layout: first 2 projects as featured cards only in "all" mode
  const isShowingAll = activeCategory === 'Все' || activeCategory === 'All';

  return (
    <section id="projects" className="w-full bg-[#050505] text-white py-24 px-4 md:px-10 min-h-screen">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .project-row {
          animation: fadeSlideUp 0.4s ease forwards;
          opacity: 0;
          position: relative;
        }
      `}</style>

      {/* === DESKTOP: scattered photo cards on hover === */}

      {/* Label card — category tag */}
      <div
        className="hidden md:flex fixed pointer-events-none z-[9999] items-center justify-center shadow-lg"
        style={{
          width: 130, height: 38,
          left: previewBaseX + 44,
          top: previewBaseY - 46,
          transform: 'rotate(2deg)',
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.1)',
          opacity: hovered ? 1 : 0,
          transition: `opacity ${pDur} ease ${pDelay(0)}`,
        }}
      >
        <span style={{ color: '#FF4533', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          {hovered ? getLocalizedCategory(hovered) : ''}
        </span>
      </div>

      {/* Image cards — up to 4, each with a unique real image from project.media */}
      {CARD_CONFIGS.map((cfg, i) =>
        hoveredImages[i] ? (
          <div
            key={i}
            className="hidden md:block fixed pointer-events-none overflow-hidden shadow-2xl"
            style={{
              zIndex: 9998 - i,
              width: cfg.w, height: cfg.h,
              left: previewBaseX + cfg.dx,
              top: previewBaseY + cfg.dy,
              transform: `rotate(${cfg.rotate}deg)`,
              opacity: hovered ? 1 : 0,
              transition: `opacity ${pDur} ease ${pDelay(i + 1)}`,
            }}
          >
            <img src={hoveredImages[i]} alt="" className="w-full h-full object-cover" />
          </div>
        ) : null
      )}

      <div className="w-full mx-auto max-w-screen-2xl relative">
        
        {/* Sticky Section Label */}
        <div className="sticky top-20 z-30 mb-12 mix-blend-difference pointer-events-none self-start">
          <span className="text-[#FF4533] font-bold text-sm tracking-widest uppercase inline-block">
            // {t('projects.title')}
          </span>
        </div>

        {/* Header Section: Title & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          
          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">
            {i18n.language === 'en' ? (
              <>Featured<br/>Works</>
            ) : (
              <>Избранные<br/>Работы</>
            )}
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name as Category)}
                className={`
                  px-5 py-2 md:px-6 md:py-3 
                  rounded-full border 
                  text-xs md:text-sm font-bold uppercase tracking-widest 
                  transition-all duration-300 
                  flex items-center gap-2
                  ${activeCategory === cat.name 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'bg-transparent text-gray-500 border-white/20 hover:border-white hover:text-white'
                  }
                `}
              >
                {cat.name}
                <span className={`text-[10px] align-top opacity-60 ${activeCategory === cat.name ? 'text-black font-extrabold' : ''}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#FF4533]" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full py-20 text-center">
            <p className="text-red-500 text-lg mb-4">⚠️ Ошибка загрузки проектов</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* Featured photo cards — desktop only, first 2 projects when showing all */}
        {!loading && !error && isShowingAll && filteredProjects.length >= 2 && (
          <div className="hidden md:grid grid-cols-5 gap-2 mb-2" style={{ height: 380 }}>

            {/* Card 1 — larger, 3/5 width */}
            <Link
              to={`/project/${filteredProjects[0].slug}`}
              className="col-span-3 relative overflow-hidden group"
              onMouseEnter={() => setHovered(filteredProjects[0])}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={filteredProjects[0].image} alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              <span
                className="absolute top-4 left-5 text-white font-bold font-mono select-none pointer-events-none"
                style={{ fontSize: 128, lineHeight: 1, opacity: 0.06 }}
              >01</span>
              <div className="absolute bottom-6 left-6 right-14">
                <span className="block text-[#FF4533] text-[9px] font-bold uppercase tracking-[0.25em] mb-2">
                  {getLocalizedCategory(filteredProjects[0])}
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white leading-tight mb-1 truncate">
                  {filteredProjects[0].title}
                </h3>
                <span className="text-gray-400 text-xs font-mono">{getLocalizedNiche(filteredProjects[0])}</span>
              </div>
              <ArrowUpRight size={18} className="absolute bottom-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </Link>

            {/* Card 2 — smaller, 2/5 width */}
            <Link
              to={`/project/${filteredProjects[1].slug}`}
              className="col-span-2 relative overflow-hidden group"
              onMouseEnter={() => setHovered(filteredProjects[1])}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={filteredProjects[1].image} alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              <span
                className="absolute top-4 left-5 text-white font-bold font-mono select-none pointer-events-none"
                style={{ fontSize: 128, lineHeight: 1, opacity: 0.06 }}
              >02</span>
              <div className="absolute bottom-6 left-6 right-14">
                <span className="block text-[#FF4533] text-[9px] font-bold uppercase tracking-[0.25em] mb-2">
                  {getLocalizedCategory(filteredProjects[1])}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white leading-tight mb-1 truncate">
                  {filteredProjects[1].title}
                </h3>
                <span className="text-gray-400 text-xs font-mono">{getLocalizedNiche(filteredProjects[1])}</span>
              </div>
              <ArrowUpRight size={18} className="absolute bottom-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </Link>

          </div>
        )}

        {/* Editorial list — remaining projects (or all when filtering) */}
        {!loading && !error && (
          <div key={activeCategory} className="border-t border-white/10">
            {(isShowingAll ? filteredProjects.slice(2) : filteredProjects).map((project, idx) => {
              const listIndex = isShowingAll ? idx + 2 : idx;
              return (
                <Link
                  key={project.slug}
                  to={`/project/${project.slug}`}
                  className="project-row group relative isolate overflow-hidden flex items-center gap-4 md:gap-6 py-7 md:py-5 border-b border-white/10 hover:border-white/25 hover:bg-white/[0.02] transition-all duration-300 px-1"
                  style={{ animationDelay: `${listIndex * 38}ms` }}
                  onMouseEnter={() => setHovered(project)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Mobile: cinematic background image with dark overlay */}
                  <span
                    className="md:hidden absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(rgba(5,5,5,0.70), rgba(5,5,5,0.70)), url(${project.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      zIndex: -1,
                    }}
                    aria-hidden="true"
                  />

                  {/* Index */}
                  <span className="text-gray-700 text-xs font-mono w-8 shrink-0 group-hover:text-gray-500 transition-colors">
                    {String(listIndex + 1).padStart(2, '0')}
                  </span>

                  {/* Title + mobile category */}
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <h3 className="text-base md:text-xl lg:text-2xl font-bold uppercase tracking-tight group-hover:text-white transition-colors duration-300 truncate">
                      {project.title}
                    </h3>
                    <span className="md:hidden text-[#FF4533] text-[9px] font-bold uppercase tracking-widest">
                      {getLocalizedCategory(project)}
                    </span>
                  </div>

                  {/* Niche */}
                  <span className="hidden md:block text-gray-500 text-sm font-mono shrink-0 max-w-[180px] truncate">
                    {getLocalizedNiche(project)}
                  </span>

                  {/* Period */}
                  {getLocalizedPeriod(project) && (
                    <span className="hidden lg:block text-gray-600 text-xs font-mono shrink-0">
                      {getLocalizedPeriod(project)}
                    </span>
                  )}

                  {/* Category */}
                  <span className="hidden md:block text-[#FF4533] text-xs font-bold uppercase tracking-widest shrink-0 min-w-[72px] text-right">
                    {getLocalizedCategory(project)}
                  </span>

                  {/* Arrow */}
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 text-white"
                  />
                </Link>
              );
            })}
          </div>
        )}
        
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="w-full py-20 text-center text-gray-500 uppercase tracking-widest">
            {i18n.language === 'en' ? 'No projects in this category' : 'Нет проектов в этой категории'}
          </div>
        )}

      </div>
    </section>
  );
};

export default Projects;