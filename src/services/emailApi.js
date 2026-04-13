import emailjs from "@emailjs/browser";

export const sendEmail = async (formData) => {
  try {
    const templateParams = {
      name: formData.name,
      phone: formData.phone,
      group: formData.group,
      event_date: formData.eventDate,
      location: formData.location,
      equipment: formData.equipment,
      submission_time: new Date().toLocaleString("ru-RU"),
      email: formData.email || "",
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    );

    return {
      success: true,
      message: "Письмо успешно отправлено",
      data: response,
    };
  } catch (error) {
    console.error("Ошибка отправки email:", error);
    return {
      success: false,
      message: error.text || "Ошибка отправки письма",
      error: error,
    };
  }
};
