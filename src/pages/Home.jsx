// Home.jsx - ФИОЛЕТОВЫЙ ПРОДАЮЩИЙ ЛЕНДИНГ с максимальным стилем и фишками
import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";
import {
  Users,
  Mic2,
  Building2,
  Heart,
  Phone,
  Calendar,
  Sparkles,
  Mic,
  ChevronRight,
  Star,
  Music,
  Ticket,
  Clock,
  CheckCircle,
  Volume2,
  Pause,
  Play,
  Gift,
  Trophy,
  Flame,
  Disc3,
  Guitar,
  Drum,
  Headphones,
  Radio,
  Zap,
  Infinity,
  Crown,
  Award,
  BarChart3,
  TrendingUp,
  PartyPopper,
  Gem,
} from "lucide-react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quizActive, setQuizActive] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [particles, setParticles] = useState([]);
  const [floatingNotes, setFloatingNotes] = useState([]);
  const [showGift, setShowGift] = useState(false);
  const [score, setScore] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [hoverCard, setHoverCard] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Layout>
      <div>
        {/* Фоновые эффекты с параллаксом */}
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-700/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] animate-spin-slow" />
        </div>

        <div className="relative z-10">
          {/* Главный заголовок с 3D эффектом */}
          <div
            className={`text-center pt-8 pb-4 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
          >
            <div className="container mx-auto px-4">
              <div className="relative inline-block">
                <h1 className="text-5xl md:text-7xl font-black mb-4 relative">
                  <span className="bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Выберите любимую группу
                  </span>
                </h1>
                <div className="absolute -top-6 -right-8 animate-bounce-slow">
                  <Sparkles size={32} className="text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* ИНТЕРАКТИВНАЯ КАРУСЕЛЬ С ЭФФЕКТОМ 3D */}
          <div className="py-4">
            <Carousel />
          </div>

          {/* СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО С СЧЕТЧИКАМИ */}
          <div className="bg-gradient-to-r from-purple-950/30 to-transparent py-12 my-12 border-y border-purple-500/20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    icon: Users,
                    value: "500+",
                    label: "Довольных клиентов",
                  },
                  {
                    icon: Mic2,
                    value: "1200+",
                    label: "Успешных выступлений",
                  },
                  {
                    icon: Building2,
                    value: "30+",
                    label: "Городов",
                  },
                  {
                    icon: Heart,
                    value: "98%",
                    label: "Рекомендуют",
                  },
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="relative inline-block">
                      <stat.icon
                        size={36}
                        className="text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ЦЕНЫ С АНИМАЦИЕЙ */}
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Простые <span className="text-purple-400">цены</span>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-transparent mx-auto mt-2" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* СТАНДАРТ - до 30 человек */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 text-center border border-white/20 hover:border-purple-500/60 transition-all duration-500 group cursor-pointer hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-500/30 backdrop-blur-sm">
                {/* Легкое свечение */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="p-3 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <Mic size={40} className="text-purple-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    Стандарт
                  </div>
                  <div className="text-purple-400 text-sm mb-2">
                    до 30 человек
                  </div>
                  <div className="text-4xl font-bold text-white mb-4">
                    50 000 ₽
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-4" />
                  <div className="space-y-2 text-left mb-6">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Живой звук
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Базовая свет
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      1 перерыв
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Длительность: до 3 часов
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-medium transition-all border border-purple-500/30 hover:border-purple-400">
                    Выбрать
                  </button>
                </div>
              </div>

              {/* РАСШИРЕННЫЙ - от 30 до 250 человек (ХИТ) */}
              <div className="relative bg-gradient-to-br from-purple-900/60 to-purple-800/30 rounded-2xl p-6 text-center border-2 border-purple-500/80 hover:border-purple-400 transition-all duration-500 group cursor-pointer hover:-translate-y-3 scale-105 shadow-2xl shadow-purple-600/30">
                {/* Яркое свечение */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Star size={12} fill="white" /> ХИТ ПРОДАЖ
                </div>
                <div className="absolute -top-2 -right-2 animate-ping-slow">
                  <Flame size={24} className="text-orange-500" />
                </div>

                <div className="relative">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="p-3 rounded-full bg-purple-500/20">
                      <PartyPopper size={40} className="text-purple-300" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    Расширенный
                  </div>
                  <div className="text-purple-300 text-sm mb-2 font-medium">
                    30-250 человек
                  </div>
                  <div className="text-4xl font-bold text-white mb-4">
                    120 000 ₽
                  </div>
                  <div className="text-green-400 text-xs mb-3">
                    🎁 Фотограф в подарок
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-4" />
                  <div className="space-y-2 text-left mb-6">
                    <div className="flex items-center gap-2 text-gray-200 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Проф. звук + свет
                    </div>
                    <div className="flex items-center gap-2 text-gray-200 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Сет-лист на выбор
                    </div>
                    <div className="flex items-center gap-2 text-gray-200 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      2 перерыва
                    </div>
                    <div className="flex items-center gap-2 text-gray-200 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Длительность: до 4 часов
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-purple-600/50 hover:shadow-purple-600/80">
                    Выбрать тариф
                  </button>
                </div>
              </div>

              {/* ПРОКАТ ОБОРУДОВАНИЯ */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 text-center border border-white/20 hover:border-purple-500/60 transition-all duration-500 group cursor-pointer hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-500/30 backdrop-blur-sm">
                <div className="relative">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="p-3 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <Volume2 size={40} className="text-purple-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    Прокат
                  </div>
                  <div className="text-purple-400 text-sm mb-2">
                    оборудования
                  </div>
                  <div className="text-3xl font-bold text-white mb-4">
                    от 15 000 ₽
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-4" />
                  <div className="space-y-2 text-left mb-6">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Звук, свет, сцена
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Микшерный пульт
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Сценические мониторы
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-400 flex-shrink-0"
                      />{" "}
                      Доставка и настройка
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-medium transition-all border border-purple-500/30 hover:border-purple-400">
                    Арендовать
                  </button>
                </div>
              </div>
            </div>

            {/* Дополнительный CTA текст */}
            <div className="text-center mt-12">
              <p className="text-gray-400 text-sm">
                * Возможна индивидуальная смета под ваш праздник
              </p>
            </div>
          </div>

          {/* БЛОК С ОТЗЫВАМИ В ВИДЕ КАРТОЧЕК */}
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Что говорят <span className="text-purple-400">клиенты</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "Анна С.",
                  event: "Корпоратив",
                  text: "Ребята просто зажгли! Все гости в восторге, музыка на высоте!",
                  stars: 5,
                },
                {
                  name: "Дмитрий К.",
                  event: "Свадьба",
                  text: "Лучшая группа для свадьбы! Гости танцевали до утра, спасибо!",
                  stars: 5,
                },
                {
                  name: "Елена М.",
                  event: "День рождения",
                  text: "Очень профессионально, звук отличный, подход индивидуальный. 10/10",
                  stars: 5,
                },
              ].map((review, i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/40 transition-all group hover:-translate-y-2"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.stars)].map((_, s) => (
                      <Star
                        key={s}
                        size={16}
                        fill="#a855f7"
                        className="text-purple-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm mb-4">"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium text-sm">
                        {review.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {review.event}
                      </div>
                    </div>
                    <div className="text-purple-400 text-2xl">“</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ФОРМА ЗАЯВКИ С АНИМАЦИЕЙ */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-950/40 to-purple-900/20 rounded-2xl p-8 md:p-12 border border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/30 animate-pulse">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-purple-300 text-sm font-semibold">
                    НЕ НАШЛИ ИДЕАЛЬНУЮ ГРУППУ?
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                  Мы подберём музыку <br />
                  <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                    под ваш бюджет
                  </span>
                </h2>

                <p className="text-gray-400 text-lg">
                  Оставьте заявку — и мы предложим 3 варианта в течение часа
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="flex-1 px-5 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="flex-1 px-5 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 whitespace-nowrap group">
                  Подобрать
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition"
                  />
                </button>
              </div>

              <p className="text-xs text-gray-600 text-center mt-4">
                Нажимая на кнопку, вы соглашаетесь с политикой
                конфиденциальности
              </p>
            </div>
          </div>

          {/* ФУТЕР С ИНТЕРАКТИВОМ */}
          <div className="border-t border-purple-500/20 py-10 bg-gradient-to-t from-purple-950/20 to-transparent">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 mb-4 hover:scale-110 transition-transform cursor-pointer">
                <Phone size={32} className="text-purple-400" />
              </div>
              <div className="text-gray-400 text-sm mb-1">
                Есть вопросы? Звоните
              </div>
              <a
                href="tel:+78001234567"
                className="text-3xl font-bold text-white hover:text-purple-400 transition-colors"
              >
                +7 (800) 123-45-67
              </a>
              <div className="flex items-center justify-center gap-6 mt-6">
                <button className="text-gray-500 hover:text-purple-400 transition-colors text-sm">
                  Политика
                </button>
                <span className="text-purple-500/30">•</span>
                <button className="text-gray-500 hover:text-purple-400 transition-colors text-sm">
                  Договор оферты
                </button>
                <span className="text-purple-500/30">•</span>
                <button className="text-gray-500 hover:text-purple-400 transition-colors text-sm">
                  Реквизиты
                </button>
              </div>
              <div className="mt-6 text-gray-600 text-xs">
                © 2024 Музыкальное агентство. Все права защищены.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
      @keyframes float-noise {
        0% {
          transform: translateY(100vh);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        90% {
          opacity: 0.5;
        }
        100% {
          transform: translateY(-20vh);
          opacity: 0;
        }
      }

      .animate-float-noise {
        animation: float-noise linear infinite;
        will-change: transform;
      }


      @keyframes micro-float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  20% {
    transform: translateY(70vh) scale(1);
    opacity: 0.7;
  }
  80% {
    transform: translateY(30vh) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-10vh) scale(0);
    opacity: 0;
  }
}

.animate-micro-float {
  animation: micro-float linear infinite;
}
      `}</style>
    </Layout>
  );
};

export default Home;
