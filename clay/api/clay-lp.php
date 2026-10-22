<?php
/**
 * Launchpad copy: schema, defaults (TR/EN) and the overrides saved by the admin
 * under settings.lp in the ledger. Included by /index.php and api/clay-ledger.php;
 * a direct GET returns the public schema + current values for the admin editor.
 */

if (defined("CLAY_LP_LOADED")) {
    return;
}
define("CLAY_LP_LOADED", 1);

function clay_lp_schema(): array
{
    // key => [group, label, max, tr, en]
    return [
        "navCards" => ["Menü", "Menü · Kartlar", 24, "Kartlar", "Cards"],
        "navPlans" => ["Menü", "Menü · Paketler", 24, "Paketler", "Plans"],
        "navHow" => ["Menü", "Menü · Nasıl Çalışır", 24, "Nasıl Çalışır", "How it works"],
        "navFaq" => ["Menü", "Menü · SSS", 24, "SSS", "FAQ"],
        "btnLogin" => ["Menü", "Buton · Giriş", 24, "Giriş", "Log in"],
        "btnSignup" => ["Menü", "Buton · Hesap Aç", 24, "Hesap Aç", "Sign up"],
        "btnPanel" => ["Menü", "Buton · Panel (girişliyken)", 24, "Panel", "Dashboard"],

        "heroTitle" => ["Hero", "Ana başlık (her cümle ayrı satır)", 90, "Kimlik yok. Belge yok. Sadece kripto.", "No ID. No documents. Just crypto."],
        "heroLede" => ["Hero", "Alt satır", 180, "Kripto ile yükle, sanal kartın dakikalar içinde hazır.", "Top up with crypto, your virtual card is ready in minutes."],
        "heroCta" => ["Hero", "Ana buton", 32, "Hemen Hesap Aç", "Open an account"],
        "heroCta2" => ["Hero", "İkinci buton", 32, "Paketleri Gör", "See plans"],
        "heroChip1" => ["Hero", "Rozet 1", 32, "Kişisel veri yok", "No personal data"],
        "heroChip2" => ["Hero", "Rozet 2", 32, "KYC yok", "No KYC"],
        "heroChip3" => ["Hero", "Rozet 3", 32, "150+ coin", "150+ coins"],
        "activeLabel" => ["Hero", "Kart durumu etiketi", 16, "Aktif", "Active"],

        "trustKicker" => ["Güvenlik", "Üst etiket", 40, "Güvenlik ve gizlilik", "Security and privacy"],
        "trust1t" => ["Güvenlik", "Rozet 1 başlık", 40, "Kişisel veri yok", "No personal data"],
        "trust1d" => ["Güvenlik", "Rozet 1 yazı", 120, "İsim ya da belge istenmez.", "No name or documents required."],
        "trust2t" => ["Güvenlik", "Rozet 2 başlık", 40, "KYC yok", "No KYC"],
        "trust2d" => ["Güvenlik", "Rozet 2 yazı", 120, "Kimlik doğrulaması yok.", "No identity verification."],
        "trust3t" => ["Güvenlik", "Rozet 3 başlık", 40, "Anında dondur", "Instant freeze"],
        "trust3d" => ["Güvenlik", "Rozet 3 yazı", 120, "Kartını istediğin an dondur, kapat.", "Freeze or close your card any time."],
        "trust4t" => ["Güvenlik", "Rozet 4 başlık", 40, "7/24 canlı destek", "24/7 live support"],
        "trust4d" => ["Güvenlik", "Rozet 4 yazı", 120, "Destek ekibi her an yanında.", "Our support team is always there."],

        "stepsKicker" => ["Adımlar", "Üst etiket", 40, "Gizlilik önce", "Privacy first"],
        "stepsTitle" => ["Adımlar", "Başlık", 80, "Kripto gönder. Hemen harca.", "Send crypto. Spend right away."],
        "step1t" => ["Adımlar", "Adım 1 başlık", 32, "Coin seç", "Pick a coin"],
        "step1d" => ["Adımlar", "Adım 1 yazı", 120, "BTC, USDT, ETH ve 150+ coin.", "BTC, USDT, ETH and 150+ coins."],
        "step2t" => ["Adımlar", "Adım 2 başlık", 32, "Gönder", "Send"],
        "step2d" => ["Adımlar", "Adım 2 yazı", 120, "Adrese gönder, isim ya da belge yok.", "Send to the address, no name or documents."],
        "step3t" => ["Adımlar", "Adım 3 başlık", 32, "1 onay", "1 confirmation"],
        "step3d" => ["Adımlar", "Adım 3 yazı", 120, "Tek blok onayıyla bakiyen yazılır.", "Your balance lands after a single block confirmation."],
        "step4t" => ["Adımlar", "Adım 4 başlık", 32, "Harca", "Spend"],
        "step4d" => ["Adımlar", "Adım 4 yazı", 120, "Kartını bas, hemen kullan.", "Issue your card and use it right away."],
        "coinsMore" => ["Adımlar", "Coin şeridi son rozet", 24, "150+ coin", "150+ coins"],

        "cardsKicker" => ["Kartlar", "Üst etiket", 40, "Kartlar", "Cards"],
        "cardsTitle" => ["Kartlar", "Başlık", 80, "Her kampanyaya ayrı kart.", "A separate card for every campaign."],
        "cardsLede" => ["Kartlar", "Alt satır", 180, "Her kartın kendi bakiyesi var. İstediğin an dondur, kapat.", "Every card has its own balance. Freeze or close it any time."],
        "platformsKicker" => ["Kartlar", "Platform şeridi etiketi", 40, "Desteklenen platformlar", "Supported platforms"],

        "panelKicker" => ["Panel", "Üst etiket", 40, "Panel", "Dashboard"],
        "panelTitle" => ["Panel", "Başlık", 80, "Her şey tek panelde.", "Everything in one dashboard."],
        "panelLede" => ["Panel", "Alt satır", 180, "Kart bas, yatır, çek, dondur, kapat, aktar.", "Issue, deposit, withdraw, freeze, close, transfer."],
        "panelPoint1" => ["Panel", "Madde 1", 80, "Her kampanyaya ayrı bakiye", "A separate balance for every campaign"],
        "panelPoint2" => ["Panel", "Madde 2", 80, "Kart başına dondur ve kapat", "Freeze and close per card"],
        "panelPoint3" => ["Panel", "Madde 3", 80, "Bakiyeyi kartlar arasında aktar", "Move balance between cards"],
        "panelBalance" => ["Panel", "Örnek · Bakiye etiketi", 24, "Bakiye", "Balance"],
        "panelActions" => ["Panel", "Örnek · Butonlar (virgülle ayır)", 120, "Kart bas, Yatır, Çek, Dondur, Kapat, Aktar", "Issue, Deposit, Withdraw, Freeze, Close, Transfer"],
        "panelMyCards" => ["Panel", "Örnek · Kartlarım", 24, "Kartlarım", "My cards"],

        "plansKicker" => ["Paketler", "Üst etiket", 40, "Paketler", "Plans"],
        "plansTitle" => ["Paketler", "Başlık", 80, "İhtiyacın kadar kart.", "As many cards as you need."],
        "plansLede" => ["Paketler", "Alt satır", 180, "Basım, yükleme ve aktarım her pakette aynı. Değişen, açık kart hakkı.", "Issuing, top-up and transfer fees are the same on every plan. Only the open-card allowance changes."],
        "plan1Name" => ["Paketler", "Duo · ad", 32, "Clay Duo", "Clay Duo"],
        "plan1Price" => ["Paketler", "Duo · fiyat", 16, "$49", "$49"],
        "plan1Cards" => ["Paketler", "Duo · kart sayısı", 24, "2 kart", "2 cards"],
        "plan2Name" => ["Paketler", "Multi · ad", 32, "Clay Multi", "Clay Multi"],
        "plan2Price" => ["Paketler", "Multi · fiyat", 16, "$149", "$149"],
        "plan2Cards" => ["Paketler", "Multi · kart sayısı", 24, "8 kart", "8 cards"],
        "plan3Name" => ["Paketler", "Prime · ad", 32, "Clay Prime", "Clay Prime"],
        "plan3Price" => ["Paketler", "Prime · fiyat", 16, "$399", "$399"],
        "plan3Cards" => ["Paketler", "Prime · kart sayısı", 24, "25 kart", "25 cards"],
        "plansCardsSub" => ["Paketler", "Kart sayısı alt yazısı", 32, "açık kart hakkı", "open-card allowance"],
        "plansPopular" => ["Paketler", "Öne çıkan rozet", 24, "En Popüler", "Most popular"],
        "plansCta" => ["Paketler", "Buton", 24, "Paketi Seç", "Choose plan"],
        "feeLine" => ["Paketler", "Ücret satırı", 160, "Her pakette: Basım 750 TL · Yükleme 1 USD + %4 · Aktarım %13", "On every plan: Issuing 750 TRY · Top-up 1 USD + 4% · Transfer 13%"],

        "faqKicker" => ["SSS", "Üst etiket", 24, "SSS", "FAQ"],
        "faqTitle" => ["SSS", "Başlık", 80, "Sık sorulan sorular.", "Frequently asked questions."],
        "faq1q" => ["SSS", "Soru 1", 100, "Kimlik ya da belge gerekiyor mu?", "Do I need ID or documents?"],
        "faq1a" => ["SSS", "Yanıt 1", 240, "Hayır. KYC yok, kişisel veri istenmez.", "No. There is no KYC and no personal data is requested."],
        "faq2q" => ["SSS", "Soru 2", 100, "Hangi coinlerle yükleme yapabilirim?", "Which coins can I top up with?"],
        "faq2a" => ["SSS", "Yanıt 2", 240, "BTC, USDT, ETH ve 150+ coin.", "BTC, USDT, ETH and 150+ coins."],
        "faq3q" => ["SSS", "Soru 3", 100, "Bakiyem ne zaman yazılır?", "When is my balance credited?"],
        "faq3a" => ["SSS", "Yanıt 3", 240, "Tek blok onayıyla bakiyen yazılır.", "After a single block confirmation."],
        "faq4q" => ["SSS", "Soru 4", 100, "Yükleme ücreti ne kadar?", "How much is the top-up fee?"],
        "faq4a" => ["SSS", "Yanıt 4", 240, "Yüklemede 1 USD + %4 kesilir.", "1 USD + 4% is deducted on each top-up."],

        "lockTitle" => ["Kapanış", "Başlık", 80, "Gizliliğin seninle kalsın.", "Your privacy stays with you."],
        "lockLede" => ["Kapanış", "Alt satır", 160, "Kimlik yok. Belge yok. Sadece kripto.", "No ID. No documents. Just crypto."],
        "lockCta" => ["Kapanış", "Ana buton", 24, "Hesap Aç", "Sign up"],
        "lockCta2" => ["Kapanış", "İkinci buton", 24, "Giriş", "Log in"],

        "footTagline" => ["Footer", "Marka satırı", 120, "Kripto ile yüklenen sanal kartlar.", "Virtual cards funded with crypto."],
        "footSub" => ["Footer", "Marka alt satırı", 120, "Kimlik yok. Belge yok. Sadece kripto.", "No ID. No documents. Just crypto."],
        "footProduct" => ["Footer", "Sütun · Ürün", 24, "Ürün", "Product"],
        "footSupport" => ["Footer", "Sütun · Destek", 24, "Destek", "Support"],
        "footAccount" => ["Footer", "Sütun · Hesap", 24, "Hesap", "Account"],
        "footCoins" => ["Footer", "Sütun · Coinler", 40, "Kabul edilen coinler", "Accepted coins"],
        "footLive" => ["Footer", "Bağlantı · Canlı destek", 40, "7/24 canlı destek", "24/7 live support"],
        "footCopy" => ["Footer", "Telif satırı", 60, "© 2026 CLAY", "© 2026 CLAY"],
        "footRight" => ["Footer", "Sağ alt satır", 80, "Gizliliğin seninle kalsın.", "Your privacy stays with you."],
    ];
}

