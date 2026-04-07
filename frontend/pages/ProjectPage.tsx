import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { useProject } from '../hooks/useProject';
import { useTranslation } from 'react-i18next';

const ProjectPage: React.FC = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { project, loading, error } = useProject(slug);
  const { i18n } = useTranslation();

  const isEn = i18n.language === 'en';

  const loc = (ru: string | null | undefined, en: string | null | undefined) =>
    isEn ? (en || ru || '') : (ru || en || '');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-[#FF4533]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">⚠️ {isEn ? 'Error' : 'Ошибка'}</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/" className="text-[#FF4533] underline hover:text-white">
            {isEn ? 'Back to Home' : 'Вернуться на главную'}
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {isEn ? 'Project Not Found' : 'Проект не найден'}
          </h1>
          <Link to="/" className="text-[#FF4533] underline hover:text-white">
            {isEn ? 'Back to Home' : 'Вернуться на главную'}
          </Link>
        </div>
      </div>
    );
  }

  const solutionLines = loc(project.solution_ru, project.solution_en)
    ?.split('\n')
    .filter(Boolean) ?? [];

  const resultsLines = loc(project.results_ru, project.results_en)
    ?.split('\n')
    .filter(Boolean) ?? [];

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#FF4533] selection:text-white">
      <Header />

      <main className="pt-32 pb-20 px-4 md:px-10 max-w-screen-2xl mx-auto">

        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-bold">
            {isEn ? 'Back' : 'Назад'}
          </span>
        </Link>

        {/* Header Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/20 pb-10">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              {project.title}
            </h1>
            {(project.period_ru || project.period_en) && (
              <span className="text-[#FF4533] font-mono text-lg md:text-xl">
                // {loc(project.period_ru, project.period_en)}
              </span>
            )}
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
                {isEn ? 'Category' : 'Категория'}
              </h3>
              <p className="text-xl font-medium">
                {loc(project.category_ru, project.category_en)}
              </p>
            </div>

            {(project.niche_ru || project.niche_en) && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  {isEn ? 'Niche' : 'Ниша'}
                </h3>
                <p className="text-xl font-medium">
                  {loc(project.niche_ru, project.niche_en)}
                </p>
              </div>
            )}

            {(project.client_ru || project.client_en) && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  {isEn ? 'Client' : 'Клиент'}
                </h3>
                <p className="text-xl font-medium">
                  {loc(project.client_ru, project.client_en)}
                </p>
              </div>
            )}

            {(project.format_ru || project.format_en) && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  {isEn ? 'Format' : 'Формат'}
                </h3>
                <p className="text-xl font-medium">
                  {loc(project.format_ru, project.format_en)}
                </p>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                  {isEn ? 'Stack' : 'Стек'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs border border-white/20 px-2 py-1 rounded-sm font-mono text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold mb-6">
              {isEn ? 'About the Project' : 'О проекте'}
            </h3>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              {loc(project.description_ru, project.description_en)}
            </p>
            {(project.full_description_ru || project.full_description_en) && (
              <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                {loc(project.full_description_ru, project.full_description_en)}
              </p>
            )}
          </div>
        </div>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 border-t border-b border-white/10 py-12">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-black text-[#FF4533] mb-2">{metric.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  {isEn ? metric.label.en : metric.label.ru}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Challenge / Solution / Results */}
        {(project.challenge_ru || project.challenge_en) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 mb-24">
            <div className="col-span-1">
              <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                {isEn ? 'Challenge' : 'Задача'}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {loc(project.challenge_ru, project.challenge_en)}
              </p>
            </div>

            {solutionLines.length > 0 && (
              <div className="col-span-1">
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                  {isEn ? 'Solution' : 'Решение'}
                </h3>
                <ul className="space-y-2">
                  {solutionLines.map((line, i) => (
                    <li key={i} className="text-gray-300 leading-relaxed flex gap-2">
                      <span className="text-[#FF4533] mt-1">—</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resultsLines.length > 0 && (
              <div className="col-span-1">
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                  {isEn ? 'Results' : 'Результаты'}
                </h3>
                <ul className="space-y-2">
                  {resultsLines.map((line, i) => (
                    <li key={i} className="text-gray-300 leading-relaxed flex gap-2">
                      <span className="text-[#FF4533] mt-1">—</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Media Gallery */}
        {project.media && project.media.length > 0 && (
          <div className="space-y-6 md:space-y-10 mb-24">
            {project.media.map((item, idx) => (
              <div key={idx} className="w-full">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={isEn ? item.alt?.en : item.alt?.ru}
                    className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <video src={item.url} controls className="w-full h-auto" />
                )}
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