(function () {
  if (window.__clayGecis) return;
  window.__clayGecis = true;

  var CSS =
    "#clay-gecis{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;align-content:center;gap:18px;" +
    "background:rgba(7,6,11,.74);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;visibility:hidden;" +
    "pointer-events:none;transition:opacity .16s ease,visibility 0s linear .16s}" +
    "#clay-gecis.is-on{opacity:1;visibility:visible;transition:opacity .16s ease}" +
    "#clay-gecis .cg-card{position:relative;width:176px;height:110px;border-radius:16px;overflow:hidden;" +
    "border:1px solid rgba(255,255,255,.25);box-shadow:0 22px 56px rgba(0,0,0,.5),0 0 0 10px rgba(240,201,138,.06);" +
    "background:linear-gradient(145deg,#3a2a18 0%,#1a1428 46%,#10241f 100%);animation:cg-float 2.6s ease-in-out infinite}" +
    "#clay-gecis .cg-shine{position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.2) 48%,transparent 60%);" +
    "background-size:250% 100%;animation:cg-shine 1.4s linear infinite}" +
    "#clay-gecis .cg-chip{position:absolute;left:14px;top:14px;width:28px;height:20px;border-radius:5px;" +
    "background:linear-gradient(135deg,#fff1cf,#c4924a);box-shadow:inset 0 1px 0 rgba(255,255,255,.7)}" +
    "#clay-gecis .cg-mark{position:absolute;left:14px;bottom:13px;font:600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;" +
    "letter-spacing:.22em;color:rgba(255,255,255,.75)}" +
    "#clay-gecis .cg-dots{position:absolute;right:12px;bottom:10px;width:40px;height:24px}" +
    "#clay-gecis .cg-dots:before,#clay-gecis .cg-dots:after{content:'';position:absolute;top:0;width:24px;height:24px;border-radius:50%}" +
    "#clay-gecis .cg-dots:before{left:0;background:rgba(240,201,138,.9)}" +
    "#clay-gecis .cg-dots:after{right:0;background:rgba(141,255,228,.55);mix-blend-mode:screen}" +
    "#clay-gecis .cg-word{margin:0;font:800 22px/1 system-ui,sans-serif;letter-spacing:.3em;color:#fff;text-indent:.3em}" +
    "@keyframes cg-float{0%,to{transform:translateY(0)}50%{transform:translateY(-6px)}}" +
    "@keyframes cg-shine{from{background-position:120% 0}to{background-position:-120% 0}}" +
    "@media (prefers-reduced-motion:reduce){#clay-gecis .cg-card,#clay-gecis .cg-shine{animation:none}}";

  var box = null;
  var showTimer = 0;
  var failTimer = 0;
  var watchTimer = 0;
  var fromHref = "";

  function ensure() {
    if (box && box.isConnected) return box;
    if (!document.getElementById("clay-gecis-css")) {
      var style = document.createElement("style");
      style.id = "clay-gecis-css";
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    box = document.createElement("div");
    box.id = "clay-gecis";
    box.setAttribute("aria-hidden", "true");
    box.setAttribute("data-clay-skip", "");
    box.setAttribute("translate", "no");
    box.innerHTML = '<div class="cg-card"><i class="cg-shine"></i><i class="cg-chip"></i><b class="cg-mark">CLAY</b><i class="cg-dots"></i></div><p class="cg-word">CLAY</p>';
    document.body.appendChild(box);
    return box;
  }

  // The app's own boot splash already shows the card; never stack a second one on top.
  function bootSplashVisible() {
    var list = document.querySelectorAll("main.boot-screen .splash-card");
    for (var i = 0; i < list.length; i += 1) {
      var rect = list[i].getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && getComputedStyle(list[i]).visibility !== "hidden") return true;
    }
    return false;
  }

  function off() {
    if (box) box.classList.remove("is-on");
  }

  function stop() {
    clearTimeout(showTimer);
    clearTimeout(failTimer);
    clearInterval(watchTimer);
    showTimer = failTimer = watchTimer = 0;
    off();
  }

  function begin(clientSide) {
    stop();
    fromHref = location.href;
    showTimer = setTimeout(function () {
      if (!bootSplashVisible()) ensure().classList.add("is-on");
    }, 140);
    failTimer = setTimeout(stop, clientSide ? 5000 : 12000);
    if (!clientSide) return;
    watchTimer = setInterval(function () {
      if (bootSplashVisible()) off();
      if (location.href !== fromHref) {
        clearInterval(watchTimer);
        watchTimer = 0;
        requestAnimationFrame(function () { requestAnimationFrame(stop); });
      }
    }, 60);
  }

  function navTarget(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
    var a = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!a || a.hasAttribute("download") || a.closest("#clay-gecis")) return null;
    var target = a.getAttribute("target");
    if (target && target !== "_self") return null;
    var raw = a.getAttribute("href") || "";
    if (!raw || raw.charAt(0) === "#" || /^(mailto|tel|javascript|data|blob):/i.test(raw)) return null;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return null; }
    if (url.origin !== location.origin) return null;
    if (/^\/api\//.test(url.pathname) || /\.(pdf|png|jpe?g|webp|svg|zip|json|txt)$/i.test(url.pathname)) return null;
    if (url.pathname === location.pathname && url.search === location.search) return null;
    return url;
  }

  document.addEventListener("click", function (event) {
    if (!navTarget(event)) return;
    // React listens on document too; defaultPrevented (client-side route) is only final after dispatch.
    setTimeout(function () { begin(event.defaultPrevented); }, 0);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") stop();
  });
  window.addEventListener("pageshow", stop);
  window.addEventListener("popstate", stop);
})();
