(function () {
  if (window.__CLAY_LUXURY) return;
  window.__CLAY_LUXURY = true;

  var ICO = {
    ozet: "M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z",
    kart: "M3 7.2A2.2 2.2 0 0 1 5.2 5h13.6A2.2 2.2 0 0 1 21 7.2v9.6A2.2 2.2 0 0 1 18.8 19H5.2A2.2 2.2 0 0 1 3 16.8V7.2zm1.7 2.4h14.6V8.1H4.7z",
    siparis: "M8 3.5h8l.8 2.2H7.2zm-1.2 2.2h14.4v14H6.8zM9 10h6M9 13.5h6",
    odeme: "M4 8h16v10H4zm3-3h4v3H7zm6 0h4v3h-4zM7 12h4v4H7z",
    cuzdan: "M4 7h16v11H4zm11 4.2h3.2v2.4H15z",
    destek: "M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v6A3.5 3.5 0 0 1 15.5 16H10l-4 3v-3A3.5 3.5 0 0 1 5 12.5z",
    yukselt: "M12 4.2 14.2 9H19l-4 3.2L16.4 17 12 14.2 7.6 17 9 12.2 5 9h4.8z",
    hesap: "M12 4.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6zM5.2 19.5a6.8 6.8 0 0 1 13.6 0",
    ortak: "M8.2 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.8 19.2a4.4 4.4 0 0 1 8.8 0m7.6 0a4.4 4.4 0 0 1 8.8 0"
  };
  var UI = {
    menu: ["Menü", "Menu", "Меню"],
    panel: ["Panel", "Panel", "Панель"],
    yonetim: ["Yönetim", "Admin", "Админ"],
    ozet: ["Özet", "Overview", "Обзор"],
    kartlar: ["Kartlarım", "My cards", "Мои карты"],
    siparis: ["Siparişler", "Orders", "Заказы"],
    odeme: ["Ödemeler", "Payments", "Платежи"],
    yukle: ["Para Yatır/Çek", "Deposit/Withdraw", "Ввод/вывод"],
    destek: ["Destek", "Support", "Поддержка"],
    yukselt: ["Planı yükselt", "Upgrade plan", "Повысить план"],
    buy: ["Paket Satın Al", "Buy a plan", "Купить пакет"],
    ortak: ["Ortaklık", "Affiliate", "Партнёрка"],
    oturum: ["Aktif Oturum", "Active session", "Активный сеанс"],
    ayar: ["Ayarlar", "Account Settings", "Настройки"],
    cikis: ["Çıkış", "Log Out", "Выход"],
    bakiye: ["Bakiye", "Balance", "Баланс"],
    anon: ["Anonim Mod Aktif:", "Fully safe and anonymous", "Анонимный режим:"]
  };
  var PLAN_FACE = {
    kivilcim: { name: "Clay Duo", metal: "BRONZE", art: "/clay-duo-mark.webp", cards: 2, issue: "Basım 750 TL · $15,14", price: "$49" },
    atolye: { name: "Clay Multi", metal: "SILVER", art: "/clay-multi-mark.webp", cards: 8, issue: "Basım 750 TL · $15,14", price: "$149" },
    galeri: { name: "Clay Prime", metal: "GOLD", art: "/clay-prime-mark.webp", cards: 25, issue: "Basım 750 TL · $15,14", price: "$399" }
  };
  var PLAN_NAME_FIX = {
    "clay gold": "Clay Prime",
    "clay bronze": "Clay Duo",
    "clay silver": "Clay Multi",
    "obsidian bronze": "Clay Duo",
    "solaris gold": "Clay Prime"
  };

  function loc() {
    try {
      var stored = localStorage.getItem("clay-lang") || "";
      if (stored === "en" || stored === "tr") return stored;
      if (stored === "ru") return "en";
    } catch (e) {}
    var html = document.documentElement.lang || "tr";
    return html === "en" ? "en" : "tr";
  }
  function L(key) {
    var row = UI[key];
    if (!row) return key;
    var g = loc();
    return g === "en" ? row[1] : row[0];
  }
  function path() {
    return location.pathname.replace(/\/index\.html$/, "/") || "/";
  }
  function member() { return /^\/panel(\/|$)/.test(path()); }
  function admin() { return /^\/clayadm!nxx(\/|$)/.test(path()); }
  function norm(href) {
    try {
      var u = new URL(href, location.origin);
      return (u.pathname.replace(/\/+$/, "") || "/") + (u.search || "") + (u.hash || "");
    } catch (e) {
      return href || "";
    }
  }
  function textOf(el) {
    return (el && el.textContent || "").replace(/\s+/g, " ").trim();
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
  function deskRole() {
    var me = viewer();
    var role = me && me.adminRole ? me.adminRole : "tam";
    if (role === "tam" || role === "siparis" || role === "ucret" || role === "bakiye" || role === "destek" || role === "izle") return role;
    return "tam";
  }
  function svgIcon(kind) {
    var d = ICO[kind] || ICO.ozet;
    return '<svg class="clay-lux-ico" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="' + d + '"/></svg>';
  }
  function binBrand(raw) {
    var s = String(raw || "").replace(/\D/g, "");
    if (!s) return "";
    if (s.charAt(0) === "4") return "Visa";
    var n2 = parseInt(s.slice(0, 2), 10);
    var n4 = parseInt(s.slice(0, 4), 10);
    if ((n2 >= 51 && n2 <= 55) || (n4 >= 2221 && n4 <= 2720)) return "Mastercard";
    return "";
  }

  function paintLogo(header) {
    var link = header.querySelector('a.flex.items-center') || header.querySelector('a[href="/"], a[href^="/clayadm"]');
    if (!link) return;
    if (!link.querySelector(".clay-lux-c")) {
      var mark = document.createElement("span");
      mark.className = "clay-lux-c";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "CLAY";
      link.insertBefore(mark, link.firstChild);
    }
  }

  function paintLang(header) {
    header.querySelectorAll(".lang-btn").forEach(function (btn) {
      if (btn.classList.contains("clay-cur-btn")) return;
      document.querySelectorAll(".lang-option").forEach(function (opt) {
        if (/Рус|Russian|Rusça|\bRU\b/i.test(opt.textContent || "")) {
          opt.hidden = true;
          if (opt.parentElement) opt.parentElement.hidden = true;
        }
      });
      var tags = btn.querySelectorAll(".clay-lux-lang-tag");
      var tag = tags[0];
      if (!tag) {
        tag = document.createElement("span");
        tag.className = "clay-lux-lang-tag";
        var chev = btn.querySelector(".lang-chevron");
        if (chev) btn.insertBefore(tag, chev);
        else btn.appendChild(tag);
      }
      tags.forEach(function (el, i) { if (i > 0) el.remove(); });
      var lang = loc();
      tag.textContent = lang === "en" ? "EN" : "TR";
      btn.childNodes.forEach(function (n) {
        if (n.nodeType === 3) n.textContent = "";
      });
      btn.querySelectorAll(":scope > span, :scope > strong").forEach(function (sp) {
        if (sp === tag || sp.classList.contains("lang-flag") || sp.classList.contains("lang-chevron")) return;
        if (sp.classList.contains("clay-lux-lang-tag") && sp !== tag) { sp.remove(); return; }
        if (/^(TR|EN|RU)$/i.test(String(sp.textContent || "").replace(/\s+/g, "").trim())) sp.setAttribute("hidden", "");
      });
    });
  }

  function paintBalance(header) {
    if (!member() && !document.body.classList.contains("clay-panel")) return;
    var yukle = [];
    header.querySelectorAll('a[href="/panel/yukle"], a[href="/panel/yukle/"]').forEach(function (a) {
      if (a.closest("nav, .clay-lux-appmenu, .clay-lux-user")) return;
      yukle.push(a);
    });
    var bal = null;
    var extras = [];
    yukle.forEach(function (a) {
      var t = textOf(a);
      var asBal = a.classList.contains("clay-lux-bal") || (/(\$|₺|usd|try)/i.test(t) && /\d/.test(t));
      var asDep = a.classList.contains("clay-lux-deposit") || /deposit|withdraw|yatır|çek|para yatır/i.test(t);
      if (asDep && !asBal) extras.push(a);
      else if (!bal && (asBal || !asDep)) bal = a;
      else extras.push(a);
    });
    if (bal) {
      bal.classList.add("clay-lux-bal");
      bal.classList.remove("clay-lux-deposit");
    }
    extras.forEach(function (a) {
      a.classList.add("clay-lux-deposit");
      a.classList.remove("clay-lux-bal");
    });
    var host = header.querySelector(".clay-lux-actions .flex.max-w-full") || header.querySelector(".clay-lux-actions");
    if (!host || host.querySelector("a.clay-lux-deposit-copy")) return;
    var copy = document.createElement("a");
    copy.className = "clay-lux-deposit clay-lux-deposit-copy";
    copy.textContent = L("yukle");
    copy.setAttribute("href", "/panel/yukle/");
    var plan = host.querySelector("button.plan-menu, a.clay-lux-buy");
    if (plan) host.insertBefore(copy, plan);
    else host.appendChild(copy);
  }

  function panelFile(path) {
    var p = String(path || "").replace(/\/+$/, "");
    if (p === "/panel/yukle" || p === "/panel/yukselt") return p + "/";
    return path;
  }

  function nativePanelLink(path, skip) {
    if (/\?|#/.test(String(path || ""))) return null;
    var want = String(path || "").replace(/\/+$/, "");
    var nodes = document.querySelectorAll("header nav a[href], header a.nav-pill[href], a.nav-pill[href]");
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (a === skip) continue;
      if (a.classList.contains("clay-lux-deposit") || a.classList.contains("clay-lux-bal") || a.classList.contains("clay-lux-buy") || a.classList.contains("clay-lux-appmenu-link")) continue;
      var h = (a.getAttribute("href") || "").split("?")[0].replace(/\/+$/, "");
      if (h === want) return a;
    }
    return null;
  }

  function goPath(path, fromEl) {
    var dest = panelFile(path);
    var native = nativePanelLink(path, fromEl);
    if (native) {
      try { native.click(); } catch (e) {}
      window.setTimeout(function () {
        var now = (location.pathname || "").replace(/\/+$/, "");
        var want = String(path || "").replace(/\/+$/, "");
        if (now !== want) {
          try { window.location.assign(dest); } catch (e2) {}
        }
      }, 60);
      return;
    }
    try {
      if ((location.pathname || "").replace(/\/+$/, "") === String(path || "").replace(/\/+$/, "")) return;
      window.location.assign(dest);
    } catch (e) {}
  }

  function bindNativePanel(el, path) {
    if (!el || !path) return;
    var dest = panelFile(path);
    if (el.tagName === "A") {
      el.setAttribute("href", dest);
      el.setAttribute("role", "link");
      return;
    }
    if (el.dataset.luxNav === dest) return;
    el.dataset.luxNav = dest;
    el.addEventListener("click", function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button) return;
      ev.preventDefault();
      try { window.location.assign(dest); } catch (e) {}
    });
  }

  function bindLiveNav(el, path) {
    bindNativePanel(el, path);
  }

  function memberPaid() {
    var me = viewer();
    if (!me) return false;
    if (me.role === "yonetici") return true;
    if ((me.planStatus || "aktif") === "iptal") return false;
    if (!me.plan) return false;
    return me.planPaid === true;
  }

  function memberPlanId() {
    var me = viewer();
    var id = me && me.plan;
    if (!memberPaid()) return "";
    return PLAN_FACE[id] ? id : "";
  }

  function canonPlanName(raw, fallback) {
    var s = String(raw || "").replace(/\s+/g, " ").trim();
    if (!s) return fallback;
    var hit = PLAN_NAME_FIX[s.toLowerCase()];
    if (hit) return hit;
    if (/^clay (duo|multi|prime)$/i.test(s)) return "Clay " + s.split(" ")[1].charAt(0).toUpperCase() + s.split(" ")[1].slice(1).toLowerCase();
    return fallback;
  }

  function planFace(id) {
    var base = PLAN_FACE[id] || PLAN_FACE.kivilcim;
    var cards = base.cards;
    try {
      var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
      var row = db && db.settings && db.settings.plans && db.settings.plans[id];
      if (row && row.cardLimit) cards = Number(row.cardLimit) || cards;
    } catch (e) {}
    return { name: base.name, metal: base.metal, art: base.art, cards: cards, issue: base.issue, price: base.price };
  }

  function paintPlanBadge(header) {
    if (admin()) {
      header.querySelectorAll("a.clay-lux-buy").forEach(function (n) { n.remove(); });
      return;
    }
    header.querySelectorAll("a.clay-lux-plan, button.clay-lux-plan:not(.plan-menu)").forEach(function (n) { n.remove(); });
    var btn = header.querySelector("button.plan-menu");
    var host = (btn && btn.parentNode) ||
      header.querySelector(".clay-lux-actions .flex.max-w-full") ||
      header.querySelector(".clay-lux-actions");
    if (!memberPaid()) {
      if (btn) {
        btn.setAttribute("hidden", "");
        btn.classList.add("clay-lux-plan-hid");
        btn.classList.remove("clay-lux-plan");
      }
      if (!host) return;
      var buy = header.querySelector("a.clay-lux-buy");
      if (!buy) buy = document.createElement("a");
      buy.className = "clay-lux-buy";
      buy.textContent = L("buy");
      buy.setAttribute("href", "/panel/yukselt/");
      bindNativePanel(buy, "/panel/yukselt/");
      var dep = header.querySelector("a.clay-lux-deposit");
      if (dep && dep.parentNode === host) host.insertBefore(buy, dep.nextSibling);
      else if (btn) host.insertBefore(buy, btn);
      else if (buy.parentNode !== host) host.appendChild(buy);
      return;
    }
    header.querySelectorAll("a.clay-lux-buy").forEach(function (n) { n.remove(); });
    if (!btn) return;
    btn.removeAttribute("hidden");
    btn.classList.remove("clay-lux-plan-hid");
    btn.classList.add("clay-lux-plan");
    var extras = header.querySelectorAll("button.plan-menu");
    extras.forEach(function (el, i) { if (i > 0) el.remove(); });
    var id = memberPlanId();
    if (!id) return;
    var face = planFace(id);
    var sig = id + "|" + face.name + "|" + face.art;
    if (btn.dataset.luxPlan === sig && btn.querySelector(".clay-lux-plan-thumb")) return;
    btn.dataset.luxPlan = sig;
    btn.innerHTML = '<img class="clay-lux-plan-thumb" width="22" height="22" alt=""><span class="clay-lux-plan-lab"></span>';
    btn.querySelector(".clay-lux-plan-thumb").src = face.art;
    btn.querySelector(".clay-lux-plan-thumb").alt = "";
    btn.querySelector(".clay-lux-plan-lab").textContent = face.name;
    btn.setAttribute("aria-label", face.name);
    btn.classList.remove("plan-menu-bronze", "plan-menu-silver", "plan-menu-gold");
    btn.classList.add("plan-menu-" + (id === "galeri" ? "gold" : id === "atolye" ? "silver" : "bronze"));
  }

  function unwrap(el) {
    if (!el || !el.parentNode) return;
    while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
    el.remove();
  }

  function isPinnedOverlay(el) {
    if (!el || el.nodeType !== 1 || !el.classList) return false;
    return el.classList.contains("clay-coupon-admin") || el.classList.contains("clay-desk-live") || el.id === "clay-coupon-admin" || el.id === "canli-destek";
  }

  function pinDeskBlocks() {
    document.querySelectorAll("main.boot-screen .clay-coupon-admin, main.boot-screen .clay-desk-live").forEach(function (n) {
      n.remove();
    });
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var header = host.querySelector(":scope > header") || host.querySelector("header.glass") || host.querySelector("header");
    if (!header || header.tagName !== "HEADER") return;
    header.querySelectorAll(".clay-coupon-admin, .clay-desk-live").forEach(function (n) {
      if (n.parentNode !== host) host.insertBefore(n, header.nextSibling);
    });
    var live = null;
    var coupon = null;
    host.querySelectorAll(":scope > .clay-desk-live, :scope > .clay-coupon-admin").forEach(function (n) {
      if (n.classList.contains("clay-desk-live") && !live) live = n;
      else if (n.classList.contains("clay-coupon-admin") && !coupon) coupon = n;
      else if (n !== live && n !== coupon) n.remove();
    });
    if (!live) live = document.querySelector(".clay-desk-live");
    if (!coupon) coupon = document.querySelector(".clay-coupon-admin");
    if (live && live.closest("main.boot-screen")) {
      live.remove();
      live = null;
    }
    if (coupon && coupon.closest("main.boot-screen")) {
      coupon.remove();
      coupon = document.querySelector(".clay-coupon-admin");
    }
    if (live) {
      live.setAttribute("data-clay-pin", "live");
      if (live.parentNode !== host || live.previousElementSibling !== header) host.insertBefore(live, header.nextSibling);
    }
    if (coupon) {
      coupon.setAttribute("data-clay-pin", "coupon");
      coupon.classList.add("clay-coupon-admin");
      var after = (live && live.parentNode === host) ? live : header;
      if (coupon.parentNode !== host || coupon.previousElementSibling !== after) host.insertBefore(coupon, after.nextSibling);
    }
  }

  function wrapHeader(header) {
    if (!header || header.tagName !== "HEADER") return;
    pinDeskBlocks();
    var parent = header.parentNode;
    if (parent && parent.classList && parent.classList.contains("clay-lux-stage") && parent !== header) {
      var stageParent = parent.parentNode;
      while (parent.firstChild) stageParent.insertBefore(parent.firstChild, parent);
      parent.remove();
      pinDeskBlocks();
    }
    header.classList.remove("clay-lux-stage");
    header.querySelectorAll(".clay-lux-nav-wrap").forEach(unwrap);
    header.querySelectorAll("nav .clay-lux-chip").forEach(unwrap);
    if (document.querySelector(".clay-lux-user[open], .clay-lux-appmenu[open]")) return;
    if (header.querySelector(".clay-lux-lead") && header.querySelector(".clay-lux-actions")) {
      pinDeskBlocks();
      return;
    }
    var bar = header.querySelector(":scope > div.flex.flex-wrap.items-center.justify-between") || header.querySelector(":scope > div.flex");
    if (!bar) return;
    var lead = bar.querySelector(":scope > .clay-lux-lead");
    if (!lead) {
      lead = document.createElement("div");
      lead.className = "clay-lux-lead";
      bar.insertBefore(lead, bar.firstChild);
    }
    var logo = header.querySelector("a.flex.items-center");
    if (logo && logo.parentNode !== lead && !isPinnedOverlay(logo)) lead.appendChild(logo);
    var chrome = header.querySelector(".chrome-pair");
    if (chrome && chrome.parentNode !== lead && !isPinnedOverlay(chrome)) lead.appendChild(chrome);

    var actions = bar.querySelector(":scope > .clay-lux-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "clay-lux-actions";
      bar.appendChild(actions);
    }
    Array.prototype.slice.call(bar.childNodes).forEach(function (node) {
      if (node === lead || node === actions) return;
      if (node.nodeType === 1 && isPinnedOverlay(node)) return;
      if (node.nodeType === 1 || (node.nodeType === 3 && String(node.textContent || "").trim())) {
        actions.appendChild(node);
      }
    });
    pinDeskBlocks();
  }

  function navKind(href, label) {
    var h = String(href || "");
    var t = String(label || "").toLowerCase();
    if (/sekme=ortaklik|ortak|affiliate/.test(h + t)) return "ortak";
    if (/sekme=guvenlik|oturum|session/.test(h + t)) return "hesap";
    if (/\/kartlar|bin/.test(h) || /kart|card/.test(t)) return "kart";
    if (/siparis/.test(h) || /sipariş|siparis|order/.test(t)) return "siparis";
    if (/islemler|odeme/.test(h) || /ödeme|odeme|işlem|payment/.test(t)) return "odeme";
    if (/yukle|ucret|cuzdan/.test(h) || /yatır|çek|bakiye|ücret|deposit|withdraw/.test(t)) return "cuzdan";
    if (/destek|canli/.test(h) || /destek|canlı|support/.test(t)) return "destek";
    if (/yukselt|planlar/.test(h) || /plan|yükselt|upgrade/.test(t)) return "yukselt";
    if (/hesap|kullanici|uyeler/.test(h) || /hesap|üye|account/.test(t)) return "hesap";
    return "ozet";
  }

  function canonHref(href) {
    try {
      var u = new URL(href, location.origin);
      return (u.pathname.replace(/\/+$/, "") || "/") + (u.search || "");
    } catch (e) {
      return String(href || "").split("#")[0];
    }
  }

  function hrefUiKey(href) {
    var c = canonHref(href);
    var p = c.split("?")[0];
    var q = c.split("?")[1] || "";
    if (/sekme=ortaklik/.test(q)) return "ortak";
    if (/sekme=guvenlik/.test(q)) return "oturum";
    if (p === "/panel" || p === "/clayadm!nxx") return "ozet";
    if (/\/kartlar/.test(p)) return "kartlar";
    if (/\/siparis/.test(p)) return "siparis";
    if (/\/islemler/.test(p)) return "odeme";
    if (/\/destek/.test(p)) return "destek";
    if (/\/yukselt|\/planlar/.test(p)) return "yukselt";
    return "";
  }

  function skipMenuHref(href) {
    var raw = String(href || "");
    var c = canonHref(raw);
    var p = c.split("?")[0];
    var q = c.split("?")[1] || "";
    if (/#ayarlar/i.test(raw)) return true;
    if (/sekme=ayar/i.test(q)) return true;
    if (member() && (p === "/panel/yukle" || p === "/panel/yukle/")) return true;
    if (member() && /\/yukselt/.test(p)) return true;
    if (member() && p === "/panel/hesap" && !q) return true;
    return false;
  }

  function skipMenuLabel(label) {
    var t = String(label || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (/^(ayarlar|account|account settings|hesap|настройки)$/.test(t)) return true;
    if (/para yatır|deposit\/withdraw|deposit \+|yatır\/çek|ввод\/вывод/.test(t)) return true;
    if (/planı yükselt|upgrade plan|clay gold|çıkış|cikis|log out|logout|выход/.test(t)) return true;
    return false;
  }

  function headerRightHrefs(header) {
    var map = {};
    var root = header.querySelector(".clay-lux-actions") || header;
    root.querySelectorAll("a[href]").forEach(function (a) {
      if (a.closest(".clay-lux-appmenu, nav, details.mt-4")) return;
      map[canonHref(a.getAttribute("href") || "")] = true;
    });
    if (header.querySelector("button.plan-menu:not(.clay-lux-plan-hid), .clay-lux-plan, a.clay-lux-buy")) {
      map[canonHref("/panel/yukselt")] = true;
      map[canonHref("/panel/yukselt/")] = true;
    }
    return map;
  }

  function defaultPanelLinks() {
    var here = (location.pathname || "").replace(/\/+$/, "") || "/";
    var desk = admin();
    var rows = desk
      ? [
          { href: "/clayadm!nxx/", key: "ozet", path: "/clayadm!nxx" },
          { href: "/clayadm!nxx/kartlar/", key: "kartlar", path: "/clayadm!nxx/kartlar" },
          { href: "/clayadm!nxx/uyeler/", key: "hesap", path: "/clayadm!nxx/uyeler" },
          { href: "/clayadm!nxx/islemler/", key: "odeme", path: "/clayadm!nxx/islemler" },
          { href: "/clayadm!nxx/destek/", key: "destek", path: "/clayadm!nxx/destek" },
          { href: "/clayadm!nxx/planlar/", key: "yukselt", path: "/clayadm!nxx/planlar" }
        ]
      : [
          { href: "/panel/", key: "ozet", path: "/panel" },
          { href: "/panel/kartlar/", key: "kartlar", path: "/panel/kartlar" },
          { href: "/panel/siparisler/", key: "siparis", path: "/panel/siparisler" },
          { href: "/panel/islemler/", key: "odeme", path: "/panel/islemler" },
          { href: "/panel/destek/", key: "destek", path: "/panel/destek" },
          { href: "/panel/hesap?sekme=ortaklik", key: "ortak", path: "/panel/hesap" }
        ];
    return rows.map(function (row) {
      var on = row.key === "ortak"
        ? /sekme=ortaklik/.test(location.search)
        : here === row.path;
      return { href: row.href, label: L(row.key), on: on };
    });
  }

  function collectNavLinks(header) {
    var seen = {};
    var out = [];
    var right = headerRightHrefs(header);
    function add(a) {
      if (!a || a.closest(".clay-lux-appmenu, .clay-lux-user, .clay-lux-drop, .clay-lux-actions")) return;
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return;
      if (skipMenuHref(href) || skipMenuLabel(textOf(a))) return;
      var key = canonHref(href);
      if (seen[key] || right[key]) return;
      seen[key] = true;
      var ui = hrefUiKey(href);
      out.push({
        href: href,
        label: ui ? L(ui) : textOf(a),
        on: a.classList.contains("nav-on") || a.getAttribute("aria-current") === "page"
      });
    }
    header.querySelectorAll("nav a[href]").forEach(add);
    header.querySelectorAll("details.mt-4 a[href]").forEach(add);
    defaultPanelLinks().forEach(function (row) {
      var key = canonHref(row.href);
      if (seen[key] || right[key]) return;
      if (skipMenuHref(row.href) || skipMenuLabel(row.label)) return;
      seen[key] = true;
      out.push(row);
    });
    return out;
  }

  function mountAppMenu(header) {
    var host = header.querySelector(".clay-lux-lead") || header.querySelector(".clay-lux-actions") || header;
    if (!host) return;
    var links = collectNavLinks(header);
    if (!links.length) return;
    var menu = header.querySelector(".clay-lux-appmenu");
    if (!menu) {
      menu = document.createElement("details");
      menu.className = "clay-lux-appmenu";
    }
    if (menu.parentNode !== host) {
      if (!(header.contains(menu))) host.appendChild(menu);
    }
    var wasOpen = menu.hasAttribute("open");
    var summary = menu.querySelector("summary");
    if (!summary) {
      summary = document.createElement("summary");
      summary.className = "clay-lux-appmenu-btn";
      summary.setAttribute("aria-label", L("menu"));
      summary.innerHTML = '<svg class="clay-lux-appmenu-bars" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4 6.2h16v1.8H4zm0 4.9h16v1.8H4zm0 4.9h16v1.8H4z"/></svg><span></span>';
      menu.insertBefore(summary, menu.firstChild);
    }
    if (!summary.dataset.luxBound) {
      summary.dataset.luxBound = "1";
      summary.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation();
        if (menu.hasAttribute("open")) menu.removeAttribute("open");
        else {
          var other = header.querySelector(".clay-lux-user[open]");
          if (other) other.removeAttribute("open");
          menu.setAttribute("open", "");
          placeAppMenu(menu);
        }
      }, true);
    }
    if (!menu.dataset.luxDocBound) {
      menu.dataset.luxDocBound = "1";
      document.addEventListener("pointerdown", function (ev) {
        if (!menu.hasAttribute("open")) return;
        if (menu.contains(ev.target)) return;
        menu.removeAttribute("open");
      }, true);
      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape" && menu.hasAttribute("open")) menu.removeAttribute("open");
      });
    }
    var panel = menu.querySelector(".clay-lux-appmenu-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "clay-lux-appmenu-panel";
      panel.setAttribute("role", "menu");
      menu.appendChild(panel);
    }
    var lab = summary.querySelector("span");
    if (lab) lab.textContent = L("menu");
    summary.setAttribute("aria-label", L("menu"));
    var sig = loc() + "~" + links.map(function (row) { return canonHref(row.href) + "|" + row.label + "|" + (row.on ? "1" : "0"); }).join("~");
    if (panel.dataset.sig !== sig) {
      panel.dataset.sig = sig;
      panel.innerHTML = "";
      var kicker = document.createElement("p");
      kicker.className = "clay-lux-appmenu-kicker";
      kicker.textContent = admin() ? L("yonetim") : L("panel");
      panel.appendChild(kicker);
      links.forEach(function (row) {
        var a = document.createElement("a");
        a.href = row.href;
        a.className = "clay-lux-appmenu-link" + (row.on ? " is-on" : "");
        a.setAttribute("role", "menuitem");
        a.innerHTML = svgIcon(navKind(row.href, row.label)) + "<span></span>";
        a.querySelector("span").textContent = row.label;
        panel.appendChild(a);
      });
    }
    if (wasOpen) menu.setAttribute("open", "");
    panel.querySelectorAll("a.clay-lux-appmenu-link").forEach(function (a) {
      bindNativePanel(a, a.getAttribute("href") || "");
    });
  }

  function paintUser(header) {
    var bar = header.querySelector(":scope > div.flex.flex-wrap.items-center.justify-between") || header.querySelector(":scope > div.flex");
    if (!bar) return;
    var tools = bar.querySelector(".clay-lux-actions .flex.max-w-full") ||
      bar.querySelector(".clay-lux-actions > div.flex") ||
      bar.querySelector(":scope > div.flex:not(.clay-lux-lead):not(.clay-lux-actions)") ||
      bar.querySelector("div.flex.max-w-full");
    var host = tools || bar.querySelector(".clay-lux-actions") || bar;
    var form = header.querySelector("form.clay-lux-logout-form") ||
      Array.prototype.find.call(header.querySelectorAll("form"), function (f) {
        return !f.closest(".clay-coupon-admin, .clay-desk-live, .clay-lux-notes") && !f.classList.contains("clay-coupon-create");
      });
    if (!form) return;
    var btn = form.querySelector("button");
    if (btn) {
      btn.classList.add("clay-lux-out");
      var lt = textOf(btn);
      if (/çıkış|cikis|log out|logout|выход|sign out/i.test(lt) || lt.length < 14) btn.textContent = L("cikis");
    }
    form.classList.add("clay-lux-logout-form");
    var menu = host.querySelector(":scope > .clay-lux-user");
    if (!menu) {
      menu = document.createElement("details");
      menu.className = "clay-lux-user";
      if (form.parentNode === host) host.insertBefore(menu, form);
      else host.appendChild(menu);
    }
    var summary = menu.querySelector("summary");
    if (!summary) {
      summary = document.createElement("summary");
      menu.insertBefore(summary, menu.firstChild);
    }
    if (!summary.dataset.luxBound) {
      summary.dataset.luxBound = "1";
      summary.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (menu.hasAttribute("open")) menu.removeAttribute("open");
        else menu.setAttribute("open", "");
      });
    }
    if (!menu.dataset.luxDocBound) {
      menu.dataset.luxDocBound = "1";
      document.addEventListener("click", function (ev) {
        if (!menu.hasAttribute("open")) return;
        if (menu.contains(ev.target)) return;
        menu.removeAttribute("open");
      });
      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape" && menu.hasAttribute("open")) menu.removeAttribute("open");
      });
    }
    var name = "";
    host.querySelectorAll(":scope > span").forEach(function (sp) {
      if (sp.classList.contains("rounded-full")) return;
      var tx = textOf(sp);
      if (tx && tx.length < 40) {
        name = tx;
        sp.classList.add("clay-lux-name-hid");
      }
    });
    if (!name) name = (viewer() && (viewer().username || viewer().name)) || "Hesap";
    if (summary.childNodes.length !== 1 || summary.textContent !== name) summary.textContent = name;
    var drop = menu.querySelector(".clay-lux-drop");
    if (!drop) {
      drop = document.createElement("div");
      drop.className = "clay-lux-drop";
      menu.appendChild(drop);
    }
    var settings = drop.querySelector("[data-clay-lux-settings]");
    if (!settings) {
      settings = document.createElement("a");
      settings.setAttribute("data-clay-lux-settings", "1");
      settings.textContent = L("ayar");
      drop.appendChild(settings);
    }
    settings.textContent = L("ayar");
    settings.href = admin() ? "/clayadm!nxx/hesap/" : "/panel/hesap/#ayarlar";
    if (form.parentNode !== drop) drop.appendChild(form);
  }

  function decorateLink(a, label, kind) {
    if (!a.querySelector(".clay-lux-ico")) {
      a.insertAdjacentHTML("afterbegin", svgIcon(kind));
    }
    var ico = a.querySelector(".clay-lux-ico");
    var emoji = a.querySelector(".nav-emoji");
    var parts = [];
    a.childNodes.forEach(function (n) {
      if (n === ico || n === emoji) return;
      if (n.nodeType === 3) parts.push(n);
    });
    if (parts.length) parts[0].textContent = label;
    else if (!a.querySelector(".clay-lux-lab")) {
      var span = document.createElement("span");
      span.className = "clay-lux-lab";
      span.textContent = label;
      a.appendChild(span);
    } else a.querySelector(".clay-lux-lab").textContent = label;
  }

  function paintMemberNav(header) {
    var nav = header.querySelector("nav.mt-4") || header.querySelector("nav");
    if (nav) nav.classList.remove("glass-nav");
    header.querySelectorAll("[data-clay-lux-ortak], [data-clay-ayarlar]").forEach(function (n) { n.remove(); });
  }

  function paintAdminNav(header) {
    if (!admin()) return;
    header.querySelectorAll("nav").forEach(function (nav) { nav.classList.remove("glass-nav"); });
    header.querySelectorAll("nav a.nav-pill").forEach(function (a) {
      if (!a.querySelector(".clay-lux-ico")) {
        var href = a.getAttribute("href") || "";
        var kind = "ozet";
        if (/kartlar/.test(href)) kind = "kart";
        else if (/uyeler|kullanici/.test(href)) kind = "hesap";
        else if (/islemler/.test(href)) kind = "odeme";
        else if (/destek|canli/.test(href)) kind = "destek";
        else if (/yukle|ucret/.test(href)) kind = "cuzdan";
        else if (/planlar/.test(href)) kind = "yukselt";
        else if (/bin/.test(href)) kind = "kart";
        a.insertAdjacentHTML("afterbegin", svgIcon(kind));
      }
    });
  }

  function paintTrust() {
    var bar = document.querySelector(".clay-lux-safety");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "clay-lux-safety";
      bar.setAttribute("role", "status");
      document.body.insertBefore(bar, document.body.firstChild);
    }
    var safeLang = loc();
    if (bar.dataset.luxSafe !== safeLang) {
      bar.dataset.luxSafe = safeLang;
      var safeCopy = safeLang === "en"
        ? ["Fully safe and anonymous", "NO KYC", "NO LOG"]
        : ["Tamamen güvenli ve anonim", "KYC YOK", "LOG YOK"];
      bar.innerHTML = '<span class="clay-lux-safety-ico" aria-hidden="true"></span><strong></strong><span></span><span class="clay-lux-safety-hot"></span>';
      var bits = bar.querySelectorAll("strong, span:not(.clay-lux-safety-ico)");
      bits[0].textContent = safeCopy[0];
      bits[1].textContent = safeCopy[1];
      bits[2].textContent = safeCopy[2];
    }
    document.querySelectorAll(".trust-line").forEach(function (el) {
      el.classList.add("clay-lux-trust-hid");
    });
  }

  function cardTypeOf(card) {
    var title = textOf(card.querySelector(".vcard-title"));
    var kick = textOf(card.querySelector(".vcard-kicker"));
    var blob = (title + " " + kick + " " + (card.getAttribute("aria-label") || "")).toLowerCase();
    var bg = String(card.getAttribute("style") || "");
    if (/facebook/.test(blob) || /1877f2/.test(bg)) return "facebook_ads";
    if (/tiktok/.test(blob) || /fe2c55|25f4ee/.test(bg)) return "tiktok";
    if (/google/.test(blob) || /4285f4/.test(bg)) return "google_ads";
    if (/tek kullan|burner|çekim|cekim/.test(blob)) return "burner";
    if (/ultima/.test(blob)) return "ultima";
    return "ultima";
  }

  function cardMarkSvg(type) {
    if (type === "facebook_ads") {
      return '<svg class="vcard-mark-sq" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#fff"/><path fill="#1877F2" d="M26.4 36.5v-8.4h2.8l.5-3.2h-3.3v-2c0-1 .3-1.6 1.7-1.6h1.8v-2.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H19v3.2h3.9v8.4h3.5z"/></svg>';
    }
    if (type === "tiktok") {
      var d = "M21.2 11.2h3.4c.5 2.3 2 4 4.3 4.6v3.5c-1.6-.1-3-.6-4.3-1.5v8.4c0 3.5-2.7 6.2-6.4 6.2s-6.4-2.8-6.4-6.3 2.8-6.3 6.4-6.3c.4 0 .8 0 1.2.1v3.7c-.4-.2-.8-.3-1.2-.3-1.6 0-2.8 1.2-2.8 2.8s1.2 2.8 2.8 2.8 2.8-1.2 2.8-2.8V11.2z";
      return '<svg class="vcard-mark-sq" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#111"/><path d="' + d + '" fill="#25F4EE" transform="translate(-1.5 1.1)"/><path d="' + d + '" fill="#FE2C55" transform="translate(1.5 -1.1)"/><path d="' + d + '" fill="#fff"/></svg>';
    }
    if (type === "google_ads") {
      return '<svg class="vcard-mark-sq" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#fff"/><circle cx="17" cy="17" r="5.4" fill="#4285F4"/><circle cx="31" cy="17" r="5.4" fill="#EA4335"/><circle cx="17" cy="31" r="5.4" fill="#FBBC05"/><circle cx="31" cy="31" r="5.4" fill="#34A853"/></svg>';
    }
    return '<svg class="vcard-mark-sq" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#16120c"/><path d="M24 8.5 38.5 18.2 34.2 38H13.8L9.5 18.2 24 8.5z" fill="#c8923e"/><path d="M24 8.5 38.5 18.2 24 21.5 9.5 18.2z" fill="#ffe7b0"/><path d="M24 21.5 38.5 18.2 34.2 38 24 33.2z" fill="#8d5e22" opacity=".55"/><path d="M24 14.2 31.2 18.8 24 28.8 16.8 18.8z" fill="#fff4d4" opacity=".85"/></svg>';
  }

  function cardStatusOf(card) {
    var id = (card.closest("[id^='crd_']") || card).id || "";
    var row = null;
    try {
      var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
      if (db && db.cards && id) {
        for (var i = 0; i < db.cards.length; i++) if (db.cards[i] && db.cards[i].id === id) row = db.cards[i];
      }
    } catch (e) {}
    var st = row && row.status ? row.status : "";
    if (!st) {
      if (card.querySelector(".vcard-veil-frost, .vcard-seal-donduruldu")) st = "donduruldu";
      else if (card.querySelector(".vcard-veil-shut, .vcard-seal-kapali")) st = "kapali";
      else if (card.querySelector(".vcard-seal-hazirlaniyor")) st = "hazirlaniyor";
      else st = "aktif";
    }
    var en = loc() === "en";
    var labels = en
      ? { aktif: "Active", donduruldu: "Frozen", kapali: "Closed", hazirlaniyor: "Preparing" }
      : { aktif: "Aktif", donduruldu: "Donduruldu", kapali: "Kapalı", hazirlaniyor: "Hazırlanıyor" };
    return { id: st, label: labels[st] || st };
  }

  function paintCards() {
    document.querySelectorAll("article.vcard, .card-face .vcard").forEach(function (card) {
      var top = card.querySelector(".vcard-top");
      if (!top) return;
      var mark = top.querySelector("svg.vcard-mark-sq");
      if (!mark || mark.getBoundingClientRect().width < 8) {
        if (mark) mark.remove();
        top.insertAdjacentHTML("afterbegin", cardMarkSvg(cardTypeOf(card)));
      }
      var st = cardStatusOf(card);
      var chip = top.querySelector(".clay-lux-card-st");
      if (!chip) {
        chip = document.createElement("span");
        chip.className = "clay-lux-card-st";
        var idBox = top.querySelector(".vcard-id") || top;
        idBox.appendChild(chip);
      }
      chip.className = "clay-lux-card-st is-" + st.id;
      chip.textContent = st.label;
    });
    document.querySelectorAll('a[href="/panel/yukselt"], a[href="/panel/yukselt/"]').forEach(function (a) {
      bindNativePanel(a, "/panel/yukselt/");
    });
    document.querySelectorAll('a[href="/panel/yukle"], a[href="/panel/yukle/"]').forEach(function (a) {
      if (a.classList.contains("clay-lux-deposit") || a.classList.contains("clay-lux-bal")) bindNativePanel(a, "/panel/yukle/");
    });
  }

  function paintPlanBox() {
    document.querySelectorAll(".plan-menu-left").forEach(function (box) {
      box.classList.add("clay-lux-planbox");
      var link = box.querySelector('a[href*="yukselt"]');
      if (!memberPaid()) {
        box.classList.add("is-unpaid");
        var title = box.querySelector(".font-display");
        if (title) title.textContent = L("buy");
        if (link) {
          link.textContent = L("buy");
          bindNativePanel(link, "/panel/yukselt/");
        }
        return;
      }
      box.classList.remove("is-unpaid");
      if (link) bindNativePanel(link, "/panel/yukselt/");
    });
  }

  function soonDays() {
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var me = viewer();
    var best = null;
    var cards = db && db.cards ? db.cards : [];
    cards.forEach(function (card) {
      if (!card || !card.expiresAt || card.status === "kapali") return;
      if (me && card.userId && card.userId !== me.id) return;
      var days = Math.ceil((Date.parse(card.expiresAt) - Date.now()) / 86400000);
      if (days > 14) return;
      if (best === null || days < best) best = days;
    });
    return best;
  }

  function paintExpiryOffer() {
    var note = document.querySelector(".clay-expiry-note");
    var offer = document.querySelector(".clay-renew-offer");
    if (!note) {
      if (offer) offer.remove();
      return;
    }
    note.classList.add("clay-renew-hidden");
    if (offer && offer.parentNode === note.parentNode) {
      if (offer.nextElementSibling !== note) note.parentNode.insertBefore(offer, note);
      return;
    }
    if (offer) offer.remove();
    var en = loc() === "en";
    var days = soonDays();
    var kicker = document.createElement("span");
    kicker.className = "clay-renew-kicker";
    kicker.textContent = days === null ? (en ? "TERM" : "SÜRE") : days + (en ? " DAYS" : " GÜN");
    var title = document.createElement("strong");
    title.textContent = en ? "Don't let the card close." : "Kartın kapanmasın.";
    var sub = document.createElement("span");
    sub.textContent = en ? "Renew it and the card stays yours." : "Yenile, kartın sende kalsın.";
    var copy = document.createElement("span");
    copy.className = "clay-renew-copy";
    copy.appendChild(kicker);
    copy.appendChild(title);
    copy.appendChild(sub);
    var metal = document.createElement("img");
    metal.className = "clay-renew-metal";
    metal.src = "/clay-yenile-kucuk.gif";
    metal.alt = "";
    metal.width = 72;
    metal.height = 96;
    var go = document.createElement("button");
    go.type = "button";
    go.className = "clay-renew-go";
    go.setAttribute("data-renew-go", "1");
    go.textContent = en ? "Renew card" : "Kartı yenile";
    go.addEventListener("click", function () {
      var target = document.querySelector("[data-act=extend]");
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("clay-renew-target");
    });
    offer = document.createElement("div");
    offer.className = "clay-renew-offer";
    offer.appendChild(metal);
    offer.appendChild(copy);
    offer.appendChild(go);
    note.parentNode.insertBefore(offer, note);
  }

  function playChime() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      var ctx = playChime.ctx || (playChime.ctx = new Ctx());
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(784, now);
      osc.frequency.exponentialRampToValueAtTime(1174, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (err) {}
  }

  function chimeNewNotes() {
    try {
      var unread = noticeList().filter(function (n) { return n && !n.readAt; }).length;
      var key = "clay-note-n";
      var prev = sessionStorage.getItem(key);
      sessionStorage.setItem(key, String(unread));
      if (prev === null) return;
      if (unread > Number(prev)) playChime();
    } catch (err) {}
  }

  function noticeList() {
    var me = viewer();
    var uid = me && me.id;
    var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
    var rows = db && db.notices ? db.notices : [];
    return rows.filter(function (n) { return n && (!uid || n.userId === uid); }).slice().reverse();
  }

  function renderNotes(panel) {
    var list = panel.querySelector(".clay-lux-notes-list");
    if (!list) return;
    var rows = noticeList();
    if (!rows.length) {
      list.innerHTML = '<li class="clay-lux-notes-empty">Henüz bildirim yok.</li>';
      return;
    }
    list.innerHTML = rows.map(function (n) {
      return '<li class="' + (n.readAt ? "is-read" : "is-new") + '"><strong></strong><p></p></li>';
    }).join("");
    Array.prototype.forEach.call(list.children, function (li, i) {
      var n = rows[i];
      li.querySelector("strong").textContent = n.title || "Bildirim";
      li.querySelector("p").textContent = n.body || "";
    });
  }

  function paintBell(header) {
    if (!header) return;
    var bell = header.querySelector("a.bell, button.bell");
    if (!bell) return;
    var host = bell.parentNode;
    if (host && !host.classList.contains("clay-lux-bellwrap")) {
      var wrap = document.createElement("div");
      wrap.className = "clay-lux-bellwrap";
      host.insertBefore(wrap, bell);
      wrap.appendChild(bell);
      host = wrap;
    }
    var panel = host.querySelector(".clay-lux-notes");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "clay-lux-notes";
      panel.hidden = true;
      panel.innerHTML = '<div class="clay-lux-notes-head"><strong>Bildirimler</strong><button type="button" class="clay-lux-notes-x" aria-label="Kapat">×</button></div><div class="clay-lux-notes-tools"><button type="button" data-notes-read>Tümünü okundu say</button><button type="button" data-notes-clear>Tümünü sil</button></div><ul class="clay-lux-notes-list"></ul>';
      host.appendChild(panel);
    }
    if (bell.dataset.luxBell === "1") {
      if (!panel.hidden) renderNotes(panel);
      return;
    }
    bell.dataset.luxBell = "1";
    bell.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var open = panel.hidden;
      panel.hidden = !open;
      if (!panel.hidden) {
        renderNotes(panel);
        placeNotes(bell, panel);
      }
    }, true);
    panel.querySelector(".clay-lux-notes-x").addEventListener("click", function (ev) {
      ev.preventDefault();
      panel.hidden = true;
    });
    panel.querySelector("[data-notes-read]").addEventListener("click", function (ev) {
      ev.preventDefault();
      if (window.__clay && window.__clay.call) window.__clay.call("notice-read-all", {}).then(function () { renderNotes(panel); });
      else renderNotes(panel);
    });
    panel.querySelector("[data-notes-clear]").addEventListener("click", function (ev) {
      ev.preventDefault();
      if (window.__clay && window.__clay.call) window.__clay.call("notice-clear", {}).then(function () { renderNotes(panel); });
      else {
        var list = panel.querySelector(".clay-lux-notes-list");
        if (list) list.innerHTML = '<li class="clay-lux-notes-empty">Henüz bildirim yok.</li>';
      }
    });
    document.addEventListener("click", function (ev) {
      if (panel.hidden) return;
      if (host.contains(ev.target)) return;
      panel.hidden = true;
    });
  }

  function paintBins() {
    if (!/\/panel\/kartlar\/yeni\/?$/.test(path())) return;
    var radios = document.querySelectorAll('.mx-auto.min-h-screen input[name="bin"], #bin-sec input[name="bin"], form input[name="bin"]');
    if (!radios.length) return;
    var fieldset = document.getElementById("bin-sec") || radios[0].closest("fieldset") || radios[0].closest(".grid");
    if (fieldset && fieldset.classList) fieldset.classList.add("clay-bin-box");
    radios.forEach(function (inp) {
      if (inp.closest(".boot-screen") || inp.closest(".card-menu")) return;
      var label = inp.closest("label");
      if (!label) return;
      label.classList.add("clay-bin-chip");
      label.classList.toggle("is-on", !!inp.checked);
      if (label.querySelector(".clay-bin-brand .clay-bin-mark")) return;
      var digits = String(inp.value || "") + " " + textOf(label);
      var brand = binBrand(digits);
      if (!brand) return;
      var mark = label.querySelector(".clay-bin-brand");
      if (mark && /kart işareti|card mark/i.test(textOf(mark))) mark.textContent = brand;
    });
  }

  function paintTamTwins() {
    if (!admin()) {
      document.body.classList.remove("clay-lux-tam");
      return;
    }
    var overlay = document.querySelector(".clay-uye-detail");
    var tam = deskRole() === "tam";
    document.body.classList.toggle("clay-lux-tam", !!(tam && overlay));
    if (!overlay) return;
    if (tam) {
      ["kartlar", "bakiye"].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.hidden = false;
        el.removeAttribute("hidden");
        el.classList.remove("clay-uye-native-hid");
        el.style.removeProperty("display");
      });
    }
  }

  function moneyMinor(n) {
    var v = Math.round(Number(n) || 0);
    var sign = v < 0 ? "-" : "";
    return sign + "$" + (Math.abs(v) / 100).toFixed(2);
  }

  function paintAutoTopup() {
    var box = document.querySelector(".clay-autofill");
    if (!box) return;
    var shell = box.querySelector(":scope > .clay-lux-topup");
    if (!shell) {
      shell = document.createElement("div");
      shell.className = "clay-lux-topup";
      while (box.firstChild) shell.appendChild(box.firstChild);
      box.appendChild(shell);
    }
    if (!shell.querySelector(".clay-lux-topup-head")) {
      var head = document.createElement("div");
      head.className = "clay-lux-topup-head";
      var titles = document.createElement("div");
      var h = document.createElement("p");
      h.className = "clay-lux-topup-title";
      h.textContent = loc() === "en" ? "Automatic top-up" : "Otomatik bakiye yükleme";
      var sub = document.createElement("p");
      sub.className = "clay-lux-topup-sub";
      sub.textContent = loc() === "en" ? "Refill the card when the balance is low." : "Bakiye düşünce karta yükler.";
      titles.appendChild(h);
      titles.appendChild(sub);
      var tools = document.createElement("div");
      tools.className = "clay-lux-topup-tools";
      var sw = shell.querySelector("[data-act=autofill]");
      if (sw && !sw.closest(".clay-lux-topup-switch")) {
        var swWrap = document.createElement("span");
        swWrap.className = "clay-lux-topup-switch";
        sw.parentNode.insertBefore(swWrap, sw);
        swWrap.appendChild(sw);
        var tag = document.createElement("span");
        tag.className = "clay-lux-topup-onoff";
        tag.setAttribute("aria-hidden", "true");
        swWrap.appendChild(tag);
        tools.appendChild(swWrap);
      }
      var gear = document.createElement("button");
      gear.type = "button";
      gear.className = "clay-lux-topup-gear";
      gear.setAttribute("aria-label", "Yükleme ayarları");
      gear.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M10.2 2.5h3.6l.4 2.2a7.2 7.2 0 0 1 1.9.8l2.1-1 1.8 1.8-1 2.1c.3.6.6 1.2.8 1.9l2.2.4v3.6l-2.2.4a7.2 7.2 0 0 1-.8 1.9l1 2.1-1.8 1.8-2.1-1a7.2 7.2 0 0 1-1.9.8l-.4 2.2h-3.6l-.4-2.2a7.2 7.2 0 0 1-1.9-.8l-2.1 1-1.8-1.8 1-2.1a7.2 7.2 0 0 1-.8-1.9l-2.2-.4V9.3l2.2-.4c.2-.7.5-1.3.8-1.9l-1-2.1 1.8-1.8 2.1 1c.6-.3 1.2-.6 1.9-.8zM12 9.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2z"/></svg>';
      tools.appendChild(gear);
      head.appendChild(titles);
      head.appendChild(tools);
      shell.insertBefore(head, shell.firstChild);

      var grid = document.createElement("div");
      grid.className = "clay-lux-topup-grid";
      var left = document.createElement("div");
      left.className = "clay-lux-topup-src";
      left.innerHTML = '<span class="clay-lux-src-card" aria-hidden="true"></span><span class="clay-lux-src-arrow" aria-hidden="true">↓</span>';
      var mid = document.createElement("div");
      mid.className = "clay-lux-topup-mid";
      var copy = shell.querySelector(".clay-autofill-copy") || shell.querySelector(".clay-autofill-label span") || shell.querySelector("label.clay-autofill-label");
      if (copy) mid.appendChild(copy);
      var badge = document.createElement("p");
      badge.className = "clay-lux-topup-badge";
      badge.textContent = "Aktif: Bakiye %100 Yüklendi";
      mid.appendChild(badge);
      var off = shell.querySelector(".clay-autofill-off");
      if (off) mid.appendChild(off);
      var msg = shell.querySelector(".clay-autofill-msg");
      if (msg) mid.appendChild(msg);
      var hist = document.createElement("div");
      hist.className = "clay-lux-topup-hist";
      hist.innerHTML = '<p class="clay-lux-topup-hist-kicker">Yükleme geçmişi</p><table><thead><tr><th>Kart</th><th>Tutar</th><th>Durum</th></tr></thead><tbody></tbody></table>';
      mid.appendChild(hist);
      var right = document.createElement("div");
      right.className = "clay-lux-topup-dst";
      right.innerHTML = '<span class="clay-lux-dst-card" aria-hidden="true"><i></i><b>CLAY</b></span>';
      grid.appendChild(left);
      grid.appendChild(mid);
      grid.appendChild(right);
      shell.appendChild(grid);

      var modal = document.createElement("div");
      modal.className = "clay-lux-topup-modal";
      modal.hidden = true;
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-label", "Otomatik yükleme ayarları");
      modal.innerHTML = '<div class="clay-lux-topup-sheet"><p class="clay-lux-topup-sheet-title">Yükleme ayarları</p><label>Yükleme limiti (USD)<input type="number" min="1" step="0.01" inputmode="decimal" class="clay-lux-topup-limit"></label><label>Tetikleme bakiyesi (USD)<input type="number" min="1" step="0.01" inputmode="decimal" class="clay-lux-topup-trigger"></label><div class="clay-lux-topup-sheet-actions"><button type="button" class="clay-lux-topup-save">Kaydet</button><button type="button" class="clay-lux-topup-close">Kapat</button></div></div>';
      shell.appendChild(modal);
      gear.addEventListener("click", function (ev) {
        ev.preventDefault();
        modal.hidden = false;
      });
      modal.querySelector(".clay-lux-topup-close").addEventListener("click", function (ev) {
        ev.preventDefault();
        modal.hidden = true;
      });
      modal.querySelector(".clay-lux-topup-save").addEventListener("click", function (ev) {
        ev.preventDefault();
        var swNow = shell.querySelector("[data-act=autofill]");
        var on = swNow && (swNow.matches("input") ? swNow.checked : swNow.getAttribute("aria-checked") !== "false");
        var lim = modal.querySelector(".clay-lux-topup-limit").value;
        var trig = modal.querySelector(".clay-lux-topup-trigger").value;
        if (!(window.__clay && window.__clay.call)) {
          modal.hidden = true;
          return;
        }
        var saveBtn = modal.querySelector(".clay-lux-topup-save");
        saveBtn.disabled = true;
        window.__clay.call("oto-ayar", { acik: on ? "1" : "0", limit: lim, tetik: trig }).then(function (res) {
          saveBtn.disabled = false;
          var msgNow = shell.querySelector(".clay-autofill-msg");
          if (res && (res.code === "acik" || res.code === "kapali")) {
            modal.hidden = true;
            if (res.limit) modal.querySelector(".clay-lux-topup-limit").value = (Number(res.limit) / 100).toFixed(2);
            if (res.trigger) modal.querySelector(".clay-lux-topup-trigger").value = (Number(res.trigger) / 100).toFixed(2);
            if (msgNow) msgNow.textContent = "Yükleme ayarları kaydedildi.";
            return;
          }
          if (msgNow) msgNow.textContent = (res && res.message) || "Ayar kaydedilemedi. Tekrar dene.";
        }, function () {
          saveBtn.disabled = false;
        });
      });
    }
    var swState = shell.querySelector("[data-act=autofill]");
    var on = swState && (swState.matches("input") ? swState.checked : swState.getAttribute("aria-checked") !== "false");
    var tagEl = shell.querySelector(".clay-lux-topup-onoff");
    if (tagEl) tagEl.textContent = on ? "AÇIK" : "KAPALI";
    var badgeEl = shell.querySelector(".clay-lux-topup-badge");
    if (badgeEl) badgeEl.hidden = !on;
    var tbody = shell.querySelector(".clay-lux-topup-hist tbody");
    if (tbody && tbody.childElementCount === 0) {
      var rows = [];
      var me = viewer();
      var db = window.__clay && window.__clay.get ? window.__clay.get() : null;
      if (db && me && Array.isArray(db.transactions)) {
        db.transactions.forEach(function (tx) {
          if (!tx || tx.userId !== me.id) return;
          var title = String(tx.title || "");
          var ref = String(tx.ref || "");
          if (!/otomatik doldurma/i.test(title) && ref.indexOf("oto:") !== 0) return;
          rows.push(tx);
        });
      }
      if (!rows.length) {
        var msgEl = shell.querySelector(".clay-autofill-msg");
        var fallback = textOf(msgEl);
        if (fallback) {
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>Kart</td><td></td><td></td>";
          tr.cells[1].textContent = fallback;
          tr.cells[2].textContent = "Durum";
          tbody.appendChild(tr);
        } else {
          var empty = document.createElement("tr");
          empty.innerHTML = "<td colspan=\"3\">Kayıt yok</td>";
          tbody.appendChild(empty);
        }
      } else {
        rows.slice(-6).reverse().forEach(function (tx) {
          var tr = document.createElement("tr");
          var td1 = document.createElement("td");
          td1.textContent = tx.title || "Otomatik doldurma";
          var td2 = document.createElement("td");
          td2.textContent = moneyMinor(tx.usdMinor || tx.amount || 0);
          var td3 = document.createElement("td");
          td3.textContent = tx.status || "tamamlandi";
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tbody.appendChild(tr);
        });
      }
    }
    if (window.__clay && window.__clay.call && box.dataset.luxOto !== "1") {
      box.dataset.luxOto = "1";
      window.__clay.call("oto-durum", {}).then(function (res) {
        var lim = shell.querySelector(".clay-lux-topup-limit");
        var trig = shell.querySelector(".clay-lux-topup-trigger");
        if (lim && res && res.limit) lim.value = (Number(res.limit) / 100).toFixed(2);
        if (trig && res && res.trigger) trig.value = (Number(res.trigger) / 100).toFixed(2);
        if (lim && !lim.value) lim.value = "50.00";
        if (trig && !trig.value) trig.value = "50.00";
      });
    }
  }

  function paintPlans() {
    document.querySelectorAll(".plan-set").forEach(function (set) {
      if (set.parentNode && set.parentNode.classList.contains("clay-lux-plans")) return;
      var wrap = document.createElement("div");
      wrap.className = "clay-lux-plans";
      set.parentNode.insertBefore(wrap, set);
      wrap.appendChild(set);
    });
    document.querySelectorAll(".plan-offer").forEach(function (card) {
      var inp = card.querySelector("input[name=plan]");
      var id = inp ? inp.value : (card.classList.contains("plan-offer-gold") ? "galeri" : card.classList.contains("plan-offer-silver") ? "atolye" : "kivilcim");
      var face = planFace(id);
      var art = card.querySelector(".plan-offer-art");
      if (art) {
        art.classList.add("clay-lux-plan-head");
        art.querySelectorAll("svg.plan-offer-svg").forEach(function (svg) { svg.setAttribute("hidden", ""); });
        art.querySelectorAll("img:not(.clay-lux-plan-mark)").forEach(function (n) { n.remove(); });
        var img = art.querySelector("img.clay-lux-plan-mark");
        if (!img) {
          img = document.createElement("img");
          img.className = "clay-lux-plan-mark";
          img.width = 56;
          img.height = 56;
          art.insertBefore(img, art.firstChild);
        }
        img.src = face.art;
        img.alt = "";
        var badge = art.querySelector(".plan-offer-badge");
        if (badge && badge.parentNode !== art) art.appendChild(badge);
      }
      var kicker = card.querySelector(".plan-offer-kicker");
      if (kicker) kicker.textContent = face.metal;
      var title = card.querySelector(".plan-offer-name");
      if (title) title.textContent = face.name;
      var price = card.querySelector(".plan-offer-price");
      if (price) {
        price.innerHTML = face.price + ' <span>USD / ay</span>';
      }
      var sub = card.querySelector(".plan-offer-sub");
      if (sub) {
        sub.textContent = "";
        sub.setAttribute("hidden", "");
      }
      var badge = card.querySelector(".plan-offer-badge");
      if (badge) badge.textContent = face.cards + " KART";
      var pills = card.querySelector(".plan-offer-pills");
      if (pills) {
        pills.innerHTML = "<li>" + face.issue + "</li><li>Yükleme 1 USD+ %4 ×1,13</li><li>30 gün 750 TL · Aktarım %13</li>";
      }
      card.querySelectorAll(".plan-offer-cta button, a.plan-offer-cta").forEach(function (cta) {
        cta.textContent = "Bu plana geç";
      });
      var remain = card.querySelector(".plan-offer-remain");
      var ctaBox = card.querySelector(".plan-offer-cta");
      if (remain) {
        var hold = remain.parentNode && remain.parentNode.classList.contains("clay-lux-plan-remain")
          ? remain.parentNode
          : null;
        if (!hold) {
          hold = document.createElement("span");
          hold.className = "clay-lux-plan-remain";
          remain.parentNode.insertBefore(hold, remain);
          hold.appendChild(remain);
        }
        if (ctaBox && hold.parentNode === ctaBox.parentNode) ctaBox.parentNode.insertBefore(hold, ctaBox);
      }
    });
  }

  function ensureLottie() {}

  function paintQuota() {
    var back = document.querySelector(".clay-quota-back");
    if (!back) return;
    ensureLottie();
    var box = back.querySelector(".clay-quota");
    if (!box) return;
    if (!box.parentNode.classList.contains("clay-lux-quota")) {
      var shell = document.createElement("div");
      shell.className = "clay-lux-quota";
      box.parentNode.insertBefore(shell, box);
      shell.appendChild(box);
    }
    if (!box.querySelector(".clay-lux-quota-lottie")) {
      var native = document.createElement("div");
      native.className = "clay-lux-quota-native";
      Array.prototype.slice.call(box.children).forEach(function (n) {
        if (n.classList && n.classList.contains("clay-quota-actions")) return;
        native.appendChild(n);
      });
      var art = document.createElement("div");
      art.className = "clay-lux-quota-lottie";
      art.textContent = "CLAY";
      var title = document.createElement("p");
      title.className = "clay-lux-quota-title";
      title.textContent = loc() === "en" ? "Card limit reached" : "Kart limitine ulaşıldı";
      var lead = document.createElement("p");
      lead.className = "clay-lux-quota-lead";
      lead.textContent = loc() === "en"
        ? "This plan has no open-card slots left. Buy a larger plan to issue more cards."
        : "Bu pakette açık kart hakkı kalmadı. Daha fazla kart için paketi yükselt.";
      var actions = box.querySelector(".clay-quota-actions");
      box.insertBefore(art, box.firstChild);
      box.insertBefore(title, art.nextSibling);
      box.insertBefore(lead, title.nextSibling);
      box.insertBefore(native, lead.nextSibling);
      if (actions) box.appendChild(actions);
      var go = box.querySelector(".clay-quota-actions a[href]");
      if (go) bindNativePanel(go, "/panel/yukselt/");
    }
  }

  function placeAppMenu(menu) {
    var panel = menu.querySelector(".clay-lux-appmenu-panel");
    var header = menu.closest("header");
    if (!panel || !header || window.innerWidth > 768) return;
    var bottom = header.getBoundingClientRect().bottom;
    panel.style.top = Math.round(bottom + 8) + "px";
  }

  function placeNotes(bell, panel) {
    var rect = bell.getBoundingClientRect();
    var width = Math.min(360, window.innerWidth - 16);
    panel.style.position = "fixed";
    panel.style.top = Math.round(rect.bottom + 8) + "px";
    panel.style.left = Math.round(Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8))) + "px";
    panel.style.right = "auto";
    panel.style.width = width + "px";
  }

  function fixOpeningFee() {
    var nodes = document.querySelectorAll("p, span, li");
    nodes.forEach(function (el) {
      if (el.childElementCount) return;
      var text = el.textContent || "";
      if (text.indexOf("$750.00") === -1 && text.indexOf("$750,00") === -1) return;
      if ((el.parentNode && el.parentNode.textContent || "").indexOf("750 TL") === -1) return;
      el.textContent = text.replace("$750.00", "$15.14").replace("$750,00", "$15,14");
    });
  }

  function centsOf(raw) {
    var a = String(raw || "").trim().replace(/\s/g, "").replace(",", ".");
    if (!/^\d+(\.\d{1,2})?$/.test(a)) return null;
    var parts = a.split(".");
    return 100 * Number(parts[0]) + Number((parts[1] || "").padEnd(2, "0"));
  }

  function guardSpend() {
    var me = viewer();
    if (!me) return;
    var bal = Number(me.balance) || 0;
    document.querySelectorAll("form").forEach(function (form) {
      var btn = form.querySelector("button[type='submit'], button.btn");
      if (!btn || !/çekim talebi|withdrawal request/i.test(btn.textContent || "")) return;
      var input = form.querySelector("input[name='tutar']");
      var cents = centsOf(input && input.value);
      var short = cents !== null && cents > bal;
      btn.disabled = short;
      var hint = form.querySelector(".money-hint");
      if (!hint) return;
      if (!short) {
        if (hint.dataset.clayShort) {
          hint.textContent = hint.dataset.clayShort;
          delete hint.dataset.clayShort;
        }
        return;
      }
      if (!hint.dataset.clayShort) hint.dataset.clayShort = hint.textContent;
      var max = (bal / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      hint.textContent = loc() === "en"
        ? "Insufficient balance. You can withdraw up to $" + max + "."
        : "Bakiye yetersiz. En fazla $" + max + " çekebilirsin.";
    });
    var blocked = false;
    var reason = "";
    document.querySelectorAll("p, span").forEach(function (el) {
      if (el.closest(".clay-issue-short")) return;
      if (!el.childElementCount && /için yetersiz|insufficient/i.test(el.textContent || "")) {
        blocked = true;
        if (!reason) reason = el.textContent.replace(/\s+/g, " ").trim();
      }
    });
    document.querySelectorAll("button").forEach(function (btn) {
      if (!/kartı oluştur|create the card|create card/i.test(btn.textContent || "")) return;
      btn.disabled = blocked;
      var note = btn.nextElementSibling && btn.nextElementSibling.classList.contains("clay-issue-short") ? btn.nextElementSibling : null;
      if (!blocked) {
        if (note) note.remove();
        return;
      }
      if (!note) {
        note = document.createElement("p");
        note.className = "banner-bad clay-issue-short";
        note.setAttribute("role", "status");
        btn.insertAdjacentElement("afterend", note);
      }
      var en = loc() === "en";
      var sig = reason + "|" + en;
      if (note.dataset.sig === sig) return;
      note.dataset.sig = sig;
      note.textContent = (reason || (en ? "Insufficient balance for this card." : "Bu kart için bakiye yetersiz.")) + " ";
      var link = document.createElement("a");
      link.href = "/panel/yukle/";
      link.className = "font-semibold underline";
      link.textContent = en ? "Top up balance" : "Bakiye yükle";
      note.appendChild(link);
    });
  }

  function translateBits() {
    if (loc() !== "en") return;
    var map = {
      "Tek Kullanımlık Kart": "Single-use card",
      "TEK KULLANIMLIK KART": "SINGLE-USE CARD",
      "Cüzdana kripto yüklemesinde kesinti yok. Tutar onaylanınca aynı ABD doları olarak yazılır. Karta aktarım ayrıdır: 1 USD + %4.": "Crypto deposits to the wallet have no fee. The approved amount is credited in the same US dollars. Moving money onto a card is separate: 1 USD + 4%.",
      "Onaydan sonra bu bakiye kart harcamasında kullanılır. Cüzdan yüklemesinde kesinti yoktur. Karta yüklemede 1 USD + %4 vardır.": "After confirmation this balance can be spent on cards. Wallet deposits have no fee. Loading a card costs 1 USD + 4%.",
      "Tutar ABD dolarıdır": "The amount is in US dollars",
      "Ödeme sayfasına git": "Go to the payment page",
      "Çekim talebi aç": "Open a withdrawal",
      "Henüz çekim talebi yok.": "No withdrawal requests yet.",
      "Kupon kodu": "Coupon code",
      "Para çek": "Withdraw",
      "İndirimli tutarı bakiyeye yaz": "Credit the discounted amount"
    };
    document.querySelectorAll("p, h1, h2, button, span, label, legend, a").forEach(function (el) {
      if (el.childElementCount > 2) return;
      var text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (map[text] && el.childElementCount === 0) el.textContent = map[text];
    });
  }

  function luxOn(name) {
    var skip = window.__luxSkip || "";
    return skip.indexOf(name + ",") === -1;
  }
  function paintChrome() {
    if (!document.body) return;
    document.body.classList.add("clay-lux");
    var header = document.querySelector(".mx-auto.min-h-screen > header, .desk-root > header, header.glass") || document.querySelector("main.auth-stage");
    if (header) {
      if (luxOn("logo")) paintLogo(header);
      if (luxOn("lang")) paintLang(header);
      if (member() || admin() || document.body.classList.contains("clay-panel") || document.body.classList.contains("clay-desk")) {
        if (header.tagName === "HEADER") {
          if (luxOn("pin")) pinDeskBlocks();
          if (luxOn("wrap")) wrapHeader(header);
        }
        if (luxOn("bal")) paintBalance(header);
        if (luxOn("user")) paintUser(header);
        if (luxOn("nav")) paintMemberNav(header);
        if (luxOn("adminnav")) paintAdminNav(header);
        if (luxOn("plan")) paintPlanBadge(header);
        if (header.tagName === "HEADER" && luxOn("menu")) mountAppMenu(header);
        if (luxOn("bell")) paintBell(header);
        if (luxOn("pin")) pinDeskBlocks();
      }
      if (luxOn("trust")) paintTrust();
    } else {
      if (luxOn("trust")) paintTrust();
    }
    if (luxOn("bins")) paintBins();
    if (luxOn("tam")) paintTamTwins();
    if (luxOn("topup")) paintAutoTopup();
    if (luxOn("plans")) paintPlans();
    if (luxOn("planbox")) paintPlanBox();
    if (luxOn("cards")) paintCards();
    if (luxOn("quota")) paintQuota();
    if (luxOn("sweep")) sweepPlanCopy();
    if (luxOn("fee")) fixOpeningFee();
    if (luxOn("guard")) guardSpend();
    if (luxOn("tr")) translateBits();
    if (luxOn("renew")) paintExpiryOffer();
    if (luxOn("bell")) chimeNewNotes();
  }

  function sweepPlanCopy() {
    var nodes = document.querySelectorAll(".plan-offer-name, .plan-offer-kicker, .clay-lux-plan-lab, button.plan-menu");
    nodes.forEach(function (el) {
      if (el.matches && el.matches("button.plan-menu")) {
        var lab = el.querySelector(".clay-lux-plan-lab");
        if (lab) {
          lab.textContent = canonPlanName(lab.textContent, lab.textContent);
          return;
        }
      }
      var next = canonPlanName(el.textContent, el.textContent);
      if (next && next !== el.textContent) el.textContent = next;
    });
  }

  window.__clayLuxury = paintChrome;
  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    window.setTimeout(function () {
      queued = false;
      try { paintChrome(); } catch (err) {}
    }, 280);
  }
  function boot() {
    schedule();
    if (document.documentElement) {
      new MutationObserver(function (muts) {
        if (document.querySelector(".clay-lux-appmenu[open], .clay-lux-user[open]")) return;
        var skipSel = ".clay-lux-user, .clay-lux-drop, .clay-lux-appmenu, .lang-menu, .lang-pop, .clay-lux-notes, .clay-lux-safety, .clay-coupon-admin, .clay-desk-live, .clay-lux-lead, .clay-lux-actions";
        for (var i = 0; i < muts.length; i++) {
          var t = muts[i].target;
          if (t && t.nodeType !== 1) t = t.parentElement;
          if (t && t.closest && t.closest(skipSel)) return;
          var nodes = muts[i].addedNodes;
          if (nodes) {
            for (var n = 0; n < nodes.length; n++) {
              var el = nodes[n];
              if (el && el.nodeType !== 1) el = el.parentElement;
              if (el && el.closest && el.closest(skipSel)) return;
            }
          }
        }
        schedule();
      }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["lang"] });
    }
    document.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest(".lang-option")) {
        window.setTimeout(schedule, 0);
        window.setTimeout(schedule, 80);
      }
    }, true);
    document.addEventListener("change", function (ev) {
      var t = ev.target;
      if (t && t.name === "bin") paintBins();
    }, true);
    new MutationObserver(function () {
      var note = document.querySelector(".clay-expiry-note");
      var offer = document.querySelector(".clay-renew-offer");
      if (!note && offer) offer.remove();
      else if (note && !offer) paintExpiryOffer();
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  function start() {
    if (window.__clayAfterHydrate) window.__clayAfterHydrate(boot);
    else boot();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
