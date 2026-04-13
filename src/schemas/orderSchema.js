import { z } from 'zod';

export const orderSchema = z.object({
  group: z.string({
    required_error: "Выберите группу",
  }).min(1, "Выберите группу"),
  
  equipment: z.enum(["до 30 человек", "30-250 человек"], {
    required_error: "Выберите формат аппаратуры",
  }),
  
  eventDate: z.date({
    required_error: "Укажите дату мероприятия",
    invalid_type_error: "Некорректная дата",
  }).min(new Date(), "Дата не может быть в прошлом"),
  
  location: z.string({
    required_error: "Укажите место проведения",
  }).min(5, "Минимум 5 символов"),
  
  phone: z.string({
    required_error: "Укажите телефон",
  }).regex(/^\+?[0-9]{10,15}$/, "Неверный формат телефона"),
  
  name: z.string({
    required_error: "Укажите имя",
  }).min(2, "Минимум 2 символа"),
});

export const defaultValues = {
  group: "",
  equipment: "до 30 человек",
  eventDate: new Date(),
  location: "",
  phone: "",
  name: "",
};