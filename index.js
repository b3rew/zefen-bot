/*
    >> You need to know that the ownership of cyberspace will always remain with the hivemind --Jake “Topiary” Davis
    >> I don't host or copy any music ;) 
*/

// const TOKEN = 'TELEGRAM_TOKEN_HERE';

const TelegramBot = require('node-telegram-bot-api');
const musicApi = require('./api-parser');
const db = require('./db-parser');
const config = require('./config');

const options = {
  polling: true
};
const adminUserIds = []

const bot = new TelegramBot(TOKEN, options);

bot.on('message', function (message) {
  let command = '', keyword = '', msg = null;
  message.text.replace(/\/recent/, function (match, capture) {
    command = 'recent';
  });
  message.text.replace(/\/popular/, function (match, capture) {
    command = 'popular';
  });
  message.text.replace(/\/traditional/, function (match, capture) {
    command = 'traditional';
  });
  message.text.replace(/\/random/, function (match, capture) {
    command = 'random';
  });
  message.text.replace(/\/play(.+)/, function (match, capture) {
    command = 'play';
    keyword = capture;
  });
  message.text.replace(/\/search (.+)/, function (match, capture) {
    command = 'search';
    keyword = capture;
  });
  message.text.replace(/\/notify (.+)/, function (match, capture) {
    command = 'notify';
    keyword = capture;
  });
  message.text.replace(/\/testnotify (.+)/, function (match, capture) {
    command = 'testnotify';
    keyword = capture;
  });
  message.text.replace(/\/users/, function (match, capture) {
    command = 'users';
  });

  switch (command) {
    case 'search':
      onSearchText(message, keyword);
      break;
    case 'recent':
      onRecent(message);
      break;
    case 'popular':
      onPopular(message);
      break;
    case 'traditional':
      onTraditional(message);
      break;
    case 'random':
      onRandom(message);
      break;
    case 'play':
      onPlay(message, keyword);
      break;
    case 'notify':
      onNotify(message, keyword);
      break;
    case 'testnotify':
      onNotifyTest(message, keyword);
      break;
    case 'users':
      onUsers(message);
      break;
    default:
      onSearchText(message, message.text);
      break;
  }
});

function onSearchText(msg, match) {
  const keyword = match;
  const opts = {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML',
  }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'search', keyword).then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
};

function onRecent(msg) {
  const opts = { parse_mode: 'HTML' }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'recent').then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
};

function onPopular(msg) {
  const opts = { parse_mode: 'HTML' }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'popular').then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
};

// Matches /traditional
function onTraditional(msg) {
  const opts = { parse_mode: 'HTML' }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'traditional').then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
};

// // Matches /random
function onRandom(msg) {
  const opts = { parse_mode: 'HTML' }
  bot.sendChatAction(msg.chat.id, 'typing');
  musicApi.getSongs(msg.chat, 'random').then((songs) => {
    bot.sendMessage(msg.chat.id, songs, opts);
  })
};

// Matches /send play(and music id)
function onPlay(msg, match) {
  const resp = match;//music id
  const url = config.URL.playSong + resp;
  bot.sendChatAction(msg.chat.id, 'upload_audio');
  //TODO: check url response before sending it, but now it is sending playSong.php.mp3 if the music is not found
  db.updateUserPlayData(msg.chat, resp, url).then(function (status) {
    bot.sendAudio(msg.chat.id, url);
  });
};

// Matches /users
function onUsers(msg) {
  if (adminUserIds.indexOf(msg.chat.id) != -1) {
    db.showDb().then(function (users) {
      bot.sendMessage(msg.chat.id, "Total Users " + users.length);
    });
  }
};

// Matches /testnotify
function onNotifyTest(msg, match) {
  let message = '';
  if (adminUserIds.indexOf(msg.chat.id) != -1) {
    message = match;
    let i = adminUserIds.length;
    let sendingInterval = setInterval(function () {
      i--;
      if (i < 0) clearInterval(sendingInterval);
      else bot.sendMessage(parseInt(adminUserIds[i]), 'Hi Admin' + ', ' + message);
    }, 1000)
  }
};

// // Matches /notify
function onNotify(msg, match) {
  let message = '';
  if (adminUserIds.indexOf(msg.chat.id) != -1) {
    message = match;
    db.showDb().then(function (users) {
      let i = users.length;
      let sendingInterval = setInterval(function () {
        i--;
        if (i < 0) clearInterval(sendingInterval);
        else bot.sendMessage(parseInt(users[i].data.userId), 'Hi ' + users[i].data.username + ', ' + message);
      }, 1000)
    })
  }
};

