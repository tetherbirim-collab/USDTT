<?php
/**
 * Kripicard external caller.
 * Base: https://appapi.kripicard.com
 * POST /api/external/cards/createcard   api_key, bin, amount, name_on_card
 * dateOfBirth (YYYY-MM-DD) is added only for a leftover 537872 when the member record already has one.
 * Issued BINs are 441357 and 474613. An empty bin falls back to 441357.
 * POST /api/external/cards/carddetails  api_key, card_id
 * POST /api/external/cards/fundcard     api_key, card_id, amount
 * POST /api/external/cards/deletecard   api_key, card_id
 * Provider amount is a number, minimum 10. The key is read here and never logged.
 * Freeze is not part of this contract.
 */

const KRIPICARD_KEY_MISSING = "Kart sağlayıcı anahtarı yok. Yönetim ücretler ekranından Kripicard anahtarı yapıştırılmalı. Kart numarası üretilmedi.";
const KRIPICARD_BIRTH_REQUIRED = "Bu BIN için kart kuruluşu doğum tarihi istiyor. Üyenin kayıtlı doğum tarihi yok.";
const KRIPICARD_DEFAULT_BIN = "441357";
const KRIPICARD_API_BASE = "https://appapi.kripicard.com";

function kripicard_config_path(): string
{
    return dirname(__DIR__) . "/kripicard.config.php";
}

function kripicard_key(): string
{
    $path = kripicard_config_path();
    if (!is_file($path)) {
        return "";
    }
    $tmp = tempnam(sys_get_temp_dir(), "kcrip");
    if ($tmp === false) {
        return "";
    }
    $php = $tmp . ".php";
    @unlink($tmp);
    if (!@copy($path, $php)) {
        return "";
    }
    $config = include $php;
    @unlink($php);
    if (!is_array($config)) {
        return "";
    }
    return trim((string) ($config["api_key"] ?? ""));
}

function kripicard_ready(): bool
{
    return kripicard_key() !== "";
}

function kripicard_key_shape(string $key): bool
{
    if ($key === "") {
        return true;
    }
    $length = strlen($key);
    if ($length < 8 || $length > 256) {
        return false;
    }
    if (preg_match("/[\\x00-\\x20]/", $key)) {
        return false;
    }
    if (str_contains($key, "<?") || str_contains($key, "?>")) {
        return false;
    }
    return true;
}

function kripicard_write_key(string $key): bool
{
    if (!kripicard_key_shape($key)) {
        return false;
    }
    $path = kripicard_config_path();
    $body = "<?php\nreturn [\n    \"api_key\" => " . var_export($key, true) . ",\n];\n";
    $tmp = $path . ".tmp";
    if (file_put_contents($tmp, $body, LOCK_EX) === false) {
        return false;
    }
    return rename($tmp, $path);
}

function kripicard_redact(string $text): string
{
    $key = kripicard_key();
    if ($key !== "") {
        $text = str_replace($key, "", $text);
    }
    $text = (string) preg_replace("/\\d{13,19}/", "", $text);
    $text = (string) preg_replace("/(?i)(cvv|cvc|security[_ ]?code)\\s*[:=]\\s*\\d{3,4}/", "$1", $text);
    $text = trim((string) preg_replace("/\\s+/u", " ", $text));
    if ($text === "") {
        return "";
    }
    return function_exists("mb_substr") ? mb_substr($text, 0, 240) : substr($text, 0, 240);
}

function kripicard_fail(string $message): array
{
    $clean = kripicard_redact($message);
    if ($clean === "") {
        $clean = "Kart sağlayıcı isteği kabul etmedi.";
    }
    return ["ok" => false, "message" => $clean, "body" => null];
}

function kripicard_scrub(array $node): array
{
    $key = kripicard_key();
    $out = [];
    foreach ($node as $name => $value) {
        if ($name === "api_key") {
            continue;
        }
        if (is_array($value)) {
            $out[$name] = kripicard_scrub($value);
            continue;
        }
        if (is_string($value) && $key !== "" && str_contains($value, $key)) {
            $value = str_replace($key, "", $value);
        }
        $out[$name] = $value;
    }
    return $out;
}

