# TTTDiscordZL
Connect a Garry's Mod Server with a Discord Server!
## Info
### What it Does
When you die in Garry's Mod Trouble in Terrorist Town, you normally are not allowed to speak anymore.
You will be muted automatically in game and can't talk anymore until you respawn.
Since some people use Discord as an alternative voice chat with higher quality the in game voice chat is less in use.
In Discord you have to mute yourself or be silent "manually" to avoid disturbance.
TTTDiscordZL is a setup that connects your Garry's Mod server and your Discord server to automatically mute players who die and unmute them when they get revived or respawn.
### How it Works
Basically there are three components that work together to make the magic happen:
 - The Garry's Mod server script
 - The webpage & database
 - The Discord bot

And this is how they work together:
 1. When someone dies or respawns in game the server script will send a request to my (or your) webpage including the info which player to target and whether to mute or unmute them.
 2. The webpage will edit the specific table corresponding to your Discord server which was created by the Discord bot.
 3. The Discord bot will periodically check if a player has to be muted or unmuted by observing the database.
### Your Options
Whether you want a quick setup using my service or want to setup everything by yourself you have two options:
#### 1. Simple Way
 - [Install](#install-garrys-mod-server-script) the server script.
 - [Add](#add-discord-bot-to-your-own-discord-server) my Discord bot to your Discord server.
 - [Configurate](#configurate-the-discord-bot) the Discord bot.
#### 2. Advanced Way
 - [Install](#install-garrys-mod-server-script) the server script.
 - [Setup](#optional-setup-own-discord-bot) your own Discord bot.
 - Add your own Discord bot to your Discord server.
 - [Configurate](#configurate-the-discord-bot) the Discord bot.
 - [Setup](#optional-setup-own-database-and-webpage) your own database and webpage.
## Getting Started
### Install Garry's Mod Server Script
 1. Move _TTTDiscordZL.lua_ to _GMOD_SERVER_DIRECTORY/garrysmod/garrysmod/lua/autorun/server_.
 2. Insert your Discord server ID into the quotation marks at `local DiscordID = ""`.
 3. Restart your Garry's Mod server.
 4. [**_OPTIONAL_**] Only if you want to use your own Discord server & database:
    * Change the URL in the quotation marks to your own URL pointing to TTTDiscordZL.php at `local Webpage = "https://zlyfer.net/games/gmod_ttt/TTTDiscordZL.php"`.
### Add Discord Bot to your own Discord Server
 1. Use this link to add my bot TTTDiscordZL to your Discord server: [Discord Bot Invite](https://discordapp.com/oauth2/authorize?client_id=424687518966087682&scope=bot&permissions=4197376).
    - Keep in mind that the bot needs following rights: _MUTE_MEMBERS_ and _VIEW_CHANNEL_.
    - The permission for _SEND_MESSAGES_ is not mandatory but **extremely recommended**!
    - See [Discord Bot Permissions](https://discordapp.com/developers/docs/topics/permissions) for reference.
### Configurate the Discord Bot
Every player has to tell the bot which SteamID64 they have.

Basically you have to use the command `~zltd~link STEAMID64` to link your DiscordID with your SteamID64 so the bot can mute you when you die.

I made an [in depth tutorial](IDLinkTutorial.md) which should help on how to access your SteamID64 and how to properly link it with your DiscordID.
### [_OPTIONAL_] Setup own Discord Bot
 1. Rename _token_template.json_ to _token.json_ and insert your Discord bot token into the quotation marks.
 2. Rename _mysql_config_template.json_ to _mysql_config.json_ and add your database credentials.
 3. Install bot dependencies and start the bot.
	#### Using [npm](https://www.npmjs.com/)
	```
	npm install
	npm start
	```
	#### Using [yarn](https://yarnpkg.com/)
	```
	yarn install
	yarn start
	```
### [_OPTIONAL_] Setup own Database and Webpage
 1. Move _TTTDiscordZL.php_ to a directory on your webserver. Make sure it is exactly where `local Webpage` in _TTTDiscordZL.lua_ is pointing to.
 2. Fill in your database credentials using the variables in _TTTDiscordZL.php_.
 3. Create a database called 'TTTDiscordZL' and invite your Discord bot to your Discord server.
    - If you already invited the bot to the server simply restart the Discord bot.
### How to Basic
If you don't know how to make your own Discord bot, install npm or similar you should stick to the [Simple Way](#1-simple-way).

In case you want to use the [Advanced Way](#2-advanced-way) anyway the links below might help you but please read the [Disclaimer](#disclaimer) first.
- How to [make](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) a Discord bot and invite it to your Discord server.
- What is [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com/en/docs/getting-started).
- Yarn [vs](https://blog.risingstack.com/yarn-vs-npm-node-js-package-managers/) npm.
- How to install [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/en/docs/install#windows-stable) on Windows.
- How to install [npm](https://blog.teamtreehouse.com/install-node-js-npm-linux) or [yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable) on Linux.
- How to open the [CommandPrompt](https://www.lifewire.com/how-to-open-command-prompt-2618089) or [PowerShell](https://www.tenforums.com/tutorials/25581-open-windows-powershell-windows-10-a.html) on Windows.
- How to open the [Terminal](https://www.lifewire.com/ways-to-open-a-terminal-console-window-using-ubuntu-4075024) on Linux.
## Disclaimer
### About the Advanced Way
The links and tutorials are quickly searched in a haste.
I am not responsible if you mess anything up but you can always open an issue if you have questions.
In case you are unsure or worried, please use the [Simple Way](#1-simple-way) as mentioned.
### General use of TTTDiscordZL
The bot will be able to server-side un/mute people on your discord server!
At the moment everyone can mute people on your Discord server if they know it's ID and the SteamID64 of a specific person on your Discord server (if linked in database).
Future security measures are already planned.
