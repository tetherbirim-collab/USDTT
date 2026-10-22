(function () {
  var root = document.documentElement;
  root.classList.add("lp-js");

  var copy = {};
  try { copy = JSON.parse(document.getElementById("lp-copy").textContent || "{}"); } catch (e) {}

  function norm(lang) {
    return lang === "tr" ? "tr" : "en";
  }
  var shown = norm(root.lang);

  function current() {
    return shown;
  }

  function wanted() {
    try {
      if (localStorage.getItem("clay-lang-picked") === "1") {
        var l = localStorage.getItem("clay-lang");
        if (l === "tr") return "tr";
        if (l === "en" || l === "ru") return "en";
      }
    } catch (e) {}
    return current();
  }

  function lines(el, text, list) {
    el.textContent = "";
    var parts = list ? String(text).split(",") : (String(text).match(/[^.!?]+[.!?]*/g) || [text]);
    parts.forEach(function (part, i) {
      part = part.trim();
      if (!part) return;
      var span = document.createElement("span");
      if (el.hasAttribute("data-lines")) span.className = "lp-line";
      else if (i === 0) span.className = "is-on";
      span.textContent = part;
      el.appendChild(span);
    });
  }

  function apply(lang) {
    var dict = copy[lang];
    if (!dict) return;
    document.querySelectorAll("[data-k]").forEach(function (el) {
      var text = dict[el.getAttribute("data-k")];
      if (typeof text !== "string") return;
      if (el.hasAttribute("data-lines")) lines(el, text, false);
      else if (el.hasAttribute("data-list")) lines(el, text, true);
      else el.textContent = text;
    });
    shown = lang;
    if (norm(root.lang) !== lang) root.lang = lang;
    document.querySelectorAll("[data-lp-lang]").forEach(function (btn) { btn.textContent = lang.toUpperCase(); });
    var live = document.querySelector(".clay-live-btn");
    if (live) live.setAttribute("aria-label", lang === "tr" ? "Canlı destek" : "Live support");
    if (dict.heroTitle) document.title = "CLAY · " + dict.heroTitle;
  }

  function pick(lang) {
    try {
      localStorage.setItem("clay-lang", lang);
      localStorage.setItem("clay-lang-picked", "1");
    } catch (e) {}
    var tail = ";path=/;max-age=31536000;SameSite=Lax";
    document.cookie = "clay-lang=" + lang + tail;
    document.cookie = "clay-lang-picked=1" + tail;
    apply(lang);
  }

  function setMenu(open) {
    var btn = document.querySelector("[data-lp-menu]");
    var drawer = document.getElementById("lp-drawer");
    if (!btn || !drawer) return;
    drawer.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
  }

  document.addEventListener("click", function (event) {
    var t = event.target;
    if (!t || !t.closest) return;
    if (t.closest("[data-lp-lang]")) {
      event.preventDefault();
      pick(current() === "tr" ? "en" : "tr");
      return;
    }
    var menu = t.closest("[data-lp-menu]");
    if (menu) {
      setMenu(menu.getAttribute("aria-expanded") !== "true");
      return;
    }
    if (t.closest("[data-lp-close]")) setMenu(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  var want = wanted();
  if (want !== current()) apply(want);
  new MutationObserver(function () {
    if (norm(root.lang) !== shown) apply(norm(root.lang));
  }).observe(root, { attributes: true, attributeFilter: ["lang"] });

  var items = document.querySelectorAll(".lp-reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { io.observe(el); });
})();
