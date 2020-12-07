const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

const resHandler = require('./modules/responseHandler');

const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.API_KEY;

const bot = new TelegramBot(API_KEY, {polling: true});

bot.onText(/\/registerGM/, msg => {bot.sendMessage(msg.chat.id, "ok")});

bot.on('message', msg => {
    const response = resHandler.processText(msg.text);
    if (resHandler.tooLate()) {
        response = " <b>Bruh go sleep</b>"
    }
    bot.sendMessage(msg.chat.id, response, {parse_mode: 'HTML'});
});

cron.schedule('0 0 0 * * *', () => {
    
}, {
    scheduled: true,
    timezone: "Asia/Singapore"
});