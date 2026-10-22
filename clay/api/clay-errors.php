<?php
function clay_error_tr(string $code): string
{
    $map = [
        "e-giris" => "Kullanıcı adı veya parola hatalı.",
        "e-kilit" => "Çok fazla istek. Bir süre bekleyin.",
        "e-captcha" => "Güvenlik doğrulaması gerekli.",
        "e-askida" => "Bu hesap askıya alındı. Giriş kapalı.",
        "e-kapali" => "Bu hesap kalıcı olarak kapatıldı. Giriş kapalı.",
        "e-yetki" => "Bu işlem için yetkin yok.",
        "e-ip" => "Bu IP’den yönetici girişi kapalı.",
        "e-bakim" => "Panel bakımda. Kısa süre sonra tekrar dene.",
        "e-yok" => "Kayıt bulunamadı.",
        "e-var" => "Bu kayıt zaten var.",
        "e-tutar" => "Tutar geçersiz.",
        "e-durum" => "Kart bu işlem için uygun değil.",
        "e-onay" => "Onay gerekli.",
        "e-tavan" => "Bakiye tavanı aşıldı.",
        "e-defter" => "Defter yazılamadı.",
        "e-mesaj" => "Metin uzunluğu geçersiz.",
        "e-telegram" => "Telegram değeri geçersiz.",
        "e-parola" => "Parola geçersiz.",
        "e-parola-eski" => "Mevcut parola hatalı.",
        "e-tohum-yok" => "Bu hesapta kayıtlı tohum yok.",
        "e-haftalik" => "Haftalık limit aşıldı.",
        "e-toplam" => "Toplam limit aşıldı.",
        "e-kullanici" => "Kullanıcı adı geçersiz.",
        "e-ayar" => "Ayar değeri geçersiz.",
        "e-yonetici" => "Yönetici oturumu gerekli.",
        "e-paket" => "Başka kart için paket gerekir.",
        "e-plan" => "Başka kart için paket gerekir.",
        "e-bakiye" => "Bakiye yetersiz",
    ];
    return $map[$code] ?? "İşlem uygulanmadı.";
}
