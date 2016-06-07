<?php
ini_set('error_reporting', E_ALL);
error_reporting(E_ALL);

$db_name = "usr_ph18s241_10";
$db_host = "localhost";
$db_user = "ph18s241";
$db_pass = "suerh3!7&";
$mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name);
$output = '{ "status" : false }';
$erg = "";
header('Content-Type: application/json');
if (!$mysqli->connect_errno) {
	if($_GET['action'] == 'setup'){
		$sql = "SELECT l.lid, l.long, l.lat, t.lang, t.text FROM locations l INNER JOIN locations_txt t ON (l.lid = t.lid) ORDER BY t.text ASC";
		$result = $mysqli->query($sql);
		while($obj = $result->fetch_object()){
			$locs .= '{ "lid" : "'.$obj->lid.'", "long" : '.$obj->long.', "lat" : '.$obj->lat.', "lang" : "'.$obj->lang.'", "text" : "'.$obj->text.'"}';
		}
		
		$sql = "SELECT a.ID, a.long, a.lat, a.location, b.lang, b.text FROM stops a INNER JOIN stops_txt b ON (a.ID = b.ID) ORDER BY a.location ASC";
		$result2 = $mysqli->query($sql);
		
		while($obj = $result2->fetch_object()){
			$stops .= '{ "id" : "'.$obj->ID.'", "long" : '.$obj->long.', "lat" : '.$obj->lat.', "lang" : "'.$obj->lang.'", "location" : "'.$obj->location.'", "text" : "'.$obj->text.'"}';
		}
		
		$output = '{ "status" : true , "locations" : '.$locs.', "stops" : '.$stops.'}';
	}
	if($_GET['action'] == 'versions'){
		$sql = "SELECT name, version FROM versions";
		$result = $mysqli->query($sql);
		if($result->num_rows > 0){
			$erg = '{';
			while($obj = $result->fetch_object()){
				$erg .= '"'.$obj->name.'" : "'.$obj->version.'",';
			}
			$erg = substr($erg, 0, -1);
			$erg .= '}';
			$output = '{ "status" : true, "versions" : '.$erg.'}';
		}else{
			$output = '{ "status" : false }';
		}
	}
	if($_GET['action'] == 'contentupdate'){
		$lang = $_GET['lang'];
		if(!$lang){
			$lang = 'de';
		}
		$loc = $_GET['location'];
		if(!$loc){
			$loc = 'in';
		}
		$sql = "SELECT a.ID, a.long, a.lat, b.text FROM stops a INNER JOIN stops_txt b ON (a.ID = b.ID) WHERE b.lang = '".$lang."' AND a.location= '".$loc."' ORDER BY b.text ASC";
		$result = $mysqli->query($sql);
		if($result->num_rows > 0){
			while($obj = $result->fetch_object()){
				$erg .= '{ "id" : "'.$obj->ID.'", "long" : '.$obj->long.', "lat" : '.$obj->lat.', "text" : "'.$obj->text.'"},';
			}
			$erg = substr($erg, 0, -1);
		}
		$vername = 'contentversion_'.$loc;
		$sql = "SELECT version FROM versions WHERE name ='".$vername."'";
		$result = $mysqli->query($sql);
		$version = 'false';
		if($result->num_rows > 0){
			while($obj = $result->fetch_object()){
				$version = "\"".$obj->version."\"";
			}
		}
		$output = '{ "status" : true, "stops" : ['.$erg.'], "version" : '.$version.'}';
	}
	$mysqli->close();
}else{
	$output = '{ "status" : false }';
}
echo $output;

?>