const TelegramBot = require('node-telegram-bot-api')
const resHandler = require('./responseHandler');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.API_KEY;

const bot = new TelegramBot(API_KEY, {polling: true});

bot.on('message', msg => {
    const response = resHandler.processText(msg.text);
});