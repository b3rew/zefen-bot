/*
    >> First I just want to say, I'm sorry www.arifzefen.com :( I never meant to hurt you --Eminem
    >> You need to know that the ownership of cyberspace will always remain with the hivemind --Jake “Topiary” Davis
    >> Also please don't update/change your api
    >> To the Police, I don't host or copy any music so please don't arrest me ;) 
*/

const TOKEN = 'TELEGRAM_TOEKEN_HERE';

const TelegramBot = require('node-telegram-bot-api');
const musicApi = require('./api-parser');
const config = require('./config');

const options = {
    polling: true
};
const bot = new TelegramBot(TOKEN, options);

// Matches /search [whatever]
bot.onText(/\/search (.+)/, function onSearchText(msg, match) {
    const keyword = match[1];
    const opts = {
        reply_to_message_id: msg.message_id,
        parse_mode: 'HTML',
    }
    bot.sendChatAction(msg.chat.id, 'typing');
    musicApi.getSongs('search', keyword, (songs) => {
        bot.sendMessage(msg.chat.id, songs, opts);
    })
});
// Matches /recent
bot.onText(/\/recent/, function onRecent(msg) {
    const opts = { parse_mode: 'HTML' }
    bot.sendChatAction(msg.chat.id, 'typing');
    musicApi.getSongs('recent', null, (songs) => {
        bot.sendMessage(msg.chat.id, songs, opts);
    })
});
// Matches /popular
bot.onText(/\/popular/, function onPopular(msg) {
    const opts = { parse_mode: 'HTML' }
    bot.sendChatAction(msg.chat.id, 'typing');
    musicApi.getSongs('popular', null, (songs) => {
        bot.sendMessage(msg.chat.id, songs, opts);
    })
});
// Matches /traditional
bot.onText(/\/traditional/, function onTraditional(msg) {
    const opts = { parse_mode: 'HTML' }
    bot.sendChatAction(msg.chat.id, 'typing');
    musicApi.getSongs('traditional', null, (songs) => {
        bot.sendMessage(msg.chat.id, songs, opts);
    })
});
// Matches /random
bot.onText(/\/random/, function onTraditional(msg) {
    const opts = { parse_mode: 'HTML' }
    bot.sendChatAction(msg.chat.id, 'typing');
    musicApi.getSongs('random', null, (songs) => {
        bot.sendMessage(msg.chat.id, songs, opts);
    })
});

// Matches /send play(and music id)
bot.onText(/\/play(.+)/, function onPlay(msg, match) {
    const resp = match[1];
    const url = config.url.playSong + resp;
    // console.log("url", url);
    bot.sendChatAction(msg.chat.id, 'upload_audio');
    //TODO: check url response before sending it, but now it is sending playSong.php.mp3 if the music is not found
    bot.sendAudio(msg.chat.id, url);
});