/**
 file: main.js
 version: 1.0.0
 description: The main code behind the discord channel proxy bot to make requests and send them back to the user
 author: Justin Yau
 */

var Discord = require('discord.js'); // npm install discord.js
var logger = require('winston');     // npm install winston
var db = require('../mongodb/db.js'); // Our mongodb database will be coming from here

/**
 auth.json format:
 {
        "token": "insert token here"
    }
 */
var auth = require('../auth.json');   // touch auth.json -> vim auth.json
var prefix = '!';
var collectionName = "server";        // Name of the collection that we will be accessing to get admin-channel ids.

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client();

bot.once('ready', function (evt) {
    logger.info('Connected!');
    db.createDatabase("server");
});

bot.login(auth.token);

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'help':
            message.channel.send("**Help Menu**:\n" +
                "\tPrefix: " + prefix + "\n" +
                "\tHelp Menu: " + prefix + "help\n" +
                "\tChange prefix: " + prefix + "prefix (newPrefix)");
            break;
        case 'prefix':
            prefix = args[0];
            message.channel.send("Prefix successfully changed to: " + prefix);
            break;
        default:
            message.channel.send("Command: " + command + " not recognized!");
    }
});