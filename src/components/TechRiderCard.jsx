import React from "react";
import { motion } from "framer-motion";

// Анимации
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const TechRiderCard = ({ item, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.section
      id={item.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-[120px]"
    >
      <div className="w-full p-4 lg:p-6">
        <div
          className={`
            grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch
            ${isEven ? "" : "md:grid-flow-col-dense"}
          `}
        >
          {/* Изображение */}
          <div
            className={`
              relative overflow-hidden rounded-xl group
              h-[260px] md:h-auto min-h-[300px] w-full
              ${isEven ? "" : "md:col-start-2"}
            `}
          >
            <motion.img
              src={item.image}
              alt={item.title}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
            />
            
            {/* Затемнение */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Обводка при ховере */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-xl border-2 border-[var(--color-purple-400)]/50 z-10 pointer-events-none"
            />
          </div>

          {/* Контент */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-center h-full"
          >
            {/* Карточка с контентом */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              class="bg-[var(--color-purple-500)] backdrop-blur-sm rounded-xl p-5 lg:p-7 border border-[var(--color-purple-500)]/30 hover:border-[var(--color-purple-400)]/60 transition-all duration-300 shadow-lg shadow-purple-500/5">
              <div className="space-y-3 lg:space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-xl lg:text-2xl font-bold text-white"
                >
                  {item.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-sm text-[var(--color-deus-white)]/70 leading-relaxed"
                >
                  {item.description}
                </motion.p>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="pt-1"
                >
                  <motion.h3
                    variants={fadeInUp}
                    className="text-sm font-semibold text-[var(--color-purple-300)] flex items-center gap-2 mb-2"
                  >
                    <span className="w-1 h-4 bg-[var(--color-purple-400)] rounded-full" />
                    В комплекте:
                  </motion.h3>
                  
                  <motion.ul className="grid grid-cols-1 gap-1.5">
                    {item.content.list.slice(0, 4).map((listItem, i) => (
                      <motion.li
                        key={i}
                        variants={fadeInUp}
                        whileHover={{ x: 4 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                        }}
                        className="flex items-center gap-2 group"
                      >
                        <span className="text-[var(--color-purple-400)] text-sm font-bold">◆</span>
                        <span className="text-sm text-[var(--color-deus-white)]/80 group-hover:text-white transition-colors duration-200">
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
      {index < item.length - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--color-purple-500)]/40 to-transparent" />
        </motion.div>
      )}
    </motion.section>
  );
};

export default TechRiderCard;