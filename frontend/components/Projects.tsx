import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Category } from '../data/projects';
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
  
  // Функция для получения локализованного поля
  const getLocalizedField = (project: any, field: 'title' | 'description') => {
    if (i18n.language === 'en' && project[`${field}_en`]) {
      return project[`${field}_en`];
    }
    return project[field];
  };
  
  // Функция для получения локализованной категории
  const getLocalizedCategory = (project: any) => {
    if (i18n.language === 'en' && project.category_en) {
      return project.category_en;
    }
    return project.category;
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
  
  // Обновление активной категории при смене языка
  useEffect(() => {
    if (i18n.language === 'en') {
      const categoryMap: Record<string, Category> = {
        'Все': 'All',
        'Дизайн': 'Design',
        'Разработка': 'Development',
        'Стартапы': 'Startups',
        'Другое': 'Other'
      };
      setActiveCategory(categoryMap[activeCategory as string] || 'All');
    } else {
      const categoryMap: Record<string, Category> = {
        'All': 'Все',
        'Design': 'Дизайн',
        'Development': 'Разработка',
        'Startups': 'Стартапы',
        'Other': 'Другое'
      };
      setActiveCategory(categoryMap[activeCategory as string] || 'Все');
    }
  }, [i18n.language]);

  const getCount = (cat: CategoryItem) => {
    return cat.count || 0;
  };

  return (
    <section id="projects" className="w-full bg-[#050505] text-white py-24 px-4 md:px-10 min-h-screen">
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
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">
              {i18n.language === 'en' ? (
                <>Featured<br/>Works</>
              ) : (
                <>Избранные<br/>Работы</>
              )}
            </h2>
          </div>

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
                  {getCount(cat)}
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

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {filteredProjects.map((project) => (
            <Link 
              to={`/project/${project.id}`}
              key={project.id} 
              className="group relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-gray-900 cursor-pointer block"
            >
              {/* Image */}
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
              />

              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                
                {/* Top: Category & Arrow */}
                <div className="flex justify-between items-start w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-[#FF4533] text-xs font-bold tracking-widest uppercase border border-[#FF4533] px-2 py-1 rounded-sm">
                    {getLocalizedCategory(project)}
                  </span>
                  <div className="bg-white text-black p-2 rounded-full">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                {/* Bottom: Title & Meta */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-2 text-white">
                    {getLocalizedField(project, 'title')}
                  </h3>
                  <div className="flex items-center gap-4 text-sm md:text-base text-gray-300 font-medium font-mono">
                    <span className={project.status === 'В работе' || project.status === 'In Progress' ? 'text-yellow-400' : 'text-green-400'}>
                       ● {project.status}
                    </span>
                    <span className="text-gray-500">/</span>
                    <span>{project.year}</span>
                  </div>
                </div>

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