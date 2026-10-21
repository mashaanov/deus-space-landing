import { z } from 'zod';

export const orderSchema = (labels) => {
  const e = labels.errors;
  return z.object({
    group: z.string().min(1, e.group),
    equipment: z.string().refine(value => labels.equipmentOptions.some(option => option.value === value), e.equipment),
    eventDate: z.date({error: e.date}).refine(date => {const today = new Date();today.setHours(0,0,0,0);return date >= today;}, e.pastDate),
    location: z.string().min(5, e.location),
    phone: z.string().regex(/^\+?[0-9 ()-]{10,25}$/, e.phone).refine(value => /^\d{10,15}$/.test(value.replace(/\D/g,'')), e.phone),
    name: z.string().min(2, e.name),
  });
};
export const defaultValues = { group: '', equipment: '', eventDate: new Date(), location: '', phone: '', name: '' };
