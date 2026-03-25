import { groupsData } from "../data/groups";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const Carousel = ({ groups = groupsData }) => {
  const autoplayRef = useRef(null);
  const timerRef = useRef(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: false,
      skipSnaps: false,
    },
    [
      AutoScroll({
        playOnInit: true,
        speed: 0.8,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Функция для временной остановки автопрокрутки
  const pauseAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      autoplayRef.current.stop();
    }
    // Очищаем предыдущий таймер
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // Функция для возобновления автопрокрутки
  const resumeAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (autoplayRef.current && !autoplayRef.current.isActive()) {
        autoplayRef.current.play();
      }
    }, 2000); // Пауза на 2 секунды после клика
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      pauseAutoplay();
      emblaApi.scrollPrev();
      resumeAutoplay();
    }
  }, [emblaApi, pauseAutoplay, resumeAutoplay]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      pauseAutoplay();
      emblaApi.scrollNext();
      resumeAutoplay();
    }
  }, [emblaApi, pauseAutoplay, resumeAutoplay]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    // Получаем доступ к плагину автопрокрутки
    const autoScrollPlugin = emblaApi.plugins().autoScroll;
    if (autoScrollPlugin) {
      autoplayRef.current = autoScrollPlugin;
    }
    
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    
    return () => {
      if (emblaApi) {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [emblaApi, onSelect]);

  // Обработка наведения мыши на карусель
  const handleMouseEnter = useCallback(() => {
    if (autoplayRef.current) {
      autoplayRef.current.stop();
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (autoplayRef.current && !autoplayRef.current.isActive()) {
      autoplayRef.current.play();
    }
  }, []);

  return (
    <section className="bg-[var(--color-deus-black)]">
      <div className="container mx-auto px-4 relative">
        {/* Кастомная навигация */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[var(--color-purple-600)]/80 hover:bg-[var(--color-purple-500)] text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110"
          onClick={scrollPrev}
          aria-label="Предыдущий слайд"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[var(--color-purple-600)]/80 hover:bg-[var(--color-purple-500)] text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110"
          onClick={scrollNext}
          aria-label="Следующий слайд"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Карусель */}
        <div 
          className="overflow-hidden" 
          ref={emblaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex-[0_0_100%] min-w-0 pl-2 pr-2 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <Link
                  to={`/groups/${group.slug}`}
                  className="block group/card relative overflow-hidden rounded-xl bg-[var(--color-deus-gray-dark)] border border-[var(--color-purple-500)]/20 hover:border-[var(--color-purple-400)]/50 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.5)] h-full"
                >
                  {/* Изображение группы */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-deus-black)] via-transparent to-transparent z-10" />
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x300/1a1a1a/8b5cf6?text=" +
                          encodeURIComponent(group.name);
                      }}
                    />

                    {/* Жанр как чип сверху */}
                    <span className="absolute top-4 left-4 z-20 px-3 py-1 text-xs font-semibold rounded-full bg-[var(--color-purple-600)]/90 text-white backdrop-blur-sm border border-[var(--color-purple-400)]/30">
                      {group.genre}
                    </span>
                  </div>

                  {/* Информация о группе */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover/card:text-[var(--color-purple-400)] transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-[var(--color-deus-white)]/70 text-sm mb-4 line-clamp-2">
                      {group.description}
                    </p>

                    {/* Статистика */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-[var(--color-deus-white)]/70">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-[var(--color-purple-400)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        {group.members}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-[var(--color-purple-400)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {group.concerts}
                      </span>
                    </div>

                    {/* Индикатор кликабельности */}
                    <span className="inline-flex items-center text-[var(--color-purple-400)] font-medium">
                      Подробнее
                      <svg
                        className="w-4 h-4 ml-1 group-hover/card:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* Акцентный элемент при наведении */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-purple-400)] to-[var(--color-purple-600)] transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Кастомная пагинация */}
        <div className="flex justify-center gap-2 mt-8 pb-4">
          {groups.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? "w-6 bg-[var(--color-purple-500)]"
                  : "bg-[var(--color-purple-500)]/30 hover:bg-[var(--color-purple-500)]/50"
              }`}
              onClick={() => {
                if (emblaApi) {
                  pauseAutoplay();
                  emblaApi.scrollTo(index);
                  resumeAutoplay();
                }
              }}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
