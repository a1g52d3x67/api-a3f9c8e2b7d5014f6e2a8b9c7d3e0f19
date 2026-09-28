const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8964315899:AAFTQT_x3QjDVN3XZyV3eXaQBOHDm9PoLlk";

const bot = new TelegramBot(TOKEN, {
    polling: true
});

bot.onText(/\/hola/, (msg) => {
    bot.sendMessage(msg.chat.id, "hola");
});