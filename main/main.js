/**
 file: main.js
 version: 1.0.0
 description: The main code behind the discord channel proxy bot to make requests and send them back to the user
 author: Justin Yau
 */

var Discord = require('discord.js'); // npm install discord.js
var logger = require('winston');     // npm install winston
const process = require('process');  // process to do cleanup after exit
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
                "\tAdminchannel: " + prefix + "adminchannel (channelId)\n" +
                "\tSudo: " + prefix + "sudo (channelId) (command) (optional parameters)\n" +
                "To get channelIds, see https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-");
            break;
        case 'prefix':
            if(args.length <= 0) {
                message.channel.send("Usage: " + prefix + "prefix (newPrefix)");
                break;
            }
            prefix = args[0];
            message.channel.send("Prefix successfully changed to: " + prefix);
            break;
        case 'sudo':
            if(args.length <= 0) {
                message.channel.send("Usage: " + prefix + "sudo (channelId) (command) (optional parameters)");
                break;
            }
            var channelId = new BigNumber(args[0]);
            if(args.length > 1) {
                if(args[1] == "sudo") {
                    message.channel.send("Don't make me sudo sudo myself!");
                    break;
                }
                var channel = bot.channels.get(channelId.toString());
                if(channel == null) {
                    message.channel.send("Invalid channel ID or the ID isn't among those that I'm in!");
                    break;
                }
                db.findServer(channel.guild.id, message.author,function(name, channelId) {
                    console.log(channelId);
                    if(channelId != "-1") {
                        sudoCommand(channel, args);
                        bot.channels.get(channelId).send(name + " issued a command of " + args[1]);
                    } else {
                        message.channel.send("The server owner didn't set up an admin channel yet!");
                    }
                });
            } else {
                message.channel.send("Proper Usage: sudo (channelID) (commandName) (parameters)");
            }
            break;
        case 'adminchannel':
            if(args.length <= 0) {
                message.channel.send("Usage: " + prefix + "adminchannel (channelId)");
                break;
            }
            var channelId = new BigNumber(args[0]);
            if(isNaN(channelId)) {
                message.channel.send("Please enter a proper ID!");
                break;
            }
            db.insert(message.guild.id, channelId, function(code) {
                if(code != "-1") {
                    message.channel.send("Successfully updated admin channel to ID: " + channelId);
                }
            });
            break;
        default:
            message.channel.send("Command: " + command + " not recognized!");
    }
});

function sudoCommand(channel, args) {
    switch(args[1]) {
        case 'help':
            channel.send("**Help Menu**:\n" +
                "\tPrefix: " + prefix + "\n" +
                "\tHelp Menu: " + prefix + "help\n" +
                "\tChange prefix: " + prefix + "prefix (newPrefix)\n" +
                "\tAdminchannel: " + prefix + "adminchannel (channelId)\n" +
                "\tSudo: " + prefix + "sudo (channelId) (command) (optional parameters)\n" +
                "To get channelIds, see https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-");
            break;
        case 'prefix':
            if(args.length <= 2) {
                channel.send("Usage: " + prefix + "prefix (newPrefix)");
                break;
            }
            prefix = args[2];
            channel.send("Prefix successfully changed to: " + prefix);
            break;
        case 'adminchannel':
            if(args.length <= 2) {
                channel.send("Usage: " + prefix + "adminchannel (channelId)");
                break;
            }
            var channelId = new BigNumber(args[2]);
            if(isNaN(channelId)) {
                channel.send("Please enter a proper ID!");
                break;
            }
            db.insert(channel.guild.id, channelId, function(code) {
                if(code != "-1") {
                    channel.send("Successfully updated admin channel to ID: " + channelId);
                }
            });
            break;
        default:
            channel.send("Command: " + command + " not recognized!");
    }
};

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        db.close();
        console.log('Closing MongoDB connection');
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));