function clay_lp_langs(): array
{
    return ["tr", "en"];
}

function clay_lp_clean(string $raw, int $max): string
{
    $value = str_replace("\0", "", $raw);
    $value = strip_tags($value);
    $value = (string) preg_replace("/[\\x00-\\x1F\\x7F]/u", " ", $value);
    $value = trim((string) preg_replace("/\\s+/u", " ", $value));
    return function_exists("mb_substr") ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}

function clay_lp_store_path(): string
{
    $dir = __DIR__;
    $primary = $dir . "/clay-ledger.json";
    if (is_writable($dir) || (is_file($primary) && is_writable($primary))) {
        return $primary;
    }
    return sys_get_temp_dir() . "/clay-ledger-" . substr(hash("sha256", $dir), 0, 16) . ".json";
}

/** Only settings.plans and settings.lp, cached per ledger mtime so landing hits skip the full ledger parse. */
function clay_lp_settings(): array
{
    $path = clay_lp_store_path();
    clearstatcache(true, $path);
    if (!is_file($path)) {
        return [];
    }
    $stamp = filemtime($path) . ":" . filesize($path);
    $cache = sys_get_temp_dir() . "/clay-lp-" . substr(hash("sha256", __DIR__), 0, 16) . ".json";
    $hit = is_file($cache) ? json_decode((string) @file_get_contents($cache), true) : null;
    if (is_array($hit) && ($hit["stamp"] ?? "") === $stamp && isset($hit["settings"]) && is_array($hit["settings"])) {
        return $hit["settings"];
    }
    $handle = @fopen($path, "r");
    if (!$handle) {
        return [];
    }
    flock($handle, LOCK_SH);
    $db = json_decode((string) stream_get_contents($handle), true);
    flock($handle, LOCK_UN);
    fclose($handle);
    $all = is_array($db) && isset($db["settings"]) && is_array($db["settings"]) ? $db["settings"] : [];
    $settings = [
        "plans" => isset($all["plans"]) && is_array($all["plans"]) ? $all["plans"] : [],
        "lp" => isset($all["lp"]) && is_array($all["lp"]) ? $all["lp"] : [],
    ];
    @file_put_contents($cache, json_encode(["stamp" => $stamp, "settings" => $settings], JSON_UNESCAPED_UNICODE), LOCK_EX);
    return $settings;
}

