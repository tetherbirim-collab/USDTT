<?php
/**
 * Extra member and desk actions. Money rows are reversed or refused.
 * Notices, closed cards, and closed tickets are lists, not the balance.
 */

function clay_id_list(string $raw): array
{
    $parts = preg_split("/\\s*,\\s*/", trim($raw)) ?: [];
    $out = [];
    foreach ($parts as $part) {
        if (preg_match("/^[a-z]+_[A-Za-z0-9-]{8,80}$/", $part)) {
            $out[$part] = $part;
        }
    }
    return array_values($out);
}

function clay_purge_closed_card(array &$db, string $cardId): bool
{
    $cardIndex = clay_card_index($db, $cardId);
    if ($cardIndex < 0 || ($db["cards"][$cardIndex]["status"] ?? "") !== "kapali") {
        return false;
    }
    array_splice($db["cards"], $cardIndex, 1);
    $db["orders"] = array_values(array_filter(
        $db["orders"],
        static function ($order) use ($cardId): bool {
            return ($order["cardId"] ?? "") !== $cardId;
        }
    ));
    return true;
}

function clay_shut_card(array &$db, int $userIndex, int $cardIndex, string $mode): string
{
    $status = (string) ($db["cards"][$cardIndex]["status"] ?? "");
    if ($mode === "cancel" && $status !== "hazirlaniyor") {
        return "durum";
    }
    if ($mode === "close" && ($status === "kapali" || $status === "hazirlaniyor")) {
        return "durum";
    }
    $gate = clay_issuer_delete($db["cards"][$cardIndex]);
    if (is_array($gate)) {
        return "kripicard";
    }
    $refund = clay_refund_fee($db, $userIndex, $db["cards"][$cardIndex]);
    if ($refund === "tavan") {
        return "tavan";
    }
    $db["cards"][$cardIndex]["status"] = "kapali";
    $db["cards"][$cardIndex]["readyAt"] = null;
    if ($mode === "cancel") {
        $cardId = (string) $db["cards"][$cardIndex]["id"];
        foreach ($db["orders"] as $n => $order) {
            if (($order["cardId"] ?? "") === $cardId) {
                $db["orders"][$n]["status"] = "iptal";
                $db["orders"][$n]["readyAt"] = null;
            }
        }
    }
    return "ok";
}

function clay_tx_find(array $db, string $id): int
{
    foreach ($db["transactions"] as $i => $entry) {
        if (($entry["id"] ?? "") === $id) {
            return $i;
        }
    }
    return -1;
}

function clay_parse_tl(string $text): ?int
{
    if (!preg_match("/(?:₺|\\$)\\s*(-?)([0-9.]+),([0-9]{2})/u", $text, $match)) {
        return null;
    }
    $kurus = ((int) str_replace(".", "", $match[2])) * 100 + (int) $match[3];
    return $match[1] === "-" ? -$kurus : $kurus;
}

function clay_usd_undo(array &$db, int $userIndex, int $delta): void
{
    if ($delta === 0) {
        return;
    }
    $next = (int) $db["users"][$userIndex]["usdMinor"] - $delta;
    if ($next < 0) {
        $next = 0;
    }
    $db["users"][$userIndex]["usdMinor"] = $next;
}

