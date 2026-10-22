<?php
/**
 * Visitor live support. The header shows a representative; the desk shows the customer.
 */

header("Content-Type: application/json; charset=UTF-8");

if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") {
    http_response_code(405);
    echo json_encode(["ok" => false, "error" => "yok"], JSON_UNESCAPED_UNICODE);
    exit;
}

$https = (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off")
    || (($_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "") === "https");
session_name("CLAYSESS");
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => $https,
    "httponly" => true,
    "samesite" => "Strict",
]);
session_start();
require_once __DIR__ . "/clay-harden.php";

$input = json_decode(file_get_contents("php://input") ?: "", true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "yok"], JSON_UNESCAPED_UNICODE);
    exit;
}
if (function_exists("clay_api_limited") && clay_api_limited("live", 80)) {
    http_response_code(429);
    echo json_encode(["ok" => false, "error" => "kilit"], JSON_UNESCAPED_UNICODE);
    exit;
}

function clay_live_out(array $body, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clay_live_name(string $raw): string
{
    $name = trim((string) preg_replace("/\\s+/u", " ", $raw));
    $name = (string) preg_replace("/[\\x00-\\x1F\\x7F]/u", "", $name);
    $len = function_exists("mb_strlen") ? mb_strlen($name) : strlen($name);
    if ($len < 2 || $len > 32) {
        return "";
    }
    return $name;
}

function clay_live_text(string $raw): string
{
    $text = trim((string) preg_replace("/\\s+/u", " ", $raw));
    $text = (string) preg_replace("/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]/u", "", $text);
    $len = function_exists("mb_strlen") ? mb_strlen($text) : strlen($text);
    if ($len < 1 || $len > 400) {
        return "";
    }
    return $text;
}

function clay_live_admin(): bool
{
    $uid = $_SESSION["uid"] ?? "";
    if (!is_string($uid) || $uid === "") {
        return false;
    }
    $raw = @file_get_contents(__DIR__ . "/clay-ledger.json");
    $db = json_decode($raw ?: "", true);
    if (!is_array($db) || !isset($db["users"]) || !is_array($db["users"])) {
        $seed = json_decode((string) @file_get_contents(__DIR__ . "/clay-seed.json"), true);
        $db = is_array($seed) ? $seed : null;
    }
    if (!is_array($db)) {
        return false;
    }
    foreach ($db["users"] as $user) {
        if (($user["id"] ?? "") === $uid && ($user["role"] ?? "") === "yonetici") {
            return true;
        }
    }
    return false;
}

$path = __DIR__ . "/clay-live.json";
$handle = fopen($path, "c+");
if ($handle === false) {
    clay_live_out(["ok" => false, "error" => "kayit"], 500);
}
flock($handle, LOCK_EX);
$store = json_decode(stream_get_contents($handle) ?: "", true);
if (!is_array($store) || !isset($store["threads"]) || !is_array($store["threads"])) {
    $store = ["threads" => []];
}

$op = (string) ($input["op"] ?? "");
$now = (int) round(microtime(true) * 1000);

function clay_live_save($handle, array $store): void
{
    $store["threads"] = array_values($store["threads"]);
    if (count($store["threads"]) > 80) {
        $store["threads"] = array_slice($store["threads"], -80);
    }
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($store, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function clay_live_find(array $store, string $id): int
{
    foreach ($store["threads"] as $i => $row) {
        if (($row["id"] ?? "") === $id) {
            return $i;
        }
    }
    return -1;
}

function clay_live_on(array $store): bool
{
    return !array_key_exists("enabled", $store) || $store["enabled"] !== false;
}

function clay_live_faq_rows(): array
{
    return [
        [
            "id" => "kart",
            "q" => "Kart nasıl alınır",
            "a" => "Karta isim ver, kullanılabilir bakiyeyi seç, sonra o türün BIN listesinden bir satır işaretle. Türü, adı ve kullanılabilir bakiyeyi seçersin. Üzerindeki ad, verdiğin addır.",
        ],
        [
            "id" => "bakiye",
            "q" => "Bakiyem ne zaman yüklenir?",
            "a" => "Kripto ödemesi 1 ağ onayı alınca bakiyen paneline yazılır. Sayfayı yenilemen gerekmez; birkaç saniye içinde güncellenir.",
        ],
        [
            "id" => "plan",
            "q" => "Plan nasıl değişir",
            "a" => "Aylık paket ücreti yalnız plan değişince düşer. Yeni plan, bu plan iptal edilmeden açılmaz.",
        ],
        [
            "id" => "red",
            "q" => "Kartım neden reddedildi?",
            "a" => "Red, günlük/haftalık/toplam limit, yetersiz kart bakiyesi veya platformun kampanyayı kabul etmemesinden olur. Limitleri hesap sayfasındaki kart ayarından kontrol et. Canlı temsilci bakiyeyi değiştiremez; gerekirse yönetim bakar.",
        ],
        [
            "id" => "iade",
            "q" => "Kart oluşmazsa param ne olur?",
            "a" => "Sağlayıcı zaman aşımı veya hata olursa basım tutarı otomatik iade edilir ve paneline bildirim düşer. Destek talebi açmana gerek yok.",
        ],
    ];
}

function clay_live_ensure_autos(array &$store): bool
{
    $needed = clay_live_faq_rows();
    if (!isset($store["autos"]) || !is_array($store["autos"])) {
        $store["autos"] = $needed;
        return true;
    }
    $have = [];
    foreach ($store["autos"] as $row) {
        if (is_array($row) && isset($row["id"])) {
            $have[(string) $row["id"]] = true;
        }
    }
    $dirty = false;
    foreach ($needed as $row) {
        if (empty($have[$row["id"]])) {
            $store["autos"][] = $row;
            $dirty = true;
        }
    }
    return $dirty;
}

function clay_live_smart_reply(string $text): ?string
{
    $fold = function_exists("mb_strtolower") ? mb_strtolower($text, "UTF-8") : strtolower($text);
    $map = [
        "red" => ["redded", "neden red", "kartım neden", "kartim neden", "decline"],
        "bakiye" => ["bakiye", "ne zaman yüklen", "ne zaman yuklen", "yatırım", "yukleme", "yükleme"],
        "iade" => ["iade", "param", "oluşmadı", "olusmadi", "timeout"],
        "kart" => ["kart nasıl", "kart nasil", "nasıl alın", "nasil alin"],
        "plan" => ["plan nasıl", "plan nasil", "paket"],
    ];
    foreach ($map as $id => $needles) {
        foreach ($needles as $n) {
            if (str_contains($fold, $n)) {
                foreach (clay_live_faq_rows() as $row) {
                    if ($row["id"] === $id) {
                        return $row["a"];
                    }
                }
            }
        }
    }
    return null;
}

function clay_live_auto(array $store, string $id): ?array
{
    foreach ($store["autos"] as $row) {
        if (is_array($row) && (string) ($row["id"] ?? "") === $id) {
            return $row;
        }
    }
    return null;
}

function clay_live_users(): array
{
    $raw = @file_get_contents(__DIR__ . "/clay-ledger.json");
    $db = json_decode($raw ?: "", true);
    if (!is_array($db) || !isset($db["users"]) || !is_array($db["users"])) {
        $seed = json_decode((string) @file_get_contents(__DIR__ . "/clay-seed.json"), true);
        $db = is_array($seed) ? $seed : null;
    }
    if (!is_array($db) || !isset($db["users"]) || !is_array($db["users"])) {
        return [];
    }
    return $db["users"];
}

function clay_live_session_user(): ?array
{
    $uid = $_SESSION["uid"] ?? "";
    if (!is_string($uid) || $uid === "") {
        return null;
    }
    foreach (clay_live_users() as $user) {
        if (($user["id"] ?? "") !== $uid) {
            continue;
        }
        $status = (string) ($user["status"] ?? "acik");
        if ($status === "askida" || $status === "kapali") {
            return null;
        }
        return ["id" => $uid, "username" => trim((string) ($user["username"] ?? ""))];
    }
    return null;
}

function clay_live_anon_label(array $store, int $skip): string
{
    $base = "Clay Anonim";
    $used = [];
    foreach ($store["threads"] as $i => $row) {
        if ($i === $skip || ($row["status"] ?? "acik") === "bitti") {
            continue;
        }
        $label = (string) ($row["customer"] ?? $row["username"] ?? "");
        if (preg_match('/^Clay Anonim( [0-9]+)?$/', $label)) {
            $used[$label] = true;
        }
    }
    if (empty($used[$base])) {
        return $base;
    }
    for ($n = 2; $n < 40; $n++) {
        $label = $base . " " . $n;
        if (empty($used[$label])) {
            return $label;
        }
    }
    return $base . " 40";
}

function clay_live_agent(array &$store): string
{
    $names = ["Ahmet", "Ayşe", "Mehmet", "Fatma", "Ali", "Zeynep"];
    $cursor = (int) ($store["agentCursor"] ?? 0);
    $picked = $names[$cursor % count($names)];
    $store["agentCursor"] = ($cursor + 1) % count($names);
    return $picked;
}

function clay_live_customer_label(array $store, int $skip, ?array $member): string
{
    if ($member) {
        $name = trim((string) ($member["username"] ?? ""));
        $folded = function_exists("mb_strtolower") ? mb_strtolower($name, "UTF-8") : strtolower($name);
        if ($name === "" || $folded === "anonim") {
            return clay_live_anon_label($store, $skip);
        }
        return $name;
    }
    return clay_live_anon_label($store, $skip);
}

function clay_live_apply_name(array &$store, int $index): void
{
    $member = clay_live_session_user();
    $id = (string) ($store["threads"][$index]["id"] ?? "");
    $owner = (string) ($store["threads"][$index]["userId"] ?? "");
    $bound = (string) ($_SESSION["clayLive"] ?? "");
    $current = (string) ($store["threads"][$index]["username"] ?? "");
    $fresh = $owner === "" && $current === "";
    if ($member) {
        if (!$fresh && $owner !== "" && $owner !== $member["id"]) {
            return;
        }
        if (!$fresh && $owner === "" && $bound !== "" && $bound !== $id) {
            return;
        }
        $label = clay_live_customer_label($store, $index, $member);
        $store["threads"][$index]["userId"] = $member["id"];
    } else {
        if ($owner !== "") {
            return;
        }
        if (preg_match('/^Clay Anonim( [0-9]+)?$/', $current)) {
            $label = $current;
        } else {
            $label = clay_live_customer_label($store, $index, null);
        }
        $store["threads"][$index]["userId"] = "";
    }
    $store["threads"][$index]["customer"] = $label;
    $store["threads"][$index]["username"] = $label;
    if ((string) ($store["threads"][$index]["agent"] ?? "") === "") {
        $store["threads"][$index]["agent"] = clay_live_agent($store);
    }
    $_SESSION["clayLive"] = $id;
}

function clay_live_welcome(array &$store, int $index, int $now): void
{
    foreach ($store["threads"][$index]["messages"] ?? [] as $msg) {
        if (($msg["from"] ?? "") === "welcome") {
            return;
        }
    }
    $store["threads"][$index]["messages"][] = [
        "from" => "welcome",
        "text" => "Clay Virtual Sanal Kart Hizmetleri Sizlere Nasıl Yardımcı Olabiliriz?",
        "at" => $now,
    ];
}

if ($op === "status") {
    $on = clay_live_on($store);
    $seeded = clay_live_ensure_autos($store);
    if ($seeded) {
        clay_live_save($handle, $store);
    } else {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
    clay_live_out(["ok" => true, "enabled" => $on, "autos" => $store["autos"]]);
}

if ($op === "switch") {
    if (!clay_live_admin()) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "giris"], 403);
    }
    $store["enabled"] = ((string) ($input["acik"] ?? "")) === "1";
    $on = clay_live_on($store);
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "enabled" => $on]);
}

