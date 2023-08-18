var express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'db_game';

const client = new MongoClient(url);

router.get('/SaveCharactersStats', function(req, res) {

    client.connect(function(err) {
      
        const db = client.db(dbName);

        const query = { character_id: req.query["character_id"] };
        const update = { $set: { character_id: req.query["character_id"], character_food: req.query["character_food"], character_drink: req.query["character_drink"] }};
        const options = { upsert: true };
        db.collection('RW_Characters_Stats').updateOne(query, update, options);                     
    });
});

router.get('/LoadPlayerStats', function(req, res) {

    client.connect(function(err) {

        const db = client.db(dbName);

        db.collection('RW_Characters_Stats').find({ "character_id" : req.query["character_id"] }).toArray()
        .then(
            items => {
                if(items.length > 0)
                {
                    console.log(`Successfully Player Stats Loaded.`)
                    res.send(items);
                }
                else{

                    console.log(`Failed Player Stats Loaded.`)
                    res.send(false);
                }
            }
        )
    });
});

module.exports = router;