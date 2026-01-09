import React from 'react';
import { ArrowRight } from 'lucide-react';

const Intro: React.FC = () => {
  return (
    <section id="about" className="w-full bg-[#050505] text-white py-24 px-4 md:px-10 flex flex-col justify-center min-h-[80vh]">
      
      {/* Container */}
      <div className="w-full mx-auto flex flex-col h-full relative">
        
        {/* Sticky Label */}
        <div className="sticky top-28 z-20 mb-12 mix-blend-difference pointer-events-none">
          <span className="text-[#FF4533] font-bold text-sm tracking-widest uppercase inline-block">
            // Обо мне
          </span>
        </div>

        {/* Main Headline */}
        <div className="w-full mb-16 md:mb-20">
          {/* Reduced text size from text-[6vw] to text-[4vw] roughly, using md:text-5xl for better control */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.2] tracking-tight uppercase w-full break-words max-w-5xl">
            {/* Indentation for the first line */}
            <span className="inline-block w-[10vw] md:w-[8rem] h-1 align-middle"></span>
            Я — опытный менеджер и <span className="text-[#FF4533]">создатель элегантных решений.</span> Превращаю хаос в структуру, а идеи — в <span className="text-[#FF4533]">успешные продукты.</span>
          </h2>
        </div>

        {/* Bottom Section (Description + Button) */}
        <div className="w-full flex flex-col md:flex-row justify-between items-end gap-10 mt-auto">
           {/* Decorative separator or empty space on left */}
           <div className="hidden md:block w-1/3"></div>

           {/* Content wrapper */}
          <div className="flex flex-col items-start gap-10 w-full md:w-2/3 lg:w-1/2">
            <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-lg">
              Мой подход объединяет стратегическое мышление и внимание к деталям. Я помогаю командам находить верный курс и создаю условия для реализации самых смелых проектов.
            </p>

            {/* Redesigned Button matching Contact style */}
            <a 
              href="#projects" 
              className="group relative inline-flex items-center justify-center gap-4 px-8 py-4 bg-[#FF4533] text-white rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="font-bold uppercase tracking-wider relative z-10 text-sm md:text-base">Смотреть работы</span>
              <ArrowRight className="relative z-10 w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Intro;