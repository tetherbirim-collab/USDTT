(function () {
  if (window.__CLAY_LP_ADMIN) return;
  window.__CLAY_LP_ADMIN = true;

  var schema = null;
  var values = { tr: {}, en: {} };
  var drafts = { tr: null, en: null };
  var lang = "tr";
  var busy = false;

  function onPage() {
    return /^\/clayadm!nxx\/metinler\/?$/.test(location.pathname);
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function anchor() {
    var input = document.querySelector('form input[name="sloganKyc"]');
    return input && input.closest("form");
  }

  function load() {
    return fetch("/api/clay-lp.php", { credentials: "same-origin", cache: "no-store" })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        schema = data.fields || [];
        values = data.values || { tr: {}, en: {} };
        if (Array.isArray(values.tr)) values.tr = {};
        if (Array.isArray(values.en)) values.en = {};
      });
  }

  function say(box, text, bad) {
    var note = box.querySelector(".clay-lp-note");
    note.textContent = text;
    note.className = "clay-lp-note " + (bad ? "banner-bad" : "banner-ok");
    note.hidden = !text;
  }

  function effective(field, code) {
    var own = values[code] && values[code][field.key];
    return typeof own === "string" && own !== "" ? own : field[code];
  }

  function fill(box) {
    box.querySelectorAll("[data-lp-field]").forEach(function (input) {
      var field = schema.filter(function (f) { return f.key === input.getAttribute("data-lp-field"); })[0];
      if (!field) return;
      var draft = drafts[lang];
      input.value = draft && typeof draft[field.key] === "string" ? draft[field.key] : effective(field, lang);
      input.placeholder = field[lang];
      var mark = input.parentElement.querySelector(".clay-lp-own");
      if (mark) mark.hidden = !(values[lang] && values[lang][field.key]);
    });
    box.querySelectorAll("[data-lp-tab]").forEach(function (tab) {
      var on = tab.getAttribute("data-lp-tab") === lang;
      tab.classList.toggle("is-on", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function collect(box) {
    var out = {};
    box.querySelectorAll("[data-lp-field]").forEach(function (input) {
      out[input.getAttribute("data-lp-field")] = input.value;
    });
    return out;
  }

  function call(body) {
    body.action = "admin-lp";
    return fetch("/api/ledger.php", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "X-Clay": "1" },
      body: JSON.stringify(body)
    }).then(function (res) { return res.json(); });
  }

  function failText(res) {
    var code = res && res.code;
    if (code === "giris") return "Oturum kapandı. Tekrar giriş yap.";
    if (code === "e-yonetici" || code === "e-yetki") return "Bu işlem için yetkin yok.";
    if (res && res.message) return res.message;
    return "Kaydedilemedi. Tekrar dene.";
  }

  function save(box, reset) {
    if (busy) return;
    busy = true;
    var body = {};
    var saved = [];
    if (reset) body.reset = "on";
    else {
      drafts[lang] = collect(box);
      ["tr", "en"].forEach(function (code) {
        if (drafts[code]) {
          body[code] = drafts[code];
          saved.push(code === "tr" ? "Türkçe" : "İngilizce");
        }
      });
    }
    box.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
    call(body).then(function (res) {
      if (res && res.code === "metin") {
        drafts = { tr: null, en: null };
        return load().then(function () {
          fill(box);
          say(box, reset ? "Launchpad metinleri varsayılana döndü." : saved.join(" ve ") + " launchpad metinleri kaydedildi.", false);
        });
      }
      say(box, failText(res), true);
    }).catch(function () {
      say(box, "Bağlantı hatası. Tekrar dene.", true);
    }).then(function () {
      busy = false;
      box.querySelectorAll("button").forEach(function (b) { b.disabled = false; });
    });
  }

  function build() {
    var box = el("section", "clay-lp-admin glass");
    box.id = "launchpad-metinleri";
    box.setAttribute("data-clay-skip", "");
    box.setAttribute("translate", "no");
    var head = el("div", "clay-lp-head");
    var titles = el("div");
    titles.appendChild(el("p", "clay-lp-kicker", "LAUNCHPAD"));
    titles.appendChild(el("h2", "font-display", "Launchpad Metinleri"));
    titles.appendChild(el("p", "clay-lp-lede", "Ana sayfadaki (launchpad) tüm yazılar. Türkçe ve İngilizce ayrı kaydedilir. Boş bırakılan satır varsayılan metne döner. HTML yazılamaz; metin olduğu gibi gösterilir."));
    head.appendChild(titles);
    var open = el("a", "btn btn-ghost", "Launchpad'i aç");
    open.href = "/";
    open.target = "_blank";
    open.rel = "noopener";
    head.appendChild(open);
    box.appendChild(head);

    var tabs = el("div", "clay-lp-tabs");
    tabs.setAttribute("role", "tablist");
    [["tr", "Türkçe"], ["en", "English"]].forEach(function (row) {
      var tab = el("button", "clay-lp-tab", row[1]);
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-lp-tab", row[0]);
      tabs.appendChild(tab);
    });
    box.appendChild(tabs);

    var note = el("p", "clay-lp-note");
    note.setAttribute("role", "status");
    note.hidden = true;
    box.appendChild(note);

    var form = el("form", "clay-lp-form");
    form.noValidate = true;
    var groups = {};
    var order = [];
    schema.forEach(function (field) {
      if (!groups[field.group]) {
        groups[field.group] = [];
        order.push(field.group);
      }
      groups[field.group].push(field);
    });
    order.forEach(function (name, index) {
      var group = el("details", "clay-lp-group");
      if (index === 0) group.open = true;
      var summary = el("summary", "", name);
      summary.appendChild(el("span", "clay-lp-count", String(groups[name].length)));
      group.appendChild(summary);
      var grid = el("div", "clay-lp-grid");
      groups[name].forEach(function (field) {
        var label = el("label", "clay-lp-field" + (field.max > 100 ? " is-wide" : ""));
        var cap = el("span", "clay-lp-label", field.label);
        var own = el("em", "clay-lp-own", "düzenlendi");
        own.hidden = true;
        cap.appendChild(own);
        label.appendChild(cap);
        var input = field.max > 100 ? el("textarea", "field") : el("input", "field");
        if (input.tagName === "TEXTAREA") input.rows = 2;
        input.maxLength = field.max;
        input.name = "lp-" + field.key;
        input.setAttribute("data-lp-field", field.key);
        input.autocomplete = "off";
        input.spellcheck = true;
        label.appendChild(input);
        grid.appendChild(label);
      });
      group.appendChild(grid);
      form.appendChild(group);
    });
    var acts = el("div", "clay-lp-acts");
    var saveBtn = el("button", "btn btn-gold", "Launchpad metinlerini kaydet");
    saveBtn.type = "submit";
    var resetBtn = el("button", "btn btn-ghost", "Tümünü varsayılana al");
    resetBtn.type = "button";
    acts.appendChild(saveBtn);
    acts.appendChild(resetBtn);
    form.appendChild(acts);
    box.appendChild(form);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      save(box, false);
    });
    resetBtn.addEventListener("click", function () {
      if (window.confirm("Türkçe ve İngilizce tüm launchpad metinleri varsayılana dönsün mü?")) save(box, true);
    });
    tabs.addEventListener("click", function (event) {
      var tab = event.target.closest && event.target.closest("[data-lp-tab]");
      if (!tab) return;
      drafts[lang] = collect(box);
      lang = tab.getAttribute("data-lp-tab");
      say(box, "", false);
      fill(box);
    });
    fill(box);
    return box;
  }

  var loading = false;
  function ensure() {
    var box = document.getElementById("launchpad-metinleri");
    if (!onPage()) {
      if (box) box.remove();
      return;
    }
    var form = anchor();
    if (!form) return;
    if (box) return;
    if (schema) {
      form.insertAdjacentElement("afterend", build());
      return;
    }
    if (loading) return;
    loading = true;
    load().then(function () {
      loading = false;
      ensure();
    }, function () { loading = false; });
  }

  function start() {
    ensure();
    setInterval(ensure, 600);
  }
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();
