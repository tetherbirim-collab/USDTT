<?php
require_once __DIR__ . "/clay-ledger.php";
if (!function_exists("clay_error_tr")) {
    require_once __DIR__ . "/clay-errors.php";
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

function clay_backup_out(int $status, array $body): void
{
    http_response_code($status);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

[$handle, $db] = clay_load_raw();
if (!$handle || !is_array($db)) {
    clay_backup_out(500, ["code" => "e-defter"]);
    exit;
}
$me = clay_session_user($db);
if (!$me || ($me["role"] ?? "") !== "yonetici" || clay_desk_role($me) !== "tam") {
    clay_release($handle);
    clay_backup_out(403, ["code" => "e-yetki", "message" => clay_error_tr("e-yetki")]);
    exit;
}
$op = (string) ($_GET["op"] ?? $_POST["op"] ?? "indir");
if ($op === "indir") {
    clay_release($handle);
    $raw = (string) file_get_contents(clay_store_path());
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Disposition: attachment; filename=\"clay-ledger-backup.json\"");
    echo $raw;
    exit;
}
if ($op === "yukle") {
    if (clay_in($_POST, "onay") !== "on" && clay_in(json_decode(file_get_contents("php://input") ?: "{}", true) ?: [], "onay") !== "on") {
        clay_release($handle);
        clay_backup_out(400, ["code" => "e-onay", "message" => clay_error_tr("e-onay")]);
        exit;
    }
    $upload = "";
    if (!empty($_FILES["defter"]["tmp_name"])) {
        $upload = (string) file_get_contents($_FILES["defter"]["tmp_name"]);
    } else {
        $input = json_decode(file_get_contents("php://input") ?: "", true);
        if (is_array($input) && isset($input["defter"])) {
            $upload = is_string($input["defter"]) ? $input["defter"] : json_encode($input["defter"]);
        }
    }
    $data = json_decode($upload, true);
    if (!is_array($data) || !isset($data["users"]) || !is_array($data["users"])) {
        clay_release($handle);
        clay_backup_out(400, ["code" => "e-defter", "message" => "Yedek okunamadı."]);
        exit;
    }
    clay_commit($handle, $data);
    clay_audit("admin-yedek-yukle", ["who" => (string) $me["id"]]);
    clay_backup_out(200, ["code" => "ok"]);
    exit;
}
clay_release($handle);
clay_backup_out(400, ["code" => "e-yok"]);
