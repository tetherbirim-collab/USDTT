<?php
/**
 * Rate limit, captcha, audit, Telegram notify, geo helpers.
 * JSON ledger only: file locks instead of SQL transactions.
 */

if (!function_exists("clay_now")) {
    require_once __DIR__ . "/clay-ledger.php";
}

function clay_security_config(): array
{
    $path = dirname(__DIR__) . "/clay-security.config.php";
    $config = is_file($path) ? include $path : [];
    if (!is_array($config)) {
        $config = [];
    }
    return [
        "turnstile_site" => trim((string) ($config["turnstile_site"] ?? "")),
        "turnstile_secret" => trim((string) ($config["turnstile_secret"] ?? "")),
        "recaptcha_site" => trim((string) ($config["recaptcha_site"] ?? "")),
        "recaptcha_secret" => trim((string) ($config["recaptcha_secret"] ?? "")),
        "require_captcha" => !empty($config["require_captcha"]),
        "admin_idle_seconds" => max(120, (int) ($config["admin_idle_seconds"] ?? 900)),
        "login_max_fails" => max(3, (int) ($config["login_max_fails"] ?? 8)),
        "login_lock_seconds" => max(60, (int) ($config["login_lock_seconds"] ?? 900)),
    ];
}

function clay_plain(string $raw, int $max = 800): string
{
    $value = str_replace("\0", "", $raw);
    $value = strip_tags($value);
    $value = (string) preg_replace("/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]/u", "", $value);
    $value = trim((string) preg_replace("/\\s+/u", " ", $value));
    if (function_exists("mb_substr")) {
        return mb_substr($value, 0, $max);
    }
    return substr($value, 0, $max);
}

function clay_mask_pan(string $pan): string
{
    $digits = preg_replace("/\\D/", "", $pan);
    if (!is_string($digits) || strlen($digits) < 4) {
        return "****";
    }
    return str_repeat("*", max(0, strlen($digits) - 4)) . substr($digits, -4);
}

function clay_guard_path(): string
{
    return __DIR__ . "/clay-guard.json";
}

function clay_audit_path(): string
{
    return __DIR__ . "/clay-audit.jsonl";
}

function clay_guard_store(callable $change)
{
    $path = clay_guard_path();
    $handle = fopen($path, "c+");
    if ($handle === false) {
        return null;
    }
    flock($handle, LOCK_EX);
    $raw = stream_get_contents($handle);
    $data = json_decode($raw ?: "{}", true);
    if (!is_array($data)) {
        $data = [];
    }
    $result = $change($data);
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $result;
}

