import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Music,
  Instagram,
  Youtube,
  Send,
} from "lucide-react";
import Layout from "../components/Layout";
import { useLocation } from "react-router-dom";
import Form from "../components/Form";
import Footer from "../components/Footer";

const Contacts = () => {
  const location = useLocation();
  return (
    <>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 relative">
          {/* Декоративный фон - мягкие фиолетовые оттенки */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4C4E8]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#E8D5F5]/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C4B5D4]/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Заголовок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-purple-600">
                Свяжитесь с нами
              </h1>
              <p className="text-base sm:text-lg text-[#6B5B7B]/80 max-w-2xl mx-auto px-4">
                Мы будем рады любому формату сотрудничества с вами. Просто
                свяжитесь с нами любым удобным способом, и мы обсудим вашу
                задачу.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              {/* Левая колонка - контактная информация */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Контактные карточки */}
                <div className="grid gap-4 md:gap-6">
                  {/* Телефон */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-white/90 backdrop-blur-sm border-2 border-[#D4C4E8]/60 rounded-2xl p-5 md:p-6 hover:border-[#9B7DB5] hover:bg-white transition-all shadow-md hover:shadow-[0_8px_30px_rgba(155,125,181,0.2)]"
                  >
                    <div className="relative flex items-start gap-4">
                      <div className="p-2.5 md:p-3 bg-gradient-to-br from-[#E8D5F5] to-[#D4C4E8] rounded-xl">
                        <Phone size={22} className="text-[#7B5EA7]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-[#7B5EA7] mb-1 tracking-wider">
                          ТЕЛЕФОН
                        </p>
                        <a
                          href="tel:+79603722777"
                          className="text-lg md:text-2xl font-bold text-[#2D1B3D] hover:text-[#7B5EA7] transition-colors break-all"
                        >
                          8 800 555-35-35
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-white/90 backdrop-blur-sm border-2 border-[#D4C4E8]/60 rounded-2xl p-5 md:p-6 hover:border-[#9B7DB5] hover:bg-white transition-all shadow-md hover:shadow-[0_8px_30px_rgba(155,125,181,0.2)]"
                  >
                    <div className="relative flex items-start gap-4">
                      <div className="p-2.5 md:p-3 bg-gradient-to-br from-[#E8D5F5] to-[#D4C4E8] rounded-xl">
                        <Mail size={22} className="text-[#7B5EA7]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-[#7B5EA7] mb-1 tracking-wider">
                          E-MAIL
                        </p>
                        <a
                          href="mailto:deus.space.orders@gmail.com"
                          className="text-base md:text-2xl font-bold text-[#2D1B3D] hover:text-[#7B5EA7] transition-colors break-all"
                        >
                          deus.space.orders@gmail.com
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  {/* Локация */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-white/90 backdrop-blur-sm border-2 border-[#D4C4E8]/60 rounded-2xl p-5 md:p-6 hover:border-[#9B7DB5] hover:bg-white transition-all shadow-md hover:shadow-[0_8px_30px_rgba(155,125,181,0.2)]"
                  >
                    <div className="relative flex items-start gap-4">
                      <div className="p-2.5 md:p-3 bg-gradient-to-br from-[#E8D5F5] to-[#D4C4E8] rounded-xl">
                        <MapPin size={22} className="text-[#7B5EA7]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-[#7B5EA7] mb-1 tracking-wider">
                          МЫ ЗДЕСЬ
                        </p>
                        <p className="text-base md:text-xl text-[#2D1B3D]">
                          Находимся в Ульяновске, <br />
                          <span className="text-[#6B5B7B]/70 text-sm md:text-base">
                            но с удовольствием приедем в соседние города
                          </span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Социальные сети */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 md:pt-8"
                >
                  <p className="text-base md:text-lg font-medium text-[#2D1B3D] mb-4">
                    Подписывайтесь на наши соцсети!
                  </p>
                  <div className="flex gap-3 md:gap-4 flex-wrap">
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className="p-3 md:p-4 bg-white/90 border-2 border-[#D4C4E8]/60 rounded-xl hover:border-[#9B7DB5] hover:bg-white transition-all shadow-md hover:shadow-[0_8px_30px_rgba(155,125,181,0.2)]"
                    >
                      <Instagram
                        size={22}
                        className="text-[#7B5EA7] group-hover:scale-110 transition-transform"
                      />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className="p-3 md:p-4 bg-white/90 border-2 border-[#D4C4E8]/60 rounded-xl hover:border-[#9B7DB5] hover:bg-white transition-all shadow-md hover:shadow-[0_8px_30px_rgba(155,125,181,0.2)]"
                    >
                      <Youtube
                        size={22}
                        className="text-[#7B5EA7] group-hover:scale-110 transition-transform"
                      />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className="p-3 md:p-4 bg-white/90 border-2 border-[#D4C4E8]/60 rounded-xl hover:border-[#9B7DB5] hover:bg-white transition-all shadow-md hover:shadow-[0_8px_30px_rgba(155,125,181,0.2)]"
                    >
                      <Send
                        size={22}
                        className="text-[#7B5EA7] group-hover:scale-110 transition-transform"
                      />
                    </motion.a>
                  </div>
                </motion.div>

                {/* Разделитель */}
                <div className="hidden lg:block relative py-8">
                  <div className="absolute left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#C4B5D4]/40 to-transparent" />
                </div>
              </motion.div>

              {/* Правая колонка - форма */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-600 to-purple-700 border-2 border-[#D4C4E8]/60 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-xl shadow-[#D4C4E8]/20"
              >
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Оставить заявку
                  </h2>
                  <p className="text-[var(--color-deus-white)]/60">
                    Заполните форму, и мы свяжемся с вами в ближайшее время
                  </p>
                </div>

                {/* Обёртка для формы с улучшенной видимостью */}
                <div className="space-y-4">
                  <Form location={location} />
                </div>

                {/* Декоративный элемент формы */}
                <div className="mt-6 pt-6 border-t border-[#D4C4E8]/30">
                  <p className="text-xs text-[#6B5B7B]/50 text-center">
                    ✦ Мы ответим в течение 24 часов ✦
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Декоративная музыкальная нота - скрыта на мобилке */}
            <motion.div
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 0.06, rotate: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="hidden md:block absolute bottom-10 right-10 text-[#B8A3D4]"
            >
              <Music size={160} />
            </motion.div>
          </div>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default Contacts;