/** Saved overrides only: ["tr" => [key => text], "en" => [...]]. */
function clay_lp_overrides(?array $settings = null): array
{
    if ($settings === null) {
        $settings = clay_lp_settings();
    }
    $raw = isset($settings["lp"]) && is_array($settings["lp"]) ? $settings["lp"] : [];
    $schema = clay_lp_schema();
    $out = [];
    foreach (clay_lp_langs() as $lang) {
        $out[$lang] = [];
        $rows = isset($raw[$lang]) && is_array($raw[$lang]) ? $raw[$lang] : [];
        foreach ($rows as $key => $value) {
            if (isset($schema[$key]) && is_string($value)) {
                $clean = clay_lp_clean($value, $schema[$key][2]);
                if ($clean !== "") {
                    $out[$lang][$key] = $clean;
                }
            }
        }
    }
    return $out;
}

/** Final copy per language: default text with saved overrides on top. */
function clay_lp_copy(?array $settings = null): array
{
    if ($settings === null) {
        $settings = clay_lp_settings();
    }
    $over = clay_lp_overrides($settings);
    $defaults = clay_lp_defaults($settings);
    $copy = [];
    foreach (clay_lp_langs() as $lang) {
        foreach ($defaults[$lang] as $key => $text) {
            $copy[$lang][$key] = $over[$lang][$key] ?? $text;
        }
    }
    return $copy;
}