if ($op === "thread") {
    if (!clay_live_admin()) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "giris"], 403);
    }
    $mode = (string) ($input["mod"] ?? "");
    $index = clay_live_find($store, (string) ($input["thread"] ?? ""));
    if ($index < 0 || !in_array($mode, ["beklemede", "acik", "bitti", "sil"], true)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "yok"], 404);
    }
    if ($mode === "sil") {
        array_splice($store["threads"], $index, 1);
    } else {
        $store["threads"][$index]["status"] = $mode;
    }
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "enabled" => clay_live_on($store), "threads" => $store["threads"]]);
}

if ($op === "upload") {
    if (!clay_live_on($store)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "kapali", "enabled" => false], 403);
    }
    $index = clay_live_find($store, (string) ($input["thread"] ?? ""));
    $rawImage = (string) ($input["image"] ?? "");
    if ($index < 0 || ($store["threads"][$index]["status"] ?? "acik") === "bitti") {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "yok"], 404);
    }
    if (!preg_match("#^data:image/jpeg;base64,#", $rawImage)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "foto"], 400);
    }
    $bin = base64_decode(substr($rawImage, strpos($rawImage, ",") + 1), true);
    if (!is_string($bin) || strlen($bin) < 32 || strlen($bin) > 1200000 || substr($bin, 0, 3) !== "\xFF\xD8\xFF") {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "foto"], 400);
    }
    $dir = __DIR__ . "/clay-live-uploads";
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "kayit"], 500);
    }
    $imageId = bin2hex(random_bytes(8));
    if (file_put_contents($dir . "/" . $imageId . ".jpg", $bin) === false) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "kayit"], 500);
    }
    $caption = clay_live_text((string) ($input["text"] ?? ""));
    clay_live_apply_name($store, $index);
    $store["threads"][$index]["messages"][] = [
        "from" => "visitor",
        "text" => $caption,
        "image" => $imageId,
        "at" => $now,
    ];
    $thread = $store["threads"][$index];
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "thread" => $thread]);
}

