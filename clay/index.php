<?php
if (preg_match('#^/index\.txt$#', (string) parse_url((string) ($_SERVER["REQUEST_URI"] ?? ""), PHP_URL_PATH))) {
    // Next <Link href="/"> prefetches /index.txt; a non-RSC 200 makes the router do a full page load.
    header("Content-Type: text/html; charset=UTF-8");
    header("Cache-Control: no-store");
    exit;
}
require_once __DIR__ . "/lang-boot.php";
require_once __DIR__ . "/api/clay-lp.php";

$lang = clay_pick_lang() === "tr" ? "tr" : "en";
$copy = clay_lp_copy();
$c = $copy[$lang];

$who = "";
$sid = (string) ($_COOKIE["CLAYSESS"] ?? "");
if ($sid !== "" && preg_match('/^[A-Za-z0-9,-]{16,128}$/', $sid)) {
    session_name("CLAYSESS");
    if (@session_start(["read_and_close" => true]) && !empty($_SESSION["uid"])) {
        $who = ($_SESSION["role"] ?? "") === "yonetici" ? "admin" : "member";
    }
}
$deskHref = $who === "admin" ? "/clayadm!nxx/" : "/panel/";
$planHref = $who === "" ? "/kayit/" : ($who === "admin" ? "/clayadm!nxx/planlar/" : "/panel/yukselt/");

function lp_t(string $key, string $tag = "span", string $attrs = ""): string
{
    global $c;
    return "<" . $tag . ' data-k="' . $key . '"' . ($attrs !== "" ? " " . $attrs : "") . ">" . clay_lp_e($c[$key]) . "</" . $tag . ">";
}

function lp_ico(string $id, string $cls = "lp-ico"): string
{
    return '<svg class="' . $cls . '" aria-hidden="true"><use href="#' . $id . '"/></svg>';
}

function lp_lines(string $key): string
{
    global $c;
    $out = "";
    foreach (preg_split('/(?<=[.!?])\s+/u', $c[$key]) ?: [] as $line) {
        $out .= '<span class="lp-line">' . clay_lp_e($line) . "</span>";
    }
    return $out;
}

$coins = [
    ["btc", "Bitcoin"], ["eth", "Ethereum"], ["usdt", "USDT"], ["sol", "Solana"],
    ["ton", "TON"], ["xmr", "Monero"], ["ltc", "Litecoin"], ["trx", "Tron"],
];
$platforms = [["fb", "Facebook Ads"], ["tt", "TikTok Ads"], ["gg", "Google Ads"], ["ul", "Ultima"]];
$actions = array_values(array_filter(array_map("trim", explode(",", $c["panelActions"])), "strlen"));

