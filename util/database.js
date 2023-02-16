const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


let _db;

// this method allows to connect and store the data from the db
const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://jose:zemaior25@cluster0.hz58fyg.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected');
        _db = client.db()
        callback(client);
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

// this method allows acess to the data inside db
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
