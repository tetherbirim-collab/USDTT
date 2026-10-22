<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");
$bin = preg_replace("/\D/", "", isset($_GET["bin"]) ? $_GET["bin"] : "");
if (strlen($bin) < 6 || strlen($bin) > 8) {
  echo json_encode(array("ok" => false, "error" => "bin"));
  exit;
}

function clay_bin_get($url, $headers) {
  if (!function_exists("curl_init")) return null;
  $headers[] = "User-Agent: Mozilla/5.0";
  $ch = curl_init($url);
  curl_setopt_array($ch, array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_HTTPHEADER => $headers,
  ));
  $body = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($code !== 200 || !$body) return null;
  $json = json_decode($body, true);
  return is_array($json) ? $json : null;
}

$live = clay_bin_get("https://lookup.binlist.net/" . $bin, array("Accept-Version: 3", "Accept: application/json"));
if ($live && isset($live["type"])) {
  $country = isset($live["country"]) && is_array($live["country"]) ? $live["country"] : array();
  echo json_encode(array(
    "ok" => true,
    "source" => "binlist",
    "bin" => $bin,
    "type" => $live["type"],
    "prepaid" => !empty($live["prepaid"]) || $live["type"] === "prepaid",
    "country" => isset($country["name"]) ? $country["name"] : null,
    "alpha2" => isset($country["alpha2"]) ? $country["alpha2"] : null,
    "emoji" => isset($country["emoji"]) ? $country["emoji"] : null,
    "bank" => isset($live["bank"]["name"]) ? $live["bank"]["name"] : null,
    "scheme" => isset($live["scheme"]) ? $live["scheme"] : null,
  ));
  exit;
}

$anti = clay_bin_get("https://bins.antipublic.cc/bins/" . $bin, array("Accept: application/json"));
if ($anti && isset($anti["type"])) {
  echo json_encode(array(
    "ok" => true,
    "source" => "antipublic",
    "bin" => $bin,
    "type" => strtolower($anti["type"]),
    "prepaid" => strtolower($anti["type"]) === "prepaid",
    "country" => isset($anti["country_name"]) ? $anti["country_name"] : null,
    "alpha2" => isset($anti["country"]) ? $anti["country"] : null,
    "emoji" => isset($anti["country_flag"]) ? $anti["country_flag"] : null,
    "bank" => isset($anti["bank"]) ? $anti["bank"] : null,
    "scheme" => isset($anti["brand"]) ? strtolower($anti["brand"]) : null,
  ));
  exit;
}

echo json_encode(array("ok" => false, "bin" => $bin));