header("Content-Type: text/html; charset=UTF-8");
header("Cache-Control: no-cache");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: same-origin");
$json = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
?><!DOCTYPE html>
<html lang="<?= $lang ?>" class="lp-html" data-who="<?= $who ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>CLAY · <?= clay_lp_e($c["heroTitle"]) ?></title>
<meta name="description" content="<?= clay_lp_e($c["heroLede"]) ?>">
<meta name="theme-color" content="#0d0d0e">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/cormorant-garamond-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/clay-lp-card.webp" as="image" type="image/webp">
<link rel="stylesheet" href="/clay-lp.css?v=21">
<link rel="stylesheet" href="/clay-v14.css">
<script>try{var L=localStorage.getItem("clay-lang");if(L==="ru"){L="en";localStorage.setItem("clay-lang",L)}if(localStorage.getItem("clay-lang-picked")!=="1"||(L!=="tr"&&L!=="en"))localStorage.setItem("clay-lang",<?= json_encode($lang) ?>)}catch(e){}</script>
<script src="/clay-lp.js?v=21" defer></script>
<script src="/clay-v14.js" defer></script>
<script src="/clay-gecis.js?v=23" defer></script>
</head>
<body class="lp-body">
<svg width="0" height="0" class="lp-sprite" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="lp-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8a"/><stop offset=".5" stop-color="#e5b842"/><stop offset="1" stop-color="#9c7420"/></linearGradient>
    <linearGradient id="lp-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e5b842" stop-opacity="0"/><stop offset=".45" stop-color="#ffe7a3"/><stop offset=".7" stop-color="#e5b842"/><stop offset="1" stop-color="#e5b842" stop-opacity="0"/></linearGradient>
  </defs>
  <symbol id="i-shield" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M12 3 4.5 6v5.6c0 4.5 3.1 8.2 7.5 9.4 4.4-1.2 7.5-4.9 7.5-9.4V6z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="m8.6 12 2.4 2.4 4.4-4.6"/></symbol>
  <symbol id="i-nokyc" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8.6" cy="11" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5.8 15.6c.5-1.4 1.6-2.1 2.8-2.1s2.3.7 2.8 2.1M13.5 10h4.5M13.5 13h3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 20 20 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
  <symbol id="i-coins" viewBox="0 0 24 24"><ellipse cx="12" cy="6.5" rx="7" ry="2.8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 6.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5M5 11.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
  <symbol id="i-freeze" viewBox="0 0 24 24"><path d="M12 2.8v18.4M4 7.4l16 9.2M4 16.6l16-9.2M9.5 4.5 12 6.8l2.5-2.3M9.5 19.5 12 17.2l2.5 2.3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-headset" viewBox="0 0 24 24"><path d="M4.5 13.5V12a7.5 7.5 0 0 1 15 0v1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3.5" y="13" width="4" height="6" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="16.5" y="13" width="4" height="6" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M18.5 19c0 1.4-1.6 2.2-4.5 2.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m8 12.3 2.7 2.7L16.2 9.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-q" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8v.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="16.9" r="1.05" fill="currentColor"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
  <symbol id="i-chip" viewBox="0 0 40 30"><rect x=".75" y=".75" width="38.5" height="28.5" rx="6" fill="url(#lp-g)" stroke="#7a5a18" stroke-width="1.2"/><path d="M14 1v9.5H1M26 1v9.5h13M14 29v-9.5H1M26 29v-9.5h13M14 10.5h12v9H14z" fill="none" stroke="#7a5a18" stroke-width="1.2"/></symbol>
  <symbol id="p-fb" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#1877f2"/><path fill="#fff" d="M17.6 26v-8.4h2.8l.4-3.3h-3.2v-2.1c0-.9.3-1.6 1.6-1.6h1.7V7.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4h-2.8v3.3h2.8V26z"/></symbol>
  <symbol id="p-tt" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#0b0b0c"/><path fill="#25f4ee" d="M18.2 7h-2.9v12.2a2.6 2.6 0 1 1-1.9-2.5v-3a5.6 5.6 0 1 0 4.8 5.5v-6.1a7.3 7.3 0 0 0 4.2 1.3v-2.9a4.2 4.2 0 0 1-4.2-4.5z" transform="translate(-.7 -.5)"/><path fill="#fe2c55" d="M18.2 7h-2.9v12.2a2.6 2.6 0 1 1-1.9-2.5v-3a5.6 5.6 0 1 0 4.8 5.5v-6.1a7.3 7.3 0 0 0 4.2 1.3v-2.9a4.2 4.2 0 0 1-4.2-4.5z" transform="translate(.7 .5)"/><path fill="#fff" d="M18.2 7h-2.9v12.2a2.6 2.6 0 1 1-1.9-2.5v-3a5.6 5.6 0 1 0 4.8 5.5v-6.1a7.3 7.3 0 0 0 4.2 1.3v-2.9a4.2 4.2 0 0 1-4.2-4.5z"/></symbol>
  <symbol id="p-gg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#fff"/><path fill="#4285f4" d="M25.2 16.2c0-.7-.1-1.3-.2-1.9H16v3.6h5.2a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.8-4.1 2.8-7z"/><path fill="#34a853" d="M16 25.5c2.6 0 4.7-.9 6.3-2.3l-3.1-2.4c-.9.6-1.9 1-3.2 1-2.5 0-4.5-1.7-5.3-3.9H7.5v2.5A9.5 9.5 0 0 0 16 25.5z"/><path fill="#fbbc05" d="M10.7 17.9a5.7 5.7 0 0 1 0-3.7v-2.5H7.5a9.5 9.5 0 0 0 0 8.6z"/><path fill="#ea4335" d="M16 10.3c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9.1 9.1 0 0 0 16 6.5a9.5 9.5 0 0 0-8.5 5.2l3.2 2.5c.8-2.2 2.8-3.9 5.3-3.9z"/></symbol>
  <symbol id="p-ul" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#15120a" stroke="url(#lp-g)" stroke-width="1.6"/><text x="16" y="21.5" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#e5b842">U</text></symbol>
  <symbol id="c-btc" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#f7931a"/><path fill="#fff" d="M22.6 14c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.6-1.3-.3.7-2.6-1.6-.4-.7 2.7-1-.2-2.3-.6-.4 1.7 1.2.3c.7.2.8.6.8 1l-.8 3.1.2.1-.2-.1-1.1 4.4c-.1.2-.3.5-.8.4l-1.2-.3-.8 1.9 2.2.5 1.2.3-.7 2.8 1.6.4.7-2.7 1.3.3-.7 2.7 1.6.4.7-2.8c2.8.5 4.9.3 5.8-2.2.7-2-.1-3.2-1.5-4 1.1-.2 1.9-1 2.1-2.4zm-3.7 5.2c-.5 2-3.9.9-5 .7l.9-3.6c1.1.3 4.6.8 4.1 2.9zm.5-5.3c-.5 1.8-3.3.9-4.2.7l.8-3.2c.9.2 3.9.6 3.4 2.5z"/></symbol>
  <symbol id="c-eth" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#627eea"/><path fill="#fff" fill-opacity=".6" d="M16.5 4v8.9l7.5 3.3z"/><path fill="#fff" d="M16.5 4 9 16.2l7.5-3.3z"/><path fill="#fff" fill-opacity=".6" d="M16.5 22v6L24 17.6z"/><path fill="#fff" d="M16.5 28v-6L9 17.6z"/><path fill="#fff" fill-opacity=".2" d="m16.5 20.6 7.5-4.4-7.5-3.3z"/><path fill="#fff" fill-opacity=".6" d="m9 16.2 7.5 4.4v-7.7z"/></symbol>
  <symbol id="c-usdt" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#26a17b"/><path fill="#fff" d="M17.9 17.6v0c-.1 0-.7.1-2 .1-1 0-1.8 0-2-.1-3.9-.2-6.8-.9-6.8-1.7s2.9-1.5 6.8-1.7v2.7c.3 0 1 .1 2 .1 1.2 0 1.8-.1 2-.1v-2.7c3.9.2 6.8.9 6.8 1.7s-2.9 1.5-6.8 1.7zm0-3.6v-2.4h5.4V8H8.7v3.6h5.4V14c-4.4.2-7.7 1.1-7.7 2.1s3.3 1.9 7.7 2.1V26h3.8v-7.7c4.4-.2 7.6-1.1 7.6-2.1s-3.3-1.9-7.6-2.2z"/></symbol>
  <symbol id="c-sol" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#111"/><defs><linearGradient id="lp-sol" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#9945ff"/><stop offset="1" stop-color="#14f195"/></linearGradient></defs><path fill="url(#lp-sol)" d="M10.4 19.6c.1-.1.3-.2.5-.2h12.7c.3 0 .5.4.3.6l-2.5 2.5c-.1.1-.3.2-.5.2H8.2c-.3 0-.5-.4-.3-.6zm0-9.6c.1-.1.3-.2.5-.2h12.7c.3 0 .5.4.3.6l-2.5 2.5c-.1.1-.3.2-.5.2H8.2c-.3 0-.5-.4-.3-.6zm11 4.8c-.1-.1-.3-.2-.5-.2H8.2c-.3 0-.5.4-.3.6l2.5 2.5c.1.1.3.2.5.2h12.7c.3 0 .5-.4.3-.6z"/></symbol>
  <symbol id="c-ton" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#0098ea"/><path fill="#fff" d="M20.8 9H11.2c-1.8 0-2.9 1.9-2 3.4l5.9 10.3c.4.7 1.4.7 1.8 0l5.9-10.3c.9-1.5-.2-3.4-2-3.4zm-5.7 10.6-1.3-2.5-3.1-5.6c-.2-.4.1-.8.5-.8h3.9zm6.1-8.1-3.1 5.6-1.3 2.5V10.7h3.9c.4 0 .7.4.5.8z"/></symbol>
  <symbol id="c-xmr" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#ff6600"/><path fill="#fff" d="M16 6.5a9.5 9.5 0 0 0-9 12.6h2.8v-8l6.2 6.2 6.2-6.2v8H25A9.5 9.5 0 0 0 16 6.5z"/><path fill="#4c4c4c" d="M14.6 18.8 11.9 16v5.2H7.9A9.5 9.5 0 0 0 16 25.5c3.4 0 6.4-1.8 8.1-4.4h-4V16l-2.7 2.8L16 20.2z"/></symbol>
  <symbol id="c-ltc" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#a6a9aa"/><path fill="#fff" d="m10.4 18.3-1.2.5.6-2.3 1.2-.5 1.8-6.8h4.3l-1.3 4.8 1.2-.5-.6 2.3-1.2.5-1 3.6h6.9l-.7 2.6H8.9z"/></symbol>
  <symbol id="c-trx" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#ef0027"/><path fill="#fff" d="M21.9 11.2 8.3 8.7l7.2 18.1 10-12.2zm-.2 1.1 2.1 2-5.7 1zm-4.8 2.8-6-5 9.8 1.8zm-.4.9-1 8.1-5.3-13.2zm.9.4 6.3-1.1-7.3 8.8z"/></symbol>
