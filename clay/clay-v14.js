(function () {
  if (window.__CLAY_V14) return;
  window.__CLAY_V14 = true;
  if (!window.__CLAY_OPS_SRC && !window.__CLAY_OPS) {
    window.__CLAY_OPS_SRC = true;
    var ops = document.createElement("script");
    ops.src = "/clay-ops.js?v=26";
    (document.head || document.documentElement).appendChild(ops);
  }

  function isEn() {
    try {
      var L = localStorage.getItem("clay-lang") || document.documentElement.lang || "tr";
      return L === "en";
    } catch (e) {
      return document.documentElement.lang === "en";
    }
  }
  function tx(tr, english) { return isEn() ? english : tr; }
  var MONEY_TR = {
    issue: "Kart basımı",
    fund: "Karta yükleme",
    plan: "Plan alma",
    "plan-iptal": "Plan iptali",
    cek: "Çekim",
    transfer: "Aktarım",
    close: "Kart kapatma",
    cancel: "Sipariş iptali",
    spend: "Harcama",
    harca: "Harcama",
    refund: "İade",
    renew: "Yenileme",
    activate: "Kartı açma",
    "ana-hesap": "Ana hesaba aktarma",
    purge: "Kartı silme",
    "kupon-uygula": "Kupon",
    "kart-uzat": "Süre uzatma",
    "admin-balance": "Bakiye düzeltme",
    "admin-set-balance": "Bakiye yazma",
    "admin-topup": "Bakiye yükleme",
    "admin-issue": "Kart basımı",
    "admin-transfer": "Aktarım",
    "admin-cek": "Çekim",
    "admin-close": "Kart kapatma"
  };
  var MONEY_EN = {
    issue: "Card issue",
    fund: "Card top-up",
    plan: "Buy plan",
    "plan-iptal": "Cancel plan",
    cek: "Withdrawal",
    transfer: "Transfer",
    close: "Close card",
    cancel: "Cancel order",
    spend: "Spend",
    harca: "Spend",
    refund: "Refund",
    renew: "Renew",
    activate: "Activate card",
    "ana-hesap": "Move to wallet",
    purge: "Delete card",
    "kupon-uygula": "Coupon",
    "kart-uzat": "Extend",
    "admin-balance": "Balance adjust",
    "admin-set-balance": "Set balance",
    "admin-topup": "Balance top-up",
    "admin-issue": "Card issue",
    "admin-transfer": "Transfer",
    "admin-cek": "Withdrawal",
    "admin-close": "Close card"
  };
  var MONEY = MONEY_TR;
  // Card close forms carry their own confirmation step.
  var SELF_CONFIRMED = { close: true, "admin-close": true };
  var liveThread = "";
  var deskThread = "";
  var deskThreads = [];
  var deskPicked = false;
  var lastLedger = "";
  var askChain = Promise.resolve();
  var origFetch = window.fetch ? window.fetch.bind(window) : null;

  function path() {
    return location.pathname.replace(/\/index\.html$/, "/");
  }
  function home() {
    var p = path();
    return p === "/" || p === "";
  }
  function publicSite() {
    var p = path();
    return home() || /^\/(giris|kayit|sifre)\/?$/.test(p);
  }
  function member() {
    return /^\/panel(\/|$)/.test(path());
  }
  function admin() {
    return /^\/clayadm!nxx(\/|$)/.test(path());
  }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function passOnce(action) {
    window.__clayOnayOnce = action;
    setTimeout(function () {
      if (window.__clayOnayOnce === action) window.__clayOnayOnce = "";
    }, 8000);
  }
  function viewer() {
    if (!(window.__clay && window.__clay.get)) return null;
    var db = window.__clay.get();
    if (!db || !Array.isArray(db.users)) return null;
    var id = "";
    try {
      id = sessionStorage.getItem("clay-session") || "";
      if (!id && localStorage.getItem("clay-remember") === "1") id = localStorage.getItem("clay-session") || "";
    } catch (e) {}
    if (id) {
      for (var i = 0; i < db.users.length; i++) if (db.users[i] && db.users[i].id === id) return db.users[i];
    }
    return db.users.length === 1 ? db.users[0] : null;
  }
  function planLive(user) {
    if (!user) return false;
    var plan = user.plan;
    if (plan !== "kivilcim" && plan !== "atolye" && plan !== "galeri") return false;
    return user.planStatus !== "iptal";
  }
  function planLabel(id) {
    return { kivilcim: "Clay Duo", atolye: "Clay Multi", galeri: "Clay Prime" }[id] || "Plan";
  }
  function moneyText(action, data) {
    var pack = isEn() ? MONEY_EN : MONEY_TR;
    var label = pack[action] || tx("Bu işlem", "This action");
    var amount = data && (data.tutar || data.bakiye || data.limit || data.amount || data.plan || "");
    if (action === "plan" && data && data.plan) amount = planLabel(data.plan);
    if (action === "ana-hesap") {
      return amount
        ? tx(
            "Ana hesaba " + amount + " aktarılacak. %" + transferPct() + " komisyon kesilir. Onaylıyor musun?",
            amount + " will move to the wallet. " + transferPct() + "% fee is taken. Do you confirm?"
          )
        : tx("Ana hesaba aktar. Onaylıyor musun?", "Move to the wallet. Do you confirm?");
    }
    if (amount) return label + " · " + amount + ". " + tx("Onaylıyor musun?", "Do you confirm?");
    return label + ". " + tx("Onaylıyor musun?", "Do you confirm?");
  }

  function hideQueryBanners() {
    document.documentElement.classList.add("clay-dialog-on");
    document.querySelectorAll("p.banner-bad[role=status], p.banner-ok[role=status]").forEach(function (el) {
      if (el.classList.contains("clay-core-issue-wait") || el.classList.contains("clay-issue-short") || el.classList.contains("clay-login-note") || el.classList.contains("clay-reg-note")) return;
      el.hidden = true;
      el.style.setProperty("display", "none", "important");
    });
    document.querySelectorAll(".clay-core-toast, .clay-toast.is-on").forEach(function (el) {
      el.remove();
    });
  }

  function askIcon(name) {
    var d = {
      wallet: '<rect x="3.2" y="7" width="17.6" height="12" rx="2.2"/><path d="M14.6 12.2h4.2v2.4h-4.2z"/><path d="M7 7V5.8A1.8 1.8 0 0 1 8.8 4h6.4A1.8 1.8 0 0 1 17 5.8V7"/>',
      card: '<rect x="3" y="6.2" width="18" height="12.2" rx="2.2"/><path d="M3 10.2h18"/><path d="M7 15.2h4"/>',
      check: '<circle cx="12" cy="12" r="8.2"/><path d="M8.2 12.2 11 15l4.8-5.4"/>',
      warn: '<path d="M12 4.2 21 19.2H3z"/><path d="M12 9.4v4.4M12 16.6v.8"/>',
      star: '<path d="M12 3.6 14.4 9h5.8l-4.6 3.5 1.7 5.7L12 15.4 6.7 18.2 8.4 12.5 3.8 9h5.8z"/>',
      confirm: '<circle cx="12" cy="12" r="8.2"/><path d="M8.4 12.1h7.2M12 8.5v7.2"/>'
    };
    return '<span class="clay-ask-mark" aria-hidden="true"><i></i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">' + (d[name] || d.warn) + "</svg></span>";
  }
  function openDialog(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      document.querySelectorAll(".clay-ask-back").forEach(function (old) { old.remove(); });
      document.querySelectorAll(".clay-quota-back").forEach(function (old) { old.remove(); });
      hideQueryBanners();
      var back = document.createElement("div");
      var tone = opts.tone || (opts.kind === "alert" ? (opts.ok ? "ok" : "bad") : "confirm");
      back.className = "clay-ask-back is-" + tone + (opts.kind === "alert" ? " is-alert" : " is-confirm");
      var actions = "";
      if (opts.kind === "alert") {
        if (opts.ctaHref && opts.ctaLabel) {
          actions += '<a class="btn btn-gold clay-ask-cta" data-ask="cta" href="' + esc(opts.ctaHref) + '"><span>' + esc(opts.ctaLabel) + "</span></a>";
        }
        actions += '<button type="button" class="btn ' + (opts.ctaHref ? "btn-ghost" : "btn-gold clay-ask-cta") + '" data-ask="ok"><span>' + esc(opts.okLabel || tx("Tamam", "OK")) + "</span></button>";
      } else {
        actions += '<button type="button" class="btn btn-gold clay-ask-cta" data-ask="yes"><span>' + esc(opts.yesLabel || tx("Onayla", "Confirm")) + "</span></button>";
        actions += '<button type="button" class="btn btn-ghost" data-ask="no"><span>' + esc(opts.noLabel || tx("Vazgeç", "Cancel")) + "</span></button>";
      }
      back.innerHTML = '<div class="clay-ask" role="alertdialog" aria-modal="true" data-clay-ask="1">' +
        '<i class="clay-ask-sheen" aria-hidden="true"></i>' +
        askIcon(opts.icon || (tone === "ok" ? "check" : tone === "confirm" ? "confirm" : "warn")) +
        '<p class="clay-ask-kicker"></p>' +
        '<p class="clay-ask-title"></p>' +
        '<p class="clay-confirm-q"></p>' +
        '<div class="clay-confirm-actions">' + actions + "</div></div>";
      var kicker = opts.kicker || (opts.kind === "confirm" ? tx("ONAY", "CONFIRM") : "");
      var title = opts.title || "";
      back.querySelector(".clay-ask-kicker").textContent = kicker;
      if (!kicker) back.querySelector(".clay-ask-kicker").hidden = true;
      var titleEl = back.querySelector(".clay-ask-title");
      titleEl.textContent = title;
      if (!title) titleEl.hidden = true;
      back.querySelector(".clay-confirm-q").textContent = opts.text || "";
      document.body.appendChild(back);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { back.classList.add("is-in"); });
      });
      var settled = false;
      function finish(ok) {
        if (settled) return;
        settled = true;
        back.classList.remove("is-in");
        back.classList.add("is-out");
        var wait = 240;
        try { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) wait = 0; } catch (e) {}
        setTimeout(function () {
          if (back.parentNode) back.remove();
          resolve(!!ok);
        }, wait);
      }
      var yes = back.querySelector("[data-ask=yes]");
      var no = back.querySelector("[data-ask=no]");
      var okBtn = back.querySelector("[data-ask=ok]");
      if (yes) yes.addEventListener("click", function () { finish(true); });
      if (no) no.addEventListener("click", function () { finish(false); });
      if (okBtn) okBtn.addEventListener("click", function () { finish(true); });
      back.addEventListener("click", function (event) {
        if (event.target === back) finish(opts.kind === "alert");
      });
      (yes || okBtn || no).focus();
    });
  }
  function openAsk(text) {
    return openDialog({
      kind: "confirm",
      tone: "confirm",
      icon: "confirm",
      kicker: tx("ONAY", "CONFIRM"),
      title: tx("Onay gerekiyor", "Confirmation required"),
      text: text
    });
  }
  function askConfirm(text) {
    var next = askChain.then(function () { return openAsk(text); });
    askChain = next.then(function () { return null; }, function () { return null; });
    return next;
  }
  function explainNotice(code, message) {
    var c = String(code || "");
    var extra = String(message || "").trim();
    var fail = c.indexOf("e-") === 0;
    var item = {
      kind: "alert",
      ok: !fail,
      tone: fail ? "bad" : "ok",
      icon: fail ? "warn" : "check",
      text: extra,
      kicker: fail ? tx("UYARI", "NOTICE") : tx("TAMAM", "DONE"),
      title: fail ? tx("İşlem uygulanmadı", "The action was not applied") : tx("İşlem tamamlandı", "The action completed")
    };
    if (c === "e-bakiye") {
      item.kicker = tx("BAKİYE", "BALANCE");
      item.title = tx("Bakiye yetersiz", "Insufficient balance");
      item.icon = "wallet";
      item.text = extra || tx("Bu işlem için cüzdanda yeterli tutar yok. Önce bakiye yükle, sonra yeniden dene.", "The wallet does not cover this action. Top up first, then try again.");
      item.ctaHref = "/panel/yukle/";
      item.ctaLabel = tx("Bakiye yükle", "Top up balance");
    } else if (c === "e-paket" || c === "e-plan") {
      item.kicker = tx("KART KOTASI", "CARD QUOTA");
      item.title = tx("Paket gerekir", "A plan is required");
      item.icon = "star";
      item.tone = "quota";
      item.text = extra || tx("Paketsiz hesapta 1 kart vardır. Duo 2, Multi 8, Prime 25 kart açar.", "Free accounts include 1 card. Duo is 2, Multi is 8, Prime is 25.");
      item.ctaHref = "/panel/yukselt/";
      item.ctaLabel = tx("Paket satın al", "Buy a plan");
    } else if (c === "e-kripicard-anahtar") {
      item.icon = "card";
      item.title = tx("Kart basılamadı", "Card was not issued");
      item.text = extra || tx("Kart sağlayıcı anahtarı yok. Numara üretilmedi, bakiye düşmedi.", "Provider key is missing. No number was issued and the wallet was not charged.");
    } else if (c === "e-kripicard-tutar") {
      item.icon = "card";
      item.title = tx("Tutar çok düşük", "Amount too low");
      item.text = extra || tx("Karta yazılan tutar en az 10 USD olmalı.", "Amount on the card must be at least 10 USD.");
    } else if (c.indexOf("e-kripicard") === 0) {
      item.icon = "card";
      item.title = tx("Kart basılamadı", "Card was not issued");
      item.text = extra || tx("Kart sağlayıcı isteği reddetti. Kart oluşmadı.", "The card provider rejected the request. No card was issued.");
    } else if (c === "e-tutar") {
      item.title = tx("Tutar geçersiz", "Invalid amount");
      item.text = extra || tx("Yazdığın tutarı kontrol et.", "Check the amount you entered.");
    } else if (c === "e-durum") {
      item.icon = "card";
      item.title = tx("Kart uygun değil", "Card cannot take this");
      item.text = extra || tx("Kart bu işlem için uygun değil.", "This card cannot take that action.");
    } else if (c === "e-limit") {
      item.title = tx("Limit aşıldı", "Limit exceeded");
      item.text = extra || tx("Bu işlem kart veya hesap limitini aşıyor.", "This action exceeds the card or account limit.");
    } else if (c === "e-bin" || c === "e-hesap") {
      item.icon = "card";
      item.title = tx("Kart bilgisi hatalı", "Card details are invalid");
      item.text = extra || tx("Kart bilgisi eksik veya hatalı.", "Card details are missing or invalid.");
    } else if (c === "siparis" || c === "basildi") {
      item.ok = true;
      item.tone = "ok";
      item.icon = "card";
      item.title = tx("Kart siparişi alındı", "Card order received");
      item.text = extra || tx("Sipariş deftere yazıldı. Numara sağlayıcı bağlanınca görünür.", "The order is on the ledger. The number appears once the provider is connected.");
    } else if (c === "transfer" || c === "ana-hesap") {
      item.ok = true;
      item.tone = "ok";
      item.icon = "wallet";
      item.title = tx("Aktarım tamamlandı", "Transfer completed");
      item.text = extra || tx("Tutar ilgili hesaba yazıldı.", "The amount was written to the destination.");
    } else if (!item.text) {
      item.text = fail
        ? tx("Kod: " + c, "Code: " + c)
        : tx("Kayıt deftere işlendi.", "The record was saved.");
    }
    return item;
  }
  function showAlert(code, message) {
    if (code === "e-onay") return Promise.resolve(true);
    var spec = explainNotice(code, message);
    var next = askChain.then(function () { return openDialog(spec); });
    askChain = next.then(function () { return null; }, function () { return null; });
    return next;
  }
  window.__clayAsk = askConfirm;
  window.__clayAlert = showAlert;
  window.__clayNoticeQuery = function () {
    var q = "";
    var extra = "";
    try {
      var sp = new URLSearchParams(location.search);
      q = sp.get("bildirim") || "";
      extra = sp.get("metin") || "";
    } catch (e) {}
    if (!q) return false;
    if (q === "hosgeldin" || q === "sifre" || q === "kapandi" || q === "transfer" || q === "ana-hesap") return false;
    hideQueryBanners();
    if (window.__clayNoticeShown === q + location.pathname) return true;
    window.__clayNoticeShown = q + location.pathname;
    showAlert(q, extra);
    return true;
  };

  function readUrl(input) {
    if (typeof input === "string") return input;
    if (input && typeof input.url === "string") return input.url;
    return "";
  }
  function readJson(init) {
    if (!init || init.body == null) return null;
    if (typeof FormData !== "undefined" && init.body instanceof FormData) {
      var form = {};
      init.body.forEach(function (value, key) { form[key] = value; });
      return form;
    }
    if (typeof init.body !== "string") return null;
    try { return JSON.parse(init.body); } catch (e) { return null; }
  }
  function classify(input, init) {
    var method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
    if (method !== "POST") return null;
    var url = readUrl(input);
    var data = readJson(init);
    if (!data || !data.action) return null;
    if (data.action === "issue" || data.action === "admin-issue") {
      return { kind: "ledger", action: data.action, text: moneyText(data.action, data) };
    }
    if (SELF_CONFIRMED[data.action]) return null;
    if (url.indexOf("/api/ledger.php") !== -1 && MONEY[data.action]) return { kind: "ledger", action: data.action, text: moneyText(data.action, data) };
    if (url.indexOf("/api/heleket.php") !== -1 && data.action === "create") return { kind: "heleket", action: "create", text: tx("Bakiye yükleme", "Balance top-up") + (data.amount ? " · " + data.amount + " USD" : "") + ". " + tx("Onaylıyor musun?", "Do you confirm?") };
    return null;
  }
  function rememberLedger(response) {
    if (!response || !response.clone) return;
    response.clone().text().then(function (text) {
      if (text && text.indexOf('"mode"') !== -1 && text.indexOf('"db"') !== -1) {
        lastLedger = text;
        try {
          var parsed = JSON.parse(text);
          window.__clayIssuerReady = parsed.issuerReady === true;
        } catch (e) {}
      }
    }).catch(function () {});
  }
  function rejected(kind) {
    if (kind === "heleket") {
      return new Response(JSON.stringify({ error: "İşlem onaylanmadı." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    var payload = null;
    try { payload = JSON.parse(lastLedger); } catch (e) { payload = null; }
    if (!payload || !payload.db || !payload.db.settings) {
      var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
      payload = { mode: "php", code: "e-onay", message: "İşlem onaylanmadı.", save: false, db: db || { settings: { plans: {} }, bins: [], users: [], cards: [], transactions: [] }, me: null };
    } else {
      payload.code = "e-onay";
      payload.message = "İşlem onaylanmadı.";
      payload.save = false;
    }
    return new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  var issueBusy = false;
  function issueKey() {
    try {
      var k = sessionStorage.getItem("clay-issue-idem");
      if (k && k.length >= 8) return k;
      k = "idm_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("clay-issue-idem", k);
      return k;
    } catch (e) {
      return "idm_" + Date.now();
    }
  }
  function withIdem(init, action) {
    if (action !== "issue" && action !== "admin-issue") return init;
    var data = readJson(init) || {};
    data.idem = issueKey();
    init = init ? Object.assign({}, init) : {};
    init.body = JSON.stringify(data);
    return init;
  }
  function lockIssueButtons(on) {
    issueBusy = !!on;
    document.querySelectorAll("form button[type=submit], .clay-confirm button, button").forEach(function (btn) {
      var label = String(btn.textContent || "").replace(/\s+/g, " ").trim();
        if (label !== "Kart Al" && label !== "Kartı oluştur" && label !== "Create card" && label !== "Issue card" && label !== "Kart bas" && !btn.closest(".clay-confirm")) return;
        if (label === "Kart Al" || label === "Kartı oluştur" || label === "Create card" || label === "Issue card" || label === "Kart bas") {
        btn.disabled = !!on;
        btn.setAttribute("aria-busy", on ? "true" : "false");
      }
    });
  }
  if (origFetch) {
    window.fetch = function (input, init) {
      var info = classify(input, init);
      var call = function () {
        var payload = readJson(init);
        if (payload && payload.action === "login") {
          var cap = document.querySelector("[name=captcha]");
          if (cap && cap.value) {
            payload.captcha = cap.value;
            init = init ? Object.assign({}, init) : {};
            init.body = JSON.stringify(payload);
          }
        }
        if (info && (info.action === "issue" || info.action === "admin-issue")) {
          if (info.action === "issue" && memberOverQuota()) {
            showQuotaNotice();
            return Promise.resolve(rejected(info.kind));
          }
          if (issueBusy) return Promise.resolve(rejected(info.kind));
          lockIssueButtons(true);
          init = withIdem(init, info.action);
        }
        return Promise.resolve(origFetch(input, init)).then(function (response) {
          if (readUrl(input).indexOf("/api/ledger.php") !== -1) rememberLedger(response);
          var payload = readJson(init);
          response.clone().json().then(function (body) {
            ledgerToast(payload && payload.action, body);
            if (info && (info.action === "issue" || info.action === "admin-issue")) {
              lockIssueButtons(false);
              if (body && body.code === "basildi") {
                try { sessionStorage.removeItem("clay-issue-idem"); } catch (e) {}
              }
              if (body && (body.code === "e-paket" || body.code === "e-plan")) {
                showQuotaNotice();
                pulseNow();
              } else if (body && String(body.code || "").indexOf("e-") === 0) {
                pulseNow();
              } else if (body && body.code === "basildi") pulseNow();
            }
          }).catch(function () {
            if (info && (info.action === "issue" || info.action === "admin-issue")) lockIssueButtons(false);
          });
          return response;
        }).catch(function (err) {
          if (info && (info.action === "issue" || info.action === "admin-issue")) lockIssueButtons(false);
          throw err;
        });
      };
      if (!info) {
        var peek = readJson(init);
        if (peek && (peek.action === "issue" || peek.action === "admin-issue")) {
          info = { kind: "ledger", action: peek.action, text: moneyText(peek.action, peek) };
        }
      }
      if (!info) return call();
      if (window.__clayOnayOnce && window.__clayOnayOnce === info.action) {
        window.__clayOnayOnce = "";
        return call();
      }
      return askConfirm(info.text).then(function (ok) {
        if (!ok) return rejected(info.kind);
        return call();
      });
    };
  }

  function postLive(body) {
    return fetch("/api/clay-live.php", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) { return res.json(); }).catch(function () { return { ok: false }; });
  }

  var liveOpening = false;
  var liveEnabled = null;
  var liveStatus = "acik";
  var liveAutos = [];
  var deskAutoEdit = "";
  var audioCtx = null;
  var audioHeard = {};
  var deskSeen = null;
  window.__clayAudio = { state: "idle", played: [] };
  function unlockAudio() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      window.__clayAudio.ctx = audioCtx;
      window.__clayAudio.state = audioCtx.state;
      return audioCtx.state === "running";
    } catch (e) {
      window.__clayAudio.state = "blocked";
      return false;
    }
  }
  function playTone(freq, delay, dur) {
    if (!audioCtx || audioCtx.state !== "running") return false;
    var start = audioCtx.currentTime + delay;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.06, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    return true;
  }
  function playChime(kind) {
    var ok = false;
    if (kind === "welcome") ok = playTone(523, 0, 0.16) && playTone(784, 0.12, 0.2);
    else if (kind === "customer") ok = playTone(440, 0, 0.12) && playTone(660, 0.09, 0.16);
    else ok = playTone(392, 0, 0.1) && playTone(523, 0.08, 0.14);
    window.__clayAudio.state = audioCtx ? audioCtx.state : "blocked";
    if (ok) window.__clayAudio.played.push(kind);
    return ok;
  }
  function hearWelcome(messages) {
    (messages || []).forEach(function (row) {
      if (row.from !== "welcome") return;
      var key = "w" + row.at;
      if (audioHeard[key]) return;
      if (Date.now() - Number(row.at) > 12000) {
        audioHeard[key] = true;
        return;
      }
      if (playChime("welcome")) audioHeard[key] = true;
    });
  }
  function hearDesk(threads) {
    if (!admin()) return;
    var keys = [];
    (threads || []).forEach(function (row) {
      keys.push("chat:" + row.id);
      (row.messages || []).forEach(function (msg) {
        if (msg.from === "visitor") keys.push("msg:" + row.id + ":" + msg.at);
      });
    });
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    if (db) {
      (db.users || []).forEach(function (user) { if (user && user.role === "uye") keys.push("user:" + user.id); });
      (db.orders || []).forEach(function (order) { if (order && order.status === "hazirlaniyor") keys.push("order:" + order.id); });
      (db.payouts || []).forEach(function (payout) { if (payout && payout.status === "bekliyor") keys.push("pay:" + payout.id); });
      (db.tickets || []).forEach(function (ticket) { if (ticket && ticket.status === "acik") keys.push("tkt:" + ticket.id); });
      (db.transactions || []).forEach(function (tx) {
        if (tx && (tx.kind === "yukleme" || tx.kind === "cek" || tx.kind === "transfer")) keys.push("tx:" + tx.id);
      });
      (db.cards || []).forEach(function (card) { if (card && card.status === "donduruldu") keys.push("card:" + card.id); });
      (db.users || []).forEach(function (user) { if (user && user.telegramId) keys.push("tg:" + user.id + ":" + user.telegramId); });
    }
    if (!deskSeen) {
      deskSeen = {};
      keys.forEach(function (key) { deskSeen[key] = true; });
      return;
    }
    var customer = false;
    var other = false;
    keys.forEach(function (key) {
      if (deskSeen[key]) return;
      deskSeen[key] = true;
      if (key.indexOf("msg:") === 0) customer = true;
      else other = true;
    });
    if (customer) playChime("customer");
    else if (other) playChime("desk");
  }
  function girisTrust() {
    if (!/^\/giris\/?$/.test(path())) return;
    if (document.querySelector(".auth-stage .trust-line")) return;
    var stage = document.querySelector(".auth-stage");
    if (!stage) return;
    var line = document.createElement("p");
    line.className = "trust-line";
    line.innerHTML = "<span>KYC YOK</span><span aria-hidden=\"true\"> · </span><span class=\"trust-hot\">LOG YOK</span><span aria-hidden=\"true\"> · </span><span>TAMAMEN GÜVENLİ VE ANONİM</span>";
    stage.insertBefore(line, stage.firstChild);
  }
  function telegramFor(customer, userId) {
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    if (!db || !Array.isArray(db.users)) return "";
    for (var i = 0; i < db.users.length; i++) {
      var user = db.users[i];
      if (!user || !user.telegramId) continue;
      if (userId && user.id === userId) return String(user.telegramId);
      if (customer && user.username === customer) return String(user.telegramId);
    }
    return "";
  }
  function paintMemberTelegram() {
    if (!admin() || !/\/uyeler\/?$/.test(path())) return;
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    if (!db || !Array.isArray(db.users)) return;
    document.querySelectorAll(".glass").forEach(function (card) {
      var text = card.innerText || "";
      db.users.forEach(function (user) {
        if (!user || !user.telegramId || !user.username) return;
        if (text.indexOf(user.username) === -1) return;
        var note = card.querySelector('.clay-tg-row[data-user="' + user.id + '"]');
        if (!note) {
          note = document.createElement("p");
          note.className = "clay-tg-row";
          note.setAttribute("data-user", user.id);
          card.appendChild(note);
        }
        note.textContent = "Telegram " + user.telegramId;
      });
    });
  }
  var seedWords = [];
  var seedOpen = false;
  var seedReady = false;
  var seedAsked = false;
  function maskSeed(words) {
    var keep = words.length > 3 ? 3 : Math.min(2, words.length);
    return words.map(function (word, index) { return index < keep ? word : "***"; }).join(" ");
  }
  function seedButton() {
    return document.querySelector("[data-clay-seed-show]");
  }
  function paintSeed() {
    var node = document.querySelector(".clay-seed-view");
    var btn = seedButton();
    if (!node) return;
    if (!seedReady) {
      node.textContent = "Tohum yükleniyor.";
      if (btn) {
        btn.hidden = false;
        btn.disabled = true;
        btn.textContent = "Görüntüle";
        btn.setAttribute("aria-disabled", "true");
        btn.setAttribute("aria-pressed", "false");
      }
      return;
    }
    if (!seedWords.length) {
      node.textContent = "Bu hesapta kayıtlı tohum yok.";
      if (btn) {
        btn.hidden = true;
        btn.disabled = true;
        btn.textContent = "Görüntüle";
        btn.setAttribute("aria-disabled", "true");
        btn.setAttribute("aria-pressed", "false");
      }
      return;
    }
    node.textContent = seedOpen ? seedWords.join(" ") : maskSeed(seedWords);
    if (btn) {
      btn.hidden = false;
      btn.disabled = false;
      btn.removeAttribute("aria-disabled");
      btn.textContent = seedOpen ? "Gizle" : "Görüntüle";
      btn.setAttribute("aria-pressed", seedOpen ? "true" : "false");
    }
  }
  function toggleSeed() {
    if (!seedReady || !seedWords.length) return;
    seedOpen = !seedOpen;
    paintSeed();
  }
  function loadSeed() {
    if (seedReady) {
      paintSeed();
      return;
    }
    paintSeed();
    if (!(window.__clay && window.__clay.call) || seedAsked) return;
    seedAsked = true;
    var done = function (res) {
      seedWords = res && res.code === "ok" && res.message ? String(res.message).trim().split(/\s+/).filter(Boolean) : [];
      seedOpen = false;
      seedReady = true;
      paintSeed();
    };
    window.__clay.call("seed-bak", {}).then(done, function () { done(null); });
  }
  function mountHesap() {
    if (!/^\/panel\/hesap\/?$/.test(path())) return;
    if (document.querySelector(".clay-hesap-ayar")) {
      loadSeed();
      return;
    }
    var host = document.querySelector(".grid.gap-5");
    if (!host) return;
    var box = document.createElement("section");
    box.id = "ayarlar";
    box.className = "account-sheet clay-hesap-ayar";
    box.innerHTML = '<h2 class="account-sheet-title font-display text-2xl font-bold">Ayarlar</h2><h2 class="account-sheet-title font-display text-2xl font-bold">Şifre değiştir</h2><form data-clay-pass><label>Mevcut parola<input class="field" type="password" name="eski" autocomplete="current-password" required></label><label>Yeni parola<input class="field" type="password" name="yeni" autocomplete="new-password" required></label><label>Yeni parola tekrar<input class="field" type="password" name="yeni2" autocomplete="new-password" required></label><button class="btn btn-gold" type="submit">Kaydet</button><p class="clay-hesap-msg" role="status"></p></form><h2 class="account-sheet-title font-display text-2xl font-bold">Seed görüntüle</h2><p class="clay-seed-view">Tohum yükleniyor.</p><button type="button" class="btn btn-ghost" data-clay-seed-show disabled hidden aria-pressed="false">Görüntüle</button><h2 class="account-sheet-title font-display text-2xl font-bold">Telegram ID ekle</h2><form data-clay-tg><label>Telegram<input class="field" name="telegram" autocomplete="off" placeholder="@kullanici veya rakam"></label><button class="btn btn-gold" type="submit">Kaydet</button><p class="clay-tg-now"></p><p class="clay-hesap-msg" role="status"></p></form>';
    host.insertBefore(box, host.firstChild);
    if (location.hash === "#ayarlar") box.scrollIntoView({ block: "start" });
    var me = viewer();
    var current = box.querySelector(".clay-tg-now");
    if (current && me && me.telegramId) current.textContent = "Kayıtlı: " + me.telegramId;
    paintSeed();
    loadSeed();
  }
  function refineMarks() {
    document.querySelectorAll("svg.h-8, svg.h-9").forEach(function (svg) {
      if (svg.dataset.clayCard === "1" || svg.getAttribute("viewBox") !== "0 0 32 32") return;
      if (svg.innerHTML.indexOf("#f0c98a") === -1) return;
      svg.dataset.clayCard = "1";
      svg.setAttribute("viewBox", "0 0 68 44");
      svg.setAttribute("class", (svg.getAttribute("class") || "") + " clay-brand-card");
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = '<rect width="68" height="44" rx="7" fill="#e2b15a"/><rect x="7" y="9" width="14" height="10" rx="2" fill="#fff6e4"/><text x="7" y="34" fill="#3a2410" font-size="12" font-family="Clay Display, Times New Roman, serif" letter-spacing="1.4">CLAY</text>';
    });
  }
  var livePanelHtml = '<div class="clay-live-panel" hidden><header class="clay-live-head"><span class="clay-live-card" aria-hidden="true"><span class="clay-live-card-chip"></span><span class="clay-live-card-mark">CLAY</span></span><span class="clay-live-id"><span class="clay-live-brand">Clay Virtual Card</span><span class="clay-live-role">Müşteri temsilcisi</span><strong class="clay-live-name">Canlı destek</strong><span class="clay-live-sub"><i class="clay-live-dot is-on"></i><span class="clay-live-subtext">Çevrimiçi</span></span></span><button type="button" data-act="live-close" aria-label="Kapat"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/></svg></button></header><div class="clay-live-log" role="log" aria-live="polite"></div><div class="clay-live-foot"><div class="clay-live-autos"></div><form class="clay-live-form"><label class="clay-live-photo"><input type="file" accept="image/*" hidden><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 6.5A2.5 2.5 0 0 1 6.5 4h2.2l1.2-1.6A2 2 0 0 1 11.4 1.5h1.2a2 2 0 0 1 1.5.9L15.3 4H17.5A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11zM12 16.2a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4z"/></svg></label><input name="metin" maxlength="400" placeholder="Mesaj yazın" autocomplete="off" enterkeyhint="send"><button class="clay-live-send" type="submit" aria-label="Gönder"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3.2 11.2 20 4.2c.7-.3 1.4.4 1.1 1.1l-7 16.8c-.3.8-1.5.7-1.7-.1l-1.8-6.6-6.6-1.8c-.8-.2-.9-1.4-.1-1.7z"/></svg></button></form></div></div>';
  var liveButtonHtml = '<button type="button" class="clay-live-btn" data-act="live-open" aria-label="Canlı destek"><i class="clay-live-beacon" aria-hidden="true"></i><svg class="clay-live-icon-chat" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9.2L5 19.4c-.6.5-1.5.1-1.5-.7V5.5z"/></svg><svg class="clay-live-icon-x" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/></svg></button>';
  function visitorShell() {
    if (!document.body) return null;
    var root = document.querySelector(".clay-live");
    if (!root) {
      root = document.createElement("section");
      root.className = "clay-live";
      root.innerHTML = livePanelHtml + liveButtonHtml;
      document.body.appendChild(root);
      return root;
    }
    if (!root.querySelector(".clay-live-panel")) root.insertAdjacentHTML("afterbegin", livePanelHtml);
    if (!root.querySelector(".clay-live-btn")) root.insertAdjacentHTML("beforeend", liveButtonHtml);
    if (!root.querySelector(".clay-live-autos")) {
      var form = root.querySelector(".clay-live-form");
      if (form && form.parentNode) {
        var foot = document.createElement("div");
        foot.className = "clay-live-foot";
        var chips = document.createElement("div");
        chips.className = "clay-live-autos";
        form.parentNode.insertBefore(foot, form);
        foot.appendChild(chips);
        foot.appendChild(form);
      }
    }
    return root;
  }
  function paintVisitor(thread) {
    if (admin()) {
      document.querySelectorAll(".clay-live").forEach(function (node) { node.hidden = true; });
      return;
    }
    var root = visitorShell();
    if (!root) return;
    var closed = liveEnabled === false;
    root.classList.toggle("is-live", !closed);
    root.classList.toggle("is-closed", closed);
    if (closed) {
      root.dataset.open = "";
      root.classList.remove("is-open");
      var shut = root.querySelector(".clay-live-panel");
      if (shut) shut.hidden = true;
      return;
    }
    var panel = root.querySelector(".clay-live-panel");
    if (!panel) return;
    var open = root.dataset.open === "1";
    root.classList.toggle("is-open", open);
    panel.hidden = !open;
    paintAutoChips(root);
    if (!thread && liveThread) return;
    var nameNode = root.querySelector(".clay-live-name");
    if (nameNode) nameNode.textContent = thread && thread.agent ? thread.agent : "Canlı destek";
    var log = root.querySelector(".clay-live-log");
    var messages = thread && thread.messages ? thread.messages : [];
    var state = thread && thread.status ? thread.status : "acik";
    if (thread) liveStatus = state;
    var sub = root.querySelector(".clay-live-subtext");
    var dot = root.querySelector(".clay-live-dot");
    var subLabel = "Çevrimiçi";
    var tone = "is-on";
    if (state === "beklemede") { subLabel = "Beklemede"; tone = "is-hold"; }
    if (state === "bitti") { subLabel = "Görüşme sonlandı"; tone = "is-off"; }
    if (sub) sub.textContent = subLabel;
    if (dot) dot.className = "clay-live-dot " + tone;
    var field = root.querySelector(".clay-live-form input[name=metin]");
    var sendBtn = root.querySelector(".clay-live-send");
    var photo = root.querySelector(".clay-live-photo input");
    var ended = state === "bitti";
    if (field) {
      field.disabled = ended;
      field.placeholder = ended ? "Görüşme sonlandı" : "Mesaj yazın";
    }
    if (sendBtn) sendBtn.disabled = ended;
    if (photo) photo.disabled = ended;
    var sig = (thread && thread.agent ? thread.agent : "") + "|" + (thread && (thread.customer || thread.username) ? (thread.customer || thread.username) : "") + "|" + state + "|" + messages.map(function (row) { return row.at + row.from + row.text + (row.image || ""); }).join("~");
    hearWelcome(messages);
    if (log.dataset.sig === sig) return;
    log.dataset.sig = sig;
    var html = "";
    if (!messages.length && state !== "bitti") {
      html = '<p class="clay-live-admin clay-live-hello"><span>Clay Virtual Card</span>Merhaba. Mesajınızı veya fotoğrafınızı gönderin, yanıt burada görünür.</p>';
    }
    html += messages.map(function (row) {
      var mine = row.from === "visitor";
      var who = mine ? ((thread && (thread.customer || thread.username)) || "Siz") : (row.from === "auto" ? "Otomasyon" : "Destek");
      var photo = row.image ? '<img src="/api/clay-live-file.php?id=' + esc(row.image) + '" alt="Fotoğraf">' : "";
      return '<p class="clay-live-' + (mine ? "mine" : "admin") + '"><span>' + esc(who) + "</span>" + photo + (row.text ? esc(row.text) : "") + "</p>";
    }).join("");
    if (state === "beklemede") html += '<p class="clay-live-admin"><span>Destek</span>Görüşme beklemede.</p>';
    if (state === "bitti") html += '<p class="clay-live-admin"><span>Destek</span>Görüşme sonlandı.</p>';
    log.innerHTML = html;
    log.scrollTop = log.scrollHeight;
  }
  var liveOpenWait = null;
  function whenThread() {
    if (liveThread) return Promise.resolve(liveThread);
    if (liveOpenWait) return liveOpenWait;
    liveOpening = true;
    liveOpenWait = postLive({ op: "open" }).then(function (res) {
      liveOpening = false;
      liveOpenWait = null;
      if (res && res.enabled === false) {
        liveEnabled = false;
        paintVisitor(null);
        return "";
      }
      if (!res || !res.ok || !res.thread) return "";
      liveThread = res.thread.id;
      paintVisitor(res.thread);
      return liveThread;
    });
    return liveOpenWait;
  }
  function ensureThread() {
    if (liveEnabled === false || liveThread || liveOpening) return;
    whenThread();
  }
  function dropThread() {
    liveThread = "";
    liveStatus = "acik";
    var root = document.querySelector(".clay-live");
    if (root) {
      var log = root.querySelector(".clay-live-log");
      if (log) log.dataset.sig = "";
    }
    paintVisitor(null);
    if (root && root.dataset.open === "1") ensureThread();
  }
  function refreshVisitor() {
    postLive({ op: "status" }).then(function (res) {
      if (res && Array.isArray(res.autos)) liveAutos = res.autos;
      var on = !res || res.enabled !== false;
      if (on !== liveEnabled) {
        liveEnabled = on;
        if (!on) {
          var root = document.querySelector(".clay-live");
          if (root) root.remove();
          return;
        }
      } else {
        liveEnabled = on;
      }
      if (!on) return;
      if (!liveThread) {
        paintVisitor(null);
        return;
      }
      postLive({ op: "read", thread: liveThread }).then(function (read) {
        if (read && read.thread) paintVisitor(read.thread);
        else if (read && read.error === "yok") dropThread();
      });
    });
  }
  function sendVisitor(form) {
    var text = String(form.metin.value || "").trim();
    if (!text || !liveThread || liveStatus === "bitti") return;
    postLive({ op: "send", text: text, thread: liveThread }).then(function (res) {
      if (res && res.thread && res.error === "bitti") {
        paintVisitor(res.thread);
        return;
      }
      if (!res || !res.ok || !res.thread) return;
      liveThread = res.thread.id;
      form.metin.value = "";
      paintVisitor(res.thread);
    });
  }
  function shrinkImage(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type || "")) {
        reject();
        return;
      }
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 960;
        var scale = Math.min(1, max / Math.max(img.width || 1, img.height || 1));
        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round((img.width || 1) * scale));
        canvas.height = Math.max(1, Math.round((img.height || 1) * scale));
        var ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject();
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        var quality = 0.82;
        var data = "";
        for (var i = 0; i < 5; i++) {
          data = canvas.toDataURL("image/jpeg", quality);
          if (Math.floor((data.length - 24) * 0.75) <= 1100000) break;
          quality -= 0.12;
        }
        if (!data || data.indexOf("data:image/jpeg;base64,") !== 0) reject();
        else resolve(data);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject();
      };
      img.src = url;
    });
  }
  function uploadVisitor(file, text) {
    if (liveEnabled === false || liveStatus === "bitti") return;
    whenThread().then(function (id) {
      if (!id || liveStatus === "bitti") return null;
      return shrinkImage(file).then(function (dataUrl) {
        return postLive({ op: "upload", thread: id, image: dataUrl, text: text || "" });
      });
    }).then(function (res) {
      if (!res || !res.thread) return;
      liveThread = res.thread.id;
      if (res.ok) {
        var form = document.querySelector(".clay-live-form");
        if (form && form.metin && text) form.metin.value = "";
      }
      paintVisitor(res.thread);
    }).catch(function () {});
  }

  function paintAutoChips(root) {
    var host = root && root.querySelector(".clay-live-autos");
    if (!host) return;
    if (liveStatus === "bitti") {
      if (host.dataset.sig !== "off") {
        host.dataset.sig = "off";
        host.innerHTML = "";
      }
      return;
    }
    var liveLang = "tr";
    try { liveLang = localStorage.getItem("clay-lang") || document.documentElement.lang || "tr"; } catch (e) {}
    var faqEn = { kart: "How do I get a card", bakiye: "When is my balance credited?", plan: "How does the plan change", red: "Why was my card declined?", iade: "What happens to my money if the card is not issued?" };
    var sig = liveLang + "|" + liveAutos.map(function (row) { return row.id + "\n" + row.q; }).join("|");
    if (host.dataset.sig === sig) return;
    host.dataset.sig = sig;
    host.innerHTML = liveAutos.map(function (row) {
      var q = liveLang === "en" && faqEn[row.id] ? faqEn[row.id] : row.q;
      return '<button type="button" data-act="auto-tap" data-id="' + esc(row.id) + '">' + esc(q) + "</button>";
    }).join("");
    var closeBtn = root.querySelector("[data-act=live-close]");
    if (closeBtn) closeBtn.setAttribute("aria-label", liveLang === "en" ? "Close" : "Kapat");
    var sendBtn = root.querySelector(".clay-live-form button");
    if (sendBtn) sendBtn.textContent = liveLang === "en" ? "Send" : "Gönder";
  }
  function takeDesk(res) {
    if (!res || !res.ok) return;
    liveEnabled = res.enabled !== false;
    if (Array.isArray(res.autos)) liveAutos = res.autos;
    var box = document.querySelector(".clay-desk-live");
    if (box) box.dataset.sig = "";
    paintDesk(res.threads || []);
  }
  function liveTone(status) {
    if (status === "beklemede") return "is-hold";
    if (status === "bitti") return "is-off";
    return "is-on";
  }
  function liveLabel(status) {
    if (status === "beklemede") return "Beklemede";
    if (status === "bitti") return "Sonlandı";
    return "Çevrimiçi";
  }
  function cardMark() {
    return '<span class="clay-live-card" aria-hidden="true"><span class="clay-live-card-chip"></span><span class="clay-live-card-mark">CLAY</span></span>';
  }
  function runThread(mod) {
    if (!deskThread) return;
    postLive({ op: "thread", thread: deskThread, mod: mod }).then(function (res) {
      if (!res || !res.ok) return;
      takeDesk(res);
    });
  }
  function masaPath() {
    return /^\/clayadm!nxx\/?$/.test(path());
  }
  function liveDeskPath() {
    return /\/clayadm!nxx\/canli\/?$/.test(path());
  }
  function deskShell() {
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return null;
    if (!(host.querySelector(":scope > header") || host.querySelector(":scope > .clay-lux-stage > header") || host.querySelector("header.glass") || host.querySelector("header"))) return null;
    return host;
  }
  function placeDesk(box) {
    if (!box) return;
    box.id = "canli-destek";
    var host = deskShell();
    if (liveDeskPath() && host) {
      var header = host.querySelector(":scope > header") || host.querySelector("header.glass") || host.querySelector("header");
      var main = host.querySelector(":scope > .mt-6") || host.querySelector("main") || host.querySelector(":scope > .grid");
      if (main) {
        if (box.nextElementSibling !== main && box.parentNode === host) host.insertBefore(box, main.nextSibling);
        else if (box.parentNode !== host) host.appendChild(box);
        return;
      }
      if (header && (box.parentNode !== host || box.previousElementSibling !== header)) host.insertBefore(box, header.nextSibling);
      return;
    }
    if (!box.parentNode) document.body.appendChild(box);
  }
  function pinCanliNav() {
    document.querySelectorAll("[data-clay-canli]").forEach(function (node) { node.remove(); });
  }
  function pinAyarlar() {
    document.querySelectorAll("[data-clay-ayarlar]").forEach(function (node) { node.remove(); });
  }
  function fillAutoForm(host, loadRow) {
    host = host && host.querySelector ? host : document;
    var form = host.querySelector(".clay-desk-auto-form");
    if (!form) return;
    form.dataset.edit = deskAutoEdit || "";
    var btn = form.querySelector("button[type=submit]");
    if (btn) btn.textContent = deskAutoEdit ? "Kaydet" : "Ekle";
    host.querySelectorAll(".clay-desk-auto li").forEach(function (li) {
      var idBtn = li.querySelector("[data-act=auto-edit]");
      var id = idBtn ? idBtn.getAttribute("data-id") : "";
      li.classList.toggle("is-edit", !!(deskAutoEdit && id === deskAutoEdit));
    });
    if (!loadRow) return;
    if (!deskAutoEdit) {
      form.soru.value = "";
      form.yanit.value = "";
      return;
    }
    var row = null;
    liveAutos.forEach(function (item) { if (item && item.id === deskAutoEdit) row = item; });
    if (!row) return;
    form.soru.value = row.q || "";
    form.yanit.value = row.a || "";
  }
  function arrangeAdminNav() {
    if (!admin()) return;
    document.querySelectorAll("header nav").forEach(function (nav) {
      var sig = Array.prototype.map.call(nav.querySelectorAll("a"), function (a) {
        return (a.getAttribute("href") || "") + "|" + (a.textContent || "").replace(/\s+/g, " ").trim();
      }).join("~");
      if (nav.dataset.clayNav === sig && nav.querySelector(".clay-admin-kicker") && nav.querySelector("[data-clay-drawer]") ) return;
      nav.querySelectorAll("a").forEach(function (a) {
        var label = (a.textContent || "").replace(/\s+/g, " ").trim();
        if (a.getAttribute("data-clay-canli") || label === "Canlı destek") a.remove();
        if (a.getAttribute("data-clay-ayarlar") && label === "Ayarlar") a.remove();
      });
      nav.querySelectorAll("p, span, strong").forEach(function (el) {
        if (el.closest("a")) return;
        var t = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (t === "AYAR" || t === "SETUP" || t === "НАСТРОЙКИ" || t === "Ayarlar") {
          el.textContent = "Ayarlar";
          el.classList.add("clay-admin-kicker");
        }
      });
      var rows = nav.querySelectorAll(".flex.flex-wrap");
      if (rows[0] && !rows[0].querySelector(".clay-admin-kicker")) {
        var k = document.createElement("p");
        k.className = "clay-admin-kicker";
        k.textContent = "Panel";
        rows[0].insertBefore(k, rows[0].firstChild);
      }
      if (rows[1]) {
        nav.querySelectorAll("a").forEach(function (a) {
          var label = (a.textContent || "").replace(/\s+/g, " ").trim();
          var href = a.getAttribute("href") || "";
          if ((label === "Kupon" || /sekme=kupon/.test(href)) && a.parentNode !== rows[1]) rows[1].appendChild(a);
        });
      }
      if (!nav.querySelector("[data-clay-drawer]")) {
        var drawer = document.createElement("button");
        drawer.type = "button";
        drawer.className = "btn btn-ghost clay-admin-drawer";
        drawer.setAttribute("data-clay-drawer", "1");
        drawer.textContent = "Menü";
        nav.insertBefore(drawer, nav.firstChild);
      }
      nav.classList.add("clay-admin-nav");
      var seenNav = {};
      nav.querySelectorAll("a").forEach(function (a) {
        var href = a.getAttribute("href") || "";
        var label = (a.textContent || "").replace(/\s+/g, " ").trim();
        var key = href + "|" + label;
        if (seenNav[key]) a.remove();
        else seenNav[key] = true;
      });
      nav.dataset.clayNav = Array.prototype.map.call(nav.querySelectorAll("a"), function (a) {
        return (a.getAttribute("href") || "") + "|" + (a.textContent || "").replace(/\s+/g, " ").trim();
      }).join("~");
    });
  }
  function paintDesk(threads) {
    if (!admin() || !liveDeskPath()) {
      document.querySelectorAll(".clay-desk-live").forEach(function (gone) { gone.remove(); });
      return;
    }
    var box = document.querySelector(".clay-desk-live");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-desk-live glass";
      box.id = "canli-destek";
      placeDesk(box);
    }
    box.id = "canli-destek";
    threads = Array.isArray(threads) ? threads.slice() : [];
    deskThreads = threads.slice();
    threads.sort(function (a, b) {
      var am = a.messages && a.messages.length ? a.messages[a.messages.length - 1].at : a.at;
      var bm = b.messages && b.messages.length ? b.messages[b.messages.length - 1].at : b.at;
      return bm - am;
    });
    if (!deskPicked) deskThread = threads[0] ? threads[0].id : "";
    if (deskThread && !threads.some(function (row) { return row.id === deskThread; })) deskThread = threads[0] ? threads[0].id : "";
    var active = null;
    threads.forEach(function (row) { if (row.id === deskThread) active = row; });
    var sig = (liveEnabled === false ? "0" : "1") + "|" + threads.map(function (row) {
      var bits = (row.messages || []).map(function (item) {
        return String(item.at || "") + (item.from || "") + (item.image || "") + String(item.text || "").length;
      }).join(",");
      return row.id + ":" + (row.customer || row.username || "") + ":" + (row.agent || "") + ":" + (row.userId || "") + ":" + telegramFor(row.customer || row.username, row.userId) + ":" + (row.status || "acik") + ":" + bits;
    }).join("|") + ">" + deskThread + "#" + liveAutos.map(function (row) { return row.id + row.q + row.a; }).join("~");
    if (box.dataset.sig === sig) {
      mountUyeList();
      mountUyeDetail();
      return;
    }
    box.dataset.sig = sig;
    var list = threads.map(function (row) {
      var status = row.status || "acik";
      var customer = row.customer || row.username || "";
      var agent = row.agent || "";
      var tg = telegramFor(customer, row.userId);
      return '<button type="button" class="clay-desk-person' + (row.id === deskThread ? " is-on" : "") + '" data-thread="' + esc(row.id) + '">' + cardMark() + '<span class="clay-desk-person-copy"><span class="clay-desk-person-brand">Müşteri</span><strong>' + esc(customer) + '</strong><span class="clay-desk-person-role"><i class="clay-live-dot ' + liveTone(status) + '"></i> Temsilci ' + esc(agent) + " · " + esc(liveLabel(status)) + "</span>" + (tg ? '<span class="clay-tg">Telegram ' + esc(tg) + "</span>" : "") + "</span></button>";
    }).join("") || '<p class="clay-desk-live-empty">Henüz konuşma yok.</p>';
    var status = active ? (active.status || "acik") : "";
    var log = active ? (active.messages || []).map(function (row) {
      var customer = active.customer || active.username || "";
      var who = row.from === "auto" ? "Otomasyon" : (row.from === "visitor" ? customer : "Destek");
      var role = row.from === "auto" ? "<small>Otomatik yanıt</small>" : (row.from === "visitor" ? "<small>Müşteri</small>" : "");
      var photo = row.image ? '<img src="/api/clay-live-file.php?id=' + esc(row.image) + '" alt="Fotoğraf">' : "";
      var text = row.text ? '<span class="clay-desk-live-text">' + esc(row.text) + "</span>" : "";
      return '<p class="' + (row.from === "visitor" ? "is-visitor" : (row.from === "auto" ? "is-auto" : "is-admin")) + '"><strong>' + esc(who) + "</strong>" + role + text + photo + "</p>";
    }).join("") || "<p>Henüz mesaj yok.</p>" : "<p>Bir konuşma seç.</p>";
    var tools = active
      ? '<p class="clay-desk-live-meta"><i class="clay-live-dot ' + liveTone(status) + '"></i> ' + esc(active.customer || active.username || "") + " · " + esc(liveLabel(status)) + (active.agent ? " · Temsilci " + esc(active.agent) : "") + '</p><div class="clay-desk-live-tools"><button type="button" class="btn btn-ghost" data-act="live-hold"' + (status === "acik" ? "" : " disabled") + '>Beklemeye al</button><button type="button" class="btn btn-ghost" data-act="live-resume"' + (status === "beklemede" ? "" : " disabled") + '>Beklemeden çıkar</button><button type="button" class="btn btn-ghost" data-act="live-end"' + (status === "bitti" ? " disabled" : "") + '>Görüşmeyi sonlandır</button><button type="button" class="btn btn-ghost" data-act="live-reopen"' + (status === "bitti" ? "" : " disabled") + '>Yeniden aç</button><button type="button" class="btn btn-ghost" data-act="live-delete">Sil</button></div>'
      : "";
    var deskLang = "tr";
    try { deskLang = localStorage.getItem("clay-lang") || document.documentElement.lang || "tr"; } catch (e) {}
    var editLab = deskLang === "en" ? "Edit" : "Düzenle";
    var delLab = deskLang === "en" ? "Remove" : "Kaldır";
    var offLab = deskLang === "en" ? "Turn off" : "Kapat";
    var onLab = deskLang === "en" ? "Turn on" : "Aç";
    var autos = '<section class="clay-desk-auto"><h3>Otomasyon mesajları</h3><ul>' + (liveAutos.map(function (row) {
      return "<li" + (row.id === deskAutoEdit ? " class=\"is-edit\"" : "") + "><p><strong>" + esc(row.q) + "</strong></p><p>" + esc(row.a) + '</p><span class="clay-desk-auto-acts"><button type="button" class="btn btn-ghost" data-act="auto-edit" data-id="' + esc(row.id) + '">' + editLab + '</button><button type="button" class="btn btn-ghost" data-act="auto-del" data-id="' + esc(row.id) + '">' + delLab + "</button></span></li>";
    }).join("") || "<li>Kayıtlı soru yok.</li>") + '</ul><form class="clay-desk-auto-form"><input name="soru" maxlength="400" placeholder="Soru" autocomplete="off"><input name="yanit" maxlength="400" placeholder="Yanıt" autocomplete="off"><button class="btn btn-gold" type="submit">' + (deskAutoEdit ? "Kaydet" : "Ekle") + "</button></form></section>";
    var draft = "";
    var soruDraft = "";
    var yanitDraft = "";
    var input = box.querySelector("input[name=metin]");
    var soruInput = box.querySelector("input[name=soru]");
    var yanitInput = box.querySelector("input[name=yanit]");
    if (input && document.activeElement === input) draft = input.value;
    if (soruInput && document.activeElement === soruInput) soruDraft = soruInput.value;
    if (yanitInput && document.activeElement === yanitInput) yanitDraft = yanitInput.value;
    var open = liveEnabled !== false;
    var canReply = !!(active && open && status !== "bitti");
    box.setAttribute("data-clay-skip", "1");
    box.innerHTML = '<div class="clay-desk-live-head"><h2><i class="clay-live-lamp ' + (open ? "is-on" : "is-off") + '"></i>Canlı destek</h2><button type="button" class="btn btn-ghost" data-act="live-switch" data-on="' + (open ? "1" : "0") + '">' + (open ? offLab : onLab) + "</button></div><p class=\"clay-desk-live-state " + (open ? "is-on" : "is-off") + "\">" + (open ? "Ziyaretçiye açık" : "Ziyaretçiye kapalı") + "</p>" + autos + '<div class="clay-desk-live-list">' + list + "</div>" + tools + '<div class="clay-desk-live-log">' + log + '</div><form class="clay-desk-live-form"><input name="metin" maxlength="400" placeholder="' + (status === "bitti" ? "Görüşme sonlandı" : "Yanıt yaz") + '" autocomplete="off"' + (canReply ? "" : " disabled") + '><button class="btn btn-gold" type="submit"' + (canReply ? "" : " disabled") + ">Gönder</button></form>";
    var next = box.querySelector("input[name=metin]");
    var nextSoru = box.querySelector("input[name=soru]");
    var nextYanit = box.querySelector("input[name=yanit]");
    if (next && draft) next.value = draft;
    if (nextSoru && soruDraft) nextSoru.value = soruDraft;
    if (nextYanit && yanitDraft) nextYanit.value = yanitDraft;
    fillAutoForm(box, !soruDraft && !yanitDraft);
    mountUyeList();
    mountUyeDetail();
  }
  function refreshDesk() {
    if (!admin()) return;
    postLive({ op: "list" }).then(function (res) {
      if (res && res.ok) {
        takeDesk(res);
        hearDesk(res.threads || []);
      }
      else if (res && res.error === "giris") paintDesk([]);
    });
  }
  function sendDesk(form) {
    var text = String(form.metin.value || "").trim();
    if (!text || !deskThread) return;
    postLive({ op: "reply", thread: deskThread, text: text }).then(function () {
      form.metin.value = "";
      refreshDesk();
    });
  }

  var planCancelled = false;
  function quotaOf(plan, paid) {
    if (!paid) return 1;
    return { kivilcim: 2, atolye: 8, galeri: 25 }[plan] || 1;
  }
  function applyUserPlan(patch) {
    function write(u) {
      if (!u || !patch) return;
      Object.keys(patch).forEach(function (k) {
        if (patch[k] !== undefined) u[k] = patch[k];
      });
    }
    write(viewer());
    try {
      var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
      var me = viewer();
      if (db && Array.isArray(db.users) && me) {
        db.users.forEach(function (u) { if (u && u.id === me.id) write(u); });
      }
    } catch (e) {}
  }
  function showFundsBanner() {
    showAlert("e-bakiye", tx("Bakiye yetersiz. İşlem uygulanmadı.", "Insufficient balance. The action was not applied."));
  }
  function syncPlanFromRes(res) {
    var me = res && res.me;
    if (!me && res && res.db && Array.isArray(res.db.users)) {
      var cur = viewer();
      for (var i = 0; i < res.db.users.length; i++) {
        if (cur && res.db.users[i] && res.db.users[i].id === cur.id) me = res.db.users[i];
      }
    }
    if (me) {
      applyUserPlan({
        plan: me.plan || "",
        planPaid: !!me.planPaid,
        planStatus: me.planStatus || "",
        planUntil: me.planUntil || "",
        cardQuota: me.cardQuota,
        balance: me.balance
      });
    }
    if (window.__clayLuxury) window.__clayLuxury();
    paintPlan();
    pulseNow();
  }
  function buyPlan(planId) {
    if (!(window.__clay && window.__clay.call)) return;
    passOnce("plan");
    window.__clay.call("plan", { plan: planId }).then(function (res) {
      var code = res && res.code ? String(res.code) : "";
      if (code === "e-bakiye") {
        showFundsBanner();
        return;
      }
      if (code.indexOf("e-") === 0) {
        showAlert(code, (res && res.message) || tx("Plan alınamadı.", "The plan was not purchased."));
        return;
      }
      planCancelled = false;
      applyUserPlan({
        plan: planId,
        planPaid: true,
        planStatus: "aktif",
        cardQuota: quotaOf(planId, true)
      });
      var funds = document.querySelector(".clay-funds");
      if (funds) funds.hidden = true;
      syncPlanFromRes(res);
    });
  }
  function paintPlan() {
    if (admin()) return;
    var stages = document.querySelectorAll(".plan-stage");
    if (!stages.length) return;
    var user = viewer();
    var live = paidPlan(user);
    var sig = live ? user.id + ":" + user.plan + ":" + (user.planStatus || "aktif") : "off";
    stages.forEach(function (stage) {
      var gate = stage.previousElementSibling && stage.previousElementSibling.classList.contains("clay-plan-gate") ? stage.previousElementSibling : null;
      if (!live) {
        if (planCancelled) {
          if (!gate) {
            gate = document.createElement("section");
            gate.className = "clay-plan-gate";
            try { stage.parentNode.insertBefore(gate, stage); } catch (err) { return; }
          }
          if (gate.dataset.sig !== "iptal") {
            gate.dataset.sig = "iptal";
            gate.innerHTML = "<p>Plan iptal edildi. Bu hesap yeni panelde duruyor.</p>";
          }
          return;
        }
        if (gate) gate.remove();
        stage.querySelectorAll(".plan-offer-cta button").forEach(function (btn) {
          if ((btn.textContent || "").trim() === "Bu paket sende") btn.textContent = "Bu plana geç";
        });
        return;
      }
      if (!gate) {
        gate = document.createElement("section");
        gate.className = "clay-plan-gate";
        try { stage.parentNode.insertBefore(gate, stage); } catch (err) { return; }
      }
      if (gate.dataset.sig === sig) return;
      gate.dataset.sig = sig;
      var name = planLabel(user.plan);
      gate.innerHTML = "<p>Mevcut plan: <strong>" + esc(name) + "</strong>. Yeni plan, bu plan iptal edilmeden açılmaz.</p><button type=\"button\" class=\"btn btn-ghost\" data-act=\"plan-cancel\">Planı iptal et</button>";
    });
  }
  function cancelPlan() {
    if (!(window.__clay && window.__clay.call)) return Promise.resolve(null);
    passOnce("plan-iptal");
    return window.__clay.call("plan-iptal", { onay: "on" }).then(function (res) {
      if (res && res.code === "plan-iptal") {
        planCancelled = true;
        applyUserPlan({ plan: "", planPaid: false, planUntil: "", planStatus: "iptal", cardQuota: 1 });
        try { window.location.assign("/panel/yukselt/"); } catch (e) { window.location.href = "/panel/yukselt/"; }
        return res;
      }
      document.querySelectorAll(".clay-plan-gate").forEach(function (gate) { gate.dataset.sig = ""; });
      syncPlanFromRes(res);
      return res;
    }).catch(function () {
      return { code: "e-defter" };
    });
  }

  function amountText(raw) {
    var value = String(raw || "").trim();
    if (!value) return "—";
    return value.replace(".", ",") + " USD";
  }
  function liveIssueForm() {
    var field = document.querySelector('.mx-auto.min-h-screen form input[name="tutar"], .mt-6 form input[name="tutar"], form input[name="tutar"]');
    var form = field && field.closest("form");
    if (!form) return null;
    if (form.closest(".boot-screen") || form.closest("#clay-confirm")) return null;
    return form;
  }
  function paintIssue() {
    if (!/\/panel\/kartlar\/yeni\/?$/.test(path())) return;
    var form = liveIssueForm();
    var field = form && form.querySelector('input[name="tutar"]');
    var gate = document.querySelector(".mx-auto.min-h-screen .clay-confirm, .mt-6 .clay-confirm");
    if (!gate || gate.closest(".boot-screen")) gate = null;
    if (!form) return;
    if (gate && form.parentNode) form.parentNode.insertBefore(gate, form.nextSibling);
    var names = { facebook_ads: "Facebook Ads", tiktok: "TikTok Ads", google_ads: "Google Ads", ultima: "Ultima", burner: "Tek Kullanımlık Kart" };
    var picked = document.querySelector('input[name="tur"]:checked');
    var label = picked && picked.closest("label");
    var name = picked ? (names[picked.value] || "") : "";
    var kind = "";
    if (label) {
      var nameNode = label.querySelector(".entrance-type");
      if (nameNode) {
        var first = nameNode.childNodes[0];
        var read = String((first && first.nodeType === 3 ? first.textContent : "") || "").replace(/\s+/g, " ").trim();
        if (read) name = read;
      }
      var kindNode = label.querySelector(".bin-global");
      if (kindNode) kind = String(kindNode.textContent || "").replace(/\s+/g, " ").trim();
    }
    if (name && (!kind || kind === "—")) kind = "Global kart";
    var raw = field ? String(field.value || "").trim() : "";
    var shown = raw ? raw.replace(".", ",") + " USD" : "";
    if (gate) {
      var brand = gate.querySelector(".clay-sample-brand");
      if (brand && name) brand.textContent = name;
      var lines = gate.querySelectorAll(".clay-sample-line strong");
      if (lines[0] && name) lines[0].textContent = name;
      if (lines[1] && shown) lines[1].textContent = shown;
      var global = gate.querySelector(".clay-sample .bin-global");
      if (global && kind && kind !== "—") global.textContent = kind;
      var question = gate.querySelector(".clay-confirm-q");
      if (question && name && shown) question.textContent = name + " kartına " + shown + " yüklenecek. Kart Al ile oluşturursun.";
      gate.querySelectorAll(".clay-confirm-check, [data-act=card-approve], [data-act=card-reject]").forEach(function (node) {
        var wrap = node.closest("label") || node;
        wrap.remove();
      });
    }
    form.querySelectorAll("button.btn-gold").forEach(function (btn) {
      if ((btn.textContent || "").indexOf("Kart") !== -1) btn.hidden = false;
    });
  }
  window.__clayPaintIssue = paintIssue;

  function moneyUsd(cents) {
    var n = Math.round(Number(cents) || 0);
    var sign = n < 0 ? "-" : "";
    var abs = Math.abs(n);
    var whole = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var frac = String(abs % 100);
    if (frac.length < 2) frac = "0" + frac;
    return sign + "$" + whole + "." + frac;
  }
  function anonName(name) {
    var text = String(name || "").trim().toLowerCase();
    return !text || text === "anonim";
  }
  function cardTypeName(type) {
    return {
      facebook_ads: "Facebook Ads",
      tiktok: "TikTok Ads",
      google_ads: "Google Ads",
      ultima: "Ultima",
      burner: "Tek Kullanımlık Kart"
    }[type] || "";
  }
  function cardStatusName(status) {
    return { hazirlaniyor: "Hazırlanıyor", aktif: "Aktif", donduruldu: "Donduruldu", kapali: "Kapalı" }[status] || "";
  }
  function findThread(user) {
    var found = null;
    deskThreads.forEach(function (row) {
      if (found || !row || !user) return;
      if (user.id && row.userId === user.id) found = row;
      else if (!anonName(user.username) && (row.customer === user.username || row.username === user.username)) found = row;
    });
    return found;
  }
  function memberRows() {
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var users = db && Array.isArray(db.users) ? db.users : [];
    var rows = [];
    var used = {};
    users.forEach(function (user) {
      if (!user || user.role !== "uye") return;
      var thread = findThread(user);
      if (thread) used[thread.id] = true;
      var label = !anonName(user.username) ? user.username : ((thread && (thread.customer || thread.username)) || "Clay Anonim");
      rows.push({ user: user, thread: thread, label: label, guest: false });
    });
    rows.sort(function (a, b) { return a.label.localeCompare(b.label, "tr"); });
    var guests = [];
    deskThreads.forEach(function (row) {
      if (!row || used[row.id]) return;
      if (row.userId && users.some(function (user) { return user && user.id === row.userId; })) return;
      guests.push({ user: null, thread: row, label: row.customer || row.username || "Clay Anonim", guest: true });
    });
    guests.sort(function (a, b) { return a.label.localeCompare(b.label, "tr"); });
    return rows.concat(guests);
  }
  function threadLog(thread) {
    if (!thread) return '<p class="clay-uye-empty">Bu kişinin açık konuşması yok.</p>';
    var customer = thread.customer || thread.username || "";
    var lines = (thread.messages || []).map(function (row) {
      var who = row.from === "auto" ? "Otomasyon" : (row.from === "visitor" ? customer : "Destek");
      var role = row.from === "auto" ? "<small>Otomatik yanıt</small>" : (row.from === "visitor" ? "<small>Müşteri</small>" : "");
      var photo = row.image ? '<img src="/api/clay-live-file.php?id=' + esc(row.image) + '" alt="Fotoğraf">' : "";
      var text = row.text ? '<span class="clay-desk-live-text">' + esc(row.text) + "</span>" : "";
      return '<p class="' + (row.from === "visitor" ? "is-visitor" : (row.from === "auto" ? "is-auto" : "is-admin")) + '"><strong>' + esc(who) + "</strong>" + role + text + photo + "</p>";
    }).join("");
    var status = thread.status || "acik";
    var meta = esc(customer) + " · " + esc(liveLabel(status)) + (thread.agent ? " · Temsilci " + esc(thread.agent) : "");
    return '<p class="clay-desk-live-meta"><i class="clay-live-dot ' + liveTone(status) + '"></i> ' + meta + '</p><div class="clay-desk-live-log">' + (lines || "<p>Henüz mesaj yok.</p>") + "</div>";
  }
  function chatForm(thread) {
    if (!thread) return "";
    var status = thread.status || "acik";
    var open = liveEnabled !== false && status !== "bitti";
    return '<form class="clay-uye-chat-form" data-thread="' + esc(thread.id) + '"><input name="metin" maxlength="400" placeholder="' + (status === "bitti" ? "Görüşme sonlandı" : "Yanıt yaz") + '" autocomplete="off"' + (open ? "" : " disabled") + '><button class="btn btn-gold" type="submit"' + (open ? "" : " disabled") + ">Gönder</button></form>";
  }
  function accountFacts(user) {
    var tg = user && user.telegramId ? String(user.telegramId) : "Yok";
    var bal = user ? moneyUsd(user.balance) : "Yok";
    var plan = "Yok";
    if (user) {
      plan = planLabel(user.plan);
      if (user.planStatus === "iptal") plan += " · iptal";
    }
    return '<dl class="clay-uye-facts"><div><dt>Telegram</dt><dd>' + esc(tg) + "</dd></div><div><dt>Bakiye</dt><dd>" + esc(bal) + "</dd></div><div><dt>Plan</dt><dd>" + esc(plan) + "</dd></div></dl>";
  }
  function cardList(user) {
    if (!user) return "<h3>Kartlar</h3><p class=\"clay-uye-empty\">Kart yok.</p>";
    var cards = userCards(user);
    if (!cards.length) return "<h3>Kartlar</h3><p class=\"clay-uye-empty\">Kart yok.</p>";
    return "<h3>Kartlar</h3><ul class=\"clay-uye-cards\">" + cards.map(function (card) {
      var kind = cardTypeName(card.type);
      var state = cardStatusName(card.status);
      return "<li class=\"clay-plastic\"><p class=\"clay-sample-kicker\">CLAY</p><strong>" + esc(card.label || "Kart") + "</strong><span>" + esc([state, kind].filter(Boolean).join(" · ")) + " · " + esc(moneyUsd(card.limit)) + "</span></li>";
    }).join("") + "</ul>";
  }
  function userCards(user) {
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    if (!user || !db || !Array.isArray(db.cards)) return [];
    return db.cards.filter(function (card) { return card && card.userId === user.id; });
  }
  function usdField(cents) {
    var n = Math.abs(Math.round(Number(cents) || 0));
    var frac = String(n % 100);
    if (frac.length < 2) frac = "0" + frac;
    return String(Math.floor(n / 100)) + "." + frac;
  }
  function planChoices(current) {
    return [
      ["kivilcim", "Clay Duo"],
      ["atolye", "Clay Multi"],
      ["galeri", "Clay Prime"]
    ].map(function (row) {
      return '<option value="' + row[0] + '"' + (row[0] === current ? " selected" : "") + ">" + row[1] + "</option>";
    }).join("");
  }
  function statusChoices(current) {
    return [
      ["hazirlaniyor", "Hazırlanıyor"],
      ["aktif", "Aktif"],
      ["donduruldu", "Donduruldu"],
      ["kapali", "Kapalı"]
    ].map(function (row) {
      return '<option value="' + row[0] + '"' + (row[0] === current ? " selected" : "") + ">" + row[1] + "</option>";
    }).join("");
  }
  function deskRole() {
    var me = viewer();
    var role = me && me.adminRole ? me.adminRole : "tam";
    if (role === "tam" || role === "siparis" || role === "ucret" || role === "bakiye" || role === "destek" || role === "izle") return role;
    return "tam";
  }
  function memberActs(user) {
    if (!user) return "";
    if (deskRole() === "izle" || deskRole() === "destek") return "";
    var id = esc(user.id);
    var balance = '<form class="clay-uye-act" data-clay-act="bakiye" data-user="' + id + '"><label>Yeni bakiye (USD)<input class="field" name="bakiye" inputmode="decimal" value="' + esc(usdField(user.balance)) + '" required></label><button class="btn btn-gold" type="submit">Bakiyeyi yaz</button></form>';
    var delta = '<form class="clay-uye-act" data-clay-act="fark" data-user="' + id + '"><label>Tutar (USD)<input class="field" name="tutar" inputmode="decimal" placeholder="10"></label><button class="btn btn-gold" type="submit" name="yon" value="artir">Artır</button><button class="btn btn-ghost" type="submit" name="yon" value="azalt">Azalt</button></form>';
    var plan = '<form class="clay-uye-act" data-clay-act="plan" data-user="' + id + '"><label>Plan<select class="field" name="plan">' + planChoices(user.plan) + '</select></label><button class="btn btn-gold" type="submit">Ücreti düş ve yaz</button></form>';
    return '<div class="clay-uye-acts"><h3>Bakiye</h3>' + balance + delta + "<h3>Plan</h3>" + plan + '<p class="clay-uye-act-msg" role="status"></p></div>';
  }
  function cardTools(card) {
    var id = esc(card.id);
    var status = card.status || "";
    var bits = [];
    if (deskRole() === "izle") return "";
    if (status === "aktif") bits.push('<button type="button" class="btn btn-ghost" data-act="uye-dondur" data-card="' + id + '">Kartı dondur</button>');
    if (status === "donduruldu") bits.push('<button type="button" class="btn btn-gold" data-act="uye-coz" data-card="' + id + '">Kartı aktif et</button>');
    if (status === "kapali") bits.push('<button type="button" class="btn btn-ghost" data-act="uye-sil" data-card="' + id + '">Kartı sil</button>');
    return bits.join("");
  }
  function cardActs(user) {
    var cards = userCards(user);
    if (!cards.length) return "<h3>Kartlar</h3><p class=\"clay-uye-empty\">Kart yok.</p>";
    return "<h3>Kartlar</h3><ul class=\"clay-uye-cards\">" + cards.map(function (card) {
      var kind = cardTypeName(card.type);
      var state = cardStatusName(card.status);
      var save = '<form class="clay-uye-act" data-clay-act="kart" data-user="' + esc(user.id) + '" data-card="' + esc(card.id) + '"><label>Kart adı<input class="field" name="etiket" value="' + esc(card.label || "") + '" required minlength="2" maxlength="32"></label><label>Kullanılabilir bakiye (USD)<input class="field" name="limit" inputmode="decimal" value="' + esc(usdField(card.limit)) + '" required></label><label>Durum<select class="field" name="durum">' + statusChoices(card.status || "") + '</select></label><button class="btn btn-gold" type="submit">Kartı kaydet</button></form>';
      return "<li class=\"clay-plastic\"><p class=\"clay-sample-kicker\">CLAY</p><strong>" + esc(card.label || "Kart") + "</strong><span>" + esc([state, kind].filter(Boolean).join(" · ")) + " · " + esc(moneyUsd(card.limit)) + "</span><div class=\"clay-uye-card-tools\">" + cardTools(card) + "</div>" + save + "</li>";
    }).join("") + "</ul>";
  }
  function actDone(code) {
    return {
      bakiye: "Bakiye yazıldı.",
      "plan-yaz": "Plan yazıldı.",
      "plan-ayni": "Üye zaten bu planda; ücret düşülmedi.",
      kart: "Kart kaydedildi.",
      donduruldu: "Kart donduruldu.",
      cozuldu: "Kart aktif.",
      kapatildi: "Kart kapatıldı.",
      silindi: "Kart silindi."
    }[code] || "";
  }
  function refreshMemberFile(code, message) {
    var box = document.querySelector(".mx-auto.min-h-screen > .mt-6 > .clay-uye-detail");
    if (box) box.dataset.sig = "";
    mountUyeDetail();
    var note = document.querySelector(".clay-uye-detail .clay-uye-act-msg");
    if (!note) return;
    if (actDone(code)) note.textContent = actDone(code);
    else if (code && String(code).indexOf("e-") === 0) {
      var why = String(message || "").trim();
      note.textContent = "İşlem uygulanmadı" + (why ? ": " + why.replace(/\.$/, "") : "") + ".";
    }
  }
  function memberCall(action, fields) {
    if (!(window.__clay && window.__clay.call)) return;
    window.__clay.call(action, fields).then(function (res) {
      refreshMemberFile(res && res.code ? res.code : "", res && res.message);
    }, function () {
      refreshMemberFile("e-ag", "Sunucuya ulaşılamadı");
    });
  }
  function pageSlot() {
    return document.querySelector(".mx-auto.min-h-screen > .mt-6");
  }
  function mountUyeList() {
    if (!admin() || !/\/uyeler\/?$/.test(path())) {
      var stale = document.querySelector(".clay-uye-list");
      if (stale) stale.remove();
      return;
    }
    var slot = pageSlot();
    if (!slot) return;
    var rows = memberRows();
    var focus = new URLSearchParams(location.search).get("konusma") || "";
    var guest = null;
    rows.forEach(function (row) {
      if (guest || !row.guest || !row.thread) return;
      if (row.thread.id === focus) guest = row;
    });
    var sig = rows.map(function (row) {
      var bits = row.thread && row.thread.messages ? row.thread.messages.map(function (item) { return String(item.at || "") + (item.text || ""); }).join(",") : "";
      var mark = row.user ? row.user.id + ":" + (row.user.status || "") + ":" + (row.user.balance || 0) + ":" + (row.user.plan || "") + ":" + (row.user.telegramId || "") : "guest";
      return row.label + "|" + mark + "|" + (row.thread ? row.thread.id : "") + "|" + bits;
    }).join("~") + ">" + focus;
    var box = slot.querySelector(":scope > .clay-uye-list");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-uye-list";
      slot.insertBefore(box, slot.firstChild);
    }
    if (box.dataset.sig === sig) return;
    var draft = "";
    var input = box.querySelector("input[name=metin]");
    if (input && document.activeElement === input) draft = input.value;
    box.dataset.sig = sig;
    var list = rows.map(function (row) {
      var href = row.user
        ? "/clayadm!nxx/kullanici?id=" + encodeURIComponent(row.user.id)
        : "/clayadm!nxx/uyeler/?konusma=" + encodeURIComponent(row.thread ? row.thread.id : "");
      var on = !!(row.guest && row.thread && row.thread.id === focus);
      var note = row.user ? planLabel(row.user.plan) + " · " + moneyUsd(row.user.balance) : "Canlı sohbet";
      if (row.user && row.user.status === "kapali") note = "Kapalı · " + note;
      return '<a class="clay-uye-row' + (on ? " is-on" : "") + '" href="' + href + '"><strong>Üye ' + esc(row.label) + "</strong><span>" + esc(note) + "</span></a>";
    }).join("") || '<p class="clay-uye-empty">Henüz üye yok.</p>';
    var detail = "";
    if (guest) {
      detail = '<article class="clay-uye-detail"><h2>Üye ' + esc(guest.label) + "</h2>" + accountFacts(null) + cardList(null) + threadLog(guest.thread) + chatForm(guest.thread) + "</article>";
    }
    box.innerHTML = "<h2>Üyeler</h2><div class=\"clay-uye-rows\">" + list + "</div>" + detail;
    var guestLog = box.querySelector(".clay-uye-detail .clay-desk-live-log");
    if (guestLog) guestLog.scrollTop = guestLog.scrollHeight;
    var next = box.querySelector("input[name=metin]");
    if (next && draft) {
      next.value = draft;
      next.focus();
    }
  }
  function mountUyeDetail() {
    if (!admin() || !/\/kullanici\/?$/.test(path())) {
      var stale = document.querySelector(".mx-auto.min-h-screen > .mt-6 > .clay-uye-detail");
      if (stale) stale.remove();
      return;
    }
    var slot = pageSlot();
    if (!slot) return;
    var id = new URLSearchParams(location.search).get("id") || "";
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var user = null;
    if (db && Array.isArray(db.users)) db.users.forEach(function (row) { if (row && row.id === id) user = row; });
    var box = slot.querySelector(":scope > .clay-uye-detail");
    if (!user) {
      if (box) box.remove();
      return;
    }
    var thread = findThread(user);
    var label = !anonName(user.username) ? user.username : ((thread && (thread.customer || thread.username)) || "Clay Anonim");
    var cards = db && Array.isArray(db.cards) ? db.cards.filter(function (card) { return card && card.userId === user.id; }) : [];
    var bits = thread && thread.messages ? thread.messages.map(function (item) { return String(item.at || "") + (item.text || "") + (item.image || ""); }).join(",") : "";
    var sig = label + "|" + (user.telegramId || "") + "|" + (user.balance || 0) + "|" + (user.plan || "") + "|" + (user.planStatus || "") + "|" + cards.map(function (card) { return card.id + (card.status || "") + (card.limit || "") + (card.label || ""); }).join(",") + "|" + (thread ? thread.id + (thread.status || "") + (thread.agent || "") + bits : "");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-uye-detail";
      slot.insertBefore(box, slot.firstChild);
    }
    box.setAttribute("data-clay-skip", "1");
    if (box.querySelector(".clay-ask-back, [data-clay-ask]")) return;
    if (box.dataset.sig === sig) return;
    var draft = "";
    var input = box.querySelector("input[name=metin]");
    if (input && document.activeElement === input) draft = input.value;
    box.dataset.sig = sig;
    var drafts = {};
    box.querySelectorAll(".clay-uye-act").forEach(function (form, i) {
      var pack = {};
      form.querySelectorAll("input, select").forEach(function (el) {
        if (el.name) pack[el.name] = el.value;
      });
      drafts[i] = pack;
    });
    box.innerHTML = '<p class="clay-uye-back"><a href="/clayadm!nxx/uyeler/">Üye listesi</a></p><h2>Üye ' + esc(label) + "</h2>" + accountFacts(user) + memberActs(user) + cardActs(user) + threadLog(thread) + chatForm(thread);
    box.querySelectorAll(".clay-uye-act").forEach(function (form, i) {
      var pack = drafts[i];
      if (!pack) return;
      Object.keys(pack).forEach(function (name) {
        if (form[name] && document.activeElement !== form[name]) form[name].value = pack[name];
      });
    });
    var log = box.querySelector(".clay-desk-live-log");
    if (log) log.scrollTop = log.scrollHeight;
    var next = box.querySelector("input[name=metin]");
    if (next && draft) {
      next.value = draft;
      next.focus();
    }
  }
  function hideNodeHard(el) {
    if (!el) return;
    el.hidden = true;
    el.setAttribute("hidden", "");
    el.classList.add("clay-uye-native-hid");
    el.style.setProperty("display", "none", "important");
  }
  function btnLabel(btn) {
    return (btn && btn.textContent || "").replace(/\s+/g, " ").trim();
  }
  function keepNativeAdmin(text) {
    return /Hesab[ıi] ask[ıi]ya al|Hesab[ıi] a[cç]|Kal[ıi]c[ıi] kapat|Kart ver|Aktar[ıi]m|Kartlar[ıi] kapat|İşlemler/.test(String(text || ""));
  }
  function hideOriginalDupes() {
    if (admin() && /\/kullanici\/?$/.test(path()) && document.querySelector(".clay-uye-detail")) {
      var slot = pageSlot();
      if (slot) {
        hideNodeHard(slot.querySelector("#kartlar"));
        var bakiye = slot.querySelector("#bakiye");
        if (bakiye) {
          bakiye.querySelectorAll("form").forEach(function (form) {
            if (form.closest(".clay-uye-detail")) return;
            var text = (form.textContent || "").replace(/\s+/g, " ");
            if (keepNativeAdmin(text)) return;
            if (text.indexOf("Bakiyeyi yaz") !== -1 || /\bArtır\b/.test(text) || /\bAzalt\b/.test(text)) hideNodeHard(form);
          });
        }
        slot.querySelectorAll("form").forEach(function (form) {
          if (form.closest(".clay-uye-detail") || form.closest(".clay-uye-list") || form.closest(".clay-role-box")) return;
          if (form.closest("#kart-ver, #aktarim, #islemler, #bakiye")) return;
          var text = (form.textContent || "").replace(/\s+/g, " ");
          if (keepNativeAdmin(text)) return;
          if (
            text.indexOf("Bakiyeyi yaz") !== -1 ||
            /\bArtır\b/.test(text) ||
            text.indexOf("Ücreti düş ve yaz") !== -1 ||
            text.indexOf("Kartı kaydet") !== -1 ||
            text.indexOf("Evet, kapat") !== -1 ||
            text.indexOf("Evet, dondur") !== -1 ||
            text.indexOf("Kartı kapat") !== -1 ||
            text.indexOf("Kartı dondur") !== -1
          ) hideNodeHard(form);
        });
        slot.querySelectorAll("button").forEach(function (btn) {
          if (btn.closest(".clay-uye-detail") || btn.closest(".clay-uye-list") || btn.closest(".clay-ask")) return;
          if (btn.closest("#kart-ver, #aktarim, #islemler")) return;
          var label = btnLabel(btn);
          if (keepNativeAdmin(label)) return;
          if (btn.closest("#bakiye") && (label === "Bakiyeyi yaz" || label === "Artır" || label === "Azalt")) {
            hideNodeHard(btn);
            return;
          }
          if (btn.closest("#kartlar") && (
            label === "Kartı dondur" ||
            label === "Kartı kapat" ||
            label === "Evet, kapat" ||
            label === "Evet, dondur" ||
            label === "Kartı aktif et" ||
            label === "Kartı kalıcı sil" ||
            label === "Kartı kaydet"
          )) btn.remove();
        });
      }
    }
    if (admin() && /\/uyeler\/?$/.test(path()) && document.querySelector(".clay-uye-list")) {
      document.querySelectorAll(".mx-auto.min-h-screen > .mt-6 > .glass").forEach(function (el) {
        if (el.classList.contains("clay-uye-list") || el.classList.contains("clay-ref-admin")) return;
        var text = (el.textContent || "").replace(/\s+/g, " ");
        if (text.indexOf("Üyeler") !== -1 && el.querySelector("a[href*='kullanici']")) hideNodeHard(el);
      });
    }
    if (admin() && masaPath()) {
      document.querySelectorAll(".clay-desk-live, .clay-desk-auto, #canli-destek").forEach(function (el) { el.remove(); });
    }
    document.querySelectorAll("header nav").forEach(function (nav) {
      var seen = {};
      nav.querySelectorAll("a").forEach(function (a) {
        var href = a.getAttribute("href") || "";
        var label = btnLabel(a);
        var key = href + "\n" + label;
        if (seen[key]) a.remove();
        else seen[key] = true;
      });
    });
    var extraCanli = 0;
    document.querySelectorAll("header nav a").forEach(function (a) {
      var label = btnLabel(a);
      if (label === "Canlı destek" || a.getAttribute("data-clay-canli")) {
        a.remove();
        extraCanli += 1;
      }
    });
    document.querySelectorAll(".clay-live-btn").forEach(function (btn, i) {
      if (i > 0) btn.remove();
    });
    document.querySelectorAll(".clay-desk-live").forEach(function (box, i) {
      if (i > 0) box.remove();
    });
    document.querySelectorAll("[data-clay-drawer]").forEach(function (btn, i) {
      if (i > 0) btn.remove();
    });
    if (/\/panel\/kartlar\/yeni\/?$/.test(path())) {
      document.querySelectorAll("main.boot-screen, #clay-products, #clay-confirm").forEach(function (node) {
        if (document.querySelector(".mx-auto.min-h-screen form input[name=tutar], .mx-auto.min-h-screen .fee-sheet")) hideNodeHard(node);
      });
      var seenKart = false;
      var live = liveIssueForm();
      document.querySelectorAll("form button.btn-gold, .clay-confirm button, button").forEach(function (btn) {
        var label = btnLabel(btn);
        if (label.indexOf("Kart Al") === -1 && label.indexOf("Kartı oluştur") === -1) return;
        if (btn.closest(".boot-screen") || btn.closest("#clay-confirm")) {
          hideNodeHard(btn);
          return;
        }
        if (live && !live.contains(btn) && seenKart) {
          hideNodeHard(btn);
          return;
        }
        if (seenKart) hideNodeHard(btn);
        else seenKart = true;
      });
    }
  }
  function orderDesk() {
    if (!admin()) return;
    document.querySelectorAll("main.boot-screen .clay-coupon-admin, main.boot-screen .clay-desk-live").forEach(function (n) { n.remove(); });
    var parked = document.querySelector(".clay-desk-live");
    if (parked) placeDesk(parked);
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var header = host.querySelector(":scope > header") || host.querySelector("header.glass") || host.querySelector("header");
    if (!header || header.tagName !== "HEADER") return;
    header.querySelectorAll(".clay-coupon-admin, .clay-desk-live").forEach(function (n) {
      host.insertBefore(n, header.nextSibling);
    });
    var live = host.querySelector(":scope > .clay-desk-live") || document.querySelector(".clay-desk-live");
    var coupon = host.querySelector(":scope > .clay-coupon-admin") || document.querySelector(".clay-coupon-admin");
    if (live && !live.closest("main.boot-screen")) {
      live.setAttribute("data-clay-pin", "live");
      if (live.parentNode !== host || live.previousElementSibling !== header) host.insertBefore(live, header.nextSibling);
    }
    var after = (live && live.parentNode === host) ? live : header;
    if (coupon && !coupon.closest("main.boot-screen")) {
      coupon.setAttribute("data-clay-pin", "coupon");
      if (coupon.parentNode !== host || coupon.previousElementSibling !== after) host.insertBefore(coupon, after.nextSibling);
    }
    host.querySelectorAll(".clay-coupon-admin > button[data-act=disable-coupon]:not([data-code])").forEach(function (btn) { btn.remove(); });
  }
  function tidyCards() {
    document.querySelectorAll("article[id^='crd_']").forEach(function (article) {
      article.querySelectorAll("[data-act=pin],[data-act=card-pdf],[data-act=card-close]").forEach(function (btn) {
        if (btn.closest(".card-menu")) return;
        btn.remove();
      });
    });
  }
  function stripLegacyReset() {
    if (!/\/sifre\/?$/.test(path())) return;
    document.querySelectorAll("button").forEach(function (btn) {
      var text = (btn.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (text === "tohumu olmayan eski hesap" || text === "eski yöntem ile devam et") btn.remove();
    });
    document.querySelectorAll('select[name="soru"], input[name="cevap"]').forEach(function (node) {
      var label = node.closest("label");
      if (label) label.remove();
      else node.remove();
    });
    document.querySelectorAll("p").forEach(function (node) {
      if ((node.textContent || "").indexOf("Soruyu, yanıtı") !== -1 && node.closest("form")) node.remove();
    });
  }
  function permanentCloseForm(form) {
    if (!form || !form.querySelector) return false;
    var mod = form.querySelector('input[name="mod"]');
    var who = form.querySelector('input[name="uye"]');
    return !!(mod && mod.value === "kalici" && who && who.value);
  }
  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.matches) return;
    if (permanentCloseForm(form)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var onay = form.querySelector('input[name="onay"]');
      var who = form.querySelector('input[name="uye"]');
      if (!onay || !onay.checked || !who || !(window.__clay && window.__clay.call)) return;
      window.__clay.call("admin-kapat", { uye: who.value, mod: "kalici", onay: "on" }).then(function (res) {
        if (!res || res.code !== "kapandi") return;
        window.location.assign("/clayadm!nxx/uyeler/?bildirim=kapandi");
      });
      return;
    }
    if (form.matches("form.clay-live-form")) {
      event.preventDefault();
      event.stopPropagation();
      sendVisitor(form);
      return;
    }
    if (form.matches("form.clay-desk-live-form")) {
      event.preventDefault();
      event.stopPropagation();
      sendDesk(form);
      return;
    }
    if (form.matches("form.clay-uye-chat-form")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var threadId = form.getAttribute("data-thread") || "";
      var reply = String(form.metin.value || "").trim();
      if (!reply || !threadId) return;
      postLive({ op: "reply", thread: threadId, text: reply }).then(function () {
        form.metin.value = "";
        refreshDesk();
      });
      return;
    }
    if (form.matches("form.clay-uye-act")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var kind = form.getAttribute("data-clay-act") || "";
      var who = form.getAttribute("data-user") || "";
      var cardId = form.getAttribute("data-card") || "";
      if (kind === "bakiye") {
        memberCall("admin-set-balance", { uye: who, bakiye: String(form.bakiye.value || "").trim() });
        return;
      }
      if (kind === "fark") {
        var yon = event.submitter ? event.submitter.value : "";
        memberCall("admin-balance", { uye: who, yon: yon, tutar: String(form.tutar.value || "").trim() });
        return;
      }
      if (kind === "plan") {
        memberCall("admin-uye-plan", { uye: who, plan: String(form.plan.value || "") });
        return;
      }
      if (kind === "kart") {
        memberCall("admin-edit-card", {
          id: cardId,
          uye: who,
          etiket: String(form.etiket.value || "").trim(),
          limit: String(form.limit.value || "").trim(),
          durum: String(form.durum.value || "")
        });
        return;
      }
      if (kind === "kapat") {
        memberCall("admin-close", { id: cardId, onay: form.onay && form.onay.checked ? "on" : "" });
        return;
      }
      if (kind === "sil") {
        memberCall("admin-purge", { id: cardId, onay: form.onay && form.onay.checked ? "on" : "" });
      }
      return;
    }
    if (form.matches("form[data-clay-pass]")) {
      event.preventDefault();
      event.stopPropagation();
      var msg = form.querySelector(".clay-hesap-msg");
      var eski = String(form.eski.value || "");
      var yeni = String(form.yeni.value || "");
      var yeni2 = String(form.yeni2.value || "");
      if (!eski || !yeni || yeni !== yeni2) {
        if (msg) msg.textContent = "Mevcut parola ve iki yeni parola aynı olmalı.";
        return;
      }
      if (!(window.__clay && window.__clay.call)) return;
      window.__clay.call("password", { eski: eski, yeni: yeni, yeni2: yeni2 }).then(function (res) {
        if (msg) msg.textContent = res && res.code === "parola" ? "Parola güncellendi." : "Parola kaydedilmedi.";
        if (res && res.code === "parola") form.reset();
      });
      return;
    }
    if (form.matches("form[data-clay-tg]")) {
      event.preventDefault();
      event.stopPropagation();
      var note = form.querySelector(".clay-hesap-msg");
      var telegram = String(form.telegram.value || "").trim();
      if (!telegram) {
        if (note) note.textContent = "Boş Telegram kaydedilmez.";
        return;
      }
      if (!(window.__clay && window.__clay.call)) return;
      window.__clay.call("uye-telegram", { telegram: telegram }).then(function (res) {
        if (res && res.code === "telegram") {
          var me = viewer();
          var shown = me && me.telegramId ? me.telegramId : telegram;
          var line = form.querySelector(".clay-tg-now");
          if (line) line.textContent = "Kayıtlı: " + shown;
          if (note) note.textContent = "Telegram kaydedildi.";
          form.telegram.value = "";
        } else if (note) note.textContent = "Telegram kaydedilmedi.";
      });
      return;
    }
    if (form.matches("form.clay-desk-auto-form")) {
      event.preventDefault();
      event.stopPropagation();
      var question = String(form.soru.value || "").trim();
      var answer = String(form.yanit.value || "").trim();
      if (!question || !answer) return;
      var editId = deskAutoEdit || String(form.dataset.edit || "");
      var payload = editId ? { op: "auto-edit", id: editId, q: question, a: answer } : { op: "auto-add", q: question, a: answer };
      postLive(payload).then(function (res) {
        if (res && res.ok) {
          deskAutoEdit = "";
          form.dataset.edit = "";
          form.soru.value = "";
          form.yanit.value = "";
          var saveBtn = form.querySelector("button[type=submit]");
          if (saveBtn) saveBtn.textContent = "Ekle";
        }
        takeDesk(res);
      });
      return;
    }
    if (form.classList.contains("plan-offer-cta") && form.querySelector("[name=plan]")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var user = viewer();
      var want = String((form.querySelector("[name=plan]") || {}).value || "");
      if (paidPlan(user)) {
        askConfirm("Yeni plan açılmaz. Mevcut planı iptal ediyor musun? Onaylıyor musun?").then(function (ok) {
          if (ok) cancelPlan();
        });
        return;
      }
      askConfirm("Bu planı almak üzeresin. Onaylıyor musun?").then(function (ok) {
        if (!ok) return;
        buyPlan(want);
      });
      return;
    }
  }, true);

  document.addEventListener("pointerdown", function () { unlockAudio(); }, true);
  document.addEventListener("click", function (event) {
    var seedBtn = event.target.closest && event.target.closest("[data-clay-seed-show]");
    if (seedBtn) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (seedBtn.disabled || seedBtn.hidden || !seedWords.length) return;
      toggleSeed();
      return;
    }
    var drawerBtn = event.target.closest && event.target.closest("[data-clay-drawer]");
    if (drawerBtn) {
      event.preventDefault();
      document.body.classList.toggle("clay-admin-open");
      return;
    }
    var renew = event.target.closest && event.target.closest("[data-act=renew-yes]");
    if (renew) passOnce("kart-uzat");
    var act = event.target.closest && event.target.closest("[data-act]");
    if (act) {
      var name = act.getAttribute("data-act");
      if (name === "auto-tap") {
        event.preventDefault();
        event.stopImmediatePropagation();
        var autoId = act.getAttribute("data-id");
        whenThread().then(function (id) {
          if (!id) return null;
          return postLive({ op: "auto", thread: id, id: autoId });
        }).then(function (res) {
          if (res && Array.isArray(res.autos)) liveAutos = res.autos;
          if (res && res.thread) paintVisitor(res.thread);
          else paintVisitor(null);
        });
        return;
      }
      if (name === "auto-edit") {
        event.preventDefault();
        event.stopImmediatePropagation();
        deskAutoEdit = act.getAttribute("data-id") || "";
        var host = act.closest(".clay-desk-live") || document;
        fillAutoForm(host, true);
        var soru = host.querySelector("input[name=soru]");
        if (soru) soru.focus();
        return;
      }
      if (name === "auto-del") {
        event.preventDefault();
        event.stopImmediatePropagation();
        var delId = act.getAttribute("data-id") || "";
        if (deskAutoEdit && deskAutoEdit === delId) deskAutoEdit = "";
        postLive({ op: "auto-del", id: delId }).then(takeDesk);
        return;
      }
      if (name === "live-switch") {
        event.preventDefault();
        event.stopImmediatePropagation();
        postLive({ op: "switch", acik: act.getAttribute("data-on") === "1" ? "0" : "1" }).then(function () {
          refreshDesk();
        });
        return;
      }
      if (name === "live-hold" || name === "live-resume" || name === "live-reopen") {
        event.preventDefault();
        event.stopImmediatePropagation();
        runThread(name === "live-hold" ? "beklemede" : "acik");
        return;
      }
      if (name === "live-end") {
        event.preventDefault();
        event.stopImmediatePropagation();
        askConfirm("Bu görüşmeyi sonlandırıyorsun. Onaylıyor musun?").then(function (ok) {
          if (ok) runThread("bitti");
        });
        return;
      }
      if (name === "live-delete") {
        event.preventDefault();
        event.stopImmediatePropagation();
        askConfirm("Bu görüşmeyi siliyorsun. Onaylıyor musun?").then(function (ok) {
          if (ok) runThread("sil");
        });
        return;
      }
      if (name === "live-open") {
        event.preventDefault();
        event.stopImmediatePropagation();
        unlockAudio();
        if (liveEnabled === false) return;
        var root = document.querySelector(".clay-live");
        if (!root) { paintVisitor(null); root = document.querySelector(".clay-live"); }
        if (!root) return;
        var open = root.dataset.open !== "1";
        root.dataset.open = open ? "1" : "";
        paintVisitor(null);
        if (open) ensureThread();
        else refreshVisitor();
        return;
      }
      if (name === "live-close") {
        event.preventDefault();
        var live = document.querySelector(".clay-live");
        if (live) {
          live.dataset.open = "";
          paintVisitor(null);
        }
        return;
      }
      if (name === "uye-dondur" || name === "uye-coz" || name === "uye-sil") {
        event.preventDefault();
        event.stopImmediatePropagation();
        var card = act.getAttribute("data-card") || "";
        if (name === "uye-dondur") {
          askConfirm("Emin misin? Kart dondurulmuş sekmeye gider.").then(function (ok) {
            if (ok) memberCall("admin-card", { id: card, mod: "dondur" });
          });
          return;
        }
        if (name === "uye-sil") {
          askConfirm("Emin misin? Kart ve siparişi silinir. Bakiye değişmez.").then(function (ok) {
            if (ok) memberCall("admin-purge", { id: card, onay: "on" });
          });
          return;
        }
        memberCall("admin-card", { id: card, mod: "coz" });
        return;
      }
      if (name === "plan-cancel") {
        event.preventDefault();
        askConfirm("Mevcut planı iptal ediyor musun? Onaylıyor musun?").then(function (ok) {
          if (ok) cancelPlan();
        });
      }
    }
    var tumu = event.target.closest && event.target.closest("form.transfer-panel button");
    if (tumu && /Tümü|Tumu/.test((tumu.textContent || "").replace(/\s+/g, " "))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      fillAllTransfer(tumu.closest("form"));
      return;
    }
    var kartBtn = event.target.closest && event.target.closest("button");
    if (kartBtn && /\/panel\/kartlar\/yeni\/?$/.test(path())) {
      var lab = (kartBtn.textContent || "").replace(/\s+/g, " ");
      if ((lab.indexOf("Kart Al") !== -1 || lab.indexOf("Kartı oluştur") !== -1) && memberOverQuota()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showQuotaNotice();
        return;
      }
    }
    var threadBtn = event.target.closest && event.target.closest(".clay-desk-live [data-thread]");
    if (threadBtn) {
      event.preventDefault();
      deskPicked = true;
      deskThread = threadBtn.getAttribute("data-thread");
      refreshDesk();
    }
  }, true);

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !/\/panel\/kartlar\/yeni\/?$/.test(path())) return;
    if (!form.querySelector('[name="tur"]') || !form.querySelector('[name="tutar"]')) return;
    if (form.closest(".boot-screen")) return;
    if (memberOverQuota()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showQuotaNotice();
    }
  }, true);

  document.addEventListener("change", function (event) {
    var target = event.target;
    if (!target) return;
    if (target.matches && target.matches(".clay-live-photo input")) {
      var file = target.files && target.files[0];
      var form = target.closest("form");
      var text = form && form.metin ? String(form.metin.value || "").trim() : "";
      target.value = "";
      if (file) uploadVisitor(file, text);
      return;
    }
    if (target.name === "tur" || target.name === "tutar") { paintIssue(); paintFeeSheet(); paintBins(); paintTransferSplit(); }
    if (target.name === "bin") paintBins();
  });
  document.addEventListener("input", function (event) {
    var target = event.target;
    if (!target) return;
    if (target.name === "tutar") { paintIssue(); paintFeeSheet(); paintTransferSplit(); }
  });

  function toast(text, ok) {
    if (!text) return;
    var node = document.querySelector(".clay-toast");
    if (!node) {
      node = document.createElement("p");
      node.className = "clay-toast";
      node.setAttribute("role", "status");
      document.body.appendChild(node);
    }
    node.textContent = text;
    node.classList.toggle("is-bad", !ok);
    node.classList.add("is-on");
    clearTimeout(node._t);
    node._t = setTimeout(function () { node.classList.remove("is-on"); }, 5200);
  }
  function fxRate() {
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var rate = db && db.settings && db.settings.fx && Number(db.settings.fx.rate);
    return rate > 1 ? rate : 49.527;
  }
  function moneyCur() {
    try {
      var c = localStorage.getItem("clay-currency");
      return c === "TRY" ? "TRY" : "USD";
    } catch (e) { return "USD"; }
  }
  function paintCurrency() {
    var want = moneyCur();
    document.documentElement.setAttribute("data-clay-cur", want);
    var rate = fxRate();
    document.querySelectorAll("body *").forEach(function (el) {
      if (el.childElementCount) return;
      var t = el.textContent;
      if (!t || t.length > 48) return;
      if (want === "TRY" && / USD\s*$/.test(t) && t.indexOf("TRY") === -1) {
        var n = t.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
        var usd = parseFloat(n);
        if (!isFinite(usd)) return;
        el.dataset.clayUsd = t;
        el.textContent = (usd * rate).toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " TRY";
      } else if (want === "USD" && el.dataset.clayUsd) {
        el.textContent = el.dataset.clayUsd;
        delete el.dataset.clayUsd;
      }
    });
    document.querySelectorAll("header .clay-fx-line, .chrome-pair .clay-fx-line").forEach(function (node) { node.remove(); });
    var host = document.querySelector(".chrome-pair") || document.querySelector("header") || document.querySelector(".lang-pop");
    if (!host || document.querySelector(".clay-cur-btn")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-btn clay-cur-btn";
    btn.textContent = want;
    btn.addEventListener("click", function () {
      var next = moneyCur() === "TRY" ? "USD" : "TRY";
      try {
        localStorage.setItem("clay-currency", next);
        localStorage.setItem("clay-currency-picked", "1");
      } catch (e) {}
      btn.textContent = next;
      paintCurrency();
    });
    host.appendChild(btn);
  }
  function geoBoot() {
    if (geoBoot.done) return;
    geoBoot.done = true;
    var picked = false;
    try { picked = localStorage.getItem("clay-lang-picked") === "1"; } catch (e) {}
    var curPicked = false;
    try { curPicked = localStorage.getItem("clay-currency-picked") === "1"; } catch (e) {}
    if (picked && curPicked) return;
    fetch("/api/clay-geo.php", { credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || !d.ok) return;
      if (!picked && (d.lang === "tr" || d.lang === "en")) {
        try { localStorage.setItem("clay-lang", d.lang); } catch (e) {}
        document.documentElement.lang = d.lang;
      }
      if (!curPicked && (d.currency === "TRY" || d.currency === "USD")) {
        try { localStorage.setItem("clay-currency", d.currency); } catch (e) {}
        paintCurrency();
      }
    }).catch(function () {});
  }
  document.addEventListener("click", function (event) {
    var opt = event.target.closest && event.target.closest(".lang-option");
    if (opt) {
      try { localStorage.setItem("clay-lang-picked", "1"); document.cookie = "clay-lang-picked=1;path=/;max-age=31536000;SameSite=Lax"; } catch (e) {}
    }
  }, true);
  function pulseNow() {
    if (!(window.__clay && window.__clay.call)) return;
    window.__clay.call("state", {}).then(function (res) {
      if (!res || !res.db) return;
      var me = res.me || viewer();
      if (me) {
        document.querySelectorAll("[data-clay-bal], .clay-balance, .balance-value").forEach(function (n) {
          if (!n.childElementCount) n.textContent = moneyUsd(me.balance);
        });
      }
      (res.db.cards || []).forEach(function (card) {
        var root = document.getElementById(card.id) || document.querySelector('[data-card="' + card.id + '"]');
        if (!root) return;
        root.querySelectorAll("dd, .card-expiry, .card-limit").forEach(function (n) {
          if (/SKT|exp/i.test(n.previousElementSibling && n.previousElementSibling.textContent || "")) n.textContent = card.expiry || n.textContent;
        });
      });
      paintCurrency();
    }).catch(function () {});
  }
  var pulseTimer = 0;
  function pulseLoop() {
    if (!member() && !admin()) return;
    if (pulseTimer) return;
    pulseTimer = setInterval(pulseNow, 20000);
    pulseNow();
  }
  function rbacNav() {
    if (!admin()) return;
    var role = deskRole();
    if (role === "tam") return;
    var hide = [];
    if (role === "siparis") hide = ["/bin", "/planlar", "/ucretler", "/metinler", "/telegram"];
    if (role === "ucret") hide = ["/uyeler", "/kullanici", "/canli"];
    if (role === "bakiye") hide = ["/bin", "/planlar", "/ucretler", "/metinler", "/telegram"];
    if (role === "destek") hide = ["/bin", "/planlar", "/ucretler", "/metinler", "/telegram"];
    if (role === "izle") hide = ["/bin", "/planlar", "/ucretler", "/metinler", "/telegram"];
    document.querySelectorAll("header nav a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      hide.forEach(function (p) {
        if (href.indexOf("/clayadm!nxx" + p) !== -1 || href.indexOf("/clayadm!nxx" + p + "/") !== -1) a.hidden = true;
      });
    });
  }
  function mountCharts() {
    if (!admin() || !/^\/clayadm!nxx\/?$/.test(path())) return;
    if (document.querySelector(".clay-charts")) return;
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    if (!db) return;
    var host = document.querySelector("main") || document.querySelector(".grid.gap-5");
    if (!host) return;
    var days = {};
    var weeks = {};
    var dep = {};
    (db.transactions || []).forEach(function (tx) {
      if (!tx || tx.status === "reddedildi") return;
      var day = String(tx.createdAt || "").slice(0, 10);
      var week = day.slice(0, 7);
      var amt = Math.abs(Number(tx.usdMinor) || 0);
      if (tx.kind === "yukleme" && (tx.amount || 0) > 0) {
        days[day] = (days[day] || 0) + amt;
        weeks[week] = (weeks[week] || 0) + amt;
        dep[tx.userId] = (dep[tx.userId] || 0) + amt;
      }
      if (tx.kind === "basim") {
        days[day] = (days[day] || 0) + Math.abs(Number(tx.usdMinor) || 0);
      }
    });
    var active = (db.cards || []).filter(function (c) { return c && c.status === "aktif"; }).length;
    function bars(map) {
      var keys = Object.keys(map).sort().slice(-7);
      var max = Math.max.apply(null, keys.map(function (k) { return map[k]; }).concat([1]));
      return keys.map(function (k) {
        var h = Math.max(4, Math.round(64 * map[k] / max));
        return '<span class="clay-bar" title="' + esc(k) + '"><i style="height:' + h + 'px"></i></span>';
      }).join("");
    }
    var top = Object.keys(dep).sort(function (a, b) { return dep[b] - dep[a]; }).slice(0, 5).map(function (id) {
      var u = (db.users || []).find(function (x) { return x && x.id === id; });
      return "<li>" + esc((u && u.username) || id) + " · " + moneyUsd(dep[id]) + "</li>";
    }).join("") || "<li>Kayıt yok</li>";
    var box = document.createElement("section");
    box.className = "glass rounded-[28px] p-5 clay-charts";
    box.innerHTML = '<h2 class="font-display text-2xl font-bold">Özet</h2><p class="text-sm text-white/60">Aktif kart: ' + active + '</p><div class="clay-chart-row"><div><p>Günlük satış</p><div class="clay-bars">' + bars(days) + '</div></div><div><p>Haftalık satış</p><div class="clay-bars">' + bars(weeks) + '</div></div></div><h3 class="font-display text-xl font-bold">En çok yükleyenler</h3><ul class="clay-top-dep">' + top + "</ul>";
    host.insertBefore(box, host.firstChild);
  }
  function mountTelegramAdmin() {
    if (!admin() || !/\/telegram\/?$/.test(path())) return;
    if (document.querySelector(".clay-tg-bot")) return;
    var form = document.querySelector("form.glass") || document.querySelector("form");
    if (!form) return;
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var note = db && db.settings && db.settings.telegramNote ? db.settings.telegramNote : "";
    var extra = document.createElement("div");
    extra.className = "clay-tg-bot grid gap-3";
    extra.innerHTML = '<label>Bot token<input class="field" name="bot" autocomplete="off" placeholder="123456:ABC"></label><label>Chat ID<input class="field" name="chat" autocomplete="off" placeholder="-100... veya @kanal"></label><p class="text-sm text-white/60">Kart oluşunca bu sohbete gider. Token tarayıcıya yazılmaz; boş bırakırsan kayıtlı token durur. ' + esc(note) + "</p>";
    form.appendChild(extra);
    form.addEventListener("submit", function () {
      var bot = form.bot && form.bot.value;
      var chat = form.chat && form.chat.value;
      if (!(window.__clay && window.__clay.call)) return;
      if (bot || chat) window.__clay.call("admin-telegram", { telegram: form.telegram ? form.telegram.value : "", bot: bot || "", chat: chat || "" });
    });
  }
  function mountBinPattern() {
    if (!admin() || !/\/bin\/?$/.test(path())) return;
    document.querySelectorAll('input[name="rakam"]').forEach(function (el) {
      el.setAttribute("pattern", "\\d{6}|\\d{8}");
      el.setAttribute("maxlength", "8");
      el.setAttribute("minlength", "6");
    });
  }
  function mountCaptcha() {
    document.querySelectorAll(".clay-captcha").forEach(function (node) { node.remove(); });
  }
  function paintAutoFill(box, on, message) {
    var sw = box.querySelector("[data-act=autofill]");
    var off = box.querySelector(".clay-autofill-off");
    var msg = box.querySelector(".clay-autofill-msg");
    if (sw) {
      if (sw.matches("input")) sw.checked = !!on;
      sw.setAttribute("aria-checked", on ? "true" : "false");
      sw.classList.toggle("is-on", !!on);
    }
    if (off) off.hidden = !!on;
    if (msg && typeof message === "string") msg.textContent = message;
    var tag = box.querySelector(".clay-lux-topup-onoff");
    if (tag) tag.textContent = autoEn() ? (on ? "ON" : "OFF") : (on ? "AÇIK" : "KAPALI");
    var badge = box.querySelector(".clay-lux-topup-badge");
    if (badge) badge.hidden = !on;
    box.dataset.autoOn = on ? "1" : "0";
  }
  function autoEn() {
    return String(document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  }
  function autoFailText(res) {
    if (res && res.message && !autoEn()) return String(res.message);
    var code = res && res.code ? String(res.code) : "";
    if (code === "giris") return autoEn() ? "Session expired. Sign in again." : "Oturum kapandı. Tekrar giriş yap.";
    if (code === "e-defter") return autoEn() ? "Setting could not be saved. Try again." : "Ayar kaydedilemedi. Tekrar dene.";
    return autoEn() ? "Setting could not be saved." : "Ayar kaydedilemedi.";
  }
  function autoFillMarkup(on) {
    return '<div class="clay-autofill-row"><span class="clay-autofill-copy">Minimum bakiye veya para yetersizliği durumunda otomatik kart yüklemesi</span><button type="button" class="clay-autofill-switch' + (on ? " is-on" : "") + '" data-act="autofill" role="switch" aria-checked="' + (on ? "true" : "false") + '" aria-label="Minimum bakiye veya para yetersizliği durumunda otomatik kart yüklemesi"><i aria-hidden="true"></i></button></div><p class="clay-autofill-off" hidden>Otomatik doldurma devre dışı</p><p class="clay-autofill-msg" role="status"></p>';
  }
  function bindAutoFill(box) {
    if (box.dataset.clayAutoBound === "1") return;
    box.dataset.clayAutoBound = "1";
    box.addEventListener("click", function (event) {
      var hit = event.target.closest && (event.target.closest("[data-act=autofill]") || event.target.closest(".clay-lux-topup-switch"));
      if (!hit || !box.contains(hit)) return;
      var sw = hit.matches("[data-act=autofill]") ? hit : hit.querySelector("[data-act=autofill]");
      if (!sw) return;
      event.preventDefault();
      if (box.dataset.autoBusy === "1") return;
      var was = sw.getAttribute("aria-checked") === "true";
      var on = !was;
      paintAutoFill(box, on, "");
      if (!(window.__clay && window.__clay.call)) return;
      box.dataset.autoBusy = "1";
      sw.setAttribute("aria-busy", "true");
      window.__clay.call("oto-ayar", { acik: on ? "1" : "0" }).then(function (res) {
        box.dataset.autoBusy = "";
        sw.removeAttribute("aria-busy");
        var code = res && res.code;
        if (code !== "acik" && code !== "kapali") {
          paintAutoFill(box, was, autoFailText(res));
          return;
        }
        var open = code === "acik";
        paintAutoFill(box, open, "");
        if (open) window.__clay.call("oto-doldur", {}).then(function (fill) {
          if (fill && fill.message) paintAutoFill(box, fill.code !== "kapali", fill.message);
        });
      }, function () {
        box.dataset.autoBusy = "";
        sw.removeAttribute("aria-busy");
        paintAutoFill(box, was, autoFailText(null));
      });
    });
  }
  window.__clayAutoFillOwner = "v14";
  function mountAutoFill() {
    if (admin() || !member() || !/\/panel\/kartlar\/?$/.test(location.pathname)) return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var box = host.querySelector(".clay-autofill");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-autofill glass rounded-[24px] p-4";
      box.innerHTML = autoFillMarkup(true);
      var title = host.querySelector("h1");
      var block = title && title.closest(".grid");
      if (block) block.insertBefore(box, block.firstChild);
      else host.insertBefore(box, host.firstChild);
    } else if (box.querySelector("input[data-act=autofill]") || !box.querySelector("[role=switch][data-act=autofill]")) {
      var old = box.querySelector("[data-act=autofill]");
      var wasOn = old && old.matches("input") ? !!old.checked : (!old || old.getAttribute("aria-checked") !== "false");
      var keep = box.querySelector(".clay-autofill-msg");
      var text = keep ? keep.textContent : "";
      box.innerHTML = autoFillMarkup(wasOn);
      if (text) paintAutoFill(box, wasOn, text);
    }
    bindAutoFill(box);
    if (box.dataset.autoAsked === "1") return;
    box.dataset.autoAsked = "1";
    if (!(window.__clay && window.__clay.call)) return;
    window.__clay.call("oto-durum", {}).then(function (res) {
      if (!res || (res.code !== "acik" && res.code !== "kapali")) {
        box.dataset.autoAsked = "";
        return;
      }
      var open = res.code === "acik";
      paintAutoFill(box, open, "");
      if (!open) return;
      window.__clay.call("oto-doldur", {}).then(function (fill) {
        if (fill && fill.message) paintAutoFill(box, fill.code !== "kapali", fill.message);
      });
    });
  }
  function mountAdminSeed() {
    if (!admin() || !/\/kullanici\/?$/.test(path())) return;
    var me = viewer();
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    if (!db) return;
    var id = "";
    try { id = new URLSearchParams(location.search).get("id") || ""; } catch (e) {}
    var user = (db.users || []).find(function (u) { return u && u.id === id; });
    if (!user || !user.seedKeep) return;
    if (document.querySelector(".clay-admin-seed")) return;
    var host = document.querySelector(".glass") || document.querySelector("main");
    if (!host) return;
    var p = document.createElement("p");
    p.className = "clay-admin-seed text-sm";
    p.textContent = "Tohum: " + user.seedKeep;
    host.appendChild(p);
  }

  function transferPct() {
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var n = db && db.settings && Number(db.settings.transferFeePercent);
    return n > 0 && n < 40 ? n : 13;
  }
  function cutUsd(cents, pct) {
    if (!(cents > 1)) return 0;
    var fee = Math.round(cents * pct / 100);
    if (fee < 1) fee = 1;
    if (fee >= cents) fee = cents - 1;
    return fee;
  }
  function allRemainingAfterFee(available, pct) {
    var t = Math.round(Number(available) || 0);
    while (t >= 100) {
      var fee = cutUsd(t, pct);
      if (t <= available && fee >= 1 && t - fee >= 1) {
        var n = Math.max(0, Math.round(t));
        return Math.floor(n / 100) + "." + String(n % 100).padStart(2, "0");
      }
      t -= 1;
    }
    return "";
  }
  function usdPrint(cents) {
    var n = Math.round(Number(cents) || 0);
    var sign = n < 0 ? "-" : "";
    var abs = Math.abs(n);
    return sign + "$" + (abs / 100).toFixed(2);
  }
  function parseUsdField(raw) {
    var t = String(raw || "").trim().replace(/\s/g, "").replace(",", ".");
    if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
    var parts = t.split(".");
    return Number(parts[0]) * 100 + Number((parts[1] || "").padEnd(2, "0"));
  }
  function paidPlan(user) {
    if (!user) return false;
    if (user.role === "yonetici") return true;
    if ((user.planStatus || "aktif") === "iptal") return false;
    if (!user.plan) return false;
    if (user.planPaid === true) return true;
    if (!planLive(user)) return false;
    return user.plan === "atolye" || user.plan === "galeri";
  }
  function cardQuota(user) {
    if (!paidPlan(user)) return 1;
    if (user && Number(user.cardQuota) > 0) return Number(user.cardQuota);
    var data = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var row = data && data.settings && data.settings.plans ? data.settings.plans[user.plan] : null;
    var limit = row ? Number(row.cardLimit) : 0;
    return limit > 0 ? limit : 1;
  }
  function memberOverQuota() {
    var me = viewer();
    if (!me || me.role === "yonetici") return false;
    var open = userCards(me).filter(function (c) { return c && c.status !== "kapali"; }).length;
    return open >= cardQuota(me);
  }
  function flashOk(title, line) {
    var root = document.getElementById("clay-flash");
    if (!root) {
      root = document.createElement("div");
      root.id = "clay-flash";
      root.className = "clay-flash";
      root.innerHTML = '<div class="clay-flash-card" role="status"><p class="clay-flash-kicker">CLAY</p><p class="clay-flash-title"></p><p class="clay-flash-line"></p></div>';
      document.body.appendChild(root);
    }
    root.querySelector(".clay-flash-title").textContent = title;
    root.querySelector(".clay-flash-line").textContent = line || "";
    root.classList.add("is-on");
    clearTimeout(root._t);
    root._t = setTimeout(function () { root.classList.remove("is-on"); }, 4200);
  }
  function showTransferFlash() {
    if (!member() || !/\/panel\/kartlar\/?$/.test(path())) return;
    var key = location.pathname + location.search;
    var stored = "";
    try { stored = sessionStorage.getItem("clay-flash") || ""; } catch (e) {}
    var q = "";
    try { q = new URLSearchParams(location.search).get("bildirim") || ""; } catch (e) {}
    var kind = stored || (q === "transfer" ? "aktar" : q === "ana-hesap" ? "ana" : "");
    if (!kind) return;
    if (showTransferFlash.key === key + kind) return;
    showTransferFlash.key = key + kind;
    try { sessionStorage.removeItem("clay-flash"); } catch (e) {}
    if (kind === "aktar") flashOk("Evet, aktarıldı", "Komisyon kesildi. Karşı karta yazılan tutar önizlemedeki Yazılır ile aynı.");
    if (kind === "ana") flashOk("Ana hesaba aktarıldı", "Karttan düşen tutar Çıkar, ana hesaba yazılan Yazılır.");
  }
  function ledgerToast(action, body) {
    if (!body) return;
    var code = String(body.code || "");
    var fail = code.indexOf("e-") === 0;
    if (action === "kart-limit") {
      if (fail) showAlert(code, body.message || tx("Limit kaydedilemedi.", "The limit was not saved."));
      else toast(tx("Evet, limitlerin güncellendi.", "Yes, the limits were updated."), true);
      return;
    }
    if (action === "harca" || action === "spend") {
      var ok = code === "harcama" || code === "ok";
      if (!ok) showAlert(code || "e-harca", body.message || tx("Harcama uygulanmadı.", "The spend was not applied."));
      else toast(tx("Evet, harcama işlendi.", "Yes, the spend was applied."), true);
      return;
    }
    if (action === "transfer") {
      if (code === "transfer") try { sessionStorage.setItem("clay-flash", "aktar"); } catch (e) {}
      if (code === "transfer") showTransferFlash();
      else showAlert(code, body.message || tx("Aktarım uygulanmadı.", "The transfer was not applied."));
      return;
    }
    if (action === "ana-hesap") {
      if (code === "ana-hesap") try { sessionStorage.setItem("clay-flash", "ana"); } catch (e) {}
      if (code === "ana-hesap") showTransferFlash();
      else showAlert(code, body.message || tx("Ana hesaba aktarım uygulanmadı.", "The wallet transfer was not applied."));
      return;
    }
    if (action === "plan") {
      if (code === "e-bakiye") showFundsBanner();
      else if (fail) showAlert(code, body.message || tx("Plan alınamadı.", "The plan was not purchased."));
      else {
        planCancelled = false;
        syncPlanFromRes(body);
      }
      return;
    }
    if (action === "plan-iptal") {
      if (code === "plan-iptal") {
        planCancelled = true;
        applyUserPlan({ plan: "", planPaid: false, planUntil: "", planStatus: "iptal", cardQuota: 1 });
        syncPlanFromRes(body);
      }
      return;
    }
    if (fail && code !== "e-onay" && action !== "issue" && action !== "admin-issue" && action !== "login") {
      showAlert(code, body.message);
    }
  }
  function wrapClayCall() {
    if (!window.__clay || !window.__clay.call || window.__clay.call.__quota) return;
    var orig = window.__clay.call.bind(window.__clay);
    window.__clay.call = function (action, fields) {
      if (action === "issue" && memberOverQuota()) {
        showQuotaNotice();
        return Promise.resolve({ code: "e-paket", message: "Başka kart için paket gerekir." });
      }
      return orig(action, fields).then(function (res) {
        if (res && (res.code === "e-paket" || res.code === "e-plan")) showQuotaNotice();
        if (action === "plan" && res && res.code === "e-bakiye") showFundsBanner();
        if (action === "plan" || action === "plan-iptal") {
          window.setTimeout(function () {
            if (window.__clayLuxury) window.__clayLuxury();
            paintPlan();
          }, 0);
        }
        return res;
      });
    };
    window.__clay.call.__quota = true;
  }
  function showQuotaNotice() {
    if (document.querySelector(".clay-ask-back.is-quota")) return;
    showAlert("e-paket");
  }
  function styleLimitBtns() {
    document.querySelectorAll(".clay-limit [data-act=save-limit]").forEach(function (btn) {
      btn.classList.add("btn-gold");
      btn.classList.remove("btn-ghost");
    });
    document.querySelectorAll(".clay-limit [data-act=spend]").forEach(function (btn) {
      btn.classList.add("btn-gold");
      btn.classList.remove("btn-ghost", "btn-wine");
    });
  }
  function hideSecurityQuestion() {
    if (/\/panel\/hesap\/?$/.test(path())) {
      document.querySelectorAll("form.account-sheet, section.account-sheet, .account-sheet").forEach(function (box) {
        if (box.classList.contains("clay-hesap-ayar") || box.closest(".clay-hesap-ayar") || box.classList.contains("clay-ref-panel")) return;
        var text = (box.textContent || "").replace(/\s+/g, " ");
        if (text.indexOf("Güvenlik sorusu") !== -1 || text.indexOf("Soruyu kaydet") !== -1) box.remove();
      });
    }
    document.querySelectorAll("form.account-sheet, section.account-sheet, .account-sheet").forEach(function (box) {
      var title = box.querySelector("h2");
      var text = ((title && title.textContent) || box.textContent || "").replace(/\s+/g, " ");
      if (text.indexOf("Güvenlik sorusu") !== -1 || text.indexOf("Soruyu kaydet") !== -1) {
        box.setAttribute("hidden", "");
        box.style.setProperty("display", "none", "important");
      }
    });
    document.querySelectorAll('select[name="soru"], input[name="cevap"]').forEach(function (node) {
      if (!/\/sifre\/?$/.test(path()) && node.closest("form")) {
        var form = node.closest("form");
        var t = (form.textContent || "");
        if (t.indexOf("Güvenlik sorusu") !== -1 || t.indexOf("Soruyu kaydet") !== -1) {
          form.setAttribute("hidden", "");
          form.style.setProperty("display", "none", "important");
        }
      }
    });
    document.querySelectorAll("a[href*='sekme=guvenlik']").forEach(function (a) {
      if ((a.textContent || "").indexOf("Güvenlik") !== -1) a.remove();
    });
  }
  function polishOrtaklik() {
    var extra = document.querySelector(".clay-extra");
    if (extra && (/ortaklik/.test(location.search) || extra.querySelector("form.clay-refer"))) {
      extra.classList.add("clay-ortaklik");
      extra.classList.add("clay-ortak");
    }
    document.querySelectorAll(".clay-ref-panel, .clay-ortaklik, .clay-extra").forEach(function (box) {
      if (!/ortaklik|Ortaklık/.test((box.textContent || "") + location.search) && !box.querySelector("form.clay-refer")) return;
      box.classList.add("clay-ortaklik");
      box.classList.add("clay-ortak");
    });
  }
  function feeUsdOpen() {
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var issue = db && db.settings ? Number(db.settings.issueFeeKurus) : 1514;
    var fx = fxRate();
    if (!issue) issue = 1514;
    if (issue === 1514) return 1514;
    if (issue >= 10000) return Math.round((issue / 100) / fx * 100);
    return issue;
  }
  function paintFeeSheet() {
    if (!/\/panel\/kartlar\/yeni\/?$/.test(path())) return;
    var form = liveIssueForm();
    if (!form) return;
    var native = form.querySelector("#kesinti, .fee-sheet") || document.querySelector(".mx-auto.min-h-screen #kesinti, .mx-auto.min-h-screen .fee-sheet");
    var host = form.parentNode;
    var sheet = native || host.querySelector(".clay-fee-sheet");
    if (native) {
      native.classList.add("clay-fee-sheet");
      document.querySelectorAll(".clay-fee-sheet").forEach(function (extra) {
        if (extra !== native) extra.remove();
      });
      return;
    }
    if (!sheet) {
      sheet = document.createElement("aside");
      sheet.className = "clay-fee-sheet";
      host.insertBefore(sheet, form.nextSibling);
    }
    var raw = form.tutar ? String(form.tutar.value || "").trim() : "";
    var cents = parseUsdField(raw);
    var me = viewer();
    var bal = me ? Number(me.balance) || 0 : 0;
    var open = feeUsdOpen();
    var fx = fxRate();
    var load = cents || 0;
    var cost = load > 0 ? 600 + Math.round(load * 4 / 100) : 600;
    var marked = Math.round(cost * 113 / 100);
    var due = open + load + marked;
    var short = bal < due;
    var lines = [];
    lines.push('<p class="clay-fee-kicker">NE KESİLİR / NE KALIR</p>');
    lines.push("<h3>Basım özeti</h3>");
    lines.push("<dl><div><dt>Açılış</dt><dd>" + usdPrint(open) + " · 750 TL</dd></div>");
    lines.push("<div><dt>Karta yazılmaz</dt><dd>750 TL kart bakiyesine girmez.</dd></div>");
    lines.push("<div><dt>Karta yazılır</dt><dd>" + (load ? usdPrint(load) : "Tutar yaz") + "</dd></div>");
    lines.push("<div><dt>Sağlayıcı</dt><dd>5 + 1 USD + %4</dd></div>");
    lines.push("<div><dt>Müşteri payı</dt><dd>×1,13 → " + usdPrint(marked) + "</dd></div>");
    lines.push("<div><dt>Kur</dt><dd>1 USD = " + String(fx).replace(".", ",") + " TL</dd></div>");
    lines.push("<div><dt>Süre</dt><dd>30 gün</dd></div>");
    lines.push("<div><dt>Şimdi hesaptan düşecek</dt><dd>" + usdPrint(due) + "</dd></div></dl>");
    if (short) lines.push('<p class="clay-fee-short">Yetersiz bakiye. Şimdi hesaptan düşecek ' + usdPrint(due) + ".</p>");
    var html = lines.join("");
    if (sheet.dataset.sig === html) return;
    sheet.dataset.sig = html;
    sheet.innerHTML = html;
    form.querySelectorAll("span, p, small").forEach(function (el) {
      if (el.closest(".clay-fee-sheet") || el.closest(".clay-sample") || el.closest(".vcard")) return;
      var t = (el.textContent || "").replace(/\s+/g, " ");
      if (t.indexOf("Kart bedeli 750") !== -1) el.style.display = "none";
    });
  }
  function binScheme(digits) {
    var d = String(digits || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.charAt(0) === "4") return "visa";
    var two = Number(d.slice(0, 2));
    var four = Number(d.slice(0, 4));
    if ((two >= 51 && two <= 55) || (four >= 2221 && four <= 2720)) return "mastercard";
    return "";
  }
  function binDigitsOf(inp, label) {
    var id = String((inp && inp.value) || "");
    var data = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var bins = data && data.bins ? data.bins : [];
    for (var i = 0; i < bins.length; i++) {
      if (bins[i] && bins[i].id === id) {
        var fromRow = String(bins[i].digits || bins[i].label || "").replace(/\D/g, "");
        if (fromRow.length >= 4) return fromRow.slice(0, 8);
      }
    }
    var text = String((label && label.textContent) || "").replace(/\D/g, "");
    if (text.length >= 4) return text.slice(0, 8);
    return "";
  }
  function binMarkHtml(scheme) {
    if (scheme === "visa") {
      return '<span class="clay-bin-mark clay-bin-visa-word">Visa</span>';
    }
    if (scheme === "mastercard") {
      return '<svg class="clay-bin-mark clay-bin-mc" viewBox="0 0 36 22" aria-hidden="true"><circle cx="13" cy="11" r="9" fill="#eb001b"></circle><circle cx="23" cy="11" r="9" fill="#f79e1b"></circle><path d="M18 3.6a9 9 0 0 1 0 14.8 9 9 0 0 1 0-14.8z" fill="#ff5f00"></path></svg><span class="clay-bin-mark-name">Mastercard</span>';
    }
    return "";
  }
  function paintBins() {
    if (!/\/panel\/kartlar\/yeni\/?$/.test(path())) return;
    var form = liveIssueForm();
    var root = document.getElementById("bin-sec") || (form && form.querySelector("#bin-sec"));
    if (root) root.classList.add("clay-bin-sec");
    var radios = form ? form.querySelectorAll('input[name="bin"]') : document.querySelectorAll('#bin-sec input[name="bin"], .mx-auto.min-h-screen input[name="bin"]');
    radios.forEach(function (inp) {
      if (!inp || inp.closest(".card-menu") || inp.closest(".boot-screen")) return;
      var label = inp.closest("label");
      if (!label || label.closest(".card-menu") || label.closest(".boot-screen")) return;
      label.classList.add("clay-bin-chip");
      if (inp.checked) label.classList.add("is-on");
      else label.classList.remove("is-on");
      var digits = binDigitsOf(inp, label);
      var scheme = binScheme(digits);
      label.classList.toggle("is-visa", scheme === "visa");
      label.classList.toggle("is-mc", scheme === "mastercard");
      var sig = digits + ":" + scheme;
      if (label.dataset.clayBin === sig && label.querySelector(".clay-bin-brand .clay-bin-mark")) return;
      label.dataset.clayBin = sig;
      var mark = label.querySelector(".clay-bin-brand");
      if (!mark) {
        var spans = label.querySelectorAll(":scope > span span");
        if (spans.length >= 3) mark = spans[spans.length - 1];
      }
      if (!mark) {
        var host = label.querySelector(":scope > span");
        if (host) {
          mark = document.createElement("span");
          host.appendChild(mark);
        }
      }
      if (!mark) return;
      mark.classList.add("clay-bin-brand");
      var html = binMarkHtml(scheme);
      if (html) mark.innerHTML = html;
    });
  }
  function paintTransferSplit() {
    if (!member() || !/\/panel\/kartlar\/?$/.test(path())) return;
    document.querySelectorAll("form.transfer-panel").forEach(function (form) {
      var input = form.querySelector('input[name="tutar"]');
      if (!input) return;
      var cents = parseUsdField(input.value);
      var pct = transferPct();
      var fee = cents ? cutUsd(cents, pct) : 0;
      var keep = cents ? cents - fee : 0;
      var sig = String(cents || 0) + ":" + pct + ":" + keep;
      if (form.dataset.clayXfer === sig) return;
      form.dataset.clayXfer = sig;
      var split = form.querySelector(".transfer-split");
      if (split && cents > 0) {
        var cells = split.querySelectorAll("span");
        if (cells[0]) cells[0].innerHTML = "<small>Çıkar</small>" + usdPrint(cents);
        if (cells[1]) cells[1].innerHTML = "<small>Komisyon</small>" + usdPrint(fee);
        if (cells[2]) cells[2].innerHTML = "<small>Yazılır</small>" + usdPrint(Math.max(0, keep));
      }
      var note = form.querySelector("p.text-xs");
      var peer = form.querySelector('select[name="hedef"]');
      if (note && cents > 0) {
        if (peer && peer.value) {
          note.textContent = "Karşı karta " + usdPrint(Math.max(0, keep)) + " yazılır. %" + pct + " komisyon " + usdPrint(fee) + ".";
        } else {
          note.textContent = "Ana hesaba " + usdPrint(Math.max(0, keep)) + " yazılır. %" + pct + " komisyon " + usdPrint(fee) + ".";
        }
      }
      var mark = form.querySelector(".text-gold");
      if (mark && /^\s*%/.test(mark.textContent || "")) mark.textContent = "%" + pct;
    });
  }
  function fillAllTransfer(form) {
    var input = form.querySelector('input[name="tutar"]');
    if (!input) return;
    var cardId = form.querySelector('input[name="id"]') && form.querySelector('input[name="id"]').value;
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var card = db && (db.cards || []).find(function (c) { return c && c.id === cardId; });
    var usable = card ? Math.max(0, (Number(card.limit) || 0) - (Number(card.spent) || 0)) : 0;
    var text = allRemainingAfterFee(usable, transferPct());
    if (!text) return;
    var proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    if (proto && proto.set) proto.set.call(input, text);
    else input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    paintTransferSplit();
  }

  function slipStatus(status) {
    return {
      tamamlandi: "Tamamlandı",
      beklemede: "Beklemede",
      reddedildi: "Reddedildi",
      iptal: "İptal",
      hazirlaniyor: "Hazırlanıyor"
    }[status] || status || "";
  }
  function slipMoney(cents) {
    var n = (Number(cents) || 0) / 100;
    return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD";
  }
  function slipCardName(tx, data) {
    if (!tx || !tx.cardId) return "Cüzdan";
    var card = data && (data.cards || []).find(function (item) { return item && item.id === tx.cardId; });
    if (!card) return "Kart";
    return card.label || cardTypeName(card.type) || "Kart";
  }
  function paintReceipts() {
    if (!member() || !/\/panel\/islemler\/?$/.test(path())) return;
    var box = document.querySelector(".mx-auto.min-h-screen .clay-receipts, .mt-6 .clay-receipts, .clay-receipts");
    if (!box) {
      var native = document.querySelector(".mx-auto.min-h-screen .mt-6") || document.querySelector(".mt-6");
      if (native && native.querySelector("article, table, .order-slip, li")) {
        native.classList.add("clay-receipts");
        box = native;
      }
    }
    if (!box) return;
    box.classList.add("clay-receipts-sheet");
    var h2 = box.querySelector("h2");
    if (h2) h2.classList.add("clay-receipts-title");
    var note = box.querySelector("[data-i18n=notInvoice]");
    if (!note) {
      var paras = box.querySelectorAll(":scope > p");
      for (var i = 0; i < paras.length; i++) {
        if ((paras[i].textContent || "").indexOf("Yasal fatura") !== -1) note = paras[i];
      }
    }
    if (note) note.classList.add("clay-receipts-note");
    var data = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var txs = data && data.transactions ? data.transactions : [];
    box.querySelectorAll(".clay-ticket-row").forEach(function (row) {
      if (row.dataset.claySlip === "1" && row.querySelector(".clay-slip-main")) return;
      var btn = row.querySelector("[data-act=pdf]");
      var txId = btn ? btn.getAttribute("data-tx") : "";
      var tx = null;
      for (var n = 0; n < txs.length; n++) if (txs[n] && txs[n].id === txId) tx = txs[n];
      var dump = "";
      var first = row.firstElementChild;
      if (first && first.tagName === "SPAN") dump = String(first.textContent || "");
      var title = tx ? (tx.title || tx.kind || "İşlem") : "";
      var amount = tx ? slipMoney(tx.amount || 0) : "";
      var cardName = tx ? slipCardName(tx, data) : "";
      var status = tx ? (tx.status || "") : "";
      if (!tx && dump) {
        var parts = dump.split(" · ");
        title = parts[0] || "";
        amount = parts[1] || "";
        var rawId = parts[2] || "";
        status = parts[3] || "";
        if (!rawId || rawId === "cuzdan") cardName = "Cüzdan";
        else if (/^crd_/.test(rawId)) {
          var found = data && (data.cards || []).find(function (c) { return c && c.id === rawId; });
          cardName = (found && (found.label || cardTypeName(found.type))) || "Kart";
        } else cardName = rawId;
      }
      var tone = status === "tamamlandi" ? "ok" : (status === "reddedildi" || status === "iptal" ? "bad" : "wait");
      var debit = tx ? Number(tx.amount || 0) < 0 : /^-/.test(amount);
      row.dataset.claySlip = "1";
      row.classList.add("clay-slip");
      var pdf = btn || null;
      row.innerHTML = '<div class="clay-slip-main"><div class="clay-slip-top"><p class="clay-slip-title"></p><p class="clay-slip-amt' + (debit ? " is-out" : " is-in") + '"></p></div><div class="clay-slip-meta"><span class="clay-slip-card"></span><span class="clay-slip-pill is-' + tone + '"></span></div></div>';
      row.querySelector(".clay-slip-title").textContent = title;
      row.querySelector(".clay-slip-amt").textContent = amount;
      row.querySelector(".clay-slip-card").textContent = cardName;
      row.querySelector(".clay-slip-pill").textContent = slipStatus(status);
      if (pdf) {
        pdf.classList.add("clay-slip-pdf");
        row.appendChild(pdf);
      }
    });
  }
  function tick() {
    document.body.classList.toggle("clay-desk", admin());
    document.body.classList.toggle("clay-panel", member());
    if (admin() && liveDeskPath()) paintDesk(deskThreads);
    else if (!liveDeskPath()) document.querySelectorAll(".clay-desk-live").forEach(function (n) { n.remove(); });
    orderDesk();
    pinCanliNav();
    pinAyarlar();
    arrangeAdminNav();
    mountUyeList();
    mountUyeDetail();
    hideOriginalDupes();
    document.body.classList.toggle("clay-issue", /\/panel\/kartlar\/yeni\/?$/.test(path()));
    tidyCards();
    stripLegacyReset();
    refineMarks();
    girisTrust();
    mountHesap();
    paintMemberTelegram();
    paintVisitor(null);
    paintPlan();
    paintIssue();
    paintFeeSheet();
    paintBins();
    paintTransferSplit();
    styleLimitBtns();
    hideSecurityQuestion();
    polishOrtaklik();
    paintReceipts();
    if (window.__clayNoticeQuery) window.__clayNoticeQuery();
    else if (/e-paket|e-plan/.test(location.search)) showQuotaNotice();
    showTransferFlash();
    paintCurrency();
    rbacNav();
    mountCharts();
    mountTelegramAdmin();
    mountBinPattern();
    mountCaptcha();
    mountAutoFill();
    mountAdminSeed();
    wrapClayCall();
    if (window.__clayOps) window.__clayOps();
    document.querySelectorAll(".clay-live-btn ~ .clay-live-btn, .clay-site-foot [data-act=live-open]").forEach(function (node) { node.remove(); });
  }
  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      tick();
    });
  }
  function boot() {
    if (document.documentElement) {
      new MutationObserver(function (muts) {
        if (document.querySelector(".clay-lux-appmenu[open]")) return;
        for (var i = 0; i < muts.length; i++) {
          var t = muts[i].target;
          if (t && t.nodeType !== 1) t = t.parentElement;
          if (t && t.closest && t.closest(".clay-coupon-admin, .clay-desk-live, .clay-lux-appmenu, .clay-lux-notes")) return;
        }
        if (!document.querySelector(".clay-live-btn")) visitorShell();
        schedule();
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
    tick();
    geoBoot();
    pulseLoop();
    refreshDesk();
    refreshVisitor();
    setInterval(function () {
      refreshVisitor();
      refreshDesk();
    }, 8000);
  }
  function start() {
    if (window.__clayAfterHydrate) window.__clayAfterHydrate(boot);
    else boot();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
