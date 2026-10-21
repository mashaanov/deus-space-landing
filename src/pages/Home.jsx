// Home.jsx - СВЕТЛЫЙ ПРОДАЮЩИЙ ЛЕНДИНГ в фиолетовых тонах
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
  Mail,
  Shield,
} from "lucide-react";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";

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
      <div className="bg-gradient-to-br from-white via-purple-50 to-purple-100">
        {/* Фоновые эффекты с параллаксом - светлые */}
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[120px] bg-purple-200/60" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] bg-purple-300/40 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] bg-purple-200/30 animate-spin-slow" />
        </div>

        <div className="relative z-10">
          {/* Главный заголовок с 3D эффектом */}
          <div
            className={`text-center pt-8 pb-4 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
          >
            <div className="container mx-auto px-4">
              <div className="relative inline-block">
                <h1 className="text-5xl md:text-7xl font-black mb-4 relative">
                  <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 bg-clip-text text-transparent animate-gradient">
                    Выберите любимую группу
                  </span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mt-2">
                  Профессиональные музыкальные коллективы для вашего мероприятия
                </p>
              </div>
            </div>
          </div>

          {/* ИНТЕРАКТИВНАЯ КАРУСЕЛЬ С ЭФФЕКТОМ 3D */}
          <div className="py-4">
            <Carousel />
          </div>

          {/* СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО С СЧЕТЧИКАМИ - светлая версия */}
          <div className="bg-gradient-to-r from-purple-100/80 to-transparent py-12 my-12 border-y border-purple-200">
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
                        className="text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-purple-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ЦЕНЫ С АНИМАЦИЕЙ - светлая версия */}
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-900 mb-12">
              Прейскурант
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* СТАНДАРТ - до 30 человек */}
              <Link
                className="relative bg-white rounded-2xl p-6 text-center border border-purple-200 hover:border-purple-400 transition-all duration-500 group cursor-pointer hover:-translate-y-3 hover:shadow-xl hover:shadow-purple-200 flex flex-col"
                to="/order"
                state=""
              >
                <div className="relative flex flex-col h-full">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                      <Mic size={40} className="text-purple-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    Стандарт
                  </div>
                  <div className="text-purple-500 text-sm mb-2">
                    до 30 человек
                  </div>
                  <div className="text-4xl font-bold text-purple-900 mb-4">
                    от 50 000 ₽
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent my-4" />
                  <div className="space-y-2 text-left mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-500 flex-shrink-0"
                      />{" "}
                      Живой звук
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-500 flex-shrink-0"
                      />{" "}
                      Базовый звук + свет
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-500 flex-shrink-0"
                      />{" "}
                      1 перерыв
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-500 flex-shrink-0"
                      />{" "}
                      Длительность: до 3 часов
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-purple-100 hover:bg-purple-500 text-purple-600 hover:text-white font-medium transition-all border border-purple-200 hover:border-purple-500 cursor-pointer mt-auto">
                    Выбрать тариф
                  </button>
                </div>
              </Link>

              {/* РАСШИРЕННЫЙ - от 30 до 250 человек (ХИТ) - светлая версия */}
              <Link
                className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-center transition-all duration-500 group cursor-pointer hover:-translate-y-3 shadow-xl shadow-purple-300 flex flex-col"
                to="/order"
              >
                <div className="relative flex flex-col h-full">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="p-3 rounded-full bg-white/20">
                      <PartyPopper size={40} className="text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    Расширенный
                  </div>
                  <div className="text-purple-200 text-sm mb-2 font-medium">
                    30-250 человек
                  </div>
                  <div className="text-4xl font-bold text-white mb-4">
                    от 120 000 ₽
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-4" />
                  <div className="space-y-2 text-left mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-purple-100 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-200 flex-shrink-0"
                      />{" "}
                      Проф. звук + свет
                    </div>
                    <div className="flex items-center gap-2 text-purple-100 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-200 flex-shrink-0"
                      />{" "}
                      Сет-лист на выбор
                    </div>
                    <div className="flex items-center gap-2 text-purple-100 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-200 flex-shrink-0"
                      />{" "}
                      2 перерыва
                    </div>
                    <div className="flex items-center gap-2 text-purple-100 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-purple-200 flex-shrink-0"
                      />{" "}
                      Длительность: до 4 часов
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-white text-purple-600 font-bold transition-all hover:scale-105 shadow-lg shadow-purple-700/30 hover:shadow-purple-700/50 cursor-pointer mt-auto">
                    Выбрать тариф
                  </button>
                </div>
              </Link>
            </div>
          </div>

          {/* БЛОК ОТЗЫВОВ — МОЩНОЕ СОЦДОКАЗАТЕЛЬСТВО */}
          <div className="container mx-auto px-4 py-16 relative">
            {/* Фоновый акцент */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100/40 via-transparent to-purple-100/40 rounded-3xl -z-10" />

            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-purple-900">
                Нам доверяют{" "}
                <span className="text-purple-500">самые важные</span> события
              </h2>
              <p className="text-gray-500 text-lg mt-2 max-w-2xl mx-auto">
                98% клиентов рекомендуют нас друзьям. Убедитесь сами.
              </p>
            </div>

            {/* ОТЗЫВЫ — КАРТОЧКИ С ЭФФЕКТОМ "ПРИЛИПАНИЯ" */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  name: "Анна Смирнова",
                  event: "Корпоратив • 250 человек",
                  text: "«Группа превратила скучный корпоратив в настоящий фестиваль! Люди не хотели уходить, а директор попросил контакты для следующего года. Это лучшие деньги, потраченные на мероприятие.»",
                  avatar: "https://i.pravatar.cc/100?img=1",
                  video: true,
                  rating: 5,
                  badge: "ТОП-отзыв",
                },
                {
                  name: "Дмитрий & Екатерина",
                  event: "Свадьба • 120 гостей",
                  text: "«Мы хотели, чтобы на свадьбе было душевно и драйвово. Эти ребята попали в точку! Гости танцевали даже во время ужина. Спасибо за идеальный вечер!»",
                  avatar: "https://i.pravatar.cc/100?img=3",
                  video: false,
                  rating: 5,
                  badge: "Лучшая свадьба",
                },
                {
                  name: "Ольга Мельник",
                  event: "День рождения • 50 человек",
                  text: "«Я сомневалась, стоит ли брать живую музыку. Теперь скажу — ОБЯЗАТЕЛЬНО! Гости до сих пор вспоминают, как пели вместе с солистом. Эмоции — это главное.»",
                  avatar: "https://i.pravatar.cc/100?img=5",
                  video: false,
                  rating: 5,
                  badge: "Эмоциональный отзыв",
                },
              ].map((review, i) => (
                <div
                  key={i}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-200/50 shadow-lg hover:shadow-2xl hover:shadow-purple-300/40 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] relative cursor-default"
                >
                  {/* Бейдж */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-lg shadow-purple-400/50">
                    {review.badge}
                  </div>

                  {/* Рейтинг + иконка видео */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, s) => (
                        <Star
                          key={s}
                          size={18}
                          fill="#a855f7"
                          className="text-purple-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Текст отзыва — с кавычками и курсивом */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                    {review.text}
                  </p>

                  {/* Автор */}
                  <div className="flex items-center gap-3 border-t border-purple-100 pt-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full border-2 border-purple-300 object-cover"
                    />
                    <div>
                      <div className="text-purple-900 font-bold text-sm">
                        {review.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {review.event}
                      </div>
                    </div>
                  </div>

                  {/* Анимация "пульса" при наведении */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
          <Footer />
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