</svg>

<div class="lp-head" id="ust" role="banner">
  <div class="lp-wrap lp-head-in">
    <a class="lp-logo" href="/" aria-label="CLAY">CLAY</a>
    <nav class="lp-nav" aria-label="<?= $lang === "tr" ? "Ana menü" : "Main menu" ?>">
      <a href="#kartlar"><?= lp_t("navCards") ?></a>
      <a href="#paketler"><?= lp_t("navPlans") ?></a>
      <a href="#nasil"><?= lp_t("navHow") ?></a>
      <a href="#sss"><?= lp_t("navFaq") ?></a>
      <button type="button" class="lp-lang" data-lp-lang aria-label="Dil / Language"><?= strtoupper($lang) ?></button>
    </nav>
    <div class="lp-head-cta">
<?php if ($who === ""): ?>
      <a class="lp-btn lp-btn-ghost lp-btn-sm" href="/giris/"><?= lp_t("btnLogin") ?></a>
      <a class="lp-btn lp-btn-gold lp-btn-sm" href="/kayit/"><?= lp_t("btnSignup") ?></a>
<?php else: ?>
      <a class="lp-btn lp-btn-gold lp-btn-sm" href="<?= $deskHref ?>"><?= lp_t("btnPanel") ?></a>
<?php endif; ?>
      <button type="button" class="lp-menu-btn" data-lp-menu aria-expanded="false" aria-controls="lp-drawer" aria-label="Menu"><?= lp_ico("i-menu") ?></button>
    </div>
  </div>
  <div class="lp-drawer" id="lp-drawer" hidden>
    <a href="#kartlar" data-lp-close><?= lp_t("navCards") ?></a>
    <a href="#paketler" data-lp-close><?= lp_t("navPlans") ?></a>
    <a href="#nasil" data-lp-close><?= lp_t("navHow") ?></a>
    <a href="#sss" data-lp-close><?= lp_t("navFaq") ?></a>
    <button type="button" class="lp-lang" data-lp-lang aria-label="Dil / Language"><?= strtoupper($lang) ?></button>
  </div>
