# TTTDiscordZL
Connect a Garry's Mod Server with a Discord Server!
## Info
### What it Does
### How it Works
### Your Options
Whether you want a quick setup using my service or want to setup everything by yourself you have two options:
	#### 1. Simple Way
	- [Install](https://github.com/zlyfer/TTTDiscordZL#install-garrys-mod-server-script) the server script.
	- [Add](https://github.com/zlyfer/TTTDiscordZL#add-discord-bot-to-your-own-discord-server) my Discord bot to your Discord server.
	- [Configurate](https://github.com/zlyfer/TTTDiscordZL#configurate-the-discord-bot) the Discord bot.
	#### 2. Advanced Way
	- [Install](https://github.com/zlyfer/TTTDiscordZL#install-garrys-mod-server-script) the server script.
	- [Setup](https://github.com/zlyfer/TTTDiscordZL#optional-setup-own-discord-bot) your own Discord bot.
	- [Configurate](https://github.com/zlyfer/TTTDiscordZL#configurate-the-discord-bot) the Discord bot.
	- [Setup](https://github.com/zlyfer/TTTDiscordZL#optional-setup-own-database-and-website) your own Database and Website.
## Getting Started
### Install Garry's Mod Server Script
1. Move TTTDiscordZL.lua to GMOD_SERVER_DIRECTORY/garrysmod/garrysmod/lua/autorun/server.
2. Insert your Discord server ID into the quotation marks at `local DiscordID = ""`.
3. Restart your Garry's Mod server.
4. [**_OPTIONAL_**] Only if you want to use your own Discord server & database:
	* Change the url in the quotation marks to your own url pointing to TTTDiscordZL.php at `local Webpage = "https://zlyfer.net/games/gmod_ttt/TTTDiscordZL.php"`
### Add Discord Bot to your own Discord Server
1. Use this link to add my bot TTTDiscordZL to your Discord server: [Discord Bot Invite](https://discordapp.com/oauth2/authorize?client_id=424687518966087682&scope=bot&permissions=4194304)
	- Keep in mind that the bot needs following rights: **MUTE/DEAF**
	- See [Discord Bot Permissions](https://discordapp.com/developers/docs/topics/permissions) for reference.
### Configurate the Discord Bot
Every player has to tell the bot which SteamID64 they have.
Basically you have to use the command `~zltd~link STEAMID64` to link your DiscordID with your SteamID64 so the bot can mute you when you die.
I made a [in depth tutorial](link-to-be-added) which should help how to access your SteamID64 and how to properly link it with your DiscordID.
### [_OPTIONAL_] Setup own Discord Bot
1. Rename token_template.json to token.json and insert your Discord bot token into the quotation marks.
2. Rename mysql_config_template.json to mysql_config.json and add your database credentials.
3. Install bot dependencies and start the bot
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
### [_OPTIONAL_] Setup own Database and Website
1. Move TTTDiscordZL.php to a directory on your webserver. Make sure it is exactly where `local Webpage` in TTTDiscordZL.lua is pointing to.
2. Fill in your database credentials using the variables in TTTDiscordZL.php.
3. Create a database called 'TTTDiscordZL' and invite your Discord bot to your Discord server.
	- If you already invited the bot to the server simply restart the Discord bot.
## Disclaimer
The bot will be able to server-side un/mute people on your discord server!
At the moment everyone can mute people on your Discord server if they know it's ID and the SteamID64 of a specific person on your Discord server (if linked in database).
Future security measures are already planned.
