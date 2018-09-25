<?php

$sqlUser = "";
$sqlPassword = "";
$sqlServer = "127.0.0.1";
$sqlDatabase = "";

$sql = new MySQLi($sqlServer, $sqlUser, $sqlPassword, $sqlDatabase);
$sql->set_charset("utf8");

if (isset($_GET['guildid'])) {
    $GuildID = $_GET['guildid'];

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
}