</div>

<main class="lp-main">
  <section class="lp-hero">
    <div class="lp-wrap lp-hero-in">
      <div class="lp-hero-copy">
        <h1 class="lp-display lp-hero-title" data-k="heroTitle" data-lines="1"><?= lp_lines("heroTitle") ?></h1>
        <?= lp_t("heroLede", "p", 'class="lp-lede"') ?>
        <div class="lp-cta-row">
<?php if ($who === ""): ?>
          <a class="lp-btn lp-btn-gold lp-btn-lg" href="/kayit/"><?= lp_t("heroCta") ?></a>
<?php else: ?>
          <a class="lp-btn lp-btn-gold lp-btn-lg" href="<?= $deskHref ?>"><?= lp_t("btnPanel") ?></a>
<?php endif; ?>
          <a class="lp-btn lp-btn-ghost lp-btn-lg" href="#paketler"><?= lp_t("heroCta2") ?></a>
        </div>
        <ul class="lp-chips">
          <li><?= lp_ico("i-shield") ?><?= lp_t("heroChip1") ?></li>
          <li><?= lp_ico("i-nokyc") ?><?= lp_t("heroChip2") ?></li>
          <li><?= lp_ico("i-coins") ?><?= lp_t("heroChip3") ?></li>
        </ul>
      </div>
      <div class="lp-hero-art" aria-hidden="true">
        <svg class="lp-trails lp-trails-hero" viewBox="0 0 600 520" preserveAspectRatio="none">
          <g class="lp-base"><path d="M-20 420C120 520 300 520 430 400S600 180 640 120"/>
          <path d="M-40 470C140 560 340 540 470 420S610 230 660 180"/>
          <path d="M20 360C160 470 300 470 400 380S560 210 620 60"/></g>
          <path d="M-20 420C120 520 300 520 430 400S600 180 640 120"/>
          <path d="M-40 470C140 560 340 540 470 420S610 230 660 180"/>
          <path d="M20 360C160 470 300 470 400 380S560 210 620 60"/>
        </svg>
        <div class="lp-hero-card">
          <img src="/clay-lp-card.webp" width="640" height="579" alt="" fetchpriority="high" decoding="async">
          <span class="lp-active lp-active-hero"><i></i><?= lp_t("activeLabel") ?></span>
        </div>
      </div>
    </div>
  </section>

  <section class="lp-trust lp-wrap" aria-labelledby="lp-trust-k">
    <?= lp_t("trustKicker", "p", 'class="lp-kicker" id="lp-trust-k"') ?>
    <ul class="lp-trust-grid">
