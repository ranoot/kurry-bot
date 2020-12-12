import * as TelegramBot from 'node-telegram-bot-api';
import { schedule } from 'node-cron';

import { processMsg, parseOptions } from './modules/responseHandler';
import * as db from './modules/SQL';

const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.API_KEY;

const bot = new TelegramBot(API_KEY, {polling: true});

bot.onText(/\/gm/, msg => {
    const { action, message } = parseOptions(msg.text);
    const msgID =  msg.chat.id;

    if (action === 'subscribe') {
        const gmMessage = message || 'gm';
        db.addRequest(msgID, gmMessage).then(val => {
            if (val) {
                bot.sendMessage(msgID, `<i>gm message "${gmMessage}" registered</i>`, {'parse_mode': 'HTML'});
            } else {
                bot.sendMessage(msgID, "<b>gm already registered</b>", {'parse_mode': 'HTML'})
            }
        });
    } else if (action === 'unsubscribe') {
        db.removeRequest(msgID).then(val => {
            if (val) {
                bot.sendMessage(msgID, `<i>gm message unregistered</i>`, {'parse_mode': 'HTML'})
            } else {
                bot.sendMessage(msgID, `<b>gm message not unregistered</b>`, {'parse_mode': 'HTML'})
            }
        });
    } else {
        bot.sendMessage(msgID, `<b>Invalid or no action provided</b>`, {'parse_mode': 'HTML'})
    }
});

bot.on('message', msg => {
    let response = processMsg(msg);
    if (response) bot.sendMessage(msg.chat.id, response, {
        'parse_mode': 'HTML', 
        'reply_to_message_id': msg.message_id
    });
});

bot.on('polling_error', err => {console.error(err)});

schedule('0 0 0 * * *', () => { // cron
    db.getRequests()
        .then(reqs => {
            reqs.forEach(req => {
                bot.sendMessage(req.chat_id, req.gm_message);
            });
        })
        .catch(err => { console.error(err); });
}, {
    scheduled: true,
    timezone: "Asia/Singapore"
});
