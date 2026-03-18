import teeest from "../images/groups/teeest.jpg";
import {
  Guitar,
  Lightbulb,
  Sparkles,
  Headphones,
  Volume2,
  Camera,
  Mic2,
  Music,
  Palette,
  Zap,
} from "lucide-react";

export const techRiderData = [
  {
    id: "equipment",
    label: "Звук",
    icon: "🎸",
    title: "Звук",
    description: "Полный список оборудования для выступлений...",
    image: teeest,
    popupId: "equipment-details",
    content: {
      title: "Детали оборудования",
      list: [
        "Гитары: Fender Stratocaster, Gibson Les Paul",
        "Усилители: Marshall JCM800, Mesa Boogie",
        "Барабаны: DW Collector's Series",
        "Микрофоны: Shure SM58, Sennheiser e935",
      ],
    },
  },
  {
    id: "light",
    label: "Свет",
    icon: "💡",
    title: "Свет",
    description: "Полный список светового оборудования...",
    image: teeest,
    popupId: "light-details",
    content: {
      title: "Световое оборудование",
      list: [
        "Прожекторы: Martin MAC Aura",
        "Головы: Clay Paky Sharpy",
        "Контроллер: GrandMA2",
        "DMX-кабели, стробоскопы",
      ],
    },
  },
  {
    id: "sound",
    label: "Звукорежиссер",
    icon: "🎧",
    title: "Звукорежиссер",
    description:
      "Профессиональный звукорежиссёр с опытом работы на крупных площадках",
    image: teeest,
    popupId: "sound-details",
    content: {
      title: "О звукорежиссере",
      list: [
        "Артём — звукорежиссер с 10-летним стажем",
        "Работал с группами: Louna, Слот, Animal ДжаZ",
        "Пульты: Digico SD9, Yamaha CL5",
        "Портфолио и фото сессий",
      ],
    },
  },
  {
    id: "light-operator",
    label: "Светооператор",
    icon: "💡",
    title: "Светооператор",
    description:
      "Профессиональный светооператор с опытом работы на крупных площадках",
    image: teeest,
    popupId: "light-operator-details",
    content: {
      title: "О светооператоре",
      list: [
        "Алексей — светооператор с 8-летним стажем",
        "Работал на фестивалях: Нашествие, Stereoleto, Park Live",
        "Опыт работы с артистами: Noize MC, Anacondaz, Shortparis",
        "Пульты: GrandMA2, GrandMA3, Avolites Tiger Touch",
        "Разработка световых сценариев под ключ",
        "Собственное оборудование для малых площадок",
      ],
    },
  },
];