<?php foreach ([["i-shield", 1], ["i-nokyc", 2], ["i-freeze", 3], ["i-headset", 4]] as [$icon, $n]): ?>
      <li class="lp-glass lp-trust-item lp-reveal">
        <span class="lp-ring"><?= lp_ico($icon) ?></span>
        <?= lp_t("trust{$n}t", "h3") ?>
        <?= lp_t("trust{$n}d", "p") ?>
      </li>
<?php endforeach; ?>
    </ul>
  </section>

  <section class="lp-steps" id="nasil" aria-labelledby="lp-steps-h">
    <div class="lp-wrap">
      <?= lp_t("stepsKicker", "p", 'class="lp-kicker"') ?>
      <?= lp_t("stepsTitle", "h2", 'class="lp-display lp-h2" id="lp-steps-h"') ?>
      <ol class="lp-step-grid">
<?php for ($n = 1; $n <= 4; $n++): ?>
        <li class="lp-glass lp-step lp-reveal">
          <span class="lp-step-n lp-display"><?= $n ?></span>
          <?= lp_t("step{$n}t", "h3") ?>
          <?= lp_t("step{$n}d", "p") ?>
        </li>
<?php endfor; ?>
      </ol>
    </div>
    <div class="lp-coinband">
      <svg class="lp-trails lp-trails-wave" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
          <g class="lp-base"><path d="M0 150C200 60 380 220 620 140S1020 40 1240 130 1440 170 1440 170"/>
        <path d="M0 175C240 90 420 240 660 160S1040 70 1260 150 1440 190 1440 190"/>
        <path d="M0 120C180 40 400 190 640 115S1000 20 1220 100 1440 140 1440 140"/></g>
        <path d="M0 150C200 60 380 220 620 140S1020 40 1240 130 1440 170 1440 170"/>
        <path d="M0 175C240 90 420 240 660 160S1040 70 1260 150 1440 190 1440 190"/>
        <path d="M0 120C180 40 400 190 640 115S1000 20 1220 100 1440 140 1440 140"/>
      </svg>
      <ul class="lp-wrap lp-coins">