function kripicard_request(string $endpoint, array $fields, int $timeout = 60): array
{
    $key = kripicard_key();
    if ($key === "") {
        return kripicard_fail(KRIPICARD_KEY_MISSING);
    }
    $endpoint = ltrim($endpoint, "/");
    if (!preg_match("#^cards/(createcard|carddetails|fundcard|deletecard)$#", $endpoint)) {
        return kripicard_fail("Kart sağlayıcı isteği kabul etmedi.");
    }
    $url = KRIPICARD_API_BASE . "/api/external/" . $endpoint;
    $fields["api_key"] = $key;
    $flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
    if (defined("JSON_PRESERVE_ZERO_FRACTION")) {
        $flags |= JSON_PRESERVE_ZERO_FRACTION;
    }
    $payload = json_encode($fields, $flags);
    if (!is_string($payload)) {
        return kripicard_fail("Kart sağlayıcı isteği hazırlanamadı.");
    }
    $headers = ["Accept: application/json", "Content-Type: application/json"];
    $raw = false;
    $code = 0;
    if (function_exists("curl_init")) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => max(2, $timeout),
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
        ]);
        $raw = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $errno = curl_errno($ch);
        curl_close($ch);
        if ($raw === false || $raw === "") {
            $fail = kripicard_fail($errno === 28 ? "Kart sağlayıcı zaman aşımı." : "Kart sağlayıcıya ulaşılamadı.");
            $fail["timeout"] = $errno === 28;
            $fail["http"] = $code;
            return $fail;
        }
        if ($code >= 500) {
            $fail = kripicard_fail("Kart sağlayıcı hatası (" . $code . ").");
            $fail["http"] = $code;
            $fail["timeout"] = false;
            return $fail;
        }
    } else {
        $context = stream_context_create([
            "http" => [
                "method" => "POST",
                "header" => implode("\r\n", $headers),
                "content" => $payload,
                "timeout" => max(2, $timeout),
                "ignore_errors" => true,
            ],
        ]);
        $raw = file_get_contents($url, false, $context);
        foreach ($http_response_header ?? [] as $line) {
            if (preg_match("/^HTTP\\/\\S+\\s+(\\d+)/", $line, $match)) {
                $code = (int) $match[1];
            }
        }
    }
    unset($payload, $fields, $key);
    if (!is_string($raw) || $raw === "") {
        $fail = kripicard_fail("Kart sağlayıcıya ulaşılamadı.");
        $fail["timeout"] = true;
        $fail["http"] = $code;
        return $fail;
    }
    $decoded = json_decode($raw, true);
    unset($raw);
    if (!is_array($decoded)) {
        return kripicard_fail("Kart sağlayıcı yanıtı okunamadı.");
    }
    $decoded = kripicard_scrub($decoded);
    if (!kripicard_success($decoded)) {
        $message = "";
        if (isset($decoded["message"]) && is_scalar($decoded["message"])) {
            $message = (string) $decoded["message"];
        }
        if ($message === "" && isset($decoded["error"]) && is_scalar($decoded["error"])) {
            $message = (string) $decoded["error"];
        }
        if ($message === "") {
            $message = "Kart sağlayıcı isteği kabul etmedi.";
        }
        if ($code >= 400) {
            $message .= " (" . $code . ")";
        }
        return kripicard_fail($message);
    }
    return ["ok" => true, "message" => kripicard_redact((string) ($decoded["message"] ?? "")), "body" => $decoded, "http" => $code];
}

function kripicard_success(array $body): bool
{
    if (!array_key_exists("success", $body)) {
        return false;
    }
    $flag = $body["success"];
    return $flag === true || $flag === 1 || $flag === "1" || $flag === "true";
}

function kripicard_card_id(array $body): string
{
    $value = $body["card_id"] ?? ($body["data"]["card_id"] ?? "");
    if (!is_scalar($value)) {
        return "";
    }
    $id = trim((string) $value);
    if ($id === "" || strlen($id) > 120 || preg_match("/[\\x00-\\x1f]/", $id)) {
        return "";
    }
    return $id;
}