function clay_audit(string $event, array $row = []): void
{
    $path = clay_audit_path();
    $handle = fopen($path, "ab");
    if ($handle === false) {
        return;
    }
    flock($handle, LOCK_EX);
    if (isset($row["pan"])) {
        $row["pan"] = clay_mask_pan((string) $row["pan"]);
    }
    unset($row["cvv"], $row["cvc"], $row["seed"], $row["tohum"], $row["parola"], $row["password"], $row["api_key"], $row["bot"]);
    $line = json_encode([
        "at" => clay_now(),
        "ip" => function_exists("clay_client_ip") ? clay_client_ip() : "",
        "event" => $event,
        "who" => (string) ($row["who"] ?? ""),
        "data" => $row,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (is_string($line) && $line !== "") {
        fwrite($handle, $line . "\n");
    }
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function clay_loopback_ip(string $ip): bool
{
    if ($ip === "" || $ip === "127.0.0.1" || $ip === "::1") {
        return true;
    }
    return (bool) filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false
        && filter_var($ip, FILTER_VALIDATE_IP);
}

function clay_login_locked(string $username): bool
{
    $cfg = clay_security_config();
    $ip = function_exists("clay_client_ip") ? clay_client_ip() : "";
    $key = $ip . "|" . strtolower($username);
    $locked = clay_guard_store(function (&$data) use ($key, $cfg) {
        $row = $data["login"][$key] ?? null;
        if (!is_array($row)) {
            return false;
        }
        $until = (int) ($row["until"] ?? 0);
        if ($until > time()) {
            return true;
        }
        if ($until > 0 && $until <= time()) {
            unset($data["login"][$key]);
        }
        return false;
    });
    return (bool) $locked;
}

function clay_login_fail(string $username): void
{
    $cfg = clay_security_config();
    $ip = function_exists("clay_client_ip") ? clay_client_ip() : "";
    $key = $ip . "|" . strtolower($username);
    clay_guard_store(function (&$data) use ($key, $cfg) {
        if (!isset($data["login"]) || !is_array($data["login"])) {
            $data["login"] = [];
        }
        $row = $data["login"][$key] ?? ["n" => 0, "until" => 0];
        $row["n"] = (int) ($row["n"] ?? 0) + 1;
        if ($row["n"] >= $cfg["login_max_fails"]) {
            $row["until"] = time() + $cfg["login_lock_seconds"];
        }
        $data["login"][$key] = $row;
        return true;
    });
}

function clay_login_ok(string $username): void
{
    $ip = function_exists("clay_client_ip") ? clay_client_ip() : "";
    $key = $ip . "|" . strtolower($username);
    clay_guard_store(function (&$data) use ($key) {
        if (isset($data["login"][$key])) {
            unset($data["login"][$key]);
        }
        return true;
    });
}

function clay_admin_limited(): bool
{
    $ip = function_exists("clay_client_ip") ? clay_client_ip() : "";
    $window = (int) floor(time() / 60);
    $key = $ip . "|" . $window;
    $over = clay_guard_store(function (&$data) use ($key) {
        if (!isset($data["admin"]) || !is_array($data["admin"])) {
            $data["admin"] = [];
        }
        foreach ($data["admin"] as $old => $n) {
            if (!str_contains((string) $old, "|" . (string) ((int) floor(time() / 60)))) {
                unset($data["admin"][$old]);
            }
        }
        $n = (int) ($data["admin"][$key] ?? 0) + 1;
        $data["admin"][$key] = $n;
        return $n > 40;
    });
    return (bool) $over;
}

function clay_captcha_public(): array
{
    $cfg = clay_security_config();
    if ($cfg["turnstile_site"] !== "") {
        return ["provider" => "turnstile", "site" => $cfg["turnstile_site"]];
    }
    if ($cfg["recaptcha_site"] !== "") {
        return ["provider" => "recaptcha", "site" => $cfg["recaptcha_site"]];
    }
    return ["provider" => "", "site" => ""];
}

function clay_verify_captcha(string $token): bool
{
    $cfg = clay_security_config();
    $secret = $cfg["turnstile_secret"] !== "" ? $cfg["turnstile_secret"] : $cfg["recaptcha_secret"];
    $url = $cfg["turnstile_secret"] !== ""
        ? "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        : "https://www.google.com/recaptcha/api/siteverify";
    if ($secret === "") {
        return false;
    }
    if ($token === "") {
        return false;
    }
    $post = http_build_query([
        "secret" => $secret,
        "response" => $token,
        "remoteip" => function_exists("clay_client_ip") ? clay_client_ip() : "",
    ]);
    $raw = "";
    if (function_exists("curl_init")) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $post,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_CONNECTTIMEOUT => 4,
        ]);
        $raw = (string) curl_exec($ch);
        curl_close($ch);
    } else {
        $ctx = stream_context_create([
            "http" => [
                "method" => "POST",
                "header" => "Content-Type: application/x-www-form-urlencoded",
                "content" => $post,
                "timeout" => 8,
            ],
        ]);
        $raw = (string) file_get_contents($url, false, $ctx);
    }
    $data = json_decode($raw, true);
    return is_array($data) && !empty($data["success"]);
}

function clay_captcha_needed_for_admin(): bool
{
    $cfg = clay_security_config();
    $pub = clay_captcha_public();
    $secret = $cfg["turnstile_secret"] !== "" ? $cfg["turnstile_secret"] : $cfg["recaptcha_secret"];
    return $pub["site"] !== "" && $secret !== "";
}

function clay_telegram_send(array $settings, string $text): string
{
    $token = trim((string) ($settings["telegramBot"] ?? ""));
    $chat = trim((string) ($settings["telegramChat"] ?? ""));
    if ($token === "" || $chat === "") {
        return "telegram-eksik";
    }
    if (!preg_match("/^\\d{8,12}:[A-Za-z0-9_-]{30,}$/", $token) && !preg_match("/^\\d{6,}:[A-Za-z0-9_-]{20,}$/", $token)) {
        return "telegram-jeton";
    }
    if (!preg_match("/^-?\\d{5,20}$/", $chat) && !preg_match("/^@[A-Za-z][A-Za-z0-9_]{3,31}$/", $chat)) {
        return "telegram-chat";
    }
    $url = "https://api.telegram.org/bot" . $token . "/sendMessage";
    $payload = json_encode([
        "chat_id" => $chat,
        "text" => $text,
        "disable_web_page_preview" => true,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($payload)) {
        return "telegram-govde";
    }
    $raw = "";
    $code = 0;
    if (function_exists("curl_init")) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_CONNECTTIMEOUT => 4,
        ]);
        $raw = (string) curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    } else {
        $ctx = stream_context_create([
            "http" => [
                "method" => "POST",
                "header" => "Content-Type: application/json",
                "content" => $payload,
                "timeout" => 8,
                "ignore_errors" => true,
            ],
        ]);
        $raw = (string) file_get_contents($url, false, $ctx);
    }
    $data = json_decode($raw, true);
    if ($code >= 200 && $code < 300 && is_array($data) && !empty($data["ok"])) {
        return "ok";
    }
    return "telegram-gonderilemedi";
}

