import React, { useState, useEffect } from "react";
import { Music, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Функция для определения активной ссылки
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`
    fixed w-full z-50 top-0 transition-all duration-500 
    ${
      scrolled
        ? "bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-[var(--color-purple-400)]/30 shadow-lg shadow-[var(--color-purple-500)]/10"
        : "bg-white/5 backdrop-blur-xl border-b border-white/10"
    }
    py-4
  `}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="group flex items-center gap-3 text-3xl font-extrabold tracking-tight"
          >
            <div className="relative w-12 h-12">
              {/* Линейки нотного стана */}
              <div className="absolute inset-x-0 top-2 h-0.5 bg-[var(--color-purple-500)]/30 group-hover:bg-[var(--color-purple-500)]/50 transition-colors"></div>
              <div className="absolute inset-x-0 top-4 h-0.5 bg-[var(--color-purple-500)]/30 group-hover:bg-[var(--color-purple-500)]/50 transition-colors"></div>
              <div className="absolute inset-x-0 top-6 h-0.5 bg-[var(--color-purple-500)]/30 group-hover:bg-[var(--color-purple-500)]/50 transition-colors"></div>
              <div className="absolute inset-x-0 top-8 h-0.5 bg-[var(--color-purple-500)]/30 group-hover:bg-[var(--color-purple-500)]/50 transition-colors"></div>
              <div className="absolute inset-x-0 top-10 h-0.5 bg-[var(--color-purple-500)]/30 group-hover:bg-[var(--color-purple-500)]/50 transition-colors"></div>

              {/* Ноты на линейках */}
              <Music
                className="absolute left-1 top-1 w-3 h-3 text-[var(--color-purple-400)] animate-bounce"
                style={{ animationDelay: "0s", animationDuration: "1.5s" }}
              />
              <Music
                className="absolute left-4 top-3 w-4 h-4 text-[var(--color-purple-500)] animate-bounce"
                style={{ animationDelay: "0.3s", animationDuration: "1.8s" }}
              />
              <Music
                className="absolute left-7 top-5 w-3 h-3 text-[var(--color-purple-400)] animate-bounce"
                style={{ animationDelay: "0.6s", animationDuration: "1.3s" }}
              />
              <Music
                className="absolute left-2 top-7 w-4 h-4 text-[var(--color-purple-500)] animate-bounce"
                style={{ animationDelay: "0.9s", animationDuration: "1.6s" }}
              />
            </div>
            <span className="bg-gradient-to-r from-[var(--color-purple-400)] to-[var(--color-purple-600)] bg-clip-text text-transparent">
              ДЕУС СПЭЙС
            </span>
          </Link>

          {/* ДЕСКТОП — большая версия */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {/* Навигация */}
            <div className="flex items-center gap-6 lg:gap-8">
              {[
                { path: "/", label: "Главная" },
                { path: "/tech-rider", label: "Команда и оборудование" },
                { path: "/order", label: "Контакты" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative text-lg font-medium transition-colors
                    ${
                      isActive(item.path)
                        ? "text-[var(--color-purple-400)]"
                        : "text-[var(--color-deus-white)]/80 hover:text-[var(--color-purple-400)]"
                    }
                    after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 
                    after:bg-gradient-to-r after:from-[var(--color-purple-400)] after:to-[var(--color-purple-600)]
                    after:scale-x-0 after:origin-left after:transition-transform after:duration-300
                    hover:after:scale-x-100
                    ${isActive(item.path) ? "after:scale-x-100" : ""}
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* КНОПКА — с эффектами */}
            <Link
              to="/order"
              className="group relative bg-gradient-to-r from-[var(--color-purple-600)] to-[var(--color-purple-700)] text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.8)] hover:-translate-y-0.5 font-semibold text-base flex items-center gap-2 overflow-hidden"
            >
              {/* Эффект свечения при ховере */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Заказать</span>
              <span className="relative group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {/* Мобильная кнопка */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-[var(--color-purple-400)] hover:text-[var(--color-purple-300)] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Меню"
          >
            <div className="absolute inset-0 bg-[var(--color-purple-500)]/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity" />
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Мобильное меню */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-500 ease-in-out
            ${isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col space-y-3 pt-4 border-t border-[var(--color-purple-500)]/20">
            {[
              { path: "/", label: "Главная" },
              { path: "/tech-rider", label: "Команда и оборудование" },
              { path: "/order", label: "Контакты" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  py-2 px-3 rounded-lg transition-all duration-300
                  ${
                    isActive(item.path)
                      ? "bg-[var(--color-purple-500)]/10 text-[var(--color-purple-400)] font-medium"
                      : "text-[var(--color-deus-white)]/80 hover:bg-[var(--color-purple-500)]/5 hover:text-[var(--color-purple-400)] hover:translate-x-2"
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/order"
              className="bg-gradient-to-r from-[var(--color-purple-600)] to-[var(--color-purple-700)] text-center px-4 py-3 rounded-lg hover:from-[var(--color-purple-700)] hover:to-[var(--color-purple-800)] transition-all duration-300 transform hover:scale-105 font-medium mt-2"
              onClick={() => setIsOpen(false)}
            >
              Заказать выступление
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
