import { useContent, safeUrl } from "../../content";
import { videoSource } from "../../media-utils";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Calendar,
  Users,
  Music,
  Play,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Youtube,
  Mic2,
  Sparkles,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";

import cn from "classnames";
import { Link } from "react-router-dom";

const GroupModal = ({ group, isOpen, onClose }) => {
  const {groupLabels: labels} = useContent();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [animationState, setAnimationState] = useState("closed");

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => {
        setShouldRender(true);
        setCurrentPhotoIndex(0);
        setIsVideoPlaying(false);
        setAnimationState("open");
      });
      return () => cancelAnimationFrame(frame);
    } else {
      const frame = requestAnimationFrame(() => setAnimationState("closed"));
      const timer = setTimeout(() => setShouldRender(false), 400);
      return () => {cancelAnimationFrame(frame); clearTimeout(timer);};
    }
  }, [isOpen]);

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

  if (!group || !shouldRender) return null;

  const photos = group.photos?.length ? group.photos : [group.image];
  const video = videoSource(group.videoUrl);
  const videoUrl = video?.url;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };


  const handleWatchVideo = () => {
    setIsVideoPlaying(true);
  };

  const modalContent = (
    <>
      {/* Оверлей */}
      <div
        className={`fixed inset-0 z-[9998] transition-opacity duration-300 ${
          animationState === "open" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(6px)",
          visibility: animationState === "open" ? "visible" : "hidden",
        }}
        onClick={onClose}
      />

      {/* Модальное окно — компактное */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl max-h-[85vh] overflow-y-auto z-[9999] transition-all duration-300 ${
          animationState === "open"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
        style={{
          visibility: animationState === "open" ? "visible" : "hidden",
        }}
      >
        <div className="bg-[#1a1a2e] rounded-2xl shadow-2xl shadow-purple-900/30 overflow-hidden">
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-3 right-3 z-30 w-10 h-10 bg-black/50 hover:bg-purple-600/80 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 group"
          >
            <X size={18} className="text-gray-300 group-hover:text-white" />
          </button>

          {/* Галерея — компактная */}
          <div className="relative h-[320px] md:h-[380px] group/gallery overflow-hidden">
            <img
              src={safeUrl(photos[currentPhotoIndex % photos.length])}
              alt={group.name}
              className="w-full h-full object-cover"
            />

            {/* Градиент */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/50 to-transparent" />

            {/* Кнопки навигации */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-purple-600/70 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 opacity-0 group-hover/gallery:opacity-100"
                >
                  <ChevronLeft size={18} className="text-white/80" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-purple-600/70 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 opacity-0 group-hover/gallery:opacity-100"
                >
                  <ChevronRight size={18} className="text-white/80" />
                </button>
              </>
            )}

            {/* Информация на галерее */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-600/90 backdrop-blur-md rounded-full text-white">
                  {group.genre}
                </span>
                <div className="flex items-center gap-0.5">
                  <Star size={10} fill="#fbbf24" className="text-amber-400" />
                  <span className="text-xs text-white/80">{group.rating}</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                {group.name}
              </h2>
              <p className="text-white/60 text-sm max-w-md">
                {group.tagline}
              </p>
            </div>
          </div>

          {/* Контент — компактный */}
          <div className="p-5 md:p-6 space-y-5">
            {/* Статистика — компактная */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  icon: Users,
                  label: labels.members,
                  value: group.members,
                },
                {
                  icon: Calendar,
                  label: labels.concerts,
                  value: `${group.concerts}+`,
                },
                {
                  icon: Clock,
                  label: labels.duration,
                  value: group.duration,
                },
                {
                  icon: Music,
                  label: labels.experience,
                  value: group.experience,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-xl"
                >
                  <stat.icon size={16} className="text-purple-400" />
                  <div>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] text-white/40 uppercase">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Преимущества — компактные */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(
                group.benefits || []
              ).map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-white/5 hover:bg-purple-500/10 rounded-lg transition-all duration-300"
                >
                  <CheckCircle2
                    size={14}
                    className="text-purple-500 flex-shrink-0"
                  />
                  <span className="text-xs text-white/70">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Видео — компактное */}
            {videoUrl && <div>
              <div className="flex items-center gap-2 mb-2">
                <Play size={14} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  {labels.video}
                </h3>
              </div>

              {video.type === 'file' || isVideoPlaying ? (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  {video.type === 'file' ? <video src={videoUrl} controls preload="metadata" playsInline className="w-full h-full" /> : <iframe
                    src={`${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1`}
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    title={labels.video}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />}
                </div>
              ) : (
                <div
                  onClick={handleWatchVideo}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group/video"
                >
                  <img
                    src={safeUrl(group.videoThumbnail || group.image)}
                    alt={labels.video}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/video:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover/video:scale-110">
                      <Play size={20} className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </div>}

            {/* Описание — компактное */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {labels.about}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
                {group.fullDescription || group.description}
              </p>
            </div>

            {/* {labels.repertoire} — компактный */}
            {group.repertoire && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {labels.repertoire}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.repertoire.map((song, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-[10px] bg-white/5 hover:bg-purple-500/20 rounded-full text-white/70 transition-all duration-300"
                    >
                      {song}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Социальные сети и кнопка в один ряд */}
            <div className="flex items-center gap-2 flex-wrap">
              {group.instagram && (
                <a
                  href={safeUrl(group.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-purple-600 rounded-full text-white/60 hover:text-white text-xs transition-all duration-300"
                >
                  <Instagram size={12} />
                  {labels.instagram}
                </a>
              )}
              {group.youtube && (
                <a
                  href={safeUrl(group.youtube)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-purple-600 rounded-full text-white/60 hover:text-white text-xs transition-all duration-300"
                >
                  <Youtube size={12} />
                  {labels.youtube}
                </a>
              )}
            </div>

            {/* Кнопка заказа — компактная */}

            <Link
              to={safeUrl(labels.orderPath)}
              state={{ selectedGroup: group.slug || group.id }}
              onClick={onClose}
              className={cn(
                "group relative",
                "overflow-hidden",
                "w-full block md:w-80 md:mx-auto",
                "px-7 py-3",
                "rounded-2xl",
                "bg-gradient-to-r from-purple-600 to-purple-700",
                "hover:from-purple-500 hover:to-purple-600",
                "text-white font-semibold text-sm",
                "shadow-xl shadow-purple-600/30",
                "hover:scale-105 hover:-translate-y-0.5",
                "transition-all duration-300",
                "mb-4",
                "text-center",
              )}
            >
              {/* Блик */}
              <div
                className={cn(
                  "absolute inset-0",
                  "bg-white/20",
                  "-translate-x-full skew-x-12",
                  "group-hover:translate-x-full",
                  "transition-transform duration-700",
                )}
              />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {labels.order}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default GroupModal;
