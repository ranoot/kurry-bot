const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

const resHandler = require('./modules/responseHandler');
const db = require('./modules/SQL');

const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.API_KEY;

const bot = new TelegramBot(API_KEY, {polling: true});

bot.onText(/\/gm/, msg => {
    const msgID =  msg.chat.id;
    
    const [,option, ...textArray] = msg.text.split(' ')

    if (option === 'register') {
        const gmMessage = textArray.join(' ') || 'gm';
        db.addRequest(msgID, gmMessage).then(val => {
            if (val) {
                bot.sendMessage(msgID, `<i>gm message "${gmMessage}" registered</i>`, {'parse_mode': 'HTML'});
            } else {
                bot.sendMessage(msgID, "<b>gm already registered</b>", {'parse_mode': 'HTML'})
            }
        });
    } else if (option === 'unregister') {
        db.removeRequest(msgID).then(val => {
            if (val) {
                bot.sendMessage(msgID, `<i>gm message unregistered</i>`, {'parse_mode': 'HTML'})
            } else {
                bot.sendMessage(msgID, `<b>gm message not unregistered</b>`, {'parse_mode': 'HTML'})
            }
        });
    } else {
        bot.sendMessage(msgID, "<b>No options provided</b>", {'parse_mode': 'HTML'})
    }
});

bot.on('message', msg => {
    let response = resHandler.processMsg(msg);
    if (response) bot.sendMessage(msg.chat.id, response, {
        'parse_mode': 'HTML', 
        'reply_to_message_id': msg.message_id
    });
});

bot.on('polling_error', err => {console.error(err)});

cron.schedule('0 0 0 * * *', () => {
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

// always on in glitch

const express = require('express');
const app = express();
const http = require('http');

app.use(express.static('public'));

app.get('/', function(request, response) {
    app.get("/", (request, response) => {
        console.log(Date.now() + " Ping Received");
        response.sendStatus(200);
    });
});

const listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + process.env.PORT);
    }
);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);