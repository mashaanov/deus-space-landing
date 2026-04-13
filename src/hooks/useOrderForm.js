// hooks/useOrderForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { orderSchema, defaultValues } from "../schemas/orderSchema";
import { groupsData } from "../data/groups";
import { sendEmail } from "../services/emailApi";

export const useOrderForm = (initialGroup = "") => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      ...defaultValues,
      group: initialGroup,
    },
  });

  const groups = groupsData.map((g) => ({
    value: g.slug,
    label: g.name,
  }));

  const selectedGroupData = groupsData.find(
    (g) => g.slug === form.watch("group"),
  );

  const onSubmit = async (data) => {
    const formattedDate =
      data.eventDate instanceof Date
        ? data.eventDate.toLocaleDateString("ru-RU")
        : data.eventDate;

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Отправляем email
      const result = await sendEmail({
        name: data.name,
        phone: data.phone,
        group: selectedGroupData?.name || data.group,
        eventDate: formattedDate,
        location: data.location,
        equipment: data.equipment,
        email: data.email || "",
      });

      if (result.success) {
        toast.success("✓ Заявка отправлена! Мы свяжемся с вами");
        form.reset();
      } else {
        toast.error("❌ Ошибка отправки. Попробуйте позже");
        console.error("Ошибка:", result.message);
      }
    } catch (error) {
      console.error("Ошибка в onSubmit:", error);
      toast.error("❌ Ошибка отправки. Попробуйте позже");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    groups,
    selectedGroupData,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
