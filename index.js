/*
    >> You need to know that the ownership of cyberspace will always remain with the hivemind --Jake “Topiary” Davis
    >> I don't host or copy any music ;) 
*/

const TOKEN = 'TELEGRAM_TOEKEN_HERE';

const TelegramBot = require('node-telegram-bot-api');
const musicApi = require('./api-parser');
const db = require('./db-parser');
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
  musicApi.getSongs(msg.chat, 'search', keyword).then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
});

// Matches /recent
bot.onText(/\/recent/, function onRecent(msg) {
  const opts = { parse_mode: 'HTML' }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'recent').then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
});

// Matches /popular
bot.onText(/\/popular/, function onPopular(msg) {
  const opts = { parse_mode: 'HTML' }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'popular').then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
});

// Matches /traditional
bot.onText(/\/traditional/, function onTraditional(msg) {
  const opts = { parse_mode: 'HTML' }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'traditional').then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
});

// Matches /random
bot.onText(/\/random/, function onTraditional(msg) {
  const opts = { parse_mode: 'HTML' }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'random').then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
});
// Matches /users
bot.onText(/\/users/, function onTraditional(msg) {
  db.showDb();
  bot.sendMessage(msg.chat.id, "there is nothing to see here, move along");
});

// Matches /send play(and music id)
bot.onText(/\/play(.+)/, function onPlay(msg, match) {
  const resp = match[1];//music id
  const url = config.URL.playSong + resp;
  bot.sendChatAction(msg.chat.id, 'upload_audio');
  //TODO: check url response before sending it, but now it is sending playSong.php.mp3 if the music is not found
  db.updateUserPlayData(msg.chat, resp, url).then(function(status){
     bot.sendAudio(msg.chat.id, url);
  }); 
});