if ($op === "open" || $op === "send") {
    if (!clay_live_on($store)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "kapali", "enabled" => false], 403);
    }
    $text = $op === "send" ? clay_live_text((string) ($input["text"] ?? "")) : "";
    if ($op === "send" && $text === "") {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "alan"], 400);
    }
    $threadId = (string) ($input["thread"] ?? "");
    if ($threadId === "" && $op === "open") {
        $threadId = (string) ($_SESSION["clayLive"] ?? "");
    }
    $index = $threadId !== "" ? clay_live_find($store, $threadId) : -1;
    if ($op === "open" && $index >= 0 && ($store["threads"][$index]["status"] ?? "acik") === "bitti") {
        $index = -1;
    }
    if ($index >= 0 && ($store["threads"][$index]["status"] ?? "acik") === "bitti") {
        $thread = $store["threads"][$index];
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "bitti", "thread" => $thread], 409);
    }
    if ($index < 0) {
        $threadId = "lv_" . bin2hex(random_bytes(6));
        $store["threads"][] = [
            "id" => $threadId,
            "username" => "",
            "userId" => "",
            "status" => "acik",
            "at" => $now,
            "messages" => [],
        ];
        $index = count($store["threads"]) - 1;
    }
    clay_live_apply_name($store, $index);
    if ($op === "open") {
        clay_live_welcome($store, $index, $now);
    }
    if ($op === "send") {
        $store["threads"][$index]["messages"][] = ["from" => "visitor", "text" => $text, "at" => $now];
        $smart = clay_live_smart_reply($text);
        if ($smart) {
            $store["threads"][$index]["messages"][] = ["from" => "auto", "text" => $smart, "at" => $now + 1];
        }
    }
    $thread = $store["threads"][$index];
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "thread" => $thread]);
}

