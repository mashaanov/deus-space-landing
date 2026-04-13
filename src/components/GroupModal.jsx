// components/GroupModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Users,
  MapPin,
  Music,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Youtube,
  Mic2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GroupModal = ({ group, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!group) return null;

  // Фотогалерея (если нет в данных, используем основное фото)
  const photos = group.photos || [group.image, group.image, group.image];
  const videoUrl =
    group.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"; // замени на реальный

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleOrder = () => {
    onClose();
    navigate(`/booking/${group.slug}`);
  };

  const handleWatchVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Оверлей */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[var(--color-deus-gray-dark)] to-[var(--color-deus-black)] rounded-2xl shadow-2xl z-50"
          >
            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-all cursor-pointer backdrop-blur-sm"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Фотогалерея */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={photos[currentPhotoIndex]}
                alt={`${group.name} - фото ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-deus-gray-dark)] via-transparent to-transparent" />

              {/* Кнопки навигации галереи */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <ChevronLeft size={24} className="text-white" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <ChevronRight size={24} className="text-white" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentPhotoIndex === idx
                            ? "w-6 bg-[var(--color-purple-500)]"
                            : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Жанр и название */}
              <div className="absolute bottom-0 left-0 p-8">
                <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-[var(--color-purple-600)] text-white mb-3 shadow-lg">
                  {group.genre}
                </span>
                <h2 className="text-5xl font-bold text-white mb-2">
                  {group.name}
                </h2>
                <p className="text-white/80 text-lg max-w-2xl">
                  {group.tagline || "Живая музыка для вашего праздника"}
                </p>
              </div>
            </div>

            {/* Контент */}
            <div className="p-8">
              {/* Статистика — продающие цифры */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-[var(--color-purple-500)]/10 rounded-lg hover:bg-[var(--color-purple-500)]/20 transition-all">
                  <Users size={20} className="text-[var(--color-purple-400)]" />
                  <div>
                    <p className="text-xs text-white/50">Участников</p>
                    <p className="text-lg font-semibold text-white">
                      {group.members}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[var(--color-purple-500)]/10 rounded-lg hover:bg-[var(--color-purple-500)]/20 transition-all">
                  <Calendar
                    size={20}
                    className="text-[var(--color-purple-400)]"
                  />
                  <div>
                    <p className="text-xs text-white/50">Концертов</p>
                    <p className="text-lg font-semibold text-white">
                      {group.concerts}+
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[var(--color-purple-500)]/10 rounded-lg hover:bg-[var(--color-purple-500)]/20 transition-all">
                  <Music size={20} className="text-[var(--color-purple-400)]" />
                  <div>
                    <p className="text-xs text-white/50">Длительность</p>
                    <p className="text-lg font-semibold text-white">
                      {group.duration || "2-3 часа"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[var(--color-purple-500)]/10 rounded-lg hover:bg-[var(--color-purple-500)]/20 transition-all">
                  <Sparkles
                    size={20}
                    className="text-[var(--color-purple-400)]"
                  />
                  <div>
                    <p className="text-xs text-white/50">Опыт</p>
                    <p className="text-lg font-semibold text-white">
                      {group.experience || "5+ лет"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ключевые преимущества */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {group.benefits?.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 bg-white/5 rounded-lg"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-[var(--color-purple-400)] flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-white/80">{benefit}</p>
                  </div>
                )) || (
                  <>
                    <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                      <CheckCircle2
                        size={18}
                        className="text-[var(--color-purple-400)] flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-white/80">
                        Профессиональное оборудование
                      </p>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                      <CheckCircle2
                        size={18}
                        className="text-[var(--color-purple-400)] flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-white/80">
                        Индивидуальный репертуар
                      </p>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                      <CheckCircle2
                        size={18}
                        className="text-[var(--color-purple-400)] flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-white/80">
                        Договор и гарантии
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Видео-блок */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Play size={20} className="text-[var(--color-purple-400)]" />
                  Смотрите как мы играем
                </h3>
                {isVideoPlaying ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={`${videoUrl}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div
                    onClick={handleWatchVideo}
                    className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={group.videoThumbnail || group.image}
                      alt="Видео выступления"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-[var(--color-purple-600)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <Play size={32} className="text-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Описание */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">
                  О группе
                </h3>
                <p className="text-white/70 leading-relaxed text-lg">
                  {group.fullDescription || group.description}
                </p>
              </div>

              {/* Репертуар */}
              {group.repertoire && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Репертуар
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.repertoire.map((song, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-sm bg-[var(--color-purple-500)]/20 text-white/90 rounded-full hover:bg-[var(--color-purple-500)]/30 transition-all cursor-default"
                      >
                        {song}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Состав группы */}
              {group.membersList && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Состав
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {group.membersList.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-700)] flex items-center justify-center">
                          <Mic2 size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {member.name}
                          </p>
                          <p className="text-xs text-white/60">
                            {member.instrument}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Социальные сети и ссылки */}
              <div className="flex gap-4 mb-8">
                {group.instagram && (
                  <a
                    href={group.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                  >
                    <Instagram
                      size={18}
                      className="text-[var(--color-purple-400)]"
                    />
                    <span className="text-sm text-white">Instagram</span>
                  </a>
                )}
                {group.youtube && (
                  <a
                    href={group.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                  >
                    <Youtube
                      size={18}
                      className="text-[var(--color-purple-400)]"
                    />
                    <span className="text-sm text-white">YouTube</span>
                  </a>
                )}
                <button
                  onClick={() => navigate(`/groups/${group.slug}/videos`)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Play size={18} className="text-[var(--color-purple-400)]" />
                  <span className="text-sm text-white">Все видео</span>
                </button>
              </div>

              {/* Кнопка заказа */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrder}
                className="w-full py-5 bg-gradient-to-r from-[var(--color-purple-600)] to-[var(--color-purple-700)] text-white font-bold text-lg rounded-xl hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.5)] transition-all cursor-pointer"
              >
                Забронировать выступление
              </motion.button>
              <p className="text-center text-xs text-white/40 mt-4">
                Бесплатная консультация • Подбор под ваш бюджет • Договор
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GroupModal;
