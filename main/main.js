/**
 file: main.js
 version: 1.0.0
 description: The main code behind the discord channel proxy bot to make requests and send them back to the user
 author: Justin Yau
 */

var Discord = require('discord.js'); // npm install discord.js
var logger = require('winston');     // npm install winston
const BigNumber = require('bignumber.js'); // This allows us to hold larger than 16 digit ints
var db = require('../mongodb/db.js'); // Our mongodb database will be coming from here

/**
 auth.json format:
 {
        "token": "insert token here"
    }
 */
var auth = require('../auth.json');   // touch auth.json -> vim auth.json
var prefix = '!';

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client();
var client;

bot.once('ready', function (evt) {
    logger.info('Connected!');
    client = db.connect();
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
                "\tChange prefix: " + prefix + "prefix (newPrefix)\n" +
                "\tAdminchannel: " + prefix + "adminchannel (channelId)\n");
            break;
        case 'prefix':
            prefix = args[0];
            message.channel.send("Prefix successfully changed to: " + prefix);
            break;
        case 'adminchannel':
            var channelId = new BigNumber(args[0]);
            if(isNaN(channelId)) {
                message.channel.send("Please enter a proper ID!");
                break;
            }
            if(db.insert(message.guild.id, channelId) != -1) {
                message.channel.send("Successfully updated admin channel to ID: " + channelId);
            }
            break;
        default:
            message.channel.send("Command: " + command + " not recognized!");
    }
});