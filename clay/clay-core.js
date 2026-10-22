(function () {
  if (window.__CLAY_CORE) return;
  window.__CLAY_CORE = true;

  function lang() {
    try {
      var stored = localStorage.getItem("clay-lang") || "";
      if (stored === "ru") {
        localStorage.setItem("clay-lang", "en");
        return "en";
      }
      if (stored === "en" || stored === "tr") return stored;
    } catch (e) {}
    return document.documentElement.lang === "en" ? "en" : "tr";
  }
  function en() { return lang() === "en"; }
  function db() { return window.__clay && window.__clay.get ? window.__clay.get() : null; }
  function me() {
    var data = db();
    if (!data || !data.users) return null;
    var id = "";
    try {
      id = sessionStorage.getItem("clay-session") || "";
      if (!id && localStorage.getItem("clay-remember") === "1") id = localStorage.getItem("clay-session") || "";
    } catch (e) {}
    if (id) {
      for (var i = 0; i < data.users.length; i++) if (data.users[i] && data.users[i].id === id) return data.users[i];
    }
    return data.users.length === 1 ? data.users[0] : null;
  }
  function issuerReady() {
    if (window.__clayIssuerReady === true) return true;
    var data = db();
    return !!(data && data.settings && data.settings.kripicardReady);
  }
  function money(cents) {
    return "$" + ((Number(cents) || 0) / 100).toFixed(2);
  }
  function t(tr, english) { return en() ? english : tr; }

  function hideRu() {
    document.querySelectorAll(".lang-option, [data-lang='ru'], .clay-ru, .clay-lang button").forEach(function (el) {
      var code = el.getAttribute("data-lang") || "";
      var text = (el.textContent || "");
      if (code === "ru" || el.classList.contains("clay-ru") || /Рус|Russian|\bRU\b/.test(text) && /lang-option/.test(el.className)) {
        el.hidden = true;
        if (el.parentElement && el.tagName === "LI") el.parentElement.hidden = true;
      }
    });
    try {
      if (localStorage.getItem("clay-lang") === "ru") localStorage.setItem("clay-lang", "en");
    } catch (e) {}
    if (document.documentElement.lang === "ru") document.documentElement.lang = "en";
  }

  function banner() {
    if (!/^\/panel(\/|$)/.test(location.pathname)) return;
    var host = document.querySelector("main") || document.body;
    if (!host) return;
    var box = document.querySelector(".clay-core-banner");
    if (!box) {
      box = document.createElement("p");
      box.className = "clay-core-banner";
      box.setAttribute("role", "status");
      host.insertBefore(box, host.firstChild);
    }
    var ready = issuerReady();
    box.className = "clay-core-banner " + (ready ? "is-ok" : "is-wait");
    box.textContent = ready
      ? t("Kart sağlayıcı bağlı. Yeni kart gerçek numara ile basılır.", "Card provider is connected. New cards are issued with a real number.")
      : t("Kripicard anahtarı henüz yok. Kart vitrini görünür; gerçek numara basılmaz. Anahtarı yönetim ücretler ekranına yapıştırınca basım açılır.", "The Kripicard key is not set yet. Display cards stay visible; no real number is issued. Paste the key on the admin fees screen to start issuing.");
  }

  function honestCards() {
    var data = db();
    if (!data) return;
    (data.cards || []).forEach(function (card) {
      if (!card || !card.id) return;
      var root = document.getElementById(card.id);
      if (!root) return;
      var live = !!(card.issuerCardId && card.pan && String(card.pan).replace(/\D/g, "").length >= 12);
      root.classList.toggle("is-display-card", !live);
      root.querySelectorAll(".vcard-pan, .card-pan").forEach(function (el) {
        if (el.childElementCount) return;
        if (!live) el.textContent = t("Numara yok", "No number");
      });
      if (!root.querySelector(".clay-core-card-note") && !live) {
        var note = document.createElement("p");
        note.className = "clay-core-card-note";
        note.textContent = t("Vitrin kartı · sağlayıcı anahtarı bekleniyor", "Display card · waiting for provider key");
        root.appendChild(note);
      }
      if (!root.getAttribute("data-clay-open")) {
        root.setAttribute("data-clay-open", card.id);
        root.style.cursor = "pointer";
        root.addEventListener("click", function (ev) {
          if (ev.target.closest("a, button, input, label, select, textarea")) return;
          location.assign("/panel/kartlar/?vurgu=" + encodeURIComponent(card.id));
        });
      }
    });
    document.querySelectorAll("article.vcard, .vcard").forEach(function (card) {
      var id = (card.closest("[id^='crd_']") || card).id || "";
      if (!id || card.getAttribute("data-clay-open")) return;
      var row = (data.cards || []).find(function (c) { return c && c.id === id; });
      if (!row) return;
      card.setAttribute("data-clay-open", id);
      card.style.cursor = "pointer";
      card.addEventListener("click", function (ev) {
        if (ev.target.closest("a, button, input, label, select, textarea")) return;
        location.assign("/panel/kartlar/?vurgu=" + encodeURIComponent(id));
      });
    });
  }

  function feeLine() {
    if (!/\/panel\/kartlar\/yeni\/?$/.test(location.pathname)) return;
    var data = db();
    var user = me();
    var fee = data && data.settings && data.settings.issueFeeKurus ? Number(data.settings.issueFeeKurus) : 1514;
    var input = document.querySelector('input[name="tutar"]');
    var onCard = Math.max(0, Math.round(parseFloat(String(input && input.value || "10").replace(",", ".")) * 100) || 0);
    var provider = 600 + Math.round(onCard * 0.04);
    var billed = Math.round(provider * 1.13);
    var total = fee + onCard + billed;
    var text = t(
      "Açılış " + money(fee) + " · karta " + money(onCard) + " · sağlayıcı " + money(billed) + " · toplam " + money(total),
      "Issue " + money(fee) + " · on card " + money(onCard) + " · provider " + money(billed) + " · total " + money(total)
    );
    var box = document.querySelector(".clay-core-fee");
    if (!box) {
      box = document.createElement("p");
      box.className = "clay-core-fee";
      var host = document.querySelector("h1") || document.querySelector("main");
      if (host && host.tagName === "H1" && host.parentNode) host.parentNode.insertBefore(box, host.nextSibling);
      else if (host) host.insertBefore(box, host.firstChild);
    }
    box.textContent = text;
    if (!issuerReady()) {
      var warn = document.querySelector(".clay-core-issue-wait");
      if (!warn) {
        warn = document.createElement("p");
        warn.className = "clay-core-issue-wait banner-bad";
        warn.setAttribute("role", "status");
        box.insertAdjacentElement("afterend", warn);
      }
      warn.textContent = t(
        "Anahtar yok: gönderirsen kart numarası üretilmez, bakiye düşmez.",
        "No provider key: submit will not issue a number and will not charge the wallet."
      );
    }
    document.querySelectorAll("p, .lede, .mt-2.max-w-2xl").forEach(function (el) {
      if (el.classList.contains("clay-core-fee") || el.classList.contains("clay-core-issue-wait")) return;
      var raw = (el.textContent || "").replace(/\s+/g, " ");
      if (raw.indexOf("750 TL") !== -1 && raw.length > 80 && el.childElementCount === 0) {
        el.textContent = text;
      }
    });
  }

  function busyForms() {
    if (document.documentElement.getAttribute("data-clay-busy-bound") === "1") return;
    document.documentElement.setAttribute("data-clay-busy-bound", "1");
    document.addEventListener("submit", function (ev) {
      var form = ev.target;
      if (!form || form.tagName !== "FORM") return;
      var btn = form.querySelector("button[type=submit], button.btn-gold, button.auth-primary");
      if (!btn) return;
      btn.classList.add("is-busy");
      btn.setAttribute("aria-busy", "true");
      if (!btn.getAttribute("data-clay-label")) btn.setAttribute("data-clay-label", btn.textContent);
      btn.textContent = t("Bekleniyor…", "Please wait…");
    }, true);
  }

  function noticeFromQuery() {
    if (window.__clayNoticeQuery && window.__clayNoticeQuery()) return;
    var q = new URLSearchParams(location.search).get("bildirim") || "";
    if (!q) return;
    if (document.querySelector(".clay-ask-back, .clay-quota-back, .clay-core-toast")) return;
    var map = {
      "e-kripicard-anahtar": t("Kart sağlayıcı anahtarı yok. Numara üretilmedi.", "Provider key missing. No card number was issued."),
      "e-kripicard-tutar": t("Karta yazılan tutar en az 10 USD olmalı.", "Amount on the card must be at least 10 USD."),
      "e-kripicard": t("Kart sağlayıcı isteği reddetti.", "The card provider rejected the request."),
      "e-bakiye": t("Bakiye yetersiz.", "Insufficient balance."),
      "siparis": t("Kart siparişi alındı.", "Card order received."),
      "basildi": t("Kart basıldı.", "Card issued.")
    };
    if (!map[q]) return;
    if (window.__clayAlert) {
      window.__clayAlert(q, map[q]);
      return;
    }
    var toast = document.createElement("p");
    toast.className = "clay-core-toast " + (q.indexOf("e-") === 0 ? "is-bad" : "is-ok");
    toast.setAttribute("role", "status");
    toast.textContent = map[q];
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 5200);
  }

  function paint() {
    hideRu();
    banner();
    honestCards();
    feeLine();
    busyForms();
    noticeFromQuery();
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(function () {
      queued = false;
      try { paint(); } catch (e) {}
    }, 120);
  }
  function start() {
    schedule();
    document.addEventListener("input", function (ev) {
      if (ev.target && ev.target.name === "tutar") feeLine();
    }, true);
    if (document.documentElement) {
      new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
    }
  }
  if (window.__clayAfterHydrate) window.__clayAfterHydrate(start);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