function kripicard_last4(array $body): string
{
    $value = $body["last_4"] ?? ($body["data"]["last_4"] ?? "");
    if (!is_scalar($value)) {
        return "";
    }
    $digits = preg_replace("/\\D/", "", (string) $value);
    if (!is_string($digits) || !preg_match("/^\\d{4}$/", $digits)) {
        return "";
    }
    return $digits;
}

function kripicard_pick($node, array $keys, int $depth = 0)
{
    if ($depth > 3 || !is_array($node)) {
        return null;
    }
    foreach ($keys as $key) {
        if (array_key_exists($key, $node) && !is_array($node[$key]) && $node[$key] !== null && $node[$key] !== "") {
            return $node[$key];
        }
    }
    foreach ($node as $value) {
        if (is_array($value)) {
            $found = kripicard_pick($value, $keys, $depth + 1);
            if ($found !== null && $found !== "") {
                return $found;
            }
        }
    }
    return null;
}

function kripicard_pan($raw): string
{
    $digits = preg_replace("/\\D/", "", (string) $raw);
    if (!is_string($digits) || !preg_match("/^\\d{13,19}$/", $digits)) {
        return "";
    }
    return $digits;
}

function kripicard_cvv($raw): string
{
    $digits = preg_replace("/\\D/", "", (string) $raw);
    if (!is_string($digits) || !preg_match("/^\\d{3,4}$/", $digits)) {
        return "";
    }
    return $digits;
}

function kripicard_expiry($raw): string
{
    $raw = trim((string) $raw);
    if (preg_match("/^(0[1-9]|1[0-2])\\/(\\d{2})$/", $raw)) {
        return $raw;
    }
    if (preg_match("/^(0[1-9]|1[0-2])\\/(\\d{4})$/", $raw, $match)) {
        return $match[1] . "/" . substr($match[2], -2);
    }
    if (preg_match("/^(20\\d{2})-(0[1-9]|1[0-2])$/", $raw, $match)) {
        return $match[2] . "/" . substr($match[1], -2);
    }
    if (preg_match("/^(0[1-9]|1[0-2])[- ]?(20\\d{2}|\\d{2})$/", $raw, $match)) {
        return substr($raw, 0, 2) . "/" . substr($match[2], -2);
    }
    return "";
}

function kripicard_details(array $body): array
{
    $pan = kripicard_pan(kripicard_pick($body, ["card_number", "cardNumber", "card_no", "cardNo", "pan", "cc_number", "ccNumber"]));
    $cvv = kripicard_cvv(kripicard_pick($body, ["cvv", "cvc", "card_cvv", "cardCvv", "CVV", "security_code", "securityCode"]));
    $expiry = kripicard_expiry(kripicard_pick($body, ["expiry", "expiration", "exp", "card_expires", "cardExpires", "expiry_date", "expiryDate", "valid_thru", "validThru", "expiration_date"]));
    if ($expiry === "") {
        $month = kripicard_pick($body, ["exp_month", "expMonth", "expiry_month", "expiryMonth"]);
        $year = kripicard_pick($body, ["exp_year", "expYear", "expiry_year", "expiryYear"]);
        if ($month !== null && $year !== null) {
            $expiry = kripicard_expiry(str_pad((string) $month, 2, "0", STR_PAD_LEFT) . "/" . $year);
        }
    }
    $balance = kripicard_pick($body, ["balance", "available_balance", "availableBalance", "card_balance", "cardBalance", "current_balance"]);
    $limit = 0;
    if (is_numeric($balance) && (float) $balance > 0 && function_exists("clay_kurus")) {
        $cents = (int) round(((float) $balance) * 100);
        if ($cents > 0) {
            $limit = clay_kurus($cents);
        }
    }
    $last4 = kripicard_last4($body);
    if ($last4 === "" && $pan !== "") {
        $last4 = substr($pan, -4);
    }
    return ["pan" => $pan, "cvv" => $cvv, "expiry" => $expiry, "limit" => $limit, "last_4" => $last4];
}

function kripicard_stored_birth(string $raw): string
{
    $raw = trim($raw);
    if (!preg_match("/^\\d{4}-\\d{2}-\\d{2}$/", $raw)) {
        return "";
    }
    $year = (int) substr($raw, 0, 4);
    $month = (int) substr($raw, 5, 2);
    $day = (int) substr($raw, 8, 2);
    if (!checkdate($month, $day, $year)) {
        return "";
    }
    return $raw;
}

