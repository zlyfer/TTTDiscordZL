<?php
error_reporting(0);
// Path to sql_credentials.php
include('./sql_credentials.php');
$sqlServer = "127.0.0.1";
$sqlDatabase = "TTTDiscordZL";

$sql = new MySQLi($sqlServer, $sqlUser, $sqlPassword, $sqlDatabase);
$sql->set_charset("utf8");

if (isset($_GET['token'])) {
	$Token = $_GET['token'];
	if (isset($_GET['guildid'])) {
		$GuildID = $_GET['guildid'];
		$result = $sql->query("SELECT `Token` FROM `tokens` WHERE `GuildID` = '$GuildID'")->fetch_all();
		if ($result) {
			if ($Token == $result[0][0]) {
				echo nl2br ("Access granted!\n");
				if (isset($_GET['mute'])) {
					$mute = $_GET['mute'];
					if ($mute == "all") {
						$sql->query("UPDATE `$GuildID` SET `Muted` = '1' WHERE 1");
						echo("Muted everyone!");
					} else {
						$sql->query("UPDATE `$GuildID` SET `Muted` = '1' WHERE `SteamID64` = '$mute'");
						echo("Muted $mute!");
					}
				}
				if (isset($_GET['unmute'])) {
					$unmute = $_GET['unmute'];
					if ($unmute == "all") {
						$sql->query("UPDATE `$GuildID` SET `Muted` = '0' WHERE 1");
						echo("Unmuted everyone!");
					} else {
						$sql->query("UPDATE `$GuildID` SET `Muted` = '0' WHERE `SteamID64` = '$unmute'");
						echo("Unmuted $unmute!");
					}
				}
				if (isset($_GET['linkDiscordID']) && isset($_GET['linkSteamID64'])) {
					$linkDiscordID = $_GET['linkDiscordID'];
					$linkSteamID64 = $_GET['linkSteamID64'];
					$sql->query("INSERT INTO `$GuildID` (DiscordID, SteamID64) VALUES ($linkDiscordID, $linkSteamID64) ON DUPLICATE KEY UPDATE `DiscordID` = '".$linkDiscordID."', `SteamID64` = '".$linkSteamID64."', `Muted` = '0'");
				}
			} else {
				echo nl2br ("Access denied!\n");
			}
		} else {
			echo nl2br ("Database error!\n");
		}
	} else {
		echo nl2br ("No GuildID specified!\n");
	}
} else {
	echo nl2br ("No token specified!\n");
}
?>
