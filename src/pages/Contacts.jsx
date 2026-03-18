import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Music, Instagram, Youtube, Send, ChevronRight } from "lucide-react";
import Layout from "../components/Layout";
import Form from "../components/Form";

const Contacts = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[var(--color-deus-black)]">
        {/* Декоративный фон */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-purple-500)]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-purple-700)]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-3">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-xl text-[var(--color-deus-white)]/60 max-w-2xl mx-auto">
              Мы будем рады любому формату сотрудничества с вами. 
              Просто свяжитесь с нами любым удобным способом, и мы обсудим вашу задачу.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Левая колонка - контактная информация */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Контактные карточки */}
              <div className="grid gap-6">
                {/* Телефон */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-[var(--color-deus-gray-dark)]/50 backdrop-blur-sm border border-[var(--color-purple-500)]/20 rounded-2xl p-6 hover:border-[var(--color-purple-400)]/40 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-purple-500)]/0 to-[var(--color-purple-500)]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-4">
                    <div className="p-3 bg-[var(--color-purple-500)]/10 rounded-xl group-hover:bg-[var(--color-purple-500)]/20 transition-colors">
                      <Phone size={24} className="text-[var(--color-purple-400)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-purple-400)] mb-1">ТЕЛЕФОН</p>
                      <a 
                        href="tel:+79603722777" 
                        className="text-2xl font-bold text-white hover:text-[var(--color-purple-400)] transition-colors"
                      >
                        8 800 555-35-35
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-[var(--color-deus-gray-dark)]/50 backdrop-blur-sm border border-[var(--color-purple-500)]/20 rounded-2xl p-6 hover:border-[var(--color-purple-400)]/40 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-purple-500)]/0 to-[var(--color-purple-500)]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-4">
                    <div className="p-3 bg-[var(--color-purple-500)]/10 rounded-xl group-hover:bg-[var(--color-purple-500)]/20 transition-colors">
                      <Mail size={24} className="text-[var(--color-purple-400)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-purple-400)] mb-1">E-MAIL</p>
                      <a 
                        href="mailto:manager@golovko.group" 
                        className="text-2xl font-bold text-white hover:text-[var(--color-purple-400)] transition-colors"
                      >
                        text_meeeee.group
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Локация */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-[var(--color-deus-gray-dark)]/50 backdrop-blur-sm border border-[var(--color-purple-500)]/20 rounded-2xl p-6 hover:border-[var(--color-purple-400)]/40 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-purple-500)]/0 to-[var(--color-purple-500)]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-4">
                    <div className="p-3 bg-[var(--color-purple-500)]/10 rounded-xl group-hover:bg-[var(--color-purple-500)]/20 transition-colors">
                      <MapPin size={24} className="text-[var(--color-purple-400)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-purple-400)] mb-1">МЫ ЗДЕСЬ</p>
                      <p className="text-xl text-white">
                        Находимся в Ульяновске, <br />
                        <span className="text-[var(--color-deus-white)]/60">
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
                className="pt-8"
              >
                <p className="text-lg font-medium text-white mb-4">
                  Подписывайтесь на наши соцсети!
                </p>
                <div className="flex gap-4">
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    href="#"
                    className="p-4 bg-[var(--color-deus-gray-dark)] border border-[var(--color-purple-500)]/20 rounded-xl hover:border-[var(--color-purple-400)] hover:bg-[var(--color-purple-500)]/5 transition-all group"
                  >
                    <Instagram size={24} className="text-[var(--color-purple-400)] group-hover:scale-110 transition-transform" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    href="#"
                    className="p-4 bg-[var(--color-deus-gray-dark)] border border-[var(--color-purple-500)]/20 rounded-xl hover:border-[var(--color-purple-400)] hover:bg-[var(--color-purple-500)]/5 transition-all group"
                  >
                    <Youtube size={24} className="text-[var(--color-purple-400)] group-hover:scale-110 transition-transform" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    href="#"
                    className="p-4 bg-[var(--color-deus-gray-dark)] border border-[var(--color-purple-500)]/20 rounded-xl hover:border-[var(--color-purple-400)] hover:bg-[var(--color-purple-500)]/5 transition-all group"
                  >
                    <Send size={24} className="text-[var(--color-purple-400)] group-hover:scale-110 transition-transform" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Разделитель */}
              <div className="hidden lg:block relative py-8">
                <div className="absolute left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[var(--color-purple-500)]/30 to-transparent" />
              </div>
            </motion.div>

            {/* Правая колонка - форма */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--color-deus-gray-dark)]/30 backdrop-blur-sm border border-[var(--color-purple-500)]/20 rounded-3xl p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Оставить заявку
                </h2>
                <p className="text-[var(--color-deus-white)]/60">
                  Заполните форму, и мы свяжемся с вами в ближайшее время
                </p>
              </div>
              <Form />
            </motion.div>
          </div>

          {/* Декоративная музыкальная нота */}
          <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 0.1, rotate: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 right-10 text-[var(--color-purple-500)]/20"
          >
            <Music size={200} />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Contacts;