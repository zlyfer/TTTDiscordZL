# Tutorial for the Discord Bot TTTDiscordZL
This tutorial will cover how to control the Discord bot TTTDiscordZL including:
 - Access your own SteamID64.
 - Link your SteamID64 with your DiscordID.
 - Manually unmute yourself via TTTDiscordZL.
In any cases you can use the command `~zltd~help` to receive help from the bot itself within Discord.
## How to access your own SteamID64
If you don't know your own SteamID64 follow these steps:
 1. Access your Steam profile page (either internet browser or directly in Steam).
 2. In your internet browser copy the URL of the website; In Steam use right click on any empty space and click **Copy Page URL**.
    1. Normally you will now have your SteamID64 already in the copied URL looking like: `http://steamcommunity.com/profiles/76561198079587349`.
    2. Extract your SteamID64 from the URL. Your SteamID64 will look similar to this: `76561198079587349`.
 3. In case you are using a custom URL like `http://steamcommunity.com/id/zlyfer` go to [Steam ID Finder](https://steamidfinder.com/) and insert the URL.
 4. After clicking **Get SteamId** you will see multiple information about your profile. Copy the number next to **steamID64**.
 5. You now have your SteamID64.
## How to tell the bot your SteamID64
 1. Make sure you copied **only** your SteamID64.
 2. Go into Discord and access the right server.
 3. Access any text channel the Discord bot has rights to see and read messages.
 4. Send the message `~zltd~link STEAMID64` replacing STEAMID64 with your copied SteamID64.
 5. If the bot has the rights to send message within that text channel it will send a message whether the link was successful or not.
## Manually unmute yourself
Normally the bot unmutes everyone if needed (upon new round/revive) but sometimes it is necessary to unmute yourself.
Due to the system on how the bot knows who to mute a simple server-side unmute is not enough - the bot will mute you again.
Use following command to unmute yourself manually if needed: `~zltd~unmute`.
The bot then will send a message that you unmuted yourself manually.