/** Plan ids in launchpad order: Duo, Multi, Prime. */
function clay_lp_plan_ids(): array
{
    return [1 => "kivilcim", 2 => "atolye", 3 => "galeri"];
}

/** Schema defaults; plan name/price/cards follow the admin plan settings. */
function clay_lp_defaults(array $settings): array
{
    $out = [];
    foreach (clay_lp_langs() as $i => $lang) {
        foreach (clay_lp_schema() as $key => $row) {
            $out[$lang][$key] = $row[3 + $i];
        }
        foreach (clay_lp_plan_ids() as $n => $id) {
            $plan = isset($settings["plans"][$id]) && is_array($settings["plans"][$id]) ? $settings["plans"][$id] : null;
            if (!$plan) {
                continue;
            }
            $name = clay_lp_clean((string) ($plan["name"] ?? ""), 32);
            if ($name !== "") {
                $out[$lang]["plan{$n}Name"] = $name;
            }
            $minor = (int) ($plan["priceUsdMinor"] ?? 0);
            if ($minor > 0) {
                $out[$lang]["plan{$n}Price"] = "$" . number_format($minor / 100, $minor % 100 ? 2 : 0, ".", ",");
            }
            $limit = (int) ($plan["cardLimit"] ?? 0);
            if ($limit > 0) {
                $out[$lang]["plan{$n}Cards"] = $limit . ($lang === "tr" ? " kart" : ($limit === 1 ? " card" : " cards"));
            }
        }
    }
    return $out;
}

/**
 * Applies one admin save to $settings["lp"]. $values: [lang => [key => text]].
 * Text equal to the default (or empty) drops the override.
 */
function clay_lp_apply(array &$settings, array $values, bool $reset): void
{
    $schema = clay_lp_schema();
    $defaults = clay_lp_defaults($settings);
    $current = clay_lp_overrides($settings);
    foreach (clay_lp_langs() as $lang) {
        if ($reset) {
            $current[$lang] = [];
            continue;
        }
        $rows = isset($values[$lang]) && is_array($values[$lang]) ? $values[$lang] : [];
        foreach ($rows as $key => $value) {
            if (!isset($schema[$key]) || !is_scalar($value)) {
                continue;
            }
            $clean = clay_lp_clean((string) $value, $schema[$key][2]);
            if ($clean === "" || $clean === $defaults[$lang][$key]) {
                unset($current[$lang][$key]);
            } else {
                $current[$lang][$key] = $clean;
            }
        }
    }
    $settings["lp"] = $current;
}

function clay_lp_e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

if (realpath((string) ($_SERVER["SCRIPT_FILENAME"] ?? "")) === __FILE__) {
    header("Content-Type: application/json; charset=UTF-8");
    header("Cache-Control: no-store");
    header("X-Content-Type-Options: nosniff");
    $settings = clay_lp_settings();
    $defaults = clay_lp_defaults($settings);
    $fields = [];
    foreach (clay_lp_schema() as $key => $row) {
        $fields[] = ["key" => $key, "group" => $row[0], "label" => $row[1], "max" => $row[2], "tr" => $defaults["tr"][$key], "en" => $defaults["en"][$key]];
    }
    echo json_encode(["fields" => $fields, "values" => clay_lp_overrides($settings)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
}