function clay_country_lang(?string $country): string
{
    $cc = strtoupper((string) $country);
    if ($cc === "TR") {
        return "tr";
    }
    return "en";
}

function clay_https(): bool
{
    return (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off")
        || (($_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "") === "https");
}

function clay_cache_path(): string
{
    return __DIR__ . "/clay-cache.json";
}

function clay_cache_bust(): void
{
    @unlink(clay_cache_path());
    @unlink(sys_get_temp_dir() . "/clay-lp-" . substr(hash("sha256", __DIR__), 0, 16) . ".json");
    foreach (glob(sys_get_temp_dir() . "/clay-html-*.html") ?: [] as $file) {
        @unlink($file);
    }
}

function clay_cache_get(string $key)
{
    $path = clay_cache_path();
    if (!is_file($path)) {
        return null;
    }
    $raw = @file_get_contents($path);
    $data = json_decode($raw ?: "", true);
    if (!is_array($data) || !isset($data[$key]) || !is_array($data[$key])) {
        return null;
    }
    $row = $data[$key];
    if ((int) ($row["until"] ?? 0) < time()) {
        return null;
    }
    return $row["value"] ?? null;
}

function clay_cache_set(string $key, $value, int $ttl = 45): void
{
    $path = clay_cache_path();
    $handle = fopen($path, "c+");
    if ($handle === false) {
        return;
    }
    flock($handle, LOCK_EX);
    $data = json_decode(stream_get_contents($handle) ?: "{}", true);
    if (!is_array($data)) {
        $data = [];
    }
    $data[$key] = ["until" => time() + $ttl, "value" => $value];
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function clay_api_limited(string $bucket, int $max = 60): bool
{
    $ip = function_exists("clay_client_ip") ? clay_client_ip() : "";
    $uid = (string) ($_SESSION["uid"] ?? "");
    $window = (int) floor(time() / 60);
    $key = "clayrl:" . $bucket . "|" . $ip . "|" . $uid . "|" . $window;
    if (function_exists("apcu_inc")) {
        $ok = false;
        $n = apcu_inc($key, 1, $ok, 70);
        if ($ok) {
            return (int) $n > $max;
        }
    }
    if (class_exists("Redis")) {
        try {
            $redis = new Redis();
            if (@$redis->connect("127.0.0.1", 6379, 0.05)) {
                $n = (int) $redis->incr($key);
                if ($n === 1) {
                    $redis->expire($key, 70);
                }
                return $n > $max;
            }
        } catch (Throwable $e) {
        }
    }
    $over = clay_guard_store(function (&$data) use ($key, $max, $window) {
        if (!isset($data["api"]) || !is_array($data["api"])) {
            $data["api"] = [];
        }
        foreach ($data["api"] as $old => $n) {
            if (!str_ends_with((string) $old, "|" . (string) $window)) {
                unset($data["api"][$old]);
            }
        }
        $n = (int) ($data["api"][$key] ?? 0) + 1;
        $data["api"][$key] = $n;
        return $n > $max;
    });
    return (bool) $over;
}

function clay_desk_role(?array $user): string
{
    if (!$user || ($user["role"] ?? "") !== "yonetici") {
        return "";
    }
    $role = (string) ($user["adminRole"] ?? "tam");
    if (!in_array($role, ["tam", "siparis", "ucret", "bakiye", "destek", "izle"], true)) {
        return "tam";
    }
    return $role;
}

function clay_admin_allows(?array $user, string $action): bool
{
    $role = clay_desk_role($user);
    if ($role === "") {
        return false;
    }
    if ($role === "tam") {
        return true;
    }
    $siparis = [
        "admin-ticket", "admin-ticket-close", "admin-ticket-sil", "admin-ticket-temizle",
        "admin-notice", "admin-notice-save", "admin-notice-remove", "admin-notice-sil", "admin-notice-temizle",
        "admin-announce", "admin-card", "admin-close", "admin-edit-card", "admin-edit-tx",
        "admin-tx-sil", "admin-tx-temizle", "admin-siparis-iptal", "admin-siparis-sil",
    ];
    $ucret = ["admin-fees", "admin-plan", "admin-bin-add", "admin-bin-save", "admin-bin-remove", "admin-bin-paste", "admin-copy", "admin-lp", "admin-telegram"];
    $bakiye = ["admin-balance", "admin-set-balance", "admin-topup", "admin-transfer", "admin-cek"];
    if ($role === "siparis") {
        return in_array($action, $siparis, true);
    }
    if ($role === "ucret") {
        return in_array($action, $ucret, true);
    }
    if ($role === "bakiye") {
        return in_array($action, $bakiye, true);
    }
    if ($role === "destek") {
        return in_array($action, ["admin-ticket", "admin-ticket-close", "admin-notice", "admin-card"], true);
    }
    if ($role === "izle") {
        return false;
    }
    return false;
}

