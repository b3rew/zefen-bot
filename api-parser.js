const request = require('request');
const config = require('./config');
const db = require('./db-parser');

const getSongListResponse = (songs) => songs.slice(0, config.SEARCH_LIMIT)
    .map((song, index) => `🎼 <b>${index + 1}</b> ${song.songName} (${song.artistName}) - /play${song.songId}`).join('\n');

const getSongList = (url) => new Promise((resolve, reject) => {
    if (!url || url === '') {
        reject('empty url');
        return;
    }
    request.post(url, (error, response, body) => {
        if (error) {
            reject(error);
            return;
        }
        try {
            resolve(JSON.parse(body));
        } catch (e) {
            reject(e);
        }
    });
});

const getSongs = (user, type, keyword) => new Promise((resolve, reject) => {
    let url = '';
    switch (type) {
        case 'search':
            url = config.URL.search + keyword;
            break;
        case 'recent':
            url = config.URL.recent;
            break;
        case 'popular':
            url = config.URL.popular;
            break;
        case 'random':
            url = config.URL.random;
            break;
        case 'traditional':
            url = config.URL.traditional;
            break;
    }
    db.updateUserSearchData(user, type, keyword).then(function(status){
        getSongList(url).then(function (response) {
            resolve(`<b>Results</b>\n` + getSongListResponse(response.songs));
        }).catch(function (e) {
            console.log(e);
            resolve(`<b>0 Results Found</b>`);
        })
    })
    
});
module.exports = {
    getSongs: getSongs
}