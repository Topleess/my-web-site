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

const Projects: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>(i18n.language === 'en' ? 'All' : 'Все');
  const { projects: filteredProjects, loading, error } = useProjects({ 
    category: activeCategory 
  });
  const [categories, setCategories] = useState<CategoryItem[]>([]);

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

  const getLocalizedTitle = (project: Case) => {
    if (i18n.language === 'en') return project.title_en || project.title;
    return project.title_ru || project.title;
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

        {/* Card grid — all projects */}
        {!loading && !error && (
          <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredProjects.map((project, idx) => (
              <Link
                key={project.slug}
                to={`/project/${project.slug}`}
                className="project-row group relative overflow-hidden bg-[#0d0d0d] border border-white/[0.07] hover:border-white/20 transition-all duration-300"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ paddingBottom: '62%' }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {/* Index badge */}
                  <span className="absolute top-3 left-3 text-white/30 font-mono text-xs font-bold select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {/* Arrow on hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <ArrowUpRight size={18} className="text-white" />
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <span className="block text-[#FF4533] text-[9px] font-bold uppercase tracking-[0.22em] mb-1.5">
                    {getLocalizedCategory(project)}
                  </span>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-tight text-white leading-tight truncate mb-1">
                    {getLocalizedTitle(project)}
                  </h3>
                  <span className="text-gray-500 text-xs font-mono truncate block">
                    {getLocalizedNiche(project)}{getLocalizedPeriod(project) ? ` · ${getLocalizedPeriod(project)}` : ''}
                  </span>
                </div>
              </Link>
            ))}
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