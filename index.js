require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const https = require('https');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('Bot started with Pollinations AI (free)...');

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Напишите описание картинки, которую хотите создать, и я сгенерирую её для вас.\n\nПримеры:\n- "A futuristic cityscape at sunset"\n- "Кот в космосе"\n- "A cozy cabin in the snowy mountains"');
});

bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const description = msg.text;

  if (!description) {
    bot.sendMessage(chatId, 'Пожалуйста, отправьте текст с описанием картинки.');
    return;
  }

  try {
    const loadingMsg = await bot.sendMessage(chatId, 'Генерирую картинку... Пожалуйста, подождите.');

    const encodedPrompt = encodeURIComponent(description);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;

    console.log(`Generating image for: "${description}"`);
    console.log(`Image URL: ${imageUrl}`);

    await bot.deleteMessage(chatId, loadingMsg.message_id);

    await bot.sendPhoto(chatId, imageUrl, {
      caption: `Картинка по запросу: "${description}"`
    });

  } catch (error) {
    console.error('Error:', error.message);
    bot.sendMessage(chatId, 'Извините, произошла ошибка при генерации картинки. Попробуйте другой запрос.');
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});