<?php foreach ($coins as [$id, $name]): ?>
        <li><?= lp_ico("c-" . $id, "lp-coin") ?><span><?= $name ?></span></li>
<?php endforeach; ?>
        <li class="lp-coin-more"><?= lp_t("coinsMore") ?></li>
      </ul>
    </div>
  </section>

  <section class="lp-cards" id="kartlar" aria-labelledby="lp-cards-h">
    <div class="lp-wrap">
      <?= lp_t("cardsKicker", "p", 'class="lp-kicker"') ?>
      <?= lp_t("cardsTitle", "h2", 'class="lp-display lp-h2" id="lp-cards-h"') ?>
      <?= lp_t("cardsLede", "p", 'class="lp-sub"') ?>
    </div>
    <div class="lp-deck-stage">
      <svg class="lp-trails lp-trails-deck" viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden="true">
          <g class="lp-base"><path d="M-20 260C220 120 420 340 720 220S1180 60 1460 200"/>
        <path d="M-20 300C260 170 460 380 740 260S1200 110 1460 250"/>
        <path d="M-20 220C200 90 440 300 700 190S1160 30 1460 150"/>
        <path d="M-20 340C300 230 520 400 780 300S1220 170 1460 300"/></g>
        <path d="M-20 260C220 120 420 340 720 220S1180 60 1460 200"/>
        <path d="M-20 300C260 170 460 380 740 260S1200 110 1460 250"/>
        <path d="M-20 220C200 90 440 300 700 190S1160 30 1460 150"/>
        <path d="M-20 340C300 230 520 400 780 300S1220 170 1460 300"/>
      </svg>
      <span class="lp-shard s1"></span><span class="lp-shard s2"></span><span class="lp-shard s3"></span><span class="lp-shard s4"></span><span class="lp-shard s5"></span><span class="lp-shard s6"></span>
      <ul class="lp-wrap lp-deck">
<?php foreach ($platforms as $i => [$id, $name]): ?>
        <li class="lp-vcard lp-vcard-<?= $id ?>" style="--i:<?= $i ?>">
          <span class="lp-vcard-shine"></span>
          <?= lp_ico("i-chip", "lp-chip") ?>
          <?= lp_ico("p-" . $id, "lp-vcard-logo") ?>
          <strong><?= $name ?></strong>
          <span class="lp-active"><i></i><?= lp_t("activeLabel") ?></span>
        </li>
<?php endforeach; ?>
      </ul>
      <div class="lp-floor" aria-hidden="true"></div>
    </div>
    <div class="lp-platforms lp-wrap">
      <?= lp_t("platformsKicker", "p", 'class="lp-kicker"') ?>
      <ul>
<?php foreach ($platforms as [$id, $name]): ?>
        <li><?= lp_ico("p-" . $id, "lp-plat-ico") ?><?= $name ?></li>
