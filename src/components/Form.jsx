import { useContent, safeUrl } from "../content";
import { sendEmail as sendOrderEmail } from "../services/emailApi";
import React from "react";
import { motion as Motion } from "framer-motion";
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


registerLocale("ru", ru);

// Инициализируем EmailJS


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
  const {form: labels} = useContent();
  const [sending, setSending] = React.useState(false);
  const selectedGroup = location?.state?.selectedGroup || initialGroup;
  const { form, groups, selectedGroupData,  } =
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

  const isSubmitting = sending;
  const sendEmail = async (data) => {
    const result = await sendOrderEmail({...data, group: groups.find(g => g.value === data.group)?.label || data.group, eventDate: new Date(data.eventDate).toLocaleDateString('ru-RU')});
    if (!result.success) throw new Error(result.message);
  };

  // Обертка для onSubmit с тостами
  const handleFormSubmit = async (data) => {
    if (sending) return;
    setSending(true);
    // Показываем тост загрузки
    const toastId = toast.loading(labels.loading, {
      style: {
        background: "#1a1a2e",
        border: "1px solid rgba(139, 92, 246, 0.5)",
        color: "#fff",
      },
    });

    try {
      // Отправляем данные через EmailJS
      await sendEmail(data);

      // Успешный тост
      toast.success(
        labels.success,
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

      // Тост ошибки
      toast.error(labels.error, {
        id: toastId,
        duration: 8000,
        style: {
          background: "#1a1a2e",
          border: "1px solid #ef4444",
          color: "#fff",
        },
      });
    } finally { setSending(false); }
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

      <Motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="site-order-form max-w-2xl mx-auto"
      >
        {/* Группа + Превью в одной строке */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <SelectField
            label={labels.group}
            icon={Users}
            error={errors.group?.message}
            {...register("group")}
          >
            <option value="">{labels.groupPlaceholder}</option>
            {groups.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </SelectField>

          {/* Мини-превью выбранной группы */}
          {selectedGroupData && (
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-4 py-2 bg-[var(--color-purple-500)]/5 rounded-lg border border-[var(--color-purple-400)]"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-purple-500)]/20 flex-shrink-0">
                <img
                  src={safeUrl(selectedGroupData.image)}
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
            </Motion.div>
          )}
        </div>

        {/* Аппаратура */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--color-deus-white)]/70 mb-1.5">
            {labels.equipment} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {labels.equipmentOptions.map((option) => (
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
              {labels.date} <span className="text-red-400">*</span>
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
            label={labels.location}
            icon={MapPin}
            error={errors.location?.message}
            placeholder={labels.locationPlaceholder}
            {...register("location")}
          />
        </div>

        {/* Имя и телефон */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <InputField
            label={labels.name}
            icon={User}
            error={errors.name?.message}
            placeholder={labels.namePlaceholder}
            {...register("name")}
          />

          <InputField
            label={labels.phone}
            icon={Phone}
            error={errors.phone?.message}
            placeholder={labels.phonePlaceholder}
            {...register("phone")}
          />
        </div>

        {/* Кнопка отправки */}
        <Motion.button
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
              {labels.submitting}
            </span>
          ) : (
            labels.submit
          )}
        </Motion.button>

        {/* Конфиденциальность */}
        <p className="text-center text-xs text-[var(--color-deus-white)]/30 mt-4">
          {labels.privacy}
        </p>
      </Motion.form>
    </>
  );
};

export default Form;