function clay_tx_undo(array &$db, int $txIndex): string
{
    $tx = $db["transactions"][$txIndex];
    if (!empty($tx["reversed"])) {
        return "red";
    }
    $ref = (string) ($tx["ref"] ?? "");
    if (str_starts_with($ref, "pay_") || str_ends_with($ref, ":iptal")) {
        return "e-kuyruk";
    }
    $status = (string) ($tx["status"] ?? "");
    if ($status === "reddedildi") {
        return "red";
    }
    if ($status !== "tamamlandi") {
        return "e-durum";
    }
    $kind = (string) ($tx["kind"] ?? "");
    if ($kind === "yenileme" || $kind === "transfer") {
        return "e-ters";
    }
    $userIndex = clay_user_index($db, (string) ($tx["userId"] ?? ""));
    if ($userIndex < 0) {
        return "e-yok";
    }
    $amount = (int) ($tx["amount"] ?? 0);
    $cardId = (string) ($tx["cardId"] ?? "");
    $cardIndex = $cardId !== "" ? clay_card_index($db, $cardId) : -1;
    $balance = (int) $db["users"][$userIndex]["balance"];
    $usdDelta = (int) ($tx["usdMinor"] ?? 0);

    if ($kind === "harcama") {
        if ($cardIndex < 0) {
            return "e-ters";
        }
        $spent = (int) $db["cards"][$cardIndex]["spent"] - abs($amount);
        $next = $balance + abs($amount);
        if ($spent < 0 || $next < 0 || $next > clay_max_balance()) {
            return "e-ters";
        }
        $db["cards"][$cardIndex]["spent"] = $spent;
        $db["users"][$userIndex]["balance"] = $next;
        clay_usd_undo($db, $userIndex, $usdDelta);
        return "ok";
    }
    if ($kind === "iade") {
        if ($cardIndex < 0) {
            return "e-ters";
        }
        $spent = (int) $db["cards"][$cardIndex]["spent"] + abs($amount);
        $next = $balance - abs($amount);
        if ($spent > (int) $db["cards"][$cardIndex]["limit"] || $next < 0) {
            return "e-ters";
        }
        $db["cards"][$cardIndex]["spent"] = $spent;
        $db["users"][$userIndex]["balance"] = $next;
        clay_usd_undo($db, $userIndex, $usdDelta);
        return "ok";
    }
    if ($kind === "yukleme" && $cardIndex >= 0 && $amount < 0) {
        $gross = abs($amount);
        $net = null;
        if (preg_match("/Karta\\s+((?:₺|\\$)\\s*-?[0-9.,]+)/u", (string) ($tx["note"] ?? ""), $match)) {
            $net = clay_parse_tl($match[1]);
        }
        if ($net === null || $net < 1 || $net > $gross) {
            return "e-ters";
        }
        $limit = (int) $db["cards"][$cardIndex]["limit"] - $net;
        $next = $balance + $gross;
        if ($limit < (int) $db["cards"][$cardIndex]["spent"] || $next > clay_max_balance()) {
            return "e-ters";
        }
        $db["cards"][$cardIndex]["limit"] = $limit;
        $db["users"][$userIndex]["balance"] = $next;
        clay_usd_undo($db, $userIndex, $usdDelta);
        return "ok";
    }
    if ($kind === "yukleme" || $kind === "basim" || $kind === "duzeltme") {
        $next = $balance - $amount;
        if ($next < 0 || $next > clay_max_balance()) {
            return "e-bakiye";
        }
        $db["users"][$userIndex]["balance"] = $next;
        clay_usd_undo($db, $userIndex, $usdDelta);
        return "ok";
    }
    return "e-ters";
}