<?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section class="lp-panel" aria-labelledby="lp-panel-h">
    <div class="lp-wrap lp-panel-in">
      <div class="lp-panel-copy">
        <?= lp_t("panelKicker", "p", 'class="lp-kicker lp-left"') ?>
        <h2 class="lp-display lp-h2 lp-left" id="lp-panel-h" data-k="panelTitle" data-lines="1"><?= lp_lines("panelTitle") ?></h2>
        <?= lp_t("panelLede", "p", 'class="lp-sub lp-left"') ?>
        <ul class="lp-points">
          <li><?= lp_ico("i-check") ?><?= lp_t("panelPoint1") ?></li>
          <li><?= lp_ico("i-check") ?><?= lp_t("panelPoint2") ?></li>
          <li><?= lp_ico("i-check") ?><?= lp_t("panelPoint3") ?></li>
        </ul>
      </div>
      <div class="lp-glass lp-mock lp-reveal" aria-hidden="true">
        <div class="lp-mock-top">
          <div><?= lp_t("panelBalance", "p", 'class="lp-mock-label"') ?><p class="lp-mock-bal">$2,000.00</p></div>
          <span class="lp-active"><i></i><?= lp_t("activeLabel") ?></span>
        </div>
        <div class="lp-mock-acts" data-k="panelActions" data-list="1">
<?php foreach ($actions as $i => $label): ?>
          <span<?= $i === 0 ? ' class="is-on"' : "" ?>><?= clay_lp_e($label) ?></span>
<?php endforeach; ?>
        </div>
        <?= lp_t("panelMyCards", "p", 'class="lp-mock-h"') ?>
        <ul class="lp-mock-list">
<?php foreach ([["fb", "Facebook Ads", "1001"], ["tt", "TikTok Ads", "2002"], ["gg", "Google Ads", "0037"]] as [$id, $name, $last]): ?>
          <li><?= lp_ico("p-" . $id, "lp-plat-ico") ?><span><strong><?= $name ?></strong><small>•••• <?= $last ?></small></span><span class="lp-active"><i></i><?= lp_t("activeLabel") ?></span></li>
<?php endforeach; ?>
        </ul>
      </div>
    </div>
  </section>

  <section class="lp-plans" id="paketler" aria-labelledby="lp-plans-h">
    <div class="lp-wrap">
      <?= lp_t("plansKicker", "p", 'class="lp-kicker"') ?>
      <?= lp_t("plansTitle", "h2", 'class="lp-display lp-h2" id="lp-plans-h"') ?>
      <?= lp_t("plansLede", "p", 'class="lp-sub"') ?>
      <div class="lp-plan-grid">
<?php foreach (clay_lp_plan_ids() as $n => $planId): ?>
        <article class="lp-glass lp-plan lp-reveal<?= $n === 3 ? " is-top" : "" ?>">
<?php if ($n === 3): ?>
          <?= lp_t("plansPopular", "span", 'class="lp-plan-pop"') ?>
<?php endif; ?>
          <?= lp_t("plan{$n}Name", "h3", 'class="lp-display lp-plan-name"') ?>
          <?= lp_t("plan{$n}Price", "p", 'class="lp-display lp-plan-price"') ?>
          <?= lp_t("plan{$n}Cards", "p", 'class="lp-plan-cards"') ?>
          <?= lp_t("plansCardsSub", "p", 'class="lp-plan-sub"') ?>
          <div class="lp-plan-icons" aria-hidden="true">
            <span class="is-tt"><?= lp_ico("p-tt", "lp-mini") ?></span><span class="is-fb"><?= lp_ico("p-fb", "lp-mini") ?></span><span class="is-gg"><?= lp_ico("p-gg", "lp-mini") ?></span>
          </div>
          <a class="lp-btn <?= $n === 3 ? "lp-btn-gold" : "lp-btn-ghost" ?> lp-btn-block" href="<?= $planHref ?>" data-plan="<?= $planId ?>"><?= lp_t("plansCta") ?></a>
        </article>
<?php endforeach; ?>
      </div>
      <?= lp_t("feeLine", "p", 'class="lp-fee"') ?>
    </div>
  </section>

  <section class="lp-faq" id="sss" aria-labelledby="lp-faq-h">
    <div class="lp-wrap">
      <?= lp_t("faqKicker", "p", 'class="lp-kicker"') ?>
      <?= lp_t("faqTitle", "h2", 'class="lp-display lp-h2" id="lp-faq-h"') ?>
      <dl class="lp-faq-grid">
<?php for ($n = 1; $n <= 4; $n++): ?>
        <div class="lp-glass lp-faq-item lp-reveal">
          <dt><?= lp_ico("i-q") ?><?= lp_t("faq{$n}q") ?></dt>
          <dd><?= lp_t("faq{$n}a") ?></dd>
        </div>
