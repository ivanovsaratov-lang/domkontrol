const TelegramBot = require('node-telegram-bot-api');

module.exports = async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.WEB_APP_URL;

  if (!token || !appUrl) {
    return res.status(500).json({
      ok: false,
      error: 'Missing TELEGRAM_BOT_TOKEN or WEB_APP_URL'
    });
  }

  const bot = new TelegramBot(token);

  const update = req.body;

  try {
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text === '/start') {
        await bot.sendMessage(chatId, 'Добро пожаловать в ДомКонтрол', {
          reply_markup: {
            keyboard: [
              [
                {
                  text: 'Открыть ДомКонтрол',
                  web_app: { url: appUrl }
                }
              ]
            ],
            resize_keyboard: true,
            persistent: true
          }
        });
      }

      if (update.message.web_app_data) {
        const rawData = update.message.web_app_data.data;
        let parsed;

        try {
          parsed = JSON.parse(rawData);
        } catch (e) {
          parsed = { raw: rawData };
        }

        await bot.sendMessage(
          chatId,
          `Новая проблема получена:\n\nЗаголовок: ${parsed.title || '-'}\nОписание: ${parsed.description || '-'}`
        );
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
