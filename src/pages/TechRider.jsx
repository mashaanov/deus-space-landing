import Layout from "../components/Layout";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { techRiderData } from "../data/techRiderData";
import Footer from "../components/Footer";
import TechRiderCard from "../components/TechRiderCard";
import {
  ChevronRight,
  Mic,
  Volume2,
  Monitor,
  Lightbulb,
  Sparkles,
  Menu,
  X,
  Send,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TechRider = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("equipment");
  const [isScrolling, setIsScrolling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const scrollTimeout = useRef(null);

  // Иконки для секций
  const sectionIcons = {
    equipment: Mic,
    sound: Volume2,
    light: Lightbulb,
    video: Monitor,
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY + 150;
      let currentActive = "equipment";

      for (let i = techRiderData.length - 1; i >= 0; i--) {
        const section = document.getElementById(techRiderData[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          currentActive = techRiderData[i].id;
          break;
        }
      }

      setActiveSection((prev) =>
        prev === currentActive ? prev : currentActive,
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling]);

  const scrollToSection = (id) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    setIsScrolling(true);
    setActiveSection(id);
    setMobileMenuOpen(false);

    const element = document.getElementById(id);

    setTimeout(() => {
      element?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (showContactModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showContactModal]);

  return (
    <>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100">
          {/* Мобильная навигация — улучшенный дровер */}
          <div className="sticky top-[72px] md:top-20 z-40 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full bg-white/90 backdrop-blur-xl border-b border-purple-200 py-3 px-4 flex items-center justify-between active:bg-white/95 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                {sectionIcons[activeSection] &&
                  React.createElement(sectionIcons[activeSection], {
                    size: 18,
                    className: "text-purple-500",
                  })}
                <span className="text-sm font-semibold text-purple-800">
                  {techRiderData.find((s) => s.id === activeSection)?.label ||
                    "Разделы"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-purple-400/70 font-medium hidden xs:block">
                  {mobileMenuOpen ? "Закрыть" : "Меню"}
                </span>
                {mobileMenuOpen ? (
                  <X size={20} className="text-purple-500" />
                ) : (
                  <Menu size={20} className="text-purple-500" />
                )}
              </div>
            </button>

            <AnimatePresence mode="wait">
              {mobileMenuOpen && (
                <>
                  {/* Оверлей */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setMobileMenuOpen(false)}
                    onTouchEnd={() => setMobileMenuOpen(false)}
                  />

                  {/* Меню */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-purple-200 shadow-xl z-50 rounded-b-2xl overflow-hidden max-h-[70vh] overflow-y-auto"
                  >
                    <div className="py-1">
                      {techRiderData.map((item, index) => {
                        const Icon = sectionIcons[item.id] || Sparkles;
                        const isActive = activeSection === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => {
                              scrollToSection(item.id);
                              if (navigator.vibrate) navigator.vibrate(10);
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                            whileTap={{ scale: 0.97 }}
                            className={`
                              w-full flex items-center gap-3 px-4 py-3 transition-all duration-200
                              touch-manipulation select-none
                              ${
                                isActive
                                  ? "bg-gradient-to-r from-purple-50 to-transparent text-purple-600 border-l-4 border-purple-500"
                                  : "text-gray-600 hover:bg-purple-50/50 active:bg-purple-100/30"
                              }
                            `}
                          >
                            <Icon
                              size={18}
                              className={
                                isActive ? "text-purple-500" : "text-gray-400"
                              }
                            />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Десктоп навигация */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block sticky top-20 z-40 bg-white/70 backdrop-blur-xl border-b border-purple-200"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-1 p-2">
                {techRiderData.map((item) => {
                  const Icon = sectionIcons[item.id] || Sparkles;
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer
                        ${
                          isActive
                            ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                            : "text-purple-600/70 hover:text-purple-600 hover:bg-purple-100/50"
                        }
                      `}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Основной контент */}
          <div className="container mx-auto px-4 py-8 md:py-10">
            <div className="space-y-8 md:space-y-10">
              {techRiderData.map((item, index) => {
                const Icon = sectionIcons[item.id] || Sparkles;
                return (
                  <TechRiderCard
                    key={item.id}
                    item={item}
                    index={index}
                    Icon={Icon}
                  />
                );
              })}
            </div>
          </div>

         

          {/* Модальное окно контактов */}
          <AnimatePresence>
            {showContactModal && (
              <>
                {/* Оверлей */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
                  onClick={() => setShowContactModal(false)}
                >
                  {/* Модальное окно */}
                  <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Кнопка закрытия */}
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="cursor-pointer absolute top-4 right-4 p-2 hover:bg-purple-100 rounded-xl transition-colors duration-200"
                    >
                      <X size={24} className="text-purple-500" />
                    </button>

                    {/* Заголовок */}
                    <div className="mb-6">
                     
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Связаться с нами
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Выберите удобный способ связи
                      </p>
                    </div>

                    {/* Контактные карточки */}
                    <div className="space-y-3 mb-6">
                      {/* Телефон */}
                      <motion.a
                        href="tel:+79603722777"
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-white rounded-2xl border border-purple-200/50 hover:border-purple-300 transition-all group"
                      >
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform">
                          <Phone size={20} className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-purple-400 font-medium">
                            Телефон
                          </p>
                          <p className="text-gray-800 font-semibold">
                            8 800 555-35-35
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </motion.a>

                      {/* Email */}
                      <motion.a
                        href="mailto:deus.space.orders@gmail.com"
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-white rounded-2xl border border-purple-200/50 hover:border-purple-300 transition-all group"
                      >
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform">
                          <Mail size={20} className="text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-purple-400 font-medium">
                            Email
                          </p>
                          <p className="text-gray-800 font-semibold truncate">
                            deus.space.orders@gmail.com
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </motion.a>

                      {/* Локация */}
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-white rounded-2xl border border-purple-200/50"
                      >
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                          <MapPin size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-purple-400 font-medium">
                            Мы здесь
                          </p>
                          <p className="text-gray-800 font-semibold">
                            Ульяновск
                          </p>
                          <p className="text-gray-400 text-xs">
                            и соседние города
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Соцсети */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-3">
                        Или напишите в соцсетях
                      </p>
                      <div className="flex gap-3">
                        <motion.a
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          href="#"
                          className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all border border-purple-200/50"
                        >
                          <Instagram size={20} className="text-purple-600" />
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          href="#"
                          className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all border border-purple-200/50"
                        >
                          <Youtube size={20} className="text-purple-600" />
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          href="#"
                          className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all border border-purple-200/50"
                        >
                          <Send size={20} className="text-purple-600" />
                        </motion.a>
                      </div>
                    </div>

                    {/* Кнопка перехода на страницу контактов */}
                    <button
                      onClick={() => {
                        setShowContactModal(false);
                        navigate("/contacts");
                      }}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      Перейти на страницу контактов
                      <ChevronRight size={18} />
                    </button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default TechRider;