<?php endfor; ?>
      </dl>
    </div>
  </section>

  <section class="lp-lock" aria-labelledby="lp-lock-h">
    <div class="lp-lock-art" aria-hidden="true"><img src="/clay-lp-lock.webp" width="880" height="432" alt="" loading="lazy" decoding="async"></div>
    <div class="lp-wrap">
      <?= lp_t("lockTitle", "h2", 'class="lp-display lp-h2" id="lp-lock-h"') ?>
      <?= lp_t("lockLede", "p", 'class="lp-sub"') ?>
      <div class="lp-cta-row lp-center">
<?php if ($who === ""): ?>
        <a class="lp-btn lp-btn-gold lp-btn-lg" href="/kayit/"><?= lp_t("lockCta") ?></a>
        <a class="lp-btn lp-btn-ghost lp-btn-lg" href="/giris/"><?= lp_t("lockCta2") ?></a>
<?php else: ?>
        <a class="lp-btn lp-btn-gold lp-btn-lg" href="<?= $deskHref ?>"><?= lp_t("btnPanel") ?></a>
<?php endif; ?>
      </div>
    </div>
  </section>
</main>

<footer class="lp-foot">
  <div class="lp-wrap lp-foot-in">
    <div class="lp-foot-brand">
      <a class="lp-logo" href="#ust">CLAY</a>
      <?= lp_t("footTagline", "p") ?>
      <?= lp_t("footSub", "p", 'class="lp-foot-sub"') ?>
    </div>
    <nav class="lp-foot-col" aria-labelledby="lp-f1"><?= lp_t("footProduct", "h3", 'id="lp-f1"') ?>
      <a href="#kartlar"><?= lp_t("navCards") ?></a><a href="#paketler"><?= lp_t("navPlans") ?></a><a href="#nasil"><?= lp_t("navHow") ?></a>
    </nav>
    <nav class="lp-foot-col" aria-labelledby="lp-f2"><?= lp_t("footSupport", "h3", 'id="lp-f2"') ?>
      <a href="#sss"><?= lp_t("navFaq") ?></a><button type="button" data-act="live-open"><?= lp_t("footLive") ?></button><?php if ($who === ""): ?><a href="/giris/"><?= lp_t("btnLogin") ?></a><?php endif; ?>
    </nav>
    <nav class="lp-foot-col" aria-labelledby="lp-f3"><?= lp_t("footAccount", "h3", 'id="lp-f3"') ?>
      <?php if ($who === ""): ?><a href="/kayit/"><?= lp_t("btnSignup") ?></a><?php endif; ?><a href="<?= $deskHref ?>"><?= lp_t("btnPanel") ?></a><button type="button" data-lp-lang><?= strtoupper($lang) ?></button>
    </nav>
    <div class="lp-foot-col"><?= lp_t("footCoins", "h3") ?>
      <p class="lp-foot-coins"><?php foreach (array_slice($coins, 0, 6) as [$id, $name]) { echo lp_ico("c-" . $id, "lp-coin-sm"); } ?></p>
      <?= lp_t("coinsMore", "p") ?>
    </div>
  </div>
  <div class="lp-wrap lp-foot-bar">
    <?= lp_t("footCopy", "p") ?>
    <?= lp_t("footRight", "p") ?>
  </div>
</footer>
<script type="application/json" id="lp-copy"><?= json_encode($copy, $json) ?></script>
<section class="clay-live is-live" data-clay-launcher="1"><button type="button" class="clay-live-btn" data-act="live-open" aria-label="<?= $lang === "tr" ? "Canlı destek" : "Live support" ?>"><i class="clay-live-beacon" aria-hidden="true"></i><svg class="clay-live-icon-chat" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9.2L5 19.4c-.6.5-1.5.1-1.5-.7V5.5z"/></svg><svg class="clay-live-icon-x" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/></svg></button></section>
</body>
</html>
