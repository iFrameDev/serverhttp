const MongoClient = require('mongodb').MongoClient;


// Connection URL
const url = 'mongodb://localhost:27017/db_game';

// Database Name
const dbName = 'db_game';

// Create a new MongoClient
var db;

var config = {

    useUnifiedTopology: true,
    useNewUrlParser: true
}


async function ConnexionToDatabase()
{
    MongoClient.connect(url, config , function(err, client) {

        console.log("Connected successfully to database");
        //var data = await client.db(dbName); 
        //return data;
    });

}

module.exports.ConnexionToDatabase = ConnexionToDatabase;
module.exports.db = db;
