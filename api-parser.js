const request = require('request');
const config = require('./config');


var getSongListResponse = (songs) => {
    var songString = ''
    for (var k = 0, len = songs.length; k < len && k < config.searchLimit; k++) {
        songString += `🎼 <b>${k + 1}</b> ${songs[k].songName} (${songs[k].artistName}) - /play${songs[k].songId}\n`;
    }
    return "🎼 <b>Results</b>\n" + songString;
}

var getSongList = (url, done) => {
    // console.log("request --", url)
    if (!url || url == '') return done('');
    request.post(url, (error, response, body) => {
        //TODO: Please check the respose bedenb
        if (error) {
            console.log("Error", error);
            return done('');
        }
        if (body && JSON.parse(body)) {
            var list = JSON.parse(body);
            return done(getSongListResponse(list.songs));
        }
    })
}

var getSongs = (type, keyword, done) => {
    var url = '';
    switch (type) {
        case 'search':
            url = config.url.search + keyword;
            break;
        case 'recent':
            url = config.url.recent;
            break;
        case 'popular':
            url = config.url.popular;
            break;
        case 'random':
            url = config.url.random;
            break;
        case 'traditional':
            url = config.url.traditional;
            break;
    }
    return getSongList(url, done)
};
module.exports = {
    getSongs: getSongs
}