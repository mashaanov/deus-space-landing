import React from "react";
import {
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

const Footer = () => {
  return (
    <footer className="border-t border-purple-200 bg-gradient-to-b from-white via-purple-50/50 to-purple-100/30">
      <div className="container mx-auto px-4 py-8">
        {/* Два блока: слева — инфо, справа — контакты */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          {/* Левый блок — О компании */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
                ДЕУС СПЭЙС
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-md">
              Профессиональное музыкальное агентство с 2015 года. Живой звук для
              мероприятий любого формата.
            </p>
          </div>

          {/* Правый блок — Контакты */}
          <div className="text-center md:text-right">
            <div className="space-y-1">
              <a
                href="tel:+78001234567"
                className="flex items-center justify-center md:justify-end gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
              >
                <Phone
                  size={14}
                  className="text-purple-400 group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold text-sm">
                  +7 (800) 123-45-67
                </span>
              </a>
              <a
                href="mailto:info@deus-space.ru"
                className="flex items-center justify-center md:justify-end gap-2 text-gray-500 hover:text-purple-600 transition-colors text-xs"
              >
                <Mail size={12} className="text-purple-400" />
                info@deus-space.ru
              </a>
              <div className="flex items-center justify-center md:justify-end gap-2 text-gray-500 text-xs">
                <Clock size={12} className="text-purple-400" />
                Ежедневно: 10:00 - 22:00
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть — копирайт и ссылки */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-4 border-t border-purple-200">
          <div className="text-gray-400 text-xs">
            © 2026 ДЕУС СПЭЙС — Музыкальное агентство. Все права защищены.
          </div>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-purple-500 text-xs transition-colors"
            >
              Политика
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-purple-500 text-xs transition-colors"
            >
              Оферта
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-purple-500 text-xs transition-colors"
            >
              Реквизиты
            </a>
          </div>
        </div>
      </div>

      {/* Кнопка наверх */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <ChevronRight size={18} className="rotate-[-90deg]" />
      </button>
    </footer>
  );
};

export default Footer;