if ($op === "read") {
    $threadId = (string) ($input["thread"] ?? "");
    $index = clay_live_find($store, $threadId);
    if ($index < 0) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "yok"], 404);
    }
    $before = (string) ($store["threads"][$index]["username"] ?? "") . "|" . (string) ($store["threads"][$index]["userId"] ?? "");
    clay_live_apply_name($store, $index);
    $after = (string) ($store["threads"][$index]["username"] ?? "") . "|" . (string) ($store["threads"][$index]["userId"] ?? "");
    $thread = $store["threads"][$index];
    if ($before !== $after) {
        clay_live_save($handle, $store);
    } else {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
    clay_live_out(["ok" => true, "thread" => $thread]);
}

if ($op === "auto") {
    if (!clay_live_on($store)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "kapali", "enabled" => false], 403);
    }
    clay_live_ensure_autos($store);
    $pair = clay_live_auto($store, (string) ($input["id"] ?? ""));
    $threadId = (string) ($input["thread"] ?? "");
    $index = $threadId !== "" ? clay_live_find($store, $threadId) : -1;
    if ($pair === null || $index < 0 || ($store["threads"][$index]["status"] ?? "acik") === "bitti") {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "yok", "autos" => $store["autos"]], 404);
    }
    clay_live_apply_name($store, $index);
    $store["threads"][$index]["messages"][] = ["from" => "visitor", "text" => (string) $pair["q"], "at" => $now];
    $store["threads"][$index]["messages"][] = ["from" => "auto", "text" => (string) $pair["a"], "at" => $now + 1];
    $thread = $store["threads"][$index];
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "thread" => $thread, "autos" => $store["autos"]]);
}

