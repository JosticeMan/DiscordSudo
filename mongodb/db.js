/**
 file: db.js
 version: 1.0.0
 description: The main code behind the mongodb database to make requests and send them back to the user
 author: Justin Yau
 */

var MongoClient = require('mongodb').MongoClient;         // npm install mongodb
const BigNumber = require('bignumber.js');                // This allows us to hold larger than 16 digit ints
var url = ""; // The address of the mongo database

var client; // The MongoClient object that we will use to make connections

/**
 * This function makes a connection with the given url and saves it
 * @return {Promise<void>}
 */
async function connect() {
    client = await new MongoClient(url, { useNewUrlParser: true });
    console.log("Connected to mongodb database!");
}

/**
 * Updates the given entries in the table based on the serverID
 * @param serverId - The server id to update
 * @param channelId - The channel id to update
 * @pre - serverID is already found in the table
 * @return {*}
 */
function update(serverId, channelId) {
    var sID = new BigNumber(serverId);
    return client.connect(async function(err) {
        if (err) {
            console.log(err);
            return -1;
        }
        const dbo = await client.db("mydb").collection("server");
        var query = { serverId: sID.toString() };
        var info = { $set: {
                channelId: channelId.toString()
            }
        };
        return dbo.updateOne(query, info, function(err, res) {
            if (err) {
                console.log(err);
                return -1;
            }
            console.log("serverId: " + sID + " with channelId: " + channelId + " inserted!");
            client.close();
            return 0;
        });
    });
}

/**
 * Inserts the given pair of entries into the database
 * @param serverId - The serverID to insert into the table
 * @param channelId - The channelID to insert into the table
 * @return {*} - Returns an integer to represent successful operations -1 for fail and 0 for success
 */
function insert(serverId, channelId){
    var sID = new BigNumber(serverId);
    return client.connect(async function(err) {
        if (err) {
            console.log(err);
            return -1;
        }
        const dbo = await client.db("mydb").collection("server");
        var info = {
          serverId: sID.toString(),
          channelId: channelId.toString()
        };
        return dbo.insertOne(info, function(err, res) {
            if (err) {
                console.log(err);
                return -1;
            }
            console.log("serverId: " + sID + " with channelId: " + channelId + " inserted!");
            client.close();
        });
    });
};

module.exports = {connect, insert, update};