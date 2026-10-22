<?php
/**
 * Directory front door. Apache DirectoryIndex prefers this over raw index.html,
 * so the old static page is read through the same injector as other HTML.
 */
if (basename($_SERVER["SCRIPT_FILENAME"] ?? "") === "dir-index.php") {
    http_response_code(404);
    exit;
}
require_once __DIR__ . "/lang-boot.php";
$caller = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
$dir = isset($caller[0]["file"]) ? dirname($caller[0]["file"]) : __DIR__;
$html = $dir . "/index.html";
if (!is_file($html)) {
    http_response_code(404);
    exit;
}
header("Content-Type: text/html; charset=UTF-8");
clay_emit($html);
