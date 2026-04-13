import Layout from "../components/Layout";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { techRiderData } from "../data/techRiderData";

const TechRider = () => {
  const [activeSection, setActiveSection] = useState("equipment");
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  // Анимации для разных элементов
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  const fadeInSlow = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY + 300;
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
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    setIsScrolling(true);
    setActiveSection(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-[var(--color-deus-black)]"
      >
        {/* Фиксированная навигация (табы) */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
          className="sticky top-20 z-40 bg-[var(--color-deus-black)]/80 backdrop-blur-lg border-b border-[var(--color-purple-500)]/20"
        >
          <div className="container mx-auto px-4">
            <div className="flex gap-1 p-2">
              {techRiderData.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`
                    flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm lg:text-base cursor-pointer
                    ${
                      activeSection === item.id
                        ? "bg-[var(--color-purple-600)] text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                        : "text-[var(--color-deus-white)]/70 hover:text-[var(--color-purple-400)] hover:bg-[var(--color-purple-500)]/10"
                    }
                  `}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Контент */}
        <div className="container mx-auto px-4 py-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-16 lg:space-y-20"
          >
            {techRiderData.map((item, index) => (
              <motion.section
                key={item.id}
                id={item.id}
                variants={fadeInSlow}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-[120px]"
              >
                {/* РАСТЯНУТЫЙ ДИВ НА ВЕСЬ SECTION */}
                <div className="w-full min-h-[550px] lg:min-h-[600px] p-6 lg:p-8">
                  <div
                    className={`
                      grid md:grid-cols-2 gap-8 lg:gap-12 items-start h-full
                      ${index % 2 === 1 ? "md:grid-flow-col-dense" : ""}
                    `}
                  >
                    {/* Изображение */}
                    <div
                      className={`
                        relative overflow-hidden rounded-xl group
                        h-[280px] md:h-full w-full
                        ${index % 2 === 1 ? "md:col-start-2" : ""}
                      `}
                    >
                      {/* Градиент при ховере */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-gradient-to-r from-[var(--color-purple-600)]/20 to-transparent z-10 rounded-xl pointer-events-none"
                      />

                      {/* Сама картинка */}
                      <motion.img
                        src={item.image}
                        alt={item.title}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover rounded-xl"
                        style={{ transformOrigin: "center center" }}
                      />

                      {/* Иконка на изображении */}
                      <motion.div
                        initial={{ opacity: 0, rotate: -5, scale: 0.8 }}
                        whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2,
                        }}
                        className="absolute top-4 left-4 text-4xl lg:text-5xl filter drop-shadow-2xl z-20 pointer-events-none"
                      ></motion.div>

                      {/* Градиентная обводка при ховере */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 rounded-xl border-2 border-[var(--color-purple-400)]/30 z-20 pointer-events-none"
                      />
                    </div>

                    {/* Контент */}
                    {/* Контент - теперь в карточке */}
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 1 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={`
    flex flex-col justify-center h-full
    ${index % 2 === 1 ? "md:col-start-1" : ""}
  `}
                    >
                      {/* Карточка с контентом */}
                      <motion.div
                        whileHover={{ y: -5 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="bg-[var(--color-purple-900)]/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-[var(--color-purple-500)]/20 hover:border-[var(--color-purple-400)]/40 transition-all duration-300"
                      >
                        <div className="space-y-4 lg:space-y-5">
                          <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[var(--color-purple-400)] to-[var(--color-purple-600)] bg-clip-text text-transparent"
                          >
                            {item.title}
                          </motion.h2>

                          <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                            className="text-sm lg:text-base text-[var(--color-deus-white)]/80 leading-relaxed"
                          >
                            {item.description}
                          </motion.p>

                          <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="space-y-2 pt-2"
                          >
                            <motion.h3
                              variants={fadeInUp}
                              className="text-base lg:text-lg font-semibold text-white flex items-center gap-2"
                            >
                              <motion.span
                                animate={{ height: [18, 22, 18] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.5,
                                  ease: "easeInOut",
                                }}
                                className="w-1 h-4 bg-[var(--color-purple-400)] rounded-full"
                              />
                              В комплекте:
                            </motion.h3>
                            <motion.ul className="space-y-1.5">
                              {item.content.list
                                .slice(0, 4)
                                .map((listItem, i) => (
                                  <motion.li
                                    key={i}
                                    variants={fadeInUp}
                                    whileHover={{ x: 3 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                    }}
                                    className="flex items-start gap-2 group/item"
                                  >
                                    <motion.span
                                      whileHover={{ scale: 1.2 }}
                                      className="text-[var(--color-purple-400)] mt-0.5 text-sm"
                                    >
                                      •
                                    </motion.span>
                                    <span className="text-xs lg:text-sm text-[var(--color-deus-white)]/80 group-hover/item:text-white transition-colors duration-200">
                                      {listItem}
                                    </span>
                                  </motion.li>
                                ))}
                            </motion.ul>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Декоративный разделитель */}
                {index < techRiderData.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-12 lg:mt-16 flex justify-center px-6 lg:px-8"
                  >
                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-[var(--color-purple-500)]/30 to-transparent" />
                  </motion.div>
                )}
              </motion.section>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default TechRider;
