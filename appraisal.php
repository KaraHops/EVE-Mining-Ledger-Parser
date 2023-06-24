<?php 
$_POST = json_decode(file_get_contents("php://input"), true);

$items = array();
foreach ($_POST as $param_name => $param_val) {
    array_push($items, ["name" => $param_name, "quantity" => $param_val]);
}

$url = 'https://evepraisal.com/appraisal/structured.json';
$payloadarr = ["market_name" => "jita", "persist" => "no", "items" => $items];
$payload = json_encode($payloadarr);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type:application/json", "User-Agent:KaraHops/EVE-Mining-Ledger-Parser"));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$result = curl_exec($ch);
if ($result === false) {
    throw new Exception(curl_error($ch), curl_errno($ch));
}
echo $result;
curl_close($ch);

?>