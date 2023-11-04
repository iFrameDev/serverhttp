const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017/SocialLifeDatabase';

global.db; // Ne pas initialiser ici

var config = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

async function ConnexionToDatabase() {
    console.log("start to database");
    try {
        const client = await MongoClient.connect(url, config);
        console.log("Connected successfully to database");
        global.db = client.db(); // Assurez-vous d'assigner la base de données à la variable 'db'
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
}

module.exports.ConnexionToDatabase = ConnexionToDatabase;

