(function () {
  if (window.__CLAY_OPS) return;
  window.__CLAY_OPS = true;
  function path() { return location.pathname.replace(/\/+$/, "") + "/"; }
  function admin() { return document.body && document.body.classList.contains("clay-desk"); }
  function member() { return document.body && document.body.classList.contains("clay-panel"); }
  function db() { return window.__clay && window.__clay.get ? window.__clay.get() : null; }
  function call(action, fields) {
    if (!(window.__clay && window.__clay.call)) return Promise.resolve(null);
    return window.__clay.call(action, fields);
  }
  function once(sel, cls) {
    var host = document.querySelector(sel);
    if (!host || host.querySelector("." + cls)) return null;
    var box = document.createElement("section");
    box.className = cls + " glass rounded-[28px] p-5";
    host.insertBefore(box, host.firstChild);
    return box;
  }
  function emptyStates() {
    if (!member()) return;
    var maps = [
      [/\/panel\/kartlar\/?$/, "article[id^='crd_']", "Henüz kartın yok. Yeni kart ile oluştur."],
      [/\/panel\/islemler\/?$/, "table tbody tr, .order-slip, li, .clay-ticket-row, .clay-slip", "Henüz işlem yok."],
      [/\/panel\/destek\/?$/, "article, .ticket, li", "Açık destek talebin yok."]
    ];
    maps.forEach(function (row) {
      if (!row[0].test(location.pathname)) return;
      var host = document.querySelector("main") || document.querySelector(".grid.gap-5");
      if (!host || host.querySelector(".clay-empty")) return;
      if (host.querySelector(row[1])) return;
      var p = document.createElement("p");
      p.className = "clay-empty";
      p.textContent = row[2];
      host.appendChild(p);
    });
  }
  function stripFxFromChrome() {
    document.querySelectorAll("header .clay-fx-line, .chrome-pair .clay-fx-line").forEach(function (node) {
      node.remove();
    });
    document.querySelectorAll("header p, .chrome-pair p").forEach(function (node) {
      var t = (node.textContent || "").replace(/\s+/g, " ");
      if (t.indexOf("Ağ/token") !== -1 || t.indexOf("zincir onayı") !== -1) node.remove();
    });
  }
  function mountReferral() {
    var data = db();
    if (!data) return;
    if (member() && /\/panel\/hesap\/?$/.test(location.pathname)) {
      if (document.querySelector(".clay-extra, .clay-ortaklik, form.clay-refer")) return;
      var sid = "";
      try {
        sid = sessionStorage.getItem("clay-session") || "";
        if (!sid && localStorage.getItem("clay-remember") === "1") sid = localStorage.getItem("clay-session") || "";
      } catch (e) {}
      var me = sid ? (data.users || []).find(function (u) { return u && u.id === sid; }) : null;
      if (!me) me = (data.users || []).find(function (u) { return u && u.role === "uye"; }) || (data.users || [])[0];
      if (!me || document.querySelector(".clay-ref-panel")) return;
      var host = document.querySelector(".grid.gap-5") || document.querySelector("main");
      if (!host) return;
      var box = document.createElement("section");
      box.className = "clay-ref-panel clay-ortaklik account-sheet";
      var rows = (me.commissions || []).map(function (c) {
        return "<li>" + (c.fromUsername || "") + " · " + (c.source || "") + " · " + ((c.usdMinor || 0) / 100).toFixed(2) + " USD</li>";
      }).join("") || "<li>Komisyon yok.</li>";
      box.innerHTML = "<p class=\"clay-ortak-kicker\">ORTAKLIK</p><h2>Kodun hazır</h2><p>Kod: <strong>" + (me.referralCode || "—") + "</strong></p><p>Toplam: " + ((me.commissionKurus || 0) / 100).toFixed(2) + " TL karşılığı</p><ul>" + rows + "</ul>";
      host.appendChild(box);
    }
    if (admin() && /\/uyeler\/?$/.test(location.pathname) && !document.querySelector(".clay-ref-admin")) {
      var host = document.querySelector("main") || document.querySelector(".grid.gap-5");
      if (!host) return;
      var box = document.createElement("section");
      box.className = "clay-ref-admin glass rounded-[28px] p-5";
      var lines = (data.users || []).filter(function (u) { return (u.commissions || []).length || u.commissionKurus; }).map(function (u) {
        return "<li>" + (u.username || "") + " · " + ((u.commissionKurus || 0) / 100).toFixed(2) + "</li>";
      }).join("") || "<li>Komisyon kaydı yok.</li>";
      box.innerHTML = "<h2>Ortaklık komisyonları</h2><ul>" + lines + "</ul>";
      host.appendChild(box);
    }
  }
  function mountCoupons() {
    if (!admin()) return;
    if (!/ucretler|kupon/.test(location.pathname + location.search)) return;
    if (document.querySelector(".clay-coupon-report")) return;
    var data = db();
    if (!data) return;
    var host = document.querySelector(".clay-coupon-admin") || document.querySelector("main");
    if (!host) return;
    var box = document.createElement("div");
    box.className = "clay-coupon-report";
    box.innerHTML = "<h3>Kupon kullanımı</h3><ul>" + (data.coupons || []).map(function (c) {
      return "<li>" + (c.code || "") + " · %" + (c.percent || 0) + (c.once ? " · tek" : "") + " · " + ((c.uses || []).length || 0) + " kullanım <label>Tek kullanımlık <input type=\"checkbox\" data-once=\"" + (c.code || "") + "\"" + (c.once ? " checked" : "") + "></label></li>";
    }).join("") + "</ul>";
    host.appendChild(box);
    box.addEventListener("change", function (event) {
      var inp = event.target.closest("[data-once]");
      if (!inp) return;
      call("kupon-tek", { kod: inp.getAttribute("data-once"), once: inp.checked ? "1" : "0" });
    });
  }
  function mountQueue() {
    if (!admin() || !/^\/clayadm!nxx\/?$/.test(location.pathname)) return;
    if (document.querySelector(".clay-pay-stuck")) return;
    var data = db();
    if (!data || !data.settings) return;
    var host = document.querySelector("main") || document.querySelector(".grid.gap-5");
    if (!host) return;
    var box = document.createElement("section");
    box.className = "clay-pay-stuck glass rounded-[28px] p-5";
    var stuck = data.settings.payQueue || [];
    box.innerHTML = "<h2>Ödeme takılı</h2><ul>" + (stuck.length ? stuck.map(function (row) {
      return "<li>" + (row.orderId || "") + " · " + (row.reason || "") + " <button type=\"button\" class=\"btn btn-ghost\" data-retry=\"" + (row.orderId || "") + "\">Yeniden dene</button></li>";
    }).join("") : "<li>Takılı ödeme yok.</li>") + "</ul>";
    host.appendChild(box);
    box.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-retry]");
      if (!btn) return;
      call("admin-pay-retry", { orderId: btn.getAttribute("data-retry") });
    });
  }
  function mountOpsAdmin() {
    if (!admin() || !/\/hesap\/?$/.test(location.pathname)) return;
    if (document.querySelector(".clay-ops-admin")) return;
    var host = document.querySelector(".mx-auto.min-h-screen") || document.querySelector("main");
    if (!host) return;
    var data = db();
    var set = (data && data.settings) || {};
    var box = document.createElement("section");
    box.className = "clay-ops-admin glass rounded-[28px] p-5";
    box.innerHTML = '<h2>İşletme</h2><label>Bakım<input type="checkbox" name="bakim"' + (set.maintenance ? " checked" : "") + "></label><label>Duyuru başlık<input class=\"field\" name=\"duyuru-baslik\" value=\"" + (set.announcement && set.announcement.title || "") + "\"></label><label>Duyuru<input class=\"field\" name=\"duyuru-govde\" value=\"" + (set.announcement && set.announcement.body || "") + "\"></label><label>Yönetici boşta (sn)<input class=\"field\" name=\"idle\" value=\"" + (set.adminIdle || 900) + "\"></label><label>IP izin listesi (boş = hepsi)<textarea class=\"field\" name=\"ips\">" + (set.adminIps || "") + "</textarea></label><button type=\"button\" class=\"btn btn-gold\" data-ops-save>Kaydet</button><form method=\"post\" action=\"/api/clay-backup.php?op=yukle\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"onay\" value=\"on\"><input type=\"file\" name=\"defter\" accept=\"application/json\"><button class=\"btn btn-ghost\" type=\"submit\">Yedek yükle</button></form><p><a class=\"btn btn-ghost\" href=\"/api/clay-backup.php?op=indir\">Defteri indir</a></p><button type=\"button\" class=\"btn btn-ghost\" data-krip-sim>Sağlayıcı sim (timeout iade)</button>";
    host.appendChild(box);
    box.querySelector("[data-ops-save]").addEventListener("click", function () {
      call("admin-ops", {
        bakim: box.querySelector("[name=bakim]").checked ? "1" : "0",
        baslik: box.querySelector("[name=duyuru-baslik]").value,
        mesaj: box.querySelector("[name=duyuru-govde]").value,
        idle: box.querySelector("[name=idle]").value,
        ips: box.querySelector("[name=ips]").value
      });
    });
    box.querySelector("[data-krip-sim]").addEventListener("click", function () {
      call("admin-kripicard-sim", { kind: "timeout" });
    });
  }
  function mountRoleSelect() {
    if (!admin() || !/\/kullanici\/?$/.test(location.pathname)) return;
    if (document.querySelector(".clay-role-box")) return;
    var data = db();
    if (!data) return;
    var id = "";
    try { id = new URLSearchParams(location.search).get("id") || ""; } catch (e) {}
    var user = (data.users || []).find(function (u) { return u && u.id === id; });
    if (!user || user.role !== "yonetici") return;
    var host = document.querySelector(".clay-uye-detail") || document.querySelector("main");
    if (!host) return;
    var box = document.createElement("form");
    box.className = "clay-role-box";
    box.innerHTML = '<label>Rol<select name="rol"><option value="tam">tam</option><option value="siparis">siparis</option><option value="ucret">ucret</option><option value="bakiye">bakiye</option><option value="destek">destek</option><option value="izle">izle</option></select></label><button class="btn btn-gold" type="submit">Rolü yaz</button>';
    box.rol.value = user.adminRole || "tam";
    host.appendChild(box);
    box.addEventListener("submit", function (event) {
      event.preventDefault();
      call("admin-uye-rol", { uye: id, rol: box.rol.value });
    });
  }
  function mountAnnounce() {
    var data = db();
    var note = data && data.settings && data.settings.announcement;
    if (!note || !note.on || document.querySelector(".clay-announce-bar")) return;
    var bar = document.createElement("p");
    bar.className = "clay-announce-bar";
    bar.textContent = (note.title || "") + (note.body ? " — " + note.body : "");
    document.body.insertBefore(bar, document.body.firstChild);
  }
  function mountTopup() {
    stripFxFromChrome();
    if (!member() || !/\/panel\/yukle\/?$/.test(location.pathname)) return;
    if (document.querySelector("main .clay-fx-line, .mx-auto .clay-fx-line")) return;
    var data = db();
    var host = null;
    document.querySelectorAll("form").forEach(function (form) {
      if (host) return;
      if (form.closest("header") || form.closest(".chrome-pair")) return;
      host = form;
    });
    if (!host) host = document.querySelector("main .glass") || document.querySelector("main") || document.querySelector(".mx-auto.min-h-screen");
    if (!host || host.closest("header") || host.classList.contains("chrome-pair")) return;
    var p = document.createElement("p");
    p.className = "clay-fx-line";
    var fx = data && data.settings && (data.settings.fxTry || (data.settings.fx && data.settings.fx.rate)) ? (data.settings.fxTry || data.settings.fx.rate) : 49.527;
    p.textContent = "Ağ/token: USDT TRC20 · BTC · XMR. Kur: 1 USD ≈ " + fx + " TRY. Ödeme 1 zincir onayı sonrası yazılır.";
    if (host.tagName === "FORM") host.parentNode.insertBefore(p, host);
    else host.insertBefore(p, host.firstChild);
  }
  function styleAutofill() {
    if (!member()) return;
    var box = document.querySelector(".clay-autofill");
    if (!box) return;
    if (box.querySelector("[role=switch][data-act=autofill]")) {
      box.querySelectorAll("input[type=checkbox][data-act=autofill]").forEach(function (cb) { cb.remove(); });
    }
  }
  function labelCards() {
    document.querySelectorAll(".clay-sample-kicker").forEach(function (el) {
      if (el.closest(".clay-confirm, .clay-sample")) el.textContent = "ÖRNEK";
    });
  }
  function run() {
    stripFxFromChrome();
    emptyStates();
    mountReferral();
    mountCoupons();
    mountQueue();
    mountOpsAdmin();
    mountRoleSelect();
    mountAnnounce();
    mountTopup();
    labelCards();
    styleAutofill();
  }
  window.__clayOps = run;
})();
