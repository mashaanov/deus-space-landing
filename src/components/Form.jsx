import React from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  User,
  ChevronDown,
} from "lucide-react";
import { useOrderForm } from "../hooks/useOrderForm";
import { Controller } from "react-hook-form";
import ru from "date-fns/locale/ru";
import toast, { Toaster } from "react-hot-toast";
import emailjs from "@emailjs/browser";

registerLocale("ru", ru);

// Инициализируем EmailJS
emailjs.init("Z9D-_0IOzOhdDMsmy"); // Замените на ваш Public Key

// Кастомный инпут для даты
const DatePickerCustom = ({ value, onClick }) => {
  const displayDate = value;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-deus-gray-dark)] border border-[var(--color-purple-400)] rounded-lg text-white transition-all group cursor-pointer"
    >
      <Calendar
        size={20}
        className="text-[var(--color-purple-400)] group-hover:scale-110 transition-transform"
      />
      <span className="flex-1 text-left">{displayDate}</span>
      <ChevronDown size={16} className="text-[var(--color-purple-400)]/50" />
    </button>
  );
};

// Базовые стили для полей ввода
const inputBaseStyles =
  "cursor-pointer w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-black placeholder:text-gray-400 transition-all";
const inputFocusStyles =
  "focus:border-[var(--color-purple-400)] focus:ring-1 focus:ring-[var(--color-purple-400)]/30 focus:outline-none";
const inputWithIconStyles = (hasIcon) => (hasIcon ? "pl-10" : "");
const selectBaseStyles = `${inputBaseStyles} appearance-none`;
const autofillFix =
  "[&:-webkit-autofill]:bg-[var(--color-deus-gray-dark)] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_var(--color-deus-gray-dark)_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]";

// Компактный селект с иконкой
const SelectField = ({ label, icon: Icon, error, children, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-[var(--color-deus-white)]/70">
      {label} <span className="text-red-400">*</span>
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-purple-400)]"
        />
      )}
      <select
        {...props}
        className={`
          ${selectBaseStyles}
          ${inputWithIconStyles(!!Icon)}
          ${inputFocusStyles}
        `}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-purple-400)]/50 pointer-events-none"
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

// Поле ввода с иконкой
const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-[var(--color-deus-white)]/70">
      {label} <span className="text-red-400">*</span>
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-purple-400)]"
        />
      )}
      <input
        {...props}
        className={`
          ${inputBaseStyles}
          ${inputWithIconStyles(!!Icon)}
          ${inputFocusStyles}
          ${autofillFix}
        `}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

