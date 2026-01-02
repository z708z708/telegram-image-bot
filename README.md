# Telegram Image Generation Bot

Телеграм бот для генерации картинок с помощью бесплатного AI API (Pollinations.ai).

## Особенности

- ✅ **Полностью бесплатно** - использует бесплатный API Pollinations.ai
- ✅ **Без API ключей** - не требует OpenAI API ключа
- ✅ **Качественные изображения** - на базе Stable Diffusion
- ✅ **Любой язык** - работает с русским, английским и другими языками

## Настройка

1. **Создайте телеграм бота:**
   - Откройте @BotFather в Telegram
   - Отправьте команду `/newbot`
   - Следуйте инструкциям и получите токен бота

2. **Настройте переменные окружения:**
   - Скопируйте `.env.example` в `.env`
   - Добавьте токен бота в `.env`

## Локальный запуск

```bash
npm install
npm start
```

## Деплой на Render.com (бесплатно)

1. Зарегистрируйтесь на https://render.com
2. Подключите ваш GitHub репозиторий
3. Создайте новый Web Service
4. Добавьте Environment Variable:
   - Key: `TELEGRAM_BOT_TOKEN`
   - Value: ваш токен от @BotFather
5. Деплой запустится автоматически

**ВАЖНО:** Никогда не коммитьте `.env` файл в Git!

## Использование

1. Откройте чат с вашим ботом в Telegram
2. Напишите `/start` для приветственного сообщения
3. Напишите описание картинки на любом языке
4. Получите сгенерированную картинку

## Примеры запросов

- "A futuristic cityscape at sunset"
- "Кот в космосе"
- "A cozy cabin in the snowy mountains"
- "Cyberpunk samurai in neon city"
- "Милый котенок с чашкой чая"

## Технологии

- Pollinations.ai - бесплатный AI для генерации изображений
- Stable Diffusion модель
- Telegram Bot API