const Datastore = require('nedb'), db = {};

//initalize db collection
const init = function (collection) {
    if (db[collection]) { //check if file is opened 
        return db[collection];
    } else {
        db[collection] = new Datastore({ filename: 'db/' + collection + '.db', autoload: true });
        return db[collection];
    }
}
//save unique users
const saveUser = (user) => new Promise((resolve, reject) => {
    const userDb = init('users');
    userDb.ensureIndex({ fieldName: 'userId', unique: true });

    let u = {};
    u.name = user.username;
    u.username = user.first_name;
    u.userId = user.id;

    userDb.insert(u, function (err, doc) {
        return resolve(userDb);
    });
});
//save user search history
const updateUserSearchData = (user, action, keyword) => new Promise((resolve, reject) => {
    saveUser(user).then(function (userModel) {
        userModel.update({ userId: user.id }, {
            $push: { searches: { action: action, date: new Date, keyword: keyword } }
        }, {}, function () {
            resolve({ status: true });
        });
    }).catch(function (err) {
        console.log(err);
        resolve();
    });
});
//save music to user play history
const updateUserPlayData = (user, musicId, url) => new Promise((resolve, reject) => {
    saveUser(user).then(function (userModel) {
        userModel.update({ userId: user.id }, {
            $push: { plays: { musicId: musicId, date: new Date, url: url } }
        }, {}, function () {
            resolve({ status: true });
        });
    }).catch(function (err) {
        console.log(err);
        resolve();
    });

});
//show list of saved users
const showDb = (user, musicId, url) => new Promise((resolve, reject) => {
    const userDb = init('users');
    userDb.find({}, function (err, docs) {
        let users = [];
        if (docs) {
            for (let i = 0, l = docs.length; i < l; i++) {
                users[users.length] = {
                    data: docs[i],
                    search_length: docs[i].searches ? docs[i].searches.length : 0,
                    play_length: docs[i].plays ? docs[i].plays.length : 0
                };
            }
        }
        console.log(users)
        return resolve(users);
    });
});

module.exports = {
    saveUser: saveUser,
    updateUserSearchData: updateUserSearchData,
    updateUserPlayData: updateUserPlayData,
    showDb: showDb
}