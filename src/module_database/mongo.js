const MongoClient = require('mongodb').MongoClient;


// Connection URL
const url = 'mongodb://localhost:27017/db_game';

var db;

var config = {

    useUnifiedTopology: true,
    useNewUrlParser: true
}


async function ConnexionToDatabase()
{
    console.log("start to database");
    try {
        const client = await MongoClient.connect(url, config)

                console.log("Connected successfully to database");
                //var data = await client.db(dbName); 
                //return data;
            
    }
    catch(err){
        console.error("Error connecting to database:", err);
    }
}

module.exports.ConnexionToDatabase = ConnexionToDatabase;
module.exports.db = db;
