require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const token = process.env.TELEGRAM_BOT_TOKEN;
const serverUrl = process.env.SERVER_URL; // This should be set to your Render service URL

// Create bot instance without polling
const bot = new TelegramBot(token);

// Create Express app
const app = express();
app.use(bodyParser.json());

// Webhook route for Telegram
app.post(`/bot${token}`, async (req, res) => {
  try {
    // Process the Telegram update
    await bot.processUpdate(req.body);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Telegram bot is running!' });
});

// Set webhook when server starts
const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Set the webhook URL for the bot
  if (serverUrl) {
    try {
      const webhookUrl = `${serverUrl}/bot${token}`;
      await bot.setWebHook(webhookUrl);
      console.log(`Webhook set to: ${webhookUrl}`);
    } catch (error) {
      console.error('Error setting webhook:', error.message);
      console.log('Falling back to polling mode...');
      bot.startPolling();
    }
  } else {
    console.log('SERVER_URL not set. Please set this environment variable for webhooks to work properly.');
    console.log('Starting in polling mode...');
    bot.startPolling();
  }
});

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

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});