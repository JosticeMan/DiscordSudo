var mongo = require('mongodb').MongoClient;         // npm install mongodb
var url = "mongodb://localhost:27017/";

export function createDatabase(name){
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.createCollection(name, function(err, res) {
            if (err) throw err;
            console.log("Collection " + name + " created!");
            db.close();
        });
    });
};