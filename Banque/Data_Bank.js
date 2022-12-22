var express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;







// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'db_game';

// Create a new MongoClient
const client = new MongoClient(url);

var database = require('../Database/Database.js');

var ghj = require('../dbgamehttp.js');


router.get('/bankcreateaccount', async (req, res, next) => {

    var result = await CreateBankAccount(req.query["account_type"], req.query["character_id"], req.query["account_money"]);
    res.send(result);
    
})

async function CreateBankAccount(account_type, character_id, account_money)
{
    return new Promise(function(resolve, reject) {

        client.connect(async function(err) {

            const db = client.db(dbName);

            var type = null;

            var CheckAccount = await CheckAccountBank(account_type, character_id);

            console.log('check : ' + CheckAccount);

            if(CheckAccount == false)
            {

                switch (account_type) {

                    case 'Personnal':
                                        type = 'P';
                                        break;

                    case 'Saving':      
                                        type = 'S';
                                        break;

                    case 'Company':
                                        type = 'C'
                                        break;
                }
            
                
                const numberAccount = type + (1000000000 + Math.floor(9999999999 * Math.random()));

                
                var result = await db.collection('SC_Bank_Account').findOne({ "account_number" : numberAccount });
                        
                if(result)
                {
                    return CreateBankAccount(req.query["account_type"], req.query["character_id"], req.query["account_money"]);
                }
                else {

                    const NewBankAccount = {

                        "character_id" : character_id,
                        "account_date": new Date(),
                        "account_type": account_type,
                        "account_money": account_money,
                        "account_number": numberAccount
                    };
            
                    var insert =  await db.collection('SC_Bank_Account').insertOne(NewBankAccount);
                    if(insert)
                    {
                        resolve(insert.insertedId);
                    }
                 
                }
            }

                resolve('null');

        });
    });           
}

async function CheckAccountBank(account_type, character_id)
{
    return new Promise(function(resolve, reject) {

        client.connect(async function(err) {

            const db = client.db(dbName);

            db.collection('SC_Bank_Account').find({ 
                
                $and: [
                    
                    {"character_id" : character_id}, 
                    {"account_type" : account_type}
                ]
            }).toArray()
            .then(
                items => {
                    if(items.length > 0)
                    {
                        resolve(true);
                    }
                    else{

                        resolve(false);
                    }
                }
            )
        });
    });
}

router.get('/loadaccountbank', function(req, res) {

    client.connect(function(err) {
      
        const db = client.db(dbName);

        db.collection('SC_Bank_Account').find({ "character_id" : req.query["character_id"] }).toArray()
        .then(
            items => {
                if(items.length > 0)
                {
                    console.log(`Successfully found ${items.length} account bank.`)
                    res.send(items);
                }
                else{

                    console.log(`Le joueur n'a pas de compte bancaire`);
                    res.send(false);
                }
            }
        )
    });
});

router.get('/withdrawmoney', function(req, res) {

    client.connect(function(err) {
      
        const db = client.db(dbName);

        db.collection('SC_Bank_Account').updateOne(
            
            { account_number: req.query["account_number"]},
            { $set: { account_money: req.query["account_money"]}}
        )

    });
});

router.get('/deposit_money', function(req, res) {

    client.connect(function(err) {
      
        const db = client.db(dbName);

        db.collection('SC_Bank_Account').updateOne(
            
            { account_number: req.query["account_number"]},
            { $set: { account_money: req.query["account_money"]}}
        )

    });
});


module.exports = router;


