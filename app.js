var app = require('express')();

var database = require('./src/module_database/mongo');

const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId



// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'db_game';

// Create a new MongoClient
const client = new MongoClient(url);

var db = null;



app.listen(3000,"localhost", async function() {

    console.log('listening on 3000');
    
    await database.ConnexionToDatabase();


});



app.use('/', require('./src/module_bank/bank'))
app.use('/', require('./src/module_character/characters_stats'))

app.get('/', function(req, res) {

    client.connect(function(err) {

        console.log("Connected successfully to server");
      
        const db = client.db(dbName);
        const query = { "user_deviceid": req.query["name"] };
        console.log("device id : " + req.query["name"]);
        db.collection("user").findOne(query, function(error, result) {
            if (error) throw error;
            if(result)
            {
                res.send(result._id.toString());             
            }
            else
            {
                const newAccount = {
                    "user_deviceid" : req.query["name"],
                    "user_date": new Date(),
                    "user_ban": false,
                    "user_rang": 0
                };

                db.collection('user').insertOne(newAccount)
                .then(result => res.send(result.insertedId))
            }        
        });
    });
});

app.get('/checkcharacter', function(req, res) {

    client.connect(function(err) {

        console.log("Connected successfully to server");
      
        const db = client.db(dbName);

        db.collection('characters').find({ "user_id" : req.query["user_id"] }).toArray()
        .then(
            items => {
                if(items.length > 0)
                {
                    console.log(`Successfully found ${items.length} documents.`)
                    res.send(items);
                }
                else{

                    console.log(`Successfully found ${items.length} documents.`)
                    res.send(false);
                }
            }
        )
    });
});

app.get('/addcharacter', function(req, res) {

    client.connect(function(err) {

        console.log("Connected successfully to server");
      
        const db = client.db(dbName);

        const newCharacter = {

            "user_id" : req.query["user_id"],
            "character_date": new Date(),
            "character_name": req.query["character_name" ],
            "character_surname": req.query["character_surname"],
            "character_level": req.query["character_level"],
            "character_hourofplay": req.query["character_hourofplay"],
            "character_activity": req.query["character_activity"]
        };

        db.collection('characters').insertOne(newCharacter)
        .then(result => res.send(result.insertedId))                        
    });
});

app.get('/loadcharacter', function(req, res) {

    client.connect(function(err) {

        console.log("Connected successfully to server");
      
        const db = client.db(dbName);

        db.collection('characters').find({ "user_id" : req.query["user_id"] }).toArray()
        .then(
            items => {
                if(items.length > 0)
                {
                    console.log(`Successfully found ${req.query["user_id"]} player Loaded.`)
                    res.send(items);
                }
                else{

                    console.log(`Echec found ${items.length} documents.`)
                    res.send(false);
                }
            }
        )
    });
});
app.get('/deletecharacter', function(req, res) {

    client.connect(function(err) {

        console.log("Connected successfully to server");
      
        const db = client.db(dbName);

        db.collection('characters').deleteOne({ "_id" : new ObjectID(req.query["character_id"]) }, (err, results) => {
            
            console.log(results);
            res.send(`Personnage supprimé`);
        });      
    });
});
app.get('/addinventory', function(req, res) {

    client.connect(function(err) {

        console.log("Connected successfully to server");
      
        const db = client.db(dbName);

        const inventory = {

            "entity_id" : req.query["entity_id"], // celui a qui appartient l'objet
            "item_id": req.query["item_id" ], // id de l'objet master
            "quantity": req.query["quantity"],
        };

        db.collection('inventory').insertOne(inventory)
        .then(result => res.send(result.insertedId))                        
    });
});

app.get('/updateiteminventory', function(req, res) {

    client.connect(function(err) {

        console.log("Connected successfully to server");
      
        const db = client.db(dbName);

        var query = { "_id" : new ObjectID(req.query["idsql"]) };
	// set parameter is used to update only the name field of the entry and to keep the remaining fields same.
        var data = { $set : {quantity : req.query["quantity"] } }
        console.log("thrth" + req.query["quantity"]);

        db.collection("inventory").updateOne(query , data, (err , collection) => {
            if(err) throw err;
            console.log("updated successfully");
        });                        
    });
});
app.get('/loadinventory', function(req, res) {

    client.connect(function(err) {

        console.log("Connected successfully to server");
      
        const db = client.db(dbName);
        console.log("updated successfully" + req.query["idsql_content"]);

        db.collection('inventory').find({ "entity_id" : req.query["idsql_content"] }).toArray()
        .then(
            items => {
                if(items.length > 0)
                {
                    console.log(`Successfully found ${items.length} inventory.`)
                    res.send(items);
                }
                else{

                    console.log(`Successfully found ${items.length} inventory.`)
                    res.send(false);
                }
            }
        )
    });
});

app.get('/deleteItemToInventory', function(req, res) {

    client.connect(function(err) {

        const db = client.db(dbName);

        db.collection('inventory').deleteOne({ "_id" : new ObjectID(req.query["item_id"]) }, (err, results) => {
            res.send(`item supprimé`);
        });      
    });
});


module.exports.db = db;

