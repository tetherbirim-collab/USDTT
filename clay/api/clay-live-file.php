<?php
$id = (string) ($_GET["id"] ?? "");
if (!preg_match("/^[a-f0-9]{16}$/", $id)) {
    http_response_code(404);
    exit;
}
$path = __DIR__ . "/clay-live-uploads/" . $id . ".jpg";
if (!is_file($path)) {
    http_response_code(404);
    exit;
}
header("Content-Type: image/jpeg");
header("X-Content-Type-Options: nosniff");
header("Cache-Control: private, max-age=86400");
readfile($path);