function clay_desk_act(array &$db, ?array $me, string $action, array $in): ?array
{
    if (!$me) {
        return null;
    }

    if ($action === "notice-clear") {
        $id = (string) $me["id"];
        $db["notices"] = array_values(array_filter(
            $db["notices"],
            static function ($note) use ($id): bool {
                return ($note["userId"] ?? "") !== $id;
            }
        ));
        return clay_ok("bildirim-sil");
    }

    if ($action === "purge-kapali") {
        if (clay_in($in, "onay") !== "on") {
            return clay_fail("e-onay");
        }
        $gone = 0;
        $ids = [];
        foreach ($db["cards"] as $card) {
            if (($card["userId"] ?? "") === $me["id"] && ($card["status"] ?? "") === "kapali") {
                $ids[] = (string) $card["id"];
            }
        }
        foreach ($ids as $cardId) {
            if (clay_purge_closed_card($db, $cardId)) {
                $gone++;
            }
        }
        return $gone > 0 ? clay_ok("silindi") : clay_fail("e-yok");
    }

    if ($action === "order-clear") {
        if (clay_in($in, "onay") !== "on") {
            return clay_fail("e-onay");
        }
        $cardId = clay_in($in, "id");
        $cardIndex = clay_card_index($db, $cardId, (string) $me["id"]);
        if ($cardIndex < 0 || ($db["cards"][$cardIndex]["status"] ?? "") !== "kapali") {
            return clay_fail("e-durum");
        }
        $cancelled = false;
        foreach ($db["orders"] as $order) {
            if (($order["cardId"] ?? "") === $cardId && ($order["status"] ?? "") === "iptal") {
                $cancelled = true;
            }
        }
        if (!$cancelled) {
            return clay_fail("e-durum");
        }
        return clay_purge_closed_card($db, $cardId) ? clay_ok("silindi") : clay_fail("e-yok");
    }

    if ($action === "admin-kapat") {
        if (clay_in($in, "onay") !== "on" || clay_in($in, "mod") !== "kalici") {
            return clay_fail("e-onay");
        }
        $index = clay_user_index($db, clay_in($in, "uye"));
        if ($index < 0 || ($db["users"][$index]["role"] ?? "") !== "uye" || $db["users"][$index]["id"] === $me["id"]) {
            return clay_fail("e-yok");
        }
        $db["users"][$index]["status"] = "kapali";
        clay_notice($db, (string) $db["users"][$index]["id"], "Hesap kapatıldı", "Hesabın kalıcı olarak kapatıldı. Giriş kapalı. Geçmiş kayıt duruyor.");
        return clay_ok("kapandi");
    }

    if ($action === "admin-toplu-aski") {
        $ids = clay_id_list(clay_in($in, "idler"));
        $count = 0;
        foreach ($ids as $id) {
            $index = clay_user_index($db, $id);
            if ($index < 0 || ($db["users"][$index]["role"] ?? "") !== "uye" || $db["users"][$index]["id"] === $me["id"]) {
                continue;
            }
            if (($db["users"][$index]["status"] ?? "") !== "acik") {
                continue;
            }
            $db["users"][$index]["status"] = "askida";
            clay_notice($db, $id, "Hesap askıda", "Girişin kapatıldı. Hesap açılınca buradan haberin olur.");
            $count++;
        }
        return $count > 0 ? clay_ok("askida") : clay_fail("e-yok");
    }

    if ($action === "admin-uye-sifre") {
        $index = clay_user_index($db, clay_in($in, "uye"));
        $password = clay_in($in, "parola");
        $again = clay_in($in, "parola2");
        if ($index < 0 || ($db["users"][$index]["role"] ?? "") !== "uye") {
            return clay_fail("e-yok");
        }
        if (!clay_password_shape($password) || $password !== $again) {
            return clay_fail("e-parola");
        }
        $salt = bin2hex(random_bytes(16));
        $db["users"][$index]["passSalt"] = $salt;
        $db["users"][$index]["passHash"] = clay_digest($password, $salt);
        $db["users"][$index]["password"] = "";
        clay_notice($db, (string) $db["users"][$index]["id"], "Parola yenilendi", "Yönetim yeni bir parola yazdı. Bir sonraki girişte onu kullan.");
        $out = clay_ok("sifre-yaz");
        $out["once"] = $password;
        return $out;
    }

    if ($action === "admin-uye-plan") {
        $index = clay_user_index($db, clay_in($in, "uye"));
        $plan = clay_in($in, "plan");
        if ($index < 0 || ($db["users"][$index]["role"] ?? "") !== "uye" || !clay_is_plan($plan)) {
            return clay_fail("e-plan");
        }
        if (($db["users"][$index]["plan"] ?? "") === $plan) {
            return clay_fail("plan-ayni");
        }
        $priced = $db["settings"]["plans"][$plan];
        if (clay_open_count($db, (string) $db["users"][$index]["id"]) > (int) $priced["cardLimit"]) {
            return clay_fail("e-plan-dolu");
        }
        $price = clay_kurus((int) $priced["priceUsdMinor"]);
        if ($price > (int) $db["users"][$index]["balance"]) {
            return clay_fail("e-bakiye");
        }
        if ($price > 0) {
            $db["users"][$index]["balance"] -= $price;
            $db["transactions"][] = [
                "id" => "tx_" . clay_rid(),
                "userId" => $db["users"][$index]["id"],
                "cardId" => null,
                "kind" => "duzeltme",
                "title" => "Plan · " . $priced["name"],
                "note" => "Yönetim planı yazdı. Plan ücreti bakiyeden düştü.",
                "amount" => -$price,
                "usdMinor" => -((int) $priced["priceUsdMinor"]),
                "status" => "tamamlandi",
                "createdAt" => clay_now(),
                "ref" => null,
            ];
        }
        $db["users"][$index]["plan"] = $plan;
        $db["users"][$index]["planUntil"] = clay_iso(clay_ms(clay_now()) + (30 * 86400000));
        clay_notice($db, (string) $db["users"][$index]["id"], "Plan güncellendi", "Vitrin planın " . $priced["name"] . " oldu. Plan ücreti " . clay_tl($price) . " bakiyeden düştü.");
        return clay_ok("plan-yaz");
    }

    if ($action === "admin-uye-profil") {
        $index = clay_user_index($db, clay_in($in, "uye"));
        if ($index < 0 || ($db["users"][$index]["role"] ?? "") !== "uye") {
            return clay_fail("e-yok");
        }
        $name = clay_display_name(clay_in($in, "ad"));
        $address = clay_address(clay_in($in, "adres"));
        if ($name === null || $address === null) {
            return clay_fail($name === null ? "e-ad" : "e-adres");
        }
        $db["users"][$index]["name"] = $name;
        $db["users"][$index]["address"] = $address;
        $question = clay_in($in, "soru");
        $answer = clay_answer(clay_in($in, "cevap"));
        if ($question !== "" || $answer !== "") {
            if (!isset(clay_questions()[$question]) || mb_strlen($answer) < 2 || mb_strlen($answer) > 40) {
                return clay_fail("e-cevap");
            }
            $db["users"][$index]["securityQuestion"] = $question;
            clay_answer_put($db["users"][$index], $answer);
        }
        clay_notice($db, (string) $db["users"][$index]["id"], "Hesap bilgisi güncellendi", "Ad, adres veya güvenlik kaydın yönetim masasında yenilendi.");
        return clay_ok("profil");
    }

    if ($action === "admin-kartlari-kapat") {
        if (clay_in($in, "onay") !== "on") {
            return clay_fail("e-onay");
        }
        $uid = clay_in($in, "uye");
        $userIndex = clay_user_index($db, $uid);
        if ($userIndex < 0 || ($db["users"][$userIndex]["role"] ?? "") !== "uye") {
            return clay_fail("e-yok");
        }
        $count = 0;
        foreach ($db["cards"] as $i => $card) {
            if (($card["userId"] ?? "") !== $uid) {
                continue;
            }
            $status = (string) ($card["status"] ?? "");
            if ($status === "kapali") {
                continue;
            }
            $mode = $status === "hazirlaniyor" ? "cancel" : "close";
            $code = clay_shut_card($db, $userIndex, $i, $mode);
            if ($code === "tavan") {
                return clay_fail("e-tavan");
            }
            if ($code === "kripicard") {
                return clay_fail("e-kripicard", "Kart sağlayıcı kartı kapatmadı.");
            }
            if ($code === "ok") {
                $count++;
            }
        }
        if ($count < 1) {
            return clay_fail("e-yok");
        }
        clay_notice($db, $uid, "Kartlar kapatıldı", "Açık kartların yönetim masasında kapatıldı. Basım ücreti bakiyeye döndü.");
        return clay_ok("kartlar-kapandi");
    }

    if ($action === "admin-kart-toplu") {
        $mode = clay_in($in, "mod");
        $ids = clay_id_list(clay_in($in, "idler"));
        if (!in_array($mode, ["dondur", "kapat", "sil", "iptal"], true) || $ids === []) {
            return clay_fail("e-durum");
        }
        if (($mode === "kapat" || $mode === "sil") && clay_in($in, "onay") !== "on") {
            return clay_fail("e-onay");
        }
        $count = 0;
        if ($mode === "sil") {
            foreach ($ids as $cardId) {
                if (clay_purge_closed_card($db, $cardId)) {
                    $count++;
                }
            }
            return $count > 0 ? clay_ok("silindi") : clay_fail("e-durum");
        }
        foreach ($ids as $cardId) {
            $cardIndex = clay_card_index($db, $cardId);
            if ($cardIndex < 0) {
                continue;
            }
            $userIndex = clay_user_index($db, (string) ($db["cards"][$cardIndex]["userId"] ?? ""));
            if ($userIndex < 0) {
                continue;
            }
            if ($mode === "dondur" && ($db["cards"][$cardIndex]["status"] ?? "") === "aktif") {
                $gate = clay_issuer_act($db["cards"][$cardIndex], "freeze");
                if ($gate) {
                    if ($count > 0) {
                        $gate["save"] = true;
                    }
                    return $gate;
                }
                $db["cards"][$cardIndex]["status"] = "donduruldu";
                clay_notice($db, (string) $db["cards"][$cardIndex]["userId"], "Kart donduruldu", $db["cards"][$cardIndex]["label"] . " donduruldu. Harcama kapalı.");
                $count++;
                continue;
            }
            if ($mode === "kapat" && in_array($db["cards"][$cardIndex]["status"] ?? "", ["aktif", "donduruldu"], true)) {
                $code = clay_shut_card($db, $userIndex, $cardIndex, "close");
                if ($code === "tavan") {
                    return clay_fail("e-tavan");
                }
                if ($code === "kripicard") {
                    return clay_fail("e-kripicard", "Kart sağlayıcı kartı kapatmadı.");
                }
                if ($code !== "ok") {
                    continue;
                }
                $count++;
                continue;
            }
            if ($mode === "iptal" && ($db["cards"][$cardIndex]["status"] ?? "") === "hazirlaniyor") {
                $code = clay_shut_card($db, $userIndex, $cardIndex, "cancel");
                if ($code === "tavan") {
                    return clay_fail("e-tavan");
                }
                if ($code === "kripicard") {
                    return clay_fail("e-kripicard", "Kart sağlayıcı kartı kapatmadı.");
                }
                if ($code !== "ok") {
                    continue;
                }
                clay_notice($db, (string) $db["cards"][$cardIndex]["userId"], "Sipariş iptal edildi", $db["cards"][$cardIndex]["label"] . " siparişi iptal edildi. Basım ücreti bakiyeye döndü.");
                $count++;
            }
        }
        if ($count < 1) {
            return clay_fail("e-durum");
        }
        return clay_ok($mode === "dondur" ? "donduruldu" : ($mode === "iptal" ? "iptal" : "kapatildi"));
    }

    if ($action === "admin-siparis-iptal") {
        $orderId = clay_in($in, "id");
        $orderIndex = -1;
        foreach ($db["orders"] as $i => $order) {
            if (($order["id"] ?? "") === $orderId) {
                $orderIndex = $i;
                break;
            }
        }
        if ($orderIndex < 0 || ($db["orders"][$orderIndex]["status"] ?? "") !== "hazirlaniyor") {
            return clay_fail("e-durum");
        }
        $cardIndex = clay_card_index($db, (string) $db["orders"][$orderIndex]["cardId"]);
        $userIndex = clay_user_index($db, (string) $db["orders"][$orderIndex]["userId"]);
        if ($cardIndex < 0 || $userIndex < 0) {
            return clay_fail("e-yok");
        }
        $code = clay_shut_card($db, $userIndex, $cardIndex, "cancel");
        if ($code === "tavan") {
            return clay_fail("e-tavan");
        }
        if ($code === "kripicard") {
            return clay_fail("e-kripicard", "Kart sağlayıcı kartı kapatmadı.");
        }
        if ($code !== "ok") {
            return clay_fail("e-durum");
        }
        clay_notice($db, (string) $db["orders"][$orderIndex]["userId"], "Sipariş iptal edildi", $db["cards"][$cardIndex]["label"] . " siparişi iptal edildi. Basım ücreti bakiyeye döndü.");
        return clay_ok("iptal");
    }

    if ($action === "admin-siparis-sil") {
        if (clay_in($in, "onay") !== "on") {
            return clay_fail("e-onay");
        }
        $orderId = clay_in($in, "id");
        $orderIndex = -1;
        foreach ($db["orders"] as $i => $order) {
            if (($order["id"] ?? "") === $orderId) {
                $orderIndex = $i;
                break;
            }
        }
        if ($orderIndex < 0) {
            return clay_fail("e-yok");
        }
        $order = $db["orders"][$orderIndex];
        $cardIndex = clay_card_index($db, (string) ($order["cardId"] ?? ""));
        $cardStatus = $cardIndex >= 0 ? (string) ($db["cards"][$cardIndex]["status"] ?? "") : "";
        $closed = ($order["status"] ?? "") === "iptal" || $cardStatus === "kapali";
        if (!$closed) {
            return clay_fail("e-durum");
        }
        if ($cardIndex >= 0 && $cardStatus !== "kapali") {
            return clay_fail("e-durum");
        }
        if ($cardIndex >= 0) {
            return clay_purge_closed_card($db, (string) $db["cards"][$cardIndex]["id"]) ? clay_ok("silindi") : clay_fail("e-yok");
        }
        array_splice($db["orders"], $orderIndex, 1);
        return clay_ok("silindi");
    }

    if ($action === "admin-tx-sil") {
        if (clay_in($in, "onay") !== "on") {
            return clay_fail("e-onay");
        }
        $txIndex = clay_tx_find($db, clay_in($in, "islem"));
        if ($txIndex < 0) {
            return clay_fail("e-yok");
        }
        $code = clay_tx_undo($db, $txIndex);
        if ($code !== "ok" && $code !== "red") {
            return clay_fail($code);
        }
        array_splice($db["transactions"], $txIndex, 1);
        return clay_ok($code === "red" ? "temiz" : "ters");
    }

    if ($action === "admin-tx-temizle") {
        if (clay_in($in, "onay") !== "on") {
            return clay_fail("e-onay");
        }
        $next = [];
        $gone = 0;
        foreach ($db["transactions"] as $entry) {
            $ref = (string) ($entry["ref"] ?? "");
            $drop = (($entry["status"] ?? "") === "reddedildi" || !empty($entry["reversed"]))
                && !str_starts_with($ref, "pay_")
                && !str_ends_with($ref, ":iptal");
            if ($drop) {
                $gone++;
                continue;
            }
            $next[] = $entry;
        }
        if ($gone < 1) {
            return clay_fail("e-yok");
        }
        $db["transactions"] = $next;
        return clay_ok("temiz");
    }

    if ($action === "admin-ticket-sil") {
        $id = clay_in($in, "id");
        $next = [];
        $gone = false;
        foreach ($db["tickets"] as $ticket) {
            if (($ticket["id"] ?? "") === $id) {
                $gone = true;
                continue;
            }
            $next[] = $ticket;
        }
        if (!$gone) {
            return clay_fail("e-yok");
        }
        $db["tickets"] = $next;
        return clay_ok("talep-sil");
    }

    if ($action === "admin-ticket-temizle") {
        $next = [];
        $gone = 0;
        foreach ($db["tickets"] as $ticket) {
            if (($ticket["status"] ?? "") === "kapandi") {
                $gone++;
                continue;
            }
            $next[] = $ticket;
        }
        if ($gone < 1) {
            return clay_fail("e-yok");
        }
        $db["tickets"] = $next;
        return clay_ok("talep-sil");
    }

    if ($action === "admin-notice-sil") {
        $id = clay_in($in, "id");
        $next = [];
        $gone = false;
        foreach ($db["notices"] as $note) {
            if (($note["id"] ?? "") === $id) {
                $gone = true;
                continue;
            }
            $next[] = $note;
        }
        if (!$gone) {
            return clay_fail("e-yok");
        }
        $db["notices"] = $next;
        return clay_ok("bildirim-sil");
    }

    if ($action === "admin-notice-temizle") {
        $uid = clay_in($in, "uye");
        if (clay_user_index($db, $uid) < 0) {
            return clay_fail("e-yok");
        }
        $next = [];
        $gone = 0;
        foreach ($db["notices"] as $note) {
            if (($note["userId"] ?? "") === $uid) {
                $gone++;
                continue;
            }
            $next[] = $note;
        }
        if ($gone < 1) {
            return clay_fail("e-yok");
        }
        $db["notices"] = $next;
        return clay_ok("bildirim-sil");
    }

    if ($action === "admin-cek-gizle") {
        $id = clay_in($in, "id");
        foreach ($db["payouts"] as $i => $row) {
            if (($row["id"] ?? "") !== $id) {
                continue;
            }
            $status = (string) ($row["status"] ?? "");
            if ($status !== "gitti" && $status !== "iptal") {
                return clay_fail("e-durum");
            }
            $db["payouts"][$i]["hidden"] = true;
            return clay_ok("gizlendi");
        }
        return clay_fail("e-yok");
    }

    if ($action === "admin-sifirla") {
        $alan = clay_in($in, "alan");
        $fresh = clay_default_settings();
        if ($alan === "plan") {
            foreach (["kivilcim", "atolye", "galeri"] as $id) {
                $db["settings"]["plans"][$id] = $fresh["plans"][$id];
            }
            return clay_ok("sifirlandi");
        }
        if ($alan === "ucret") {
            $db["settings"]["issueFeeKurus"] = $fresh["issueFeeKurus"];
            $db["settings"]["loadFeePercent"] = $fresh["loadFeePercent"];
            $db["settings"]["transferFeePercent"] = $fresh["transferFeePercent"];
            return clay_ok("sifirlandi");
        }
        if ($alan === "metin") {
            $db["settings"]["copy"] = [];
            return clay_ok("sifirlandi");
        }
        return clay_fail("e-ayar");
    }

    return null;
}
