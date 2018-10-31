print("TTTDiscordZL - by Frederik 'zlyfer' Shull!")

-- Insert the ID of your Discord Server.
local DiscordID = ""
-- Insert the generated token the Discord bot sent you when you invited him.
local Token = ""
-- Change url to TTTDiscordZL.php on your website (Only if you want to use your own database & Discord server!).
local Webpage = "https://zlyfer.net/sites/games/gmod_ttt/TTTDiscordZL.php"

-- Functions to un/mute players. Use either "all" for all or SteamID64 for a specific target.
local function mute(target)
	http.Fetch(Webpage.."?token="..Token.."&guildid="..DiscordID.."&mute="..target)
end
local function unmute(target)
	http.Fetch(Webpage.."?token="..Token.."&guildid="..DiscordID.."&unmute="..target)
end

-- Mute player upon death.
hook.Add("PlayerDeath", "TTTDiscordZLPlayerDeath", function (victim, inflictor, attacker)
	if GAMEMODE_NAME == "terrortown" then
		mute(victim:SteamID64())
	end
end)
-- Unmute player upon spawn/revive.
hook.Add("PlayerSpawn", "TTTDiscordZLPlayerSpawn", function (player)
	if GAMEMODE_NAME == "terrortown" then
		unmute(player:SteamID64())
	end
end)
-- Optional: Unmute player upon found corpse. Not recommended for large player groups.
--[[
hook.Add("TTTBodyFound", "TTTDiscordZLBodyFound", function(player, deadplayer, rag)
	if GAMEMODE_NAME == "terrortown" then
		unmute(deadplayer:SteamID64())
	end
end)
]]--
-- Unmute all players upon preparing phase. Ensures everyone gets unmuted porperly.
hook.Add("TTTPrepareRound", "TTTDiscordZLPrepareRound", function ()
	if GAMEMODE_NAME == "terrortown" then
		unmute("all")
	end
end)
-- Same as above but faster and less secure; If player get killed post round they will be muted again.
hook.Add("TTTEndRound", "TTTDiscordZLEndRound", function (result)
	if GAMEMODE_NAME == "terrortown" then
		unmute("all")
	end
end)
