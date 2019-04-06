/**
 file: db.js
 version: 1.0.0
 description: The main code behind the mongodb database to make requests and send them back to the user
 author: Justin Yau
 */

var MongoClient = require('mongodb').MongoClient;         // npm install mongodb
const BigNumber = require('bignumber.js');                // This allows us to hold larger than 16 digit ints
/**
 INSERT HERE
 Put the mongo URL here!
 */
var url = ""; // The address of the mongo database
/**
 INSERT HERE
 Put the mongo URL here!
 */

var client; // The MongoClient object that we will use to make connections

/**
 * This function makes a connection with the given url and saves it
 * @return {Promise<void>}
 */
async function connect() {
    var options = {
        keepAlive: 1,
        connectTimeoutMS: 30000,
        useNewUrlParser: true
    };
    client = await new MongoClient(url, options);
    console.log("Connected to mongodb database!");
}

/**
 * Looks through the database for the serverId and returns the channel id associated with it
 * @param serverId - The serverID to match up with
 * @param name - The name of the command sender
 * @param callback - The function to run when the command is finished processing
 * @pass {*} to callback - -1 for no channelID found or error, otherwise channelID
 */
function findServer(serverId, name, callback) {
    var sID = new BigNumber(serverId);
    client.connect(async function(err) {
        if (err) {
            console.log(err);
            callback(name, "-1");
            return;
        }
        const dbo = await client.db("mydb").collection("server");
        var query = { serverId: sID.toString() };
        return dbo.find(query).toArray(function(err, res) {
            if (err) {
                console.log(err);
                callback(name, "-1");
                return;
            }
            var arrayLength = res.length;
            if(arrayLength == 0) {
                callback(name, "-1");
                return;
            }
            console.log(res);
            var channelId = new BigNumber(JSON.parse(JSON.stringify(res[0])).channelId);
            console.log("SERVER: serverId: " + sID + " with channelId: " + channelId.toString() + " found!");
            callback(name, channelId.toString());
            return;
        });
    });
}

/**
 * Looks through the database for the channelId and returns the server id associated with it
 * @param channelId - The serverID to match up with
 * @param name - The name of the command sender
 * @param callback - The function to run when the command is finished processing
 * @pass {*} to callback - -1 for no serverId found or error, otherwise serverID
 */
function findChannel(channelId, name, callback) {
    console.log("CHANNEL ID: " + channelId);
    var cId = new BigNumber(channelId);
    client.connect(async function(err, ret) {
        if (err) {
            console.log(err);
            callback(name, "-1");
            return;
        }
        const dbo = await client.db("mydb").collection("server");
        var query = { channelId: cId.toString() };
        return dbo.find(query).toArray(function(err, res) {
            if (err) {
                console.log(err);
                callback(name, "-1");
                return;
            }
            var arrayLength = res.length;
            if(arrayLength == 0) {
                callback(name, "-1");
                return;
            }
            console.log(res);
            var sID = new BigNumber(JSON.parse(JSON.stringify(res[0])).serverId);
            console.log("CHANNEL: serverId: " + sID.toString() + " with channelId: " + cId + " found!");
            callback(name, sID.toString());
            return;
        });
    });
}

/**
 * Updates the given entries in the table based on the serverID
 * @param serverId - The server id to update
 * @param channelId - The channel id to update
 * @pre - serverID is already found in the table
 * @return {*}
 */
function update(serverId, channelId, callback) {
    var sID = new BigNumber(serverId);
    client.connect(async function(err, ret) {
        if (err) {
            console.log(err);
            callback("-1");
            return;
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
                callback("-1");
                return;
            }
            console.log("serverId: " + sID + " with channelId: " + channelId + " updated!");
            callback("0");
            return;
        });
    });
}

/**
 * Inserts the given pair of entries into the database
 * @param serverId - The serverID to insert into the table
 * @param channelId - The channelID to insert into the table
 * @return {*} - Returns an integer to represent successful operations -1 for fail and 0 for success
 */
function insert(serverId, channelId, callback){
    var sID = new BigNumber(serverId);
    client.connect(async function(err, ret) {
        if (err) {
            console.log(err);
            callback("-1");
            return;
        }
        const dbo = await client.db("mydb").collection("server");
        var info = {
            serverId: sID.toString(),
            channelId: channelId.toString()
        };
        findServer(serverId, "User-Insert", function(name, channelId) {
            if(channelId != "-1") {
                return update(serverId, channelId, callback);
            }
            return dbo.insertOne(info, function(err, res) {
                if (err) {
                    console.log(err);
                    callback("-1");
                    return;
                }
                console.log("serverId: " + sID + " with channelId: " + channelId + " inserted!");
                callback("0");
                return;
            });
        });
    });
};

/**
 * This is to be called after all operations are completed.
 * Closes mongoDB connection. NO FURTHER USE AFTER
 */
function close() {
    client.close();
}

module.exports = {connect, insert, findServer, findChannel, close};