const Form = ({ location, initialGroup = "" }) => {
  const selectedGroup = location.state?.selectedGroup || initialGroup;
  const { form, groups, selectedGroupData, isSubmitting, onSubmit } =
    useOrderForm(selectedGroup);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = form;

  const equipment = watch("equipment");

  // Функция отправки через EmailJS
  const sendEmail = async (formData) => {
    // Получаем название группы из списка
    const groupLabel =
      groups.find((g) => g.value === formData.group)?.label || formData.group;

    // Подготовка данных для EmailJS
    const templateParams = {
      to_email: "deus.space.orders@gmail.com",
      from_name: formData.name,
      from_phone: formData.phone,
      event_date: new Date(formData.eventDate).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      group: groupLabel,
      equipment: formData.equipment,
      location: formData.location,
      current_year: new Date().getFullYear(),
      // Можно добавить дополнительные поля
      reply_to: formData.phone, // для быстрого ответа
    };

    try {
      const response = await emailjs.send(
        "service_0g718s9", // Замените на ваш Service ID
        "template_4kspjub", // Замените на ваш Template ID
        templateParams,
      );

      console.log("✅ Email sent successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ EmailJS error:", error);
      throw error;
    }
  };

  // Обертка для onSubmit с тостами
  const handleFormSubmit = async (data) => {
    // Показываем тост загрузки
    const toastId = toast.loading("📨 Отправка заявки...", {
      style: {
        background: "#1a1a2e",
        border: "1px solid rgba(139, 92, 246, 0.5)",
        color: "#fff",
      },
    });

    try {
      // Отправляем данные через EmailJS
      await sendEmail(data);

      // Если есть оригинальный onSubmit из useOrderForm, вызываем его
      if (onSubmit) {
        await onSubmit(data);
      }

      // Успешный тост
      toast.success(
        "✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
        {
          id: toastId,
          duration: 6000,
          icon: "🎸",
          style: {
            background: "#1a1a2e",
            border: "1px solid #10b981",
            color: "#fff",
          },
        },
      );

      // Очищаем форму после успешной отправки
      setTimeout(() => {
        reset();
      }, 1000);
    } catch (error) {
      console.error("Form submission error:", error);

      let errorMessage =
        "Не удалось отправить заявку. Пожалуйста, попробуйте еще раз.";

      // Детальная обработка ошибок EmailJS
      if (error.status === 400) {
        errorMessage =
          "Ошибка в данных формы. Проверьте правильность заполнения.";
      } else if (error.status === 401) {
        errorMessage =
          "Ошибка авторизации EmailJS. Пожалуйста, свяжитесь с администратором.";
      } else if (error.status === 429) {
        errorMessage =
          "Слишком много запросов. Подождите немного и попробуйте снова.";
      } else if (error.text) {
        try {
          const errorData = JSON.parse(error.text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = error.text || errorMessage;
        }
      }

      // Тост ошибки
      toast.error(`❌ ${errorMessage}`, {
        id: toastId,
        duration: 8000,
        style: {
          background: "#1a1a2e",
          border: "1px solid #ef4444",
          color: "#fff",
        },
      });
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "12px",
            padding: "16px 24px",
            maxWidth: "500px",
          },
          success: {
            icon: "✅",
            duration: 6000,
          },
          error: {
            icon: "❌",
            duration: 8000,
          },
          loading: {
            icon: "⏳",
          },
        }}
      />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-2xl mx-auto"
      >
        {/* Группа + Превью в одной строке */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <SelectField
            label="Кавер-группа"
            icon={Users}
            error={errors.group?.message}
            {...register("group")}
          >
            <option value="">Выберите группу</option>
            {groups.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </SelectField>

          {/* Мини-превью выбранной группы */}
          {selectedGroupData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-4 py-2 bg-[var(--color-purple-500)]/5 rounded-lg border border-[var(--color-purple-400)]"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-purple-500)]/20 flex-shrink-0">
                <img
                  src={selectedGroupData.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {selectedGroupData.name}
                </p>
                <p className="text-xs text-[var(--color-purple-400)]">
                  {selectedGroupData.genre}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Аппаратура */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--color-deus-white)]/70 mb-1.5">
            Формат аппаратуры <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: "До 30 человек",
                desc: "Базовый набор",
                value: "До 30 человек",
              },
              {
                title: "30-250 человек",
                desc: "Расширенный набор",
                value: "30-250 человек",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("equipment", option.value)}
                className={`
                  p-3 rounded-lg border text-left transition-all
                  ${
                    equipment === option.value
                      ? "border-[var(--color-purple-400)] bg-[var(--color-purple-500)]/10"
                      : "border-[var(--color-purple-500)]/30 bg-[var(--color-deus-gray-dark)] hover:border-[var(--color-purple-400)]/50"
                  }
                `}
              >
                <p className="font-medium text-white text-sm">{option.title}</p>
                <p className="text-xs text-[var(--color-deus-white)]/50">
                  {option.desc}
                </p>
              </button>
            ))}
          </div>
          {errors.equipment && (
            <p className="text-xs text-red-400 mt-1">
              {errors.equipment.message}
            </p>
          )}
        </div>

        {/* Дата и место */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1.5 custom-calendar">
            <label className="block text-sm font-medium text-[var(--color-deus-white)]/70">
              Дата <span className="text-red-400">*</span>
            </label>
            <Controller
              name="eventDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                  minDate={new Date()}
                  dateFormat="dd.MM.yyyy"
                  locale="ru"
                  customInput={<DatePickerCustom />}
                />
              )}
            />
            {errors.eventDate && (
              <p className="text-xs text-red-400">{errors.eventDate.message}</p>
            )}
          </div>

          <InputField
            label="Место"
            icon={MapPin}
            error={errors.location?.message}
            placeholder="Город, площадка"
            {...register("location")}
          />
        </div>

        {/* Имя и телефон */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <InputField
            label="Ваше имя"
            icon={User}
            error={errors.name?.message}
            placeholder="Иван Иванов"
            {...register("name")}
          />

          <InputField
            label="Телефон"
            icon={Phone}
            error={errors.phone?.message}
            placeholder="+7 (999) 123-45-67"
            {...register("phone")}
          />
        </div>

        {/* Кнопка отправки */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-base transition-all relative overflow-hidden
            ${
              isSubmitting
                ? "bg-[var(--color-purple-600)]/50 cursor-not-allowed"
                : "bg-gradient-to-r from-[var(--color-purple-600)] to-[var(--color-purple-700)] hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)]"
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Отправка...
            </span>
          ) : (
            "Заказать выступление"
          )}
        </motion.button>

        {/* Конфиденциальность */}
        <p className="text-center text-xs text-[var(--color-deus-white)]/30 mt-4">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
        </p>
      </motion.form>
    </>
  );
};

export default Form;