function kripicard_create_fields(float $amount, string $bin, string $nameOnCard, string $dateOfBirth): array
{
    if ($amount < 10) {
        return kripicard_fail("Kripicard tutarı en az 10 USD olmalı.");
    }
    if ($bin === "") {
        $bin = KRIPICARD_DEFAULT_BIN;
    }
    if (!preg_match("/^\\d{4,8}$/", $bin)) {
        return kripicard_fail("BIN seç.");
    }
    $name = trim((string) preg_replace("/\\s+/u", " ", $nameOnCard));
    if ($name === "") {
        $name = "CLAY";
    }
    $name = function_exists("mb_substr") ? mb_substr($name, 0, 50) : substr($name, 0, 50);
    $fields = [
        "bin" => $bin,
        "amount" => $amount,
        "name_on_card" => $name,
    ];
    if ($bin === "537872") {
        $birth = kripicard_stored_birth($dateOfBirth);
        if ($birth === "") {
            return kripicard_fail(KRIPICARD_BIRTH_REQUIRED);
        }
        $fields["dateOfBirth"] = $birth;
    }
    return ["ok" => true, "message" => "", "body" => $fields];
}

function kripicard_create(float $amount, string $bin, string $nameOnCard, string $dateOfBirth = ""): array
{
    $ready = kripicard_create_fields($amount, $bin, $nameOnCard, $dateOfBirth);
    if (!$ready["ok"]) {
        return $ready;
    }
    $created = kripicard_request("cards/createcard", $ready["body"]);
    if (!$created["ok"]) {
        return $created;
    }
    $cardId = kripicard_card_id($created["body"]);
    if ($cardId === "") {
        return kripicard_fail("Kart sağlayıcı kart kimliği döndürmedi.");
    }
    $last4 = kripicard_last4($created["body"]);
    $face = ["pan" => "", "cvv" => "", "expiry" => "", "limit" => 0, "last_4" => $last4];
    $detailNote = "";
    $details = kripicard_request("cards/carddetails", ["card_id" => $cardId]);
    if ($details["ok"]) {
        $parsed = kripicard_details($details["body"]);
        $face["pan"] = $parsed["pan"];
        $face["cvv"] = $parsed["cvv"];
        $face["expiry"] = $parsed["expiry"];
        $face["limit"] = $parsed["limit"];
        if ($face["last_4"] === "" && $parsed["last_4"] !== "") {
            $face["last_4"] = $parsed["last_4"];
        }
    } else {
        $detailNote = $details["message"];
    }
    return [
        "ok" => true,
        "message" => $created["message"],
        "card_id" => $cardId,
        "last_4" => $face["last_4"],
        "pan" => $face["pan"],
        "cvv" => $face["cvv"],
        "expiry" => $face["expiry"],
        "limit" => $face["limit"],
        "detailNote" => $detailNote,
    ];
}

function kripicard_fund(string $cardId, float $amount): array
{
    if ($cardId === "" || $amount < 10) {
        return kripicard_fail("Kripicard tutarı en az 10 USD olmalı.");
    }
    $funded = kripicard_request("cards/fundcard", [
        "card_id" => $cardId,
        "amount" => $amount,
    ]);
    if (!$funded["ok"]) {
        return $funded;
    }
    $echo = null;
    $data = $funded["body"]["data"] ?? null;
    if (is_array($data) && isset($data["amount"]) && is_numeric($data["amount"])) {
        $echo = (float) $data["amount"];
    } elseif (isset($funded["body"]["amount"]) && is_numeric($funded["body"]["amount"])) {
        $echo = (float) $funded["body"]["amount"];
    }
    return ["ok" => true, "message" => $funded["message"], "amount" => $echo];
}

function kripicard_delete(string $cardId): array
{
    if ($cardId === "") {
        return kripicard_fail("Kart sağlayıcı kart kimliği yok.");
    }
    $deleted = kripicard_request("cards/deletecard", ["card_id" => $cardId]);
    if (!$deleted["ok"]) {
        return $deleted;
    }
    return ["ok" => true, "message" => $deleted["message"]];
}
