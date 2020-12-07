const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

const resHandler = require('./modules/responseHandler');
const db = require('./modules/SQL');

const dotenv = require('dotenv');
const { syncBuiltinESMExports } = require('module');
dotenv.config();

const API_KEY = process.env.API_KEY;

const bot = new TelegramBot(API_KEY, {polling: true});

bot.onText(/\/gm/, msg => {
    const msgID =  msg.chat.id;

    let options = msg.text.split(' ');
    options.shift();

    if (options[0] === 'register') {
        const gmMessage = options[1] || 'gm';
        db.addRequest(msgID, gmMessage);
        bot.sendMessage(msgID, `<i>gm message "${gmMessage}" registered</i>`, {parse_mode: 'HTML'})
    } else if (options[0] === 'unregister') {
        db.removeRequest(msgID);
    } else {
        bot.sendMessage(msgID, "<b>No options provided</b>", {parse_mode: 'HTML'})
    }
});

bot.on('message', msg => {
    let response = resHandler.processText(msg.text);
    if (resHandler.tooLate()) {
        response = " <b>Bruh go sleep</b>";
    }
    if (response) bot.sendMessage(msg.chat.id, response, {parse_mode: 'HTML'});
});

bot.on('polling_error', err => {console.log(err)});

cron.schedule('0 0 0 * * *', () => {

}, {
    scheduled: true,
    timezone: "Asia/Singapore"
});