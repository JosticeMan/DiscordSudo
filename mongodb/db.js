var MongoClient = require('mongodb').MongoClient;         // npm install mongodb
var url = "";;

var client;

async function connect() {
    client = await new MongoClient(url, { useNewUrlParser: true });
    console.log("Connected to mongodb database!");
}

function insert(serverId, channelId){
    var sID = parseInt(serverId);
    return client.connect(async function(err) {
        if (err) {
            console.log(err);
            return -1;
        }
        const dbo = await client.db("mydb").collection("server");
        var info = {
          serverId: sID,
          channelId: channelId
        };
        dbo.insertOne(info, function(err, res) {
            if (err) {
                console.log(err);
                return -1;
            }
            console.log("serverId: " + sID + " with channelId: " + channelId + " inserted!");
        });
        client.close();
        return 0;
    });
};

module.exports = {connect, insert};