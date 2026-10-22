<?php
require_once __DIR__ . "/lang-boot.php";
$rel = isset($_GET["clay_html"]) ? (string) $_GET["clay_html"] : "";
$rel = str_replace("\\", "/", $rel);
if ($rel === "" || strpos($rel, "..") !== false || substr($rel, -5) !== ".html") {
    http_response_code(404);
    exit;
}
$root = realpath(__DIR__);
$path = realpath(__DIR__ . "/" . $rel);
if ($root === false || $path === false || strpos($path, $root . DIRECTORY_SEPARATOR) !== 0 || !is_file($path)) {
    http_response_code(404);
    exit;
}
header("Content-Type: text/html; charset=UTF-8");
clay_emit($path);
