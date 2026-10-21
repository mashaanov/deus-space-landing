import React, { useState, useEffect } from "react";
import { Music, Menu, X, ChevronRight } from "lucide-react";
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
            ? "bg-white/80 backdrop-blur-xl border-b border-purple-200 shadow-lg shadow-purple-200/30"
            : "bg-white/40 backdrop-blur-xl border-b border-purple-100"
        }
        py-4
      `}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="group flex items-center gap-3">
            <div
              className="
    w-10
    h-10
    rounded-xl

    bg-gradient-to-br
    from-violet-500
    via-purple-500
    to-fuchsia-500

    flex
    items-center
    justify-center

    shadow-lg
    shadow-purple-300/40
    "
            >
              <Music size={18} className="text-white" />
            </div>

            <div className="leading-none">
              <div
                className=" 
                  lg:text-3xl
                  text-2xl
                  font-black

                  bg-gradient-to-r
                  from-violet-600
                  via-purple-500
                  to-fuchsia-500

                  bg-clip-text
                  text-transparent
                "
              >
                ДЕУС СПЭЙС
              </div>

              <div
                className="
      text-[10px]
      uppercase
      tracking-[0.18em]
      text-slate-400
      mt-0.5
      "
              >
                музыкальное агентство
              </div>
            </div>
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
    relative text-lg font-medium transition-colors duration-300
    ${
      isActive(item.path)
        ? "text-purple-600"
        : "text-gray-600 hover:text-purple-500"
    }
  `}
                >
                  {item.label}
                  <span
                    className={`
      absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600
      transition-all duration-300 ease-out
      ${isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"}
    `}
                  />
                </Link>
              ))}
            </div>

            {/* КНОПКА — с эффектами */}
            <Link
              to="/order"
              className="
                group
                relative

                overflow-hidden

                px-7
                py-3

                rounded-2xl

                bg-gradient-to-r
                from-violet-500
                via-purple-500
                to-fuchsia-500

                text-white
                font-semibold

                shadow-xl
                shadow-purple-300/50

                hover:scale-105
                hover:-translate-y-0.5

                transition-all
                duration-300
              "
            >
              {/* Блик */}
              <div
                className="
                  absolute
                  inset-0

                  bg-white/20

                  -translate-x-full
                  skew-x-12

                  group-hover:translate-x-full

                  transition-transform
                  duration-700
                "
              />

              <span className="relative flex items-center gap-2">
                Подобрать группу
                <ChevronRight
                  size={18}
                  className="
                  group-hover:translate-x-1
                  transition-transform
                "
                />
              </span>
            </Link>
          </div>

          {/* Мобильная кнопка */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-purple-500 hover:text-purple-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Меню"
          >
            <div className="absolute inset-0 bg-purple-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity" />
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
          <div className="flex flex-col space-y-3 pt-4 border-t border-purple-200">
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
                      ? "bg-purple-100 text-purple-600 font-medium"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-500 hover:translate-x-2"
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/order"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-center text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium mt-2"
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