if ($op === "auto-add" || $op === "auto-del" || $op === "auto-edit" || $op === "list" || $op === "reply") {
    if (!clay_live_admin()) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "giris"], 403);
    }
}

if ($op === "auto-add") {
    clay_live_ensure_autos($store);
    $question = clay_live_text((string) ($input["q"] ?? ""));
    $answer = clay_live_text((string) ($input["a"] ?? ""));
    if ($question === "" || $answer === "") {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "alan", "autos" => $store["autos"]], 400);
    }
    $store["autos"][] = ["id" => "au_" . bin2hex(random_bytes(4)), "q" => $question, "a" => $answer];
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "enabled" => clay_live_on($store), "threads" => $store["threads"], "autos" => $store["autos"]]);
}

if ($op === "auto-del") {
    clay_live_ensure_autos($store);
    $id = (string) ($input["id"] ?? "");
    $store["autos"] = array_values(array_filter($store["autos"], function ($row) use ($id) {
        return !is_array($row) || (string) ($row["id"] ?? "") !== $id;
    }));
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "enabled" => clay_live_on($store), "threads" => $store["threads"], "autos" => $store["autos"]]);
}

if ($op === "auto-edit") {
    clay_live_ensure_autos($store);
    $id = (string) ($input["id"] ?? "");
    $question = clay_live_text((string) ($input["q"] ?? ""));
    $answer = clay_live_text((string) ($input["a"] ?? ""));
    if ($id === "" || $question === "" || $answer === "") {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "alan", "autos" => $store["autos"]], 400);
    }
    $found = false;
    foreach ($store["autos"] as $i => $row) {
        if (!is_array($row) || (string) ($row["id"] ?? "") !== $id) {
            continue;
        }
        $store["autos"][$i]["q"] = $question;
        $store["autos"][$i]["a"] = $answer;
        $found = true;
        break;
    }
    if (!$found) {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "yok", "autos" => $store["autos"]], 404);
    }
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "enabled" => clay_live_on($store), "threads" => $store["threads"], "autos" => $store["autos"]]);
}

if ($op === "list") {
    $seeded = clay_live_ensure_autos($store);
    if ($seeded) {
        clay_live_save($handle, $store);
    } else {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
    clay_live_out(["ok" => true, "enabled" => clay_live_on($store), "threads" => $store["threads"], "autos" => $store["autos"]]);
}

if ($op === "reply") {
    $threadId = (string) ($input["thread"] ?? "");
    $text = clay_live_text((string) ($input["text"] ?? ""));
    $index = clay_live_find($store, $threadId);
    if ($index < 0 || $text === "") {
        flock($handle, LOCK_UN);
        fclose($handle);
        clay_live_out(["ok" => false, "error" => "yok"], 404);
    }
    $store["threads"][$index]["messages"][] = ["from" => "admin", "text" => $text, "at" => $now];
    $thread = $store["threads"][$index];
    clay_live_save($handle, $store);
    clay_live_out(["ok" => true, "thread" => $thread]);
}

flock($handle, LOCK_UN);
fclose($handle);
clay_live_out(["ok" => false, "error" => "yok"], 404);
