# DiscordSudo

A bot with mongodb backend capable of taking commands from any channel and <br />
redirecting the result to another channel, whilst logging in a set admin log channel. <br /> <br />

Perfect for pranking/anonymous commands. 

# Setup

  I removed my discord tokens and url for mongodb because there are spiders with malicious intent going around. <br />
  To get this bot properly working, obtain a bot token at https://discordapp.com/developers/applications/ <br />
  Put the token in the auth.json file appropriately. <br />
  To setup the mongodb, you can either run it on your computer or use mongo atlas. <br />
  Create a database named "mydb" and collection named "server" <br />
  Mongo Atlas can be found at: https://cloud.mongodb.com/ <br />
  To run mongodb on your computer see: https://www.mongodb.com/ <br />
  Put the access url in /mongodb/db.js -> url variable <br />
  I used node.js to run this bot. Install dependencies: <br /> <br />
  npm install discord.js mongodb winston bignumber.js  <br /> <br />
  To start the bot run: <br /> <br />
  node main/main.js 

# Commands

  (prefix)help - Displays the help menu <br />
  (prefix)prefix <newPrefix> - Changes the current prefix command <br />
  (prefix)adminchannel <channelID> - Sets/updates the adminchannel for the server <br />
  (prefix)sudo <channelID> <command> (optional params..) - Sudos the command in another channel IF there is an adminchannel on the server <br />
  
# Images

![image](https://user-images.githubusercontent.com/25600013/55670505-281c8b80-5853-11e9-887b-63288a74852c.png)
![image](https://user-images.githubusercontent.com/25600013/55670507-35d21100-5853-11e9-8335-7b28da4169fe.png)
![image](https://user-images.githubusercontent.com/25600013/55670522-70d44480-5853-11e9-9181-eab0f11b6bac.png)
![image](https://user-images.githubusercontent.com/25600013/55670530-9bbe9880-5853-11e9-83a2-bd23e7ea06de.png)
![image](https://user-images.githubusercontent.com/25600013/55670537-b6910d00-5853-11e9-8565-807417a4f5f9.png)
![image](https://user-images.githubusercontent.com/25600013/55670534-aa0cb480-5853-11e9-9027-e29dc64f82d5.png)
