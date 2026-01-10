import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { useProject } from '../hooks/useProject';
import { useTranslation } from 'react-i18next';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { project, loading, error } = useProject(id ? Number(id) : undefined);
  const { t, i18n } = useTranslation();
  
  // Функция для получения локализованного поля
  const getLocalizedField = (project: any, field: 'title' | 'description') => {
    if (i18n.language === 'en' && project[`${field}_en`]) {
      return project[`${field}_en`];
    }
    return project[field];
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-[#FF4533]" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">⚠️ {i18n.language === 'en' ? 'Error' : 'Ошибка'}</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/" className="text-[#FF4533] underline hover:text-white">
            {i18n.language === 'en' ? 'Back to Home' : 'Вернуться на главную'}
          </Link>
        </div>
      </div>
    );
  }

  // Not found state
  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {i18n.language === 'en' ? 'Project Not Found' : 'Проект не найден'}
          </h1>
          <Link to="/" className="text-[#FF4533] underline hover:text-white">
            {i18n.language === 'en' ? 'Back to Home' : 'Вернуться на главную'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#FF4533] selection:text-white">
      <Header />

      <main className="pt-32 pb-20 px-4 md:px-10 max-w-screen-2xl mx-auto">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-bold">
            {i18n.language === 'en' ? 'Back' : 'Назад'}
          </span>
        </Link>

        {/* Header Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/20 pb-10">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              {getLocalizedField(project, 'title')}
            </h1>
            <span className="text-[#FF4533] font-mono text-lg md:text-xl">
              // {project.year}
            </span>
          </div>
        </div>

        {/* Main Image */}
        <div className="w-full aspect-video mb-16 overflow-hidden bg-gray-900">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 mb-24">
          
          {/* Sidebar Info */}
          <div className="col-span-1 space-y-8">
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                {t('projects.category')}
              </h3>
              <p className="text-xl font-medium">{project.category}</p>
            </div>
            
            {project.client && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  {t('projects.client')}
                </h3>
                <p className="text-xl font-medium">{project.client}</p>
              </div>
            )}

            {project.role && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  {t('projects.role')}
                </h3>
                <p className="text-xl font-medium">{project.role}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                {t('projects.status')}
              </h3>
              <p className={`text-xl font-medium ${project.status === 'В работе' || project.status === 'In Progress' ? 'text-yellow-500' : 'text-green-500'}`}>
                {project.status}
              </p>
            </div>
          </div>

          {/* Main Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold mb-6">
              {i18n.language === 'en' ? 'About the Project' : 'О проекте'}
            </h3>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              {getLocalizedField(project, 'description')}
            </p>
            
            {/* Additional content placeholder */}
            <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
              {i18n.language === 'en' 
                ? 'The development of this project involved a deep analysis of user needs and the creation of a unique visual system that distinguishes the brand from competitors. We used modern technologies to ensure maximum performance.'
                : 'Разработка этого проекта включала в себя глубокий анализ потребностей пользователей и создание уникальной визуальной системы, которая отличает бренд от конкурентов. Мы использовали современные технологии для обеспечения максимальной производительности.'
              }
            </p>
          </div>
        </div>

        {/* Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="space-y-6 md:space-y-10 mb-24">
             {project.images.map((img, idx) => (
               <div key={idx} className="w-full">
                 <img src={img} alt={`Detail ${idx}`} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" />
               </div>
             ))}
          </div>
        )}

      </main>

      <Contact />
      <Footer />
    </div>
  );
};

export default ProjectPage;