<?php
if (defined("CLAY_LANG_BOOTED")) {
    return;
}
define("CLAY_LANG_BOOTED", 1);

function clay_client_ip()
{
    $candidates = array();
    if (!empty($_SERVER["HTTP_CF_CONNECTING_IP"])) {
        $candidates[] = $_SERVER["HTTP_CF_CONNECTING_IP"];
    }
    if (!empty($_SERVER["REMOTE_ADDR"])) {
        $candidates[] = $_SERVER["REMOTE_ADDR"];
    }
    foreach ($candidates as $raw) {
        $ip = trim(explode(",", $raw)[0]);
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }
    return "";
}

function clay_country_to_lang($country)
{
    $cc = strtoupper((string) $country);
    if ($cc === "TR") {
        return "tr";
    }
    return "en";
}

function clay_lookup_country($ip)
{
    if ($ip === "" || !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        return null;
    }
    if (!function_exists("curl_init")) {
        return null;
    }
    $ch = curl_init("https://ipwho.is/" . rawurlencode($ip) . "?fields=success,country_code");
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT_MS => 800,
        CURLOPT_CONNECTTIMEOUT_MS => 400,
        CURLOPT_USERAGENT => "ClayVirtualCard",
    ));
    $raw = curl_exec($ch);
    curl_close($ch);
    if (!is_string($raw) || $raw === "") {
        return null;
    }
    $data = json_decode($raw, true);
    if (!is_array($data) || empty($data["success"])) {
        return null;
    }
    $code = strtoupper((string) (isset($data["country_code"]) ? $data["country_code"] : ""));
    return preg_match("/^[A-Z]{2}$/", $code) ? $code : null;
}

function clay_remember($code)
{
    if (headers_sent()) {
        return;
    }
    setcookie("clay-lang", $code, array(
        "expires" => time() + 31536000,
        "path" => "/",
        "samesite" => "Lax",
    ));
}

function clay_pick_lang()
{
    static $lang = null;
    if ($lang !== null) {
        return $lang;
    }
    $picked = isset($_COOKIE["clay-lang-picked"]) ? $_COOKIE["clay-lang-picked"] : "";
    $cookie = isset($_COOKIE["clay-lang"]) ? $_COOKIE["clay-lang"] : "";
    if ($picked === "1" && ($cookie === "tr" || $cookie === "en")) {
        $lang = $cookie;
        return $lang;
    }
    if ($picked === "1" && $cookie === "ru") {
        $lang = "en";
        clay_remember($lang);
        return $lang;
    }
    $country = clay_lookup_country(clay_client_ip());
    if ($country) {
        $lang = clay_country_to_lang($country);
        clay_remember($lang);
        if (!headers_sent()) {
            setcookie("clay-geo", $country, array(
                "expires" => time() + 86400,
                "path" => "/",
                "samesite" => "Lax",
            ));
        }
        return $lang;
    }
    if ($cookie === "tr" || $cookie === "en") {
        $lang = $cookie;
        return $lang;
    }
    $lang = "tr";
    return $lang;
}

function clay_pairs($lang)
{
    $path = __DIR__ . "/lang/i18n.json";
    $raw = is_file($path) ? file_get_contents($path) : "";
    $data = json_decode(is_string($raw) ? $raw : "{}", true);
    if (is_array($data) && isset($data[$lang]) && is_array($data[$lang])) {
        return $data[$lang];
    }
    return array();
}

function clay_prepare($html)
{
    if (!is_string($html) || stripos($html, "<html") === false) {
        return $html;
    }
    $lang = clay_pick_lang();
    $pairs = clay_pairs($lang);
    if ($pairs) {
        $html = strtr($html, $pairs);
    }
    $html = preg_replace('/<html\b([^>]*?)\blang="[^"]*"/i', '<html$1lang="' . $lang . '"', $html, 1);
    if (strpos($html, 'localStorage.setItem("clay-lang"') === false) {
        $country = isset($_COOKIE["clay-geo"]) ? strtoupper((string) $_COOKIE["clay-geo"]) : "";
        $currency = $country === "TR" ? "TRY" : "USD";
        $script = '<script>try{var L=' . json_encode($lang) . ';var C=' . json_encode($currency) . ';var k="clay-lang";var p=localStorage.getItem("clay-lang-picked");var c=localStorage.getItem(k);if(c==="ru"){c="en";localStorage.setItem(k,c)}if(p==="1"&&(c==="tr"||c==="en")){document.documentElement.lang=c}else{if(c!=="tr"&&c!=="en"){localStorage.setItem(k,L);c=L}document.documentElement.lang=c}var u=localStorage.getItem("clay-currency-picked");var m=localStorage.getItem("clay-currency");if(u!=="1"&&m!=="USD"&&m!=="TRY"){localStorage.setItem("clay-currency",C)}}catch(e){}</script>';
        $html = preg_replace('/<head\b[^>]*>/i', '$0' . $script, $html, 1);
    }
    if (strpos($html, "__clayAfterHydrate") === false) {
        // Overlay scripts must not touch React-owned DOM before hydration finishes (React #418).
        $hydrate = '<script>(function(){function done(){try{var k=Object.keys(document).filter(function(x){return x.indexOf("__reactContainer$")===0})[0];if(!k)return false;var f=document[k],c=f&&f.stateNode&&f.stateNode.current,s=c&&c.memoizedState;return!!(s&&s.isDehydrated===false)}catch(e){return true}}'
            . 'window.__clayHydrated=done;window.__clayAfterHydrate=function(fn){var t0=Date.now();function go(){try{fn()}catch(e){setTimeout(function(){throw e})}}'
            . 'function wait(){if(done()){go();return}var next=document.querySelector(\'script[src*="/_next/static/chunks/"]\');if(document.readyState!=="loading"&&!next){go();return}if(Date.now()-t0>6000){go();return}setTimeout(wait,25)}wait()};'
            . 'window.addEventListener("error",function(e){if(/Minified React error #(418|423|425);/.test(String(e&&e.message||""))){e.preventDefault()}},true)})();</script>';
        $html = preg_replace('/<head\b[^>]*>/i', '$0' . $hydrate, $html, 1);
    }
    $html = preg_replace('#/clay-v14\.js(\?v=\d+)?#', '/clay-v14.js?v=30', $html);
    $html = preg_replace('#/clay-v14\.css(\?v=\d+)?#', '/clay-v14.css?v=30', $html);
    if (strpos($html, "/clay-v14.js") === false && !preg_match('/src=["\']\/clay-v14\.js["\']/', $html)) {
        $admin = (strpos((string) ($_SERVER["REQUEST_URI"] ?? ""), "clayadm") !== false);
        $head = '<link rel="stylesheet" href="/clay-v14.css?v=30">';
        if ($admin) {
            $head .= '<link rel="stylesheet" href="/clay-admin.css">';
        }
        $head .= '<script src="/clay-v14.js?v=30"></script></head>';
        $html = preg_replace('/<\/head>/i', $head, $html, 1);
    }
    if (strpos((string) ($_SERVER["REQUEST_URI"] ?? ""), "clayadm") !== false && strpos($html, "/clay-admin.css") === false) {
        $html = preg_replace('/<\/head>/i', '<link rel="stylesheet" href="/clay-admin.css"></head>', $html, 1);
    }
    if (strpos((string) ($_SERVER["REQUEST_URI"] ?? ""), "clayadm") !== false && strpos($html, "/clay-lp-admin.js") === false) {
        $html = preg_replace('/<\/head>/i', '<script src="/clay-lp-admin.js" defer></script></head>', $html, 1);
    }
    $html = str_replace("/clay-luxury.css?v=28", "/clay-luxury.css?v=30", $html);
    $html = str_replace("/clay-luxury.css?v=29", "/clay-luxury.css?v=30", $html);
    $html = str_replace("/clay-luxury.js?v=28", "/clay-luxury.js?v=29", $html);
    if (strpos($html, "/clay-luxury.css") === false) {
        $html = preg_replace('/<\/head>/i', '<link rel="stylesheet" href="/clay-luxury.css?v=30"></head>', $html, 1);
    }
    if (strpos($html, "/clay-luxury.js") === false) {
        $html = preg_replace('/<\/head>/i', '<script src="/clay-luxury.js?v=29"></script></head>', $html, 1);
    }
    if (strpos($html, "/clay-gecis.js") === false) {
        $html = preg_replace('/<\/head>/i', '<script src="/clay-gecis.js?v=23" defer></script></head>', $html, 1);
    }
    $html = str_replace("/clay-core.js?v=29", "/clay-core.js?v=30", $html);
    if (strpos($html, "/clay-core.js") === false) {
        $html = preg_replace('/<\/head>/i', '<script src="/clay-core.js?v=30"></script></head>', $html, 1);
    }
    if (strpos($html, "clay-live-btn") === false) {
        $launcher = '<section class="clay-live is-live" data-clay-launcher="1"><button type="button" class="clay-live-btn" data-act="live-open" aria-label="Canlı destek"><i class="clay-live-beacon" aria-hidden="true"></i><svg class="clay-live-icon-chat" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9.2L5 19.4c-.6.5-1.5.1-1.5-.7V5.5z"/></svg><svg class="clay-live-icon-x" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/></svg></button></section>';
        $html = preg_replace('/<\/body>/i', $launcher . '</body>', $html, 1);
    }
    return $html;
}

function clay_emit($path)
{
    $lang = clay_pick_lang();
    $cache = sys_get_temp_dir() . "/clay-html-" . substr(hash("sha256", $path . "|" . $lang), 0, 20) . ".html";
    $mtime = @filemtime($path) ?: 0;
    if (is_file($cache) && filemtime($cache) >= $mtime && (time() - filemtime($cache)) < 60) {
        $hit = file_get_contents($cache);
        if (is_string($hit) && $hit !== "") {
            echo $hit;
            return;
        }
    }
    $html = file_get_contents($path);
    $out = clay_prepare($html === false ? "" : $html);
    @file_put_contents($cache, $out, LOCK_EX);
    echo $out;
}
