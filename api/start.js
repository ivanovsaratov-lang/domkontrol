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

  const chatId = req.query.chat_id;

  if (!chatId) {
    return res.status(400).json({
      ok: false,
      error: 'Missing chat_id'
    });
  }

  await bot.sendMessage(chatId, 'Открой ДомКонтрол:', {
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

  return res.status(200).json({ ok: true });
};
