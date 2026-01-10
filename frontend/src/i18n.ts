import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Подключаем плагин для загрузки переводов
  .use(HttpBackend)
  // Подключаем детектор языка браузера
  .use(LanguageDetector)
  // Подключаем модуль react-i18next
  .use(initReactI18next)
  // Инициализируем i18next
  .init({
    // Язык по умолчанию, если не определен
    fallbackLng: 'ru',
    // Поддерживаемые языки
    supportedLngs: ['ru', 'en'],
    // Отладка (можно отключить в продакшене)
    debug: false,
    
    // Настройки детектора языка
    detection: {
      // Порядок определения языка
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      // Кэширование выбранного языка
      caches: ['localStorage'],
      // Ключ для сохранения в localStorage
      lookupLocalStorage: 'i18nextLng',
    },
    
    // Настройки загрузки переводов
    backend: {
      // Путь к файлам переводов
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // Интерполяция
    interpolation: {
      // React уже экранирует значения
      escapeValue: false,
    },
    
    // Реагировать на изменения языка
    react: {
      useSuspense: true,
    },
  });

export default i18n;
