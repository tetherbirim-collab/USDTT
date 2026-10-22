<?php
require_once dirname(__DIR__) . "/lang-boot.php";

header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store");

$ip = clay_client_ip();
$country = clay_lookup_country($ip);
$lang = clay_country_to_lang($country);
$currency = $country === "TR" ? "TRY" : "USD";

echo json_encode([
    "ok" => true,
    "country" => $country,
    "lang" => $lang,
    "currency" => $currency,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
