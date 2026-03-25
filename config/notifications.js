import dotenv from 'dotenv';
dotenv.config();

export const NOTIFICATION_CONFIG = {
  // Email configuration
  email: {
    enabled: true,
    to: "bookings@yourdomain.com",
    cc: ["manager@yourdomain.com"], // опционально
    subject: "Новая заявка на выступление",
  },

  // Telegram configuration
  telegram: {
    enabled: true,
    botToken: process.env.REACT_APP_TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },

  // Optional: сохранять в Google Sheets
  googleSheets: {
    enabled: false,
    sheetId: process.env.GOOGLE_SHEET_ID,
  },
};

// Форматирование сообщения для email
export const formatEmailHtml = (orderData, groupData) => {
  const formatDate = (date) => {
    if (!date) return "Не указана";
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const equipmentMap = {
    small: "До 30 человек (Базовый набор звука)",
    medium: "30-250 человек (Расширенный набор звука)",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 8px; border-left: 4px solid #8b5cf6; }
        .label { font-weight: bold; color: #6d28d9; margin-bottom: 5px; }
        .value { color: #374151; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
        .badge { display: inline-block; padding: 4px 12px; background: #f3f4f6; border-radius: 12px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎤 НОВАЯ ЗАЯВКА НА ВЫСТУПЛЕНИЕ</h2>
          <p>${formatDate(new Date())}</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👥 КАВЕР-ГРУППА</div>
            <div class="value">
              <strong>${groupData?.name || orderData.groupName || "Не указана"}</strong><br>
              <span class="badge">${groupData?.genre || "Не указан"}</span>
            </div>
          </div>
          
          <div class="field">
            <div class="label">📅 ДАТА МЕРОПРИЯТИЯ</div>
            <div class="value">${formatDate(orderData.eventDate)}</div>
          </div>
          
          <div class="field">
            <div class="label">📍 МЕСТО ПРОВЕДЕНИЯ</div>
            <div class="value">${orderData.location || "Не указано"}</div>
          </div>
          
          ${
            orderData.equipment
              ? `
          <div class="field">
            <div class="label">🎛 ФОРМАТ АППАРАТУРЫ</div>
            <div class="value">${equipmentMap[orderData.equipment] || orderData.equipment}</div>
          </div>
          `
              : ""
          }
          
          <div class="field">
            <div class="label">👤 ИНФОРМАЦИЯ О КЛИЕНТЕ</div>
            <div class="value">
              <strong>${orderData.name || "Не указан"}</strong><br>
              📞 ${orderData.phone || "Не указан"}
            </div>
          </div>
          
          <div class="field">
            <div class="label">🔗 БЫСТРЫЕ ДЕЙСТВИЯ</div>
            <div class="value">
              <a href="tel:${orderData.phone}" style="color: #8b5cf6;">Позвонить клиенту</a><br>
              <a href="https://wa.me/${orderData.phone?.replace(/[^\d]/g, "")}" style="color: #8b5cf6;">Написать в WhatsApp</a>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Это автоматическое сообщение. Пожалуйста, свяжитесь с клиентом в ближайшее время.</p>
          <p>ID заявки: ${Date.now()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Форматирование для Telegram (Markdown)
export const formatTelegramMessage = (orderData, groupData) => {
  const formatDate = (date) => {
    if (!date) return "Не указана";
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const equipmentMap = {
    small: "🎵 До 30 человек",
    medium: "🎸 30-250 человек",
  };

  return `
🎤 *НОВАЯ ЗАЯВКА НА ВЫСТУПЛЕНИЕ* 🎤

*Группа:* ${groupData?.name || orderData.groupName}
*Жанр:* ${groupData?.genre || "Не указан"}

*Дата:* ${formatDate(orderData.eventDate)}
*Место:* ${orderData.location}

*Аппаратура:* ${equipmentMap[orderData.equipment] || orderData.equipment}

*Клиент:* ${orderData.name}
*Телефон:* ${orderData.phone}

[Связаться в WhatsApp](https://wa.me/${orderData.phone?.replace(/[^\d]/g, "")})
  `.trim();
};
