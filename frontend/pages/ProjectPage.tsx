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

  const metaItems = [
    { label: isEn ? 'Category' : 'Категория', value: loc(project.category_ru, project.category_en) },
    { label: isEn ? 'Niche' : 'Ниша', value: loc(project.niche_ru, project.niche_en) },
    { label: isEn ? 'Client' : 'Клиент', value: loc(project.client_ru, project.client_en) },
    { label: isEn ? 'Format' : 'Формат', value: loc(project.format_ru, project.format_en) },
  ].filter((item) => item.value);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#FF4533] selection:text-white">
      <Header />

      <main className="pt-28 pb-20 px-4 md:px-10 max-w-screen-2xl mx-auto">

        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-bold">
            {isEn ? 'Back' : 'Назад'}
          </span>
        </Link>

        {/* Title + Period */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/20 pb-8 mb-6">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            {loc(project.title_ru || project.title, project.title_en || project.title)}
          </h1>
          {(project.period_ru || project.period_en) && (
            <span className="text-[#FF4533] font-mono text-base md:text-lg shrink-0">
              // {loc(project.period_ru, project.period_en)}
            </span>
          )}
        </div>

        {/* Compact Meta Bar */}
        <div className="flex flex-wrap items-start gap-x-8 gap-y-3 mb-4">
          {metaItems.map((item, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                {item.label}
              </span>
              <span className="text-sm font-medium text-gray-200">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Stack Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs border border-white/20 px-2 py-0.5 rounded-sm font-mono text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Hero Image */}
        <div className="w-full mb-10 overflow-hidden bg-gray-900" style={{ maxHeight: '56vh' }}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full object-cover"
            style={{ maxHeight: '56vh' }}
          />
        </div>

        {/* About Project — full width */}
        <div className="mb-10 max-w-3xl">
          <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">
            {isEn ? 'About the Project' : 'О проекте'}
          </h3>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-4">
            {loc(project.description_ru, project.description_en)}
          </p>
          {(project.full_description_ru || project.full_description_en) && (
            <p className="text-base text-gray-400 leading-relaxed">
              {loc(project.full_description_ru, project.full_description_en)}
            </p>
          )}
        </div>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 border-t border-b border-white/10 py-8">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#FF4533] mb-1">{metric.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  {isEn ? metric.label.en : metric.label.ru}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Challenge / Solution / Results */}
        {(project.challenge_ru || project.challenge_en) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                {isEn ? 'Challenge' : 'Задача'}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {loc(project.challenge_ru, project.challenge_en)}
              </p>
            </div>

            {solutionLines.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                  {isEn ? 'Solution' : 'Решение'}
                </h3>
                <ul className="space-y-2">
                  {solutionLines.map((line, i) => (
                    <li key={i} className="text-sm text-gray-300 leading-relaxed flex gap-2">
                      <span className="text-[#FF4533] shrink-0">—</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resultsLines.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                  {isEn ? 'Results' : 'Результаты'}
                </h3>
                <ul className="space-y-2">
                  {resultsLines.map((line, i) => (
                    <li key={i} className="text-sm text-gray-300 leading-relaxed flex gap-2">
                      <span className="text-[#FF4533] shrink-0">—</span>
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
          <div className="space-y-6 mb-10">
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