(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7177],{471:()=>{},860:()=>{},1060:()=>{},1243:(e,t,n)=>{"use strict";n.d(t,{ChromeProvider:()=>h,OF:()=>u,dX:()=>j});var i=n(5155),r=n(2115),l=n(4645);let a="clay-theme",s="clay-lang",o=(0,r.createContext)(null);function c(e){document.documentElement.classList.toggle("light","light"===e)}function d(e){document.documentElement.lang=e}function h(e){let{children:t}=e,[n,l]=(0,r.useState)("dark"),[h,u]=(0,r.useState)(function(){try{var L=localStorage.getItem("clay-lang")||""}catch(e){var L=""}if(L!=="tr"&&L!=="en"){try{L=document.documentElement.lang||""}catch(e){L=""}}return L==="en"?"en":"tr"});return(0,r.useEffect)(()=>{let e="dark",t="tr";try{("light"===localStorage.getItem(a)||document.documentElement.classList.contains("light"))&&(e="light"),(function(){var L="";try{L=localStorage.getItem(s)||""}catch(e){}if(L!=="en")L=document.documentElement.lang||"";if(L==="en")t=L})()}catch(e){}c(e),d(t),l(e),u(t)},[]),(0,i.jsx)(o.Provider,{value:{theme:n,lang:h,toggleTheme:()=>{let e=document.documentElement.classList.contains("light")?"dark":"light";c(e);try{localStorage.setItem(a,e);document.cookie="clay-lang="+e+";path=/;max-age=31536000;SameSite=Lax";}catch(e){}l(e)},setLang:e=>{d(e);try{localStorage.setItem(s,e);document.cookie="clay-lang="+e+";path=/;max-age=31536000;SameSite=Lax";}catch(e){}u(e)}},children:t})}function u(){let e=(0,r.useContext)(o);if(!e)throw Error("ChromeProvider missing");return e}function m(){return(0,i.jsx)("svg",{className:"theme-glyph theme-moon",viewBox:"0 0 24 24","aria-hidden":!0,children:(0,i.jsx)("path",{fill:"currentColor",d:"M15.1 2.7a8.7 8.7 0 1 0 6.2 15.7A7.5 7.5 0 1 1 15.1 2.7z"})})}function g(){return(0,i.jsxs)("svg",{className:"theme-glyph theme-sun",viewBox:"0 0 24 24","aria-hidden":!0,children:[(0,i.jsx)("circle",{cx:"12",cy:"12",r:"3.3",fill:"currentColor"}),(0,i.jsx)("g",{fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",children:(0,i.jsx)("path",{d:"M12 3.1v2.2M12 18.7v2.2M3.1 12h2.2M18.7 12h2.2M5.7 5.7l1.6 1.6M16.7 16.7l1.6 1.6M18.3 5.7l-1.6 1.6M7.3 16.7l-1.6 1.6"})})]})}function f(e){let{className:t="lang-flag"}=e,n=(0,r.useId)().replace(/:/g,"");return(0,i.jsxs)("svg",{className:t,viewBox:"0 0 24 18","aria-hidden":!0,children:[(0,i.jsx)("defs",{children:(0,i.jsx)("clipPath",{id:"".concat(n,"-tr"),children:(0,i.jsx)("rect",{width:"24",height:"18",rx:"3.5"})})}),(0,i.jsxs)("g",{clipPath:"url(#".concat(n,"-tr)"),children:[(0,i.jsx)("rect",{width:"24",height:"18",fill:"#E30A17"}),(0,i.jsx)("circle",{cx:"9.1",cy:"9",r:"4.35",fill:"#fff"}),(0,i.jsx)("circle",{cx:"10.45",cy:"9",r:"3.45",fill:"#E30A17"}),(0,i.jsx)("polygon",{fill:"#fff",points:"14.55,9 13.15,9.48 13.68,10.84 12.72,9.78 11.32,10.08 12.38,9 11.32,7.92 12.72,8.22 13.68,7.16 13.15,8.52"})]})]})}function p(e){let{className:t="lang-flag"}=e,n=(0,r.useId)().replace(/:/g,""),l=[];for(let e=0;e<4;e+=1)for(let t=0;t<5;t+=1)l.push({x:1.35+1.65*t,y:1.35+2.05*e});return(0,i.jsxs)("svg",{className:t,viewBox:"0 0 24 18","aria-hidden":!0,children:[(0,i.jsx)("defs",{children:(0,i.jsx)("clipPath",{id:"".concat(n,"-us"),children:(0,i.jsx)("rect",{width:"24",height:"18",rx:"3.5"})})}),(0,i.jsxs)("g",{clipPath:"url(#".concat(n,"-us)"),children:[(0,i.jsx)("rect",{width:"24",height:"18",fill:"#bf0a30"}),(0,i.jsx)("path",{fill:"#fff",d:"M0 1.4h24v1.4H0zm0 2.8h24v1.4H0zm0 2.8h24v1.4H0zm0 2.8h24v1.4H0zm0 2.8h24v1.4H0z"}),(0,i.jsx)("rect",{width:"10.2",height:"9.8",fill:"#3c3b6e"}),l.map(e=>(0,i.jsx)("circle",{cx:e.x,cy:e.y,r:"0.38",fill:"#fff"},"".concat(e.x,"-").concat(e.y)))]})]})}function x(){return(0,i.jsx)("svg",{className:"lang-chevron",viewBox:"0 0 12 12","aria-hidden":!0,children:(0,i.jsx)("path",{d:"M2.2 4.2 6 8l3.8-3.8",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round"})})}let v=[{id:"tr",flag:f},{id:"en",flag:p}];function j(){let{theme:e,lang:t,toggleTheme:n,setLang:a}=u(),[s,o]=(0,r.useState)(!1),c=(0,r.useRef)(null),d=(0,r.useId)(),h="dark"===e;return(0,r.useEffect)(()=>{if(!s)return;let e=e=>{var t;(null==(t=c.current)?void 0:t.contains(e.target))||o(!1)},t=e=>{"Escape"===e.key&&o(!1)};return document.addEventListener("pointerdown",e),document.addEventListener("keydown",t),()=>{document.removeEventListener("pointerdown",e),document.removeEventListener("keydown",t)}},[s]),(0,i.jsxs)("div",{className:"chrome-pair",children:[(0,i.jsx)("button",{type:"button",className:"theme-pill","aria-pressed":h,"aria-label":(0,l.i)(t,h?"themeDark":"themeLight"),onClick:n,children:(0,i.jsxs)("span",{className:"theme-knob",children:[(0,i.jsx)(m,{}),(0,i.jsx)(g,{})]})}),(0,i.jsxs)("div",{className:"lang-pop",ref:c,children:[(0,i.jsxs)("button",{type:"button",className:"lang-btn","aria-label":(0,l.i)(t,"language"),"aria-haspopup":"listbox","aria-expanded":s,"aria-controls":d,onClick:()=>o(e=>!e),children:[(0,i.jsx)(f,{className:"lang-flag clay-tr"}),(0,i.jsx)(p,{className:"lang-flag clay-en"}),(0,i.jsx)(x,{})]}),s&&(0,i.jsx)("ul",{className:"lang-menu",id:d,role:"listbox","aria-label":(0,l.i)(t,"language"),children:v.map(e=>{let n=e.flag,r=(0,l.i)(t,"tr"===e.id?"turkish":"ru"===e.id?"russian":"english");return(0,i.jsx)("li",{children:(0,i.jsxs)("button",{type:"button",className:"lang-option",role:"option","aria-selected":t===e.id,onClick:()=>{a(e.id),o(!1)},children:[(0,i.jsx)(n,{}),(0,i.jsx)("span",{children:r})]})},e.id)})})]})]})}},1290:()=>{},2421:()=>{},2751:()=>{},4104:(e,t,n)=>{"use strict";n.d(t,{TelegramButton:()=>l});var i=n(5155),r=n(5901);function l(){var e;let t=String(null!=(e=(0,r.y9)().telegram)?e:"").trim();return t?(0,i.jsx)("a",{className:"tg-fab",href:"https://t.me/".concat(t),target:"_blank",rel:"noopener noreferrer","aria-label":"Telegram ".concat(t),children:(0,i.jsx)("svg",{viewBox:"0 0 24 24","aria-hidden":!0,children:(0,i.jsx)("path",{fill:"currentColor",d:"M21.6 4.2 2.9 11.4c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.1.9.7.9.4 0 .6-.2.9-.5l2.6-2.5 5.4 4c1 .5 1.7.3 1.9-.9l3.5-16.4c.4-1.4-.5-2-1.7-1.4ZM8.4 13.7l9.8-6.2c.5-.3.9-.1.6.2l-8.4 7.6-.3 3.4-1.7-5z"})})}):null}},4645:(e,t,n)=>{"use strict";n.d(t,{i:()=>l});let i={themeDark:"Koyu tema",themeLight:"A\xe7ık tema",language:"Dil",turkish:"T\xfcrk\xe7e",english:"English",russian:"Russian",workshop:"At\xf6lye",signIn:"Giriş",signInLong:"Giriş yap",openAccount:"Hesap a\xe7",register:"Kayıt ol",forgot:"Şifremi unuttum",goPanel:"Panele git",goAdmin:"Y\xf6netime git",pageNav:"Sayfa",launch:"KYC gerekmez. Anonim sanal kart oluştur ve hemen harca.",logout:"\xc7ıkış",menu:"Men\xfc",balance:"Bakiye",notifications:"Bildirimler",unread:"okunmamış bildirim",admin:"Y\xf6netim",setup:"AYAR",desk:"Masa",live:"Canlı",members:"\xdcyeler",cards:"Kartlar",activity:"İşlemler",support:"Destek",notices:"Bildirimler",plans:"Planlar",fees:"\xdccretler",copy:"Yazılar",account:"Hesap"},r={themeDark:"Dark theme",themeLight:"Light theme",language:"Language",turkish:"T\xfcrk\xe7e",english:"English",russian:"Russian",workshop:"Studio",signIn:"Sign in",signInLong:"Sign in",openAccount:"Open account",register:"Create account",forgot:"Forgot password",goPanel:"Open panel",goAdmin:"Open admin",pageNav:"Page",launch:"No KYC. Create an anonymous virtual card and spend it now.",logout:"Log out",menu:"Menu",balance:"Balance",notifications:"Notifications",unread:"unread notifications",admin:"Admin",setup:"SETUP",desk:"Desk",live:"Live",members:"Members",cards:"Cards",activity:"Activity",support:"Support",notices:"Notices",plans:"Plans",fees:"Fees",copy:"Copy",account:"Account"};let clayRu={themeDark:"Тёмная тема",themeLight:"Светлая тема",language:"Язык",turkish:"Türkçe",english:"English",russian:"Russian",workshop:"Мастерская",signIn:"Вход",signInLong:"Войти",openAccount:"Открыть счёт",register:"Регистрация",forgot:"Забыли пароль",goPanel:"Открыть панель",goAdmin:"Админка",pageNav:"Страница",launch:"Без KYC. Создайте анонимную виртуальную карту и платите сразу.",logout:"Выход",menu:"Меню",balance:"Баланс",notifications:"Уведомления",unread:"непрочитанных",admin:"Админ",setup:"НАСТРОЙКИ",desk:"Стол",live:"Онлайн",members:"Участники",cards:"Карты",activity:"Операции",support:"Поддержка",notices:"Уведомления",plans:"Планы",fees:"Тарифы",copy:"Тексты",account:"Аккаунт"};function l(e,t){return"en"===e?r[t]:"ru"===e?clayRu[t]:i[t]}},5690:(e,t,n)=>{Promise.resolve().then(n.bind(n,1243)),Promise.resolve().then(n.bind(n,4104)),Promise.resolve().then(n.t.bind(n,2421,23)),Promise.resolve().then(n.t.bind(n,1060,23)),Promise.resolve().then(n.t.bind(n,471,23)),Promise.resolve().then(n.t.bind(n,6337,23)),Promise.resolve().then(n.t.bind(n,860,23)),Promise.resolve().then(n.t.bind(n,9114,23)),Promise.resolve().then(n.t.bind(n,8393,23)),Promise.resolve().then(n.t.bind(n,2751,23)),Promise.resolve().then(n.t.bind(n,1290,23))},6337:()=>{},8393:()=>{},9114:()=>{}},e=>{e.O(0,[6437,1741,5901,8441,1255,7358],()=>e(e.s=5690)),_N_E=e.O()}]);
;(function(){
function clayBoot(){
(function () {
  var IDLE_MS = 300000;
  var ACTIVITY_KEY = "clay-active-at";
  function readActivity() {
    try {
      var n = Number(sessionStorage.getItem(ACTIVITY_KEY));
      if (n > 0 && n <= Date.now() + 2000) return n;
    } catch (e) {}
    return 0;
  }
  function stampActivity(ts) {
    lastActivity = ts;
    try { sessionStorage.setItem(ACTIVITY_KEY, String(ts)); } catch (e) {}
  }
  var lastActivity = readActivity() || Date.now();
  if (!readActivity()) stampActivity(lastActivity);
  var CATALOG = { facebook_ads: "441357", tiktok: "474613", google_ads: "441357", ultima: "474613", burner: "474613" };
  var VERIFIED = {
    "441357": { type: "credit", country: null, alpha2: null, emoji: null, unavailableCountry: true },
    "474613": { type: "prepaid", country: null, alpha2: null, emoji: null, prepaid: true }
  };
  var NAMES = { Facebook: "facebook_ads", "Facebook Ads": "facebook_ads", TikTok: "tiktok", "TikTok Ads": "tiktok", "Google Ads": "google_ads", Ultima: "ultima", Burner: "burner", "Tek Kullanımlık Kart": "burner" };
  var binCache = {};
  var idleTimer = null;
  var painting = false;
  var UI = {
    remember: { tr: "Beni hatırla", en: "Remember me", ru: "Запомнить меня" },
    lockTitle: { tr: "Oturum kilitlendi", en: "Session locked", ru: "Сеанс заблокирован" },
    lockBody: { tr: "Bir süredir işlem olmadı. Devam etmek için parolayı yeniden yaz.", en: "There was no activity for a while. Enter the password again to continue.", ru: "Некоторое время не было действий. Введите пароль ещё раз, чтобы продолжить." },
    unlock: { tr: "Kilidi aç", en: "Unlock", ru: "Разблокировать" },
    lockBad: { tr: "Parola yanlış. Kilit açık kalır.", en: "Wrong password. The screen stays locked.", ru: "Неверный пароль. Экран остаётся заблокированным." },
    lockFrozen: { tr: "Üç yanlış paroladan sonra bu deneme kilitlendi. Parola artık kabul edilmez.", en: "After three wrong passwords this attempt is locked. The password is no longer accepted.", ru: "После трёх неверных паролей эта попытка закрыта. Пароль больше не принимается." },
    seedReset: { tr: "Tohumla yeni parola belirle", en: "Set a new password with the seed phrase", ru: "Задать новый пароль по сид-фразе" },
    seedHint: { tr: "Doğru tohum yeni parolayı kaydeder. Sonra yeni parola kilidi açar.", en: "The correct seed saves the new password. Then the new password unlocks the screen.", ru: "Верный сид сохраняет новый пароль. Затем новый пароль снимает блокировку." },
    seedPhrase: { tr: "Tohum", en: "Seed phrase", ru: "Сид-фраза" },
    seedAgain: { tr: "Yeni parolayı yeniden yaz", en: "Repeat the new password", ru: "Повторите новый пароль" },
    seedSave: { tr: "Yeni parolayı kaydet", en: "Save the new password", ru: "Сохранить новый пароль" },
    seedOk: { tr: "Yeni parola kaydedildi. Kilidi bu parolayla aç.", en: "New password saved. Unlock with that password.", ru: "Новый пароль сохранён. Откройте экран этим паролем." },
    seedBad: { tr: "Tohum eşleşmedi. Parola değişmedi.", en: "Seed did not match. The password was not changed.", ru: "Сид не совпал. Пароль не изменён." },
    seedMissing: { tr: "Bu hesapta tohum yok. Parola değişmedi.", en: "This account has no seed. The password was not changed.", ru: "У этого счёта нет сида. Пароль не изменён." },
    seedShape: { tr: "Yeni parola 6–72 harf veya rakam olmalı ve iki alan aynı olmalı.", en: "The new password must be 6–72 letters or digits and both fields must match.", ru: "Новый пароль: 6–72 буквы или цифры, оба поля должны совпадать." },
    password: { tr: "Parola", en: "Password", ru: "Пароль" },
    pin: { tr: "Sabitle", en: "Pin", ru: "Закрепить" },
    unpin: { tr: "Sabitlemeyi kaldır", en: "Unpin", ru: "Открепить" },
    extend: { tr: "Süreyi 30 gün uzat", en: "Extend term by 30 days", ru: "Продлить срок на 30 дней" },
    renew: { tr: "Otomatik yenile", en: "Turn on auto-renew", ru: "Включить автопродление" },
    renewOn: { tr: "Otomatik yenileme açık", en: "Auto-renew is on", ru: "Автопродление включено" },
    expiry: { tr: "Kart süresi", en: "Card term", ru: "Срок карты" },
    notice: { tr: "Süresi dolmak üzere olan kartlar var. Uzatabilir veya otomatik yenilemeyi açabilirsin.", en: "Some cards are near expiry. You can extend them or turn on auto-renew.", ru: "Срок некоторых карт скоро истекает. Продлите срок или включите автопродление." },
    copyPan: { tr: "Kart numarasını kopyala", en: "Copy card number", ru: "Копировать номер карты" },
    copyExp: { tr: "Son kullanma tarihini kopyala", en: "Copy expiry", ru: "Копировать срок" },
    copyCvv: { tr: "CVV kopyala", en: "Copy CVV", ru: "Копировать CVV" },
    copied: { tr: "Kopyalandı", en: "Copied", ru: "Скопировано" },
    coupon: { tr: "Kupon kodu", en: "Coupon code", ru: "Код купона" },
    apply: { tr: "İndirimli tutarı bakiyeye yaz", en: "Credit the discounted amount", ru: "Зачислить сумму со скидкой" },
    vote: { tr: "Oy ver", en: "Vote", ru: "Голосовать" },
    voted: { tr: "Oyun kaydedildi", en: "Vote saved", ru: "Голос учтён" },
    priority: { tr: "Öncelik", en: "Priority", ru: "Приоритет" },
    normal: { tr: "Normal", en: "Normal", ru: "Обычный" },
    urgent: { tr: "Acil", en: "Urgent", ru: "Срочно" },
    ads: { tr: "Reklam Akışı Durdu", en: "Ad delivery stopped", ru: "Реклама остановилась" },
    binDown: { tr: "BIN arızasını işle", en: "Mark a BIN impaired", ru: "Отметить сбой BIN" },
    binNew: { tr: "Yeni BIN ekle", en: "Add a new BIN", ru: "Добавить новый BIN" },
    pdf: { tr: "PDF fiş", en: "PDF slip", ru: "PDF-квитанция" },
    receipts: { tr: "İç muhasebe fişleri", en: "Internal accounting slips", ru: "Внутренние квитанции" },
    notInvoice: { tr: "Yasal fatura değildir. İç muhasebe kaydıdır.", en: "Not a legal invoice. Internal accounting slip.", ru: "Это не юридический счёт. Внутренняя квитанция." },
    unavailable: { tr: "Canlı sorgu yok", en: "Live lookup unavailable", ru: "Живой запрос недоступен" },
    countryUnknown: { tr: "Ülke doğrulanamadı", en: "Country not verified", ru: "Страна не подтверждена" },
    verified: { tr: "Doğrulanmış kayıt", en: "Verified record", ru: "Проверенная запись" },
    live: { tr: "Canlı sorgu", en: "Live lookup", ru: "Живой запрос" },
    credit: { tr: "Kredi", en: "Credit", ru: "Кредит" },
    debit: { tr: "Debit", en: "Debit", ru: "Дебет" },
    prepaid: { tr: "Prepaid", en: "Prepaid", ru: "Предоплаченная" },
    createCoupon: { tr: "Kupon oluştur", en: "Create coupon", ru: "Создать купон" },
    disable: { tr: "Kapat", en: "Disable", ru: "Отключить" },
    active: { tr: "Aktif", en: "Active", ru: "Активен" },
    inactive: { tr: "Kapalı", en: "Disabled", ru: "Отключён" },
    reduced: { tr: "İndirimli tutar", en: "Discounted amount", ru: "Сумма со скидкой" },
    original: { tr: "Yazılan tutar", en: "Entered amount", ru: "Введённая сумма" },
    demoCode: { tr: "Deneme kodu CLAY10 yüzde 10 indirir.", en: "Demo code CLAY10 takes 10 percent off.", ru: "Демокод CLAY10 даёт скидку 10 процентов." },
    newExpiry: { tr: "Yeni bitiş", en: "New expiry", ru: "Новый срок" },
    adminTickets: { tr: "Gelen talepler", en: "Incoming tickets", ru: "Входящие заявки" },
    coupons: { tr: "Kupon kodları", en: "Coupon codes", ru: "Коды купонов" },
    amount: { tr: "Tutar", en: "Amount", ru: "Сумма" },
    card: { tr: "Kart", en: "Card", ru: "Карта" },
    date: { tr: "Tarih", en: "Date", ru: "Дата" },
    status: { tr: "Durum", en: "Status", ru: "Статус" },
    daysLeft: { tr: "gün kaldı", en: "days left", ru: "дн. осталось" },
    noCode: { tr: "Kod geçersiz veya kapalı.", en: "Code is invalid or disabled.", ru: "Код неверен или отключён." },
    credited: { tr: "Yüzde kuponu kaydedildi. Bakiye yazılmaz; indirim yükleme ve plan ödemesinde uygulanır.", en: "Percent coupon saved. It is not credited as balance; the discount applies on top-up and plan payment.", ru: "Процентный купон сохранён. На баланс не зачисляется; скидка применяется при пополнении и оплате плана." },
    list: { tr: "Kodlar", en: "Codes", ru: "Коды" },
    percent: { tr: "Yüzde", en: "Percent", ru: "Процент" },
    voteCount: { tr: "oy", en: "votes", ru: "гол." },
    slip: { tr: "Fiş indir", en: "Download slip", ru: "Скачать квитанцию" }
  };
  var PHRASES = {
    "Şartlar ve Koşullar": ["Terms and Conditions", "Условия использования"],
    "Gizlilik Politikası": ["Privacy Policy", "Политика конфиденциальности"],
    "Gizlilik politikası": ["Privacy policy", "Политика конфиденциальности"],
    "Hizmet şartları": ["Terms of service", "Условия сервиса"],
    "Platform kuralları": ["Platform rules", "Правила платформы"],
    "Sorumluluk reddi": ["Disclaimer", "Отказ от ответственности"],
    "Kullanıcı hakları": ["User rights", "Права пользователя"],
    "Toplanan kayıtlar": ["Records we keep", "Какие данные хранятся"],
    "Platform kuralları ve sorumluluk reddi": ["Platform rules and disclaimer", "Правила платформы и отказ от ответственности"],
    "Kapat": ["Close", "Закрыть"],
    "Kart bas": ["Issue card", "Выпустить карту"],
    "CÜZDAN": ["WALLET", "КОШЕЛЁК"],
    "Yüzde kuponunu uygula": ["Apply percent coupon", "Применить процентный купон"],
    "Tümünü okundu say": ["Mark all read", "Отметить все прочитанными"],
    "Tümünü sil": ["Delete all", "Удалить все"],
    "Henüz bildirim yok.": ["No notifications yet.", "Уведомлений пока нет."],
    "Bu ay harcama": ["Spent this month", "Траты за месяц"],
    "Bu ay yükleme": ["Loaded this month", "Пополнения за месяц"],
    "Dondurulan": ["Frozen", "Заморожено"],
    "CLAY Sanal Kart Hizmetleri": ["CLAY Virtual Card Services", "CLAY виртуальные карты"],
    "Bakiye yükle": ["Top up balance", "Пополнить баланс"],
    "Düzenle": ["Edit", "Изменить"],
    "Kaldır": ["Remove", "Удалить"],
    "Panoya Kopyala": ["Copy to clipboard", "Копировать"],
    "Metin Belgesi (.txt) Olarak İndir": ["Download as text file (.txt)", "Скачать текстовый файл (.txt)"],
    "Seed panoya kopyalandı.": ["Seed copied to the clipboard.", "Сид скопирован."],
    "Parolayı göster": ["Show password", "Показать пароль"],
    "Parolayı gizle": ["Hide password", "Скрыть пароль"],
    "Giriş": ["Sign in", "Вход"],
    "Giriş yap": ["Sign in", "Войти"],
    "Kayıt ol": ["Create account", "Регистрация"],
    "Hesap aç": ["Open account", "Открыть счёт"],
    "Şifremi unuttum": ["Forgot password", "Забыли пароль"],
    "Kullanıcı adı": ["Username", "Имя пользователя"],
    "Parola": ["Password", "Пароль"],
    "Parolayı yeniden yaz": ["Repeat the password", "Повторите пароль"],
    "Güvenlik sorusu": ["Security question", "Секретный вопрос"],
    "Güvenlik yanıtı": ["Security answer", "Ответ на вопрос"],
    "Çıkış": ["Log out", "Выход"],
    "Menü": ["Menu", "Меню"],
    "Bakiye": ["Balance", "Баланс"],
    "Bildirimler": ["Notifications", "Уведомления"],
    "Kartlar": ["Cards", "Карты"],
    "İşlemler": ["Activity", "Операции"],
    "Destek": ["Support", "Поддержка"],
    "Hesap": ["Account", "Аккаунт"],
    "Ücretler": ["Fees", "Тарифы"],
    "Planlar": ["Plans", "Планы"],
    "Üyeler": ["Members", "Участники"],
    "Yönetim": ["Admin", "Админ"],
    "Yönetici": ["Admin", "Администратор"],
    "Panele git": ["Open panel", "Открыть панель"],
    "Yönetime git": ["Open admin", "Админка"],
    "Bu Tutarla Devam Et": ["Continue with this amount", "Продолжить с этой суммой"],
    "Aktif": ["Active", "Активен"],
    "Ortaklık": ["Affiliate", "Партнёрка"],
    "Aktif Oturum Bilgisi": ["Active session", "Активный сеанс"],
    "Bu hesabın giriş kayıtları.": ["Sign-in records for this account.", "Записи входа этой учётной записи."],
    "İki arkadaş, 5 USD": ["Two friends, 5 USD", "Два друга, 5 USD"],
    "İki arkadaşını getir. Kullanıcı kimliklerini yaz. 5 USD teklifi kayda geçer. Ödeme otomatik yapılmaz.": ["Bring two friends. Enter their user IDs. The 5 USD offer is recorded. There is no automatic payout.", "Приведите двух друзей. Введите их ID. Предложение на 5 USD записывается. Автоматической выплаты нет."],
    "Birinci kimlik": ["First user ID", "Первый ID"],
    "İkinci kimlik": ["Second user ID", "Второй ID"],
    "Talebi gönder": ["Submit request", "Отправить заявку"],
    "Talep alındı. Ödeme otomatik yapılmaz.": ["Request received. There is no automatic payout.", "Заявка принята. Автоматической выплаты нет."],
    "İki farklı kimlik yazın.": ["Enter two different user IDs.", "Введите два разных ID."],
    "Kart oluşturulmadı.": ["The card was not created.", "Карта не создана."],
    "Limitleri kaydet": ["Save limits", "Сохранить лимиты"],
    "Harcama yap": ["Make a charge", "Провести списание"],
    "Harcama işlendi.": ["Charge applied.", "Списание проведено."],
    "Davetli hareketi işle": ["Post referred activity", "Провести действие приглашённого"],
    "Davet bağlantısı panoya kopyalandı.": ["Invite link copied.", "Ссылка приглашения скопирована."],
    "Kopyalandı": ["Copied", "Скопировано"],
    "Seed anahtarımı güvenli bir yere kaydettim, kaybettiğimde hesabıma erişemeyeceğimi biliyorum": ["I saved my seed somewhere safe and I know I cannot access the account if I lose it", "Я сохранил сид в надёжном месте и знаю, что без него не войду в счёт"],
    "Kart adı": ["Card name", "Название карты"],
    "Kart oluştur": ["Create card", "Создать карту"],
    "Konu": ["Subject", "Тема"],
    "Şikayet": ["Complaint", "Обращение"],
    "Talebi gönder": ["Send ticket", "Отправить заявку"],
    "Ödeme sayfasına git": ["Go to the payment page", "Перейти к оплате"],
    "Türkçe": ["Türkçe", "Türkçe"],
    "English": ["English", "English"],
    "SANAL KART HİZMETLERİ": ["VIRTUAL CARD SERVICES", "ВИРТУАЛЬНЫЕ КАРТЫ"],
    "ANONİM SANAL KART": ["ANONYMOUS VIRTUAL CARD", "АНОНИМНАЯ ВИРТУАЛЬНАЯ КАРТА"],
    "KİMLİK BELGESİ İSTENMEZ": ["NO ID DOCUMENT ASKED", "ДОКУМЕНТ НЕ НУЖЕН"],
    "OLUŞTUR, HEMEN REKLAMINA BAŞLA": ["CREATE IT AND START YOUR ADS", "СОЗДАЙТЕ И ЗАПУСТИТЕ РЕКЛАМУ"],
    "KYC gerekmez. Anonim sanal kart oluştur ve hemen harca.": ["No KYC. Create an anonymous virtual card and spend it now.", "Без KYC. Создайте анонимную виртуальную карту и платите сразу."],
    "HARCAMA LİMİTLERİ": ["SPENDING LIMITS", "ЛИМИТЫ СПИСАНИЙ"],
    "Günlük limit (USD)": ["Daily limit (USD)", "Дневной лимит (USD)"],
    "İşlem limiti (USD)": ["Transaction limit (USD)", "Лимит операции (USD)"],
    "Harcama tutarı (USD)": ["Charge amount (USD)", "Сумма списания (USD)"],
    "Karta yükleme de aynı limitlere bakar. Limit aşılırsa tutar yazılmaz ve hata gösterilir.": ["Loading a card uses the same limits. Over the limit, nothing is posted and an error is shown.", "Пополнение карты смотрит те же лимиты. Выше лимита сумма не пишется и показывается ошибка."],
    "Affiliate paneli": ["Affiliate panel", "Партнёрская панель"],
    "Kazanılan pasif komisyon:": ["Passive commission earned:", "Начисленная комиссия:"],
    "Davetli": ["Invitee", "Приглашённый"],
    "Kayıt": ["Signup", "Регистрация"],
    "Komisyon": ["Commission", "Комиссия"],
    "Komisyon hareketleri": ["Commission activity", "Движения комиссии"],
    "Tarayıcı": ["Browser", "Браузер"],
    "IP adresi": ["IP address", "IP-адрес"],
    "Zaman": ["Time", "Время"],
    "Bu paneli görmek için giriş yap.": ["Sign in to see this panel.", "Войдите, чтобы видеть эту панель."],
    "Yalnızca bu hesabın girişleri. Her yeni giriş tarayıcı, IP adresi ve zamanla listeye eklenir.": ["Only this account's sign-ins. Each new sign-in adds browser, IP address, and time.", "Только входы этого счёта. Каждый вход добавляет браузер, IP и время."],
    "Henüz davetli yok. Bağlantıyı paylaş veya örnek hareket işle.": ["No invitees yet. Share the link or post a sample activity.", "Приглашённых пока нет. Поделитесь ссылкой или проведите пример."],
    "Henüz komisyon yok.": ["No commission yet.", "Комиссии пока нет."],
    "Bu hesapta henüz oturum satırı yok. Yeni bir giriş satır ekler.": ["This account has no session row yet. A new sign-in adds one.", "У этого счёта ещё нет строки сеанса. Новый вход добавит её."],
    "Komisyon oranı %5.": ["Commission rate is 5%.", "Ставка комиссии 5%."],
    "Davet bağlantınla açılan hesabın kart harcaması ve bakiye yüklemesi komisyon üretir.": ["Card spend and balance top-ups from an account opened with your link earn commission.", "Траты карты и пополнения счёта, открытого по вашей ссылке, дают комиссию."],
    "Tutar, hareket tamamlanınca ana bakiyene pasif komisyon olarak yazılır.": ["When the activity completes, the amount is credited to your balance as passive commission.", "Когда действие завершено, сумма пишется на баланс как пассивная комиссия."],
    "Kendi yükleme ve harcamaların komisyon üretmez.": ["Your own top-ups and charges do not earn commission.", "Ваши собственные пополнения и траты комиссию не дают."],
    "Bu düğme, davetlinin 40 USD bakiye yüklemesini işler ve %5 komisyonu bu hesaba yazar. Davetli yoksa örnek bir davetli hesap açar.": ["This button posts the invitee's 40 USD top-up and writes 5% commission to this account. If there is no invitee, it opens a sample one.", "Кнопка проводит пополнение приглашённого на 40 USD и пишет 5% комиссии на этот счёт. Если приглашённого нет, открывается пример."],
    "Günlük ve işlem limiti en az 1 USD olmalı.": ["Daily and transaction limits must be at least 1 USD.", "Дневной лимит и лимит операции должны быть не меньше 1 USD."],
    "Limitler kaydedildi. Kartın üzerinde de görünür.": ["Limits saved. They also show on the card.", "Лимиты сохранены. Они видны и на карте."],
    "Harcama tutarı en az 1 USD olmalı.": ["The charge must be at least 1 USD.", "Списание должно быть не меньше 1 USD."],
    "Kart bulunamadı.": ["Card not found.", "Карта не найдена."],
    "Bu tek kullanımlık kart tek çekimde kapandı. Yeniden çekilemez.": ["This single-use card closed after one charge. It cannot be charged again.", "Эта одноразовая карта закрыта после одного списания. Повторно списать нельзя."],
    "Kart harcama için aktif değil.": ["The card is not active for charges.", "Карта не активна для списаний."],
    "Tutar kullanılabilir bakiyeyi aşıyor. İşlem uygulanmadı.": ["The amount exceeds the available balance. The charge was not applied.", "Сумма выше доступного остатка. Списание не проведено."],
    "Ana bakiye bu harcama için yetersiz. İşlem uygulanmadı.": ["The wallet balance is too low for this charge. The charge was not applied.", "Баланса кошелька не хватает. Списание не проведено."],
    "Ödeme hesabı": ["Payment account", "Счёт оплаты"],
    "Tür": ["Type", "Тип"],
    "Karta isim ver": ["Name the card", "Назовите карту"],
    "Kripicard tutarı (USD)": ["Amount placed on the card (USD)", "Сумма на карте (USD)"],
    "Göndermeden önce": ["Before you submit", "Перед отправкой"],
    "Ne kesilir, ne kalır": ["What is charged, what remains", "Что списывается и что остаётся"],
    "Ad": ["Name", "Имя"],
    "SKT": ["EXP", "Срок"],
    "CVV": ["CVV", "CVV"],
    "Durum": ["Status", "Статус"],
    "Tarih": ["Date", "Дата"],
    "Tutar": ["Amount", "Сумма"],
    "Not": ["Note", "Заметка"],
    "Başarılı": ["Successful", "Успешно"],
    "İptal": ["Cancel", "Отмена"],
    "İade": ["Refund", "Возврат"],
    "Açık": ["Open", "Открыт"],
    "Kapalı": ["Closed", "Закрыт"],
    "Hazırlanıyor": ["Preparing", "Готовится"],
    "Dondurulmuş": ["Frozen", "Заморожена"],
    "Kapanmış": ["Closed", "Закрыта"],
    "Kapandı": ["Closed", "Закрыта"],
    "Okunmadı": ["Unread", "Не прочитано"],
    "Yanıtlandı": ["Answered", "Отвечено"],
    "Yanıtını yaz": ["Write the reply", "Напишите ответ"],
    "Talebin alındı": ["Ticket received", "Заявка принята"],
    "Acil destek talebi": ["Urgent support ticket", "Срочная заявка"],
    "Reklam akışı durdu": ["Ad delivery stopped", "Реклама остановилась"],
    "Bakiye yükle": ["Top up balance", "Пополнить баланс"],
    "Bakiye yüklemesi": ["Balance top-up", "Пополнение баланса"],
    "Heleket ile yükle": ["Top up with Heleket", "Пополнить через Heleket"],
    "Kripto ödeme": ["Crypto payment", "Криптооплата"],
    "Ödeme yöntemi": ["Payment method", "Способ оплаты"],
    "Ödeme": ["Payment", "Оплата"],
    "Üye": ["Member", "Участник"],
    "Canlı": ["Live", "Онлайн"],
    "Göster": ["Show", "Показать"],
    "Tümü": ["All", "Все"],
    "Çıkış": ["Log out", "Выход"],
    "limitsiz": ["unlimited", "без лимита"],
    "Tek çekim": ["Single charge", "Одно списание"],
    "Geniş bakiye": ["Wide balance", "Большой баланс"],
    "Akış bütçesi": ["Delivery budget", "Бюджет показов"],
    "Kısa video bütçesi": ["Short-video budget", "Бюджет коротких видео"],
    "Arama bütçesi": ["Search budget", "Бюджет поиска"],
    "Facebook Ads": ["Facebook Ads", "Facebook Ads"],
    "TikTok Ads": ["TikTok Ads", "TikTok Ads"],
    "Google Ads": ["Google Ads", "Google Ads"],
    "Ultima": ["Ultima", "Ultima"],
    "Burner": ["Burner", "Burner"],
    "Kart bazında ortak limit şablonları": ["Shared limit templates per card", "Общие шаблоны лимитов по картам"],
    "Aylık muhasebe dışa aktarma": ["Monthly accounting export", "Месячный экспорт для учёта"],
    "Bakiye eşik uyarısı": ["Balance threshold alert", "Предупреждение о пороге баланса"],
    "BIN arızası": ["BIN impairment", "Сбой BIN"],
    "Yeni BIN": ["New BIN", "Новый BIN"],
    "Özet": ["Overview", "Обзор"],
    "Kartlarım": ["My cards", "Мои карты"],
    "Siparişler": ["Orders", "Заказы"],
    "Ödemeler": ["Payments", "Платежи"],
    "Para Yatır/Çek": ["Deposit/Withdraw", "Ввод/вывод"],
    "Planı yükselt": ["Upgrade plan", "Повысить план"],
    "Son 7 gün": ["Last 7 days", "Последние 7 дней"],
    "Son işlemler": ["Recent activity", "Последние операции"],
    "ClayVirtualCard ile Anında Sanal Kartını Oluştur.": ["Create Your Virtual Card Instantly with ClayVirtualCard.", "Создайте виртуальную карту мгновенно с ClayVirtualCard."],
    "Kart oluşturmak sadece 1 blok zincir onayına bakar. Bakiyeni yükle, anında kartını oluştur ve dilediğin gibi harca.": ["Card creation takes just 1 blockchain confirmation. Top up your balance, generate your card instantly, and spend worldwide.", "Создание карты занимает всего 1 подтверждение блокчейна. Пополните баланс, мгновенно выпустите карту и тратьте по всему миру."],
    "⚡ 100'den Fazla Token Desteği ile Sınırsız Esneklik": ["⚡ Supported by 100+ Tokens for Wide Flexibility", "⚡ Поддержка более 100 токенов для широкой гибкости"],
    "Kripto ile Güvenli Ödeme": ["Secure Crypto Payments", "Безопасная оплата криптовалютой"],
    "Sanal kartını kripto varlıklarınla güvenle finanse et ve hemen harcamaya başla.": ["Fund your virtual card securely with digital assets and start spending immediately.", "Безопасно пополните виртуальную карту цифровыми активами и сразу начните тратить."],
    "Güvenlik Uyarısı": ["Security Warning", "Предупреждение о безопасности"],
    "Kart bilgilerinizi, kullanıcı adınızı ve şifrenizi kimseyle paylaşmayınız. ClayVirtualCard ekibi sizden asla şifre talep etmez.": ["Never share your card details, username, or password with anyone. Our team will never ask for your password.", "Никому не сообщайте данные карты, имя пользователя и пароль. Команда ClayVirtualCard никогда не запрашивает пароль."],
    "7/24 Kesintisiz Canlı Destek": ["24/7 Live Support", "Круглосуточная поддержка"],
    "Sorularınız veya işlemleriniz için uzman destek ekibimiz her an yanınızda.": ["Our expert support team is always here to assist you with any questions or transactions.", "Наша команда поддержки всегда рядом, чтобы помочь с вопросами и операциями."],
    "Şeffaf ve Anlık Onaylar": ["Transparent & Instant Confirmations", "Прозрачные и мгновенные подтверждения"],
    "Bakiyeniz blok zinciri ağı üzerinde 1 onay aldığı anda kartınız kullanıma hazır hale gelir.": ["Your card is ready to use as soon as your deposit receives 1 blockchain confirmation.", "Карта готова к использованию, как только депозит получит 1 подтверждение блокчейна."],
    "Kart sağlayıcı anahtarı yok. Yönetim ücretler ekranından Kripicard anahtarı yapıştırılmalı. Kart numarası üretilmedi.": ["The card provider key is missing. Paste the Kripicard key on the admin fees screen. No card number was issued.", "The card provider key is missing. Paste the Kripicard key on the admin fees screen. No card number was issued."],
    "Kripicard tutarı en az 10 USD olmalı.": ["The amount on the card must be at least 10 USD.", "The amount on the card must be at least 10 USD."],
    "Kart sağlayıcı isteği kabul etmedi.": ["The card provider rejected the request.", "The card provider rejected the request."],
    "Kart numarası yok. Sağlayıcı anahtarı eklenince gerçek kart basılır.": ["No card number yet. A real card is issued after the provider key is added.", "No card number yet. A real card is issued after the provider key is added."],
    "Bu kart bir vitrin kaydı. Gerçek numara yok.": ["This is a display card. There is no real number.", "This is a display card. There is no real number."],
    "Açılış": ["Issue fee", "Issue fee"],
    "Karta yazılan": ["On the card", "On the card"],
    "Sağlayıcı": ["Provider", "Provider"],
    "Toplam": ["Total", "Total"],
    "Kartı oluştur": ["Create card", "Create card"],
    "Kart Al": ["Issue card", "Issue card"],
    "Kaydet": ["Save", "Save"],
    "Görüntüle": ["Show", "Show"],
    "Gizle": ["Hide", "Hide"],
    "Şifre değiştir": ["Change password", "Change password"],
    "Seed görüntüle": ["View seed", "View seed"],
    "Telegram ID ekle": ["Add Telegram ID", "Add Telegram ID"],
    "Mevcut parola": ["Current password", "Current password"],
    "Yeni parola": ["New password", "New password"],
    "Yeni parola tekrar": ["Repeat new password", "Repeat new password"],
    "Tohum yükleniyor.": ["Loading the seed.", "Loading the seed."],
    "Bu hesapta kayıtlı tohum yok.": ["This account has no seed saved.", "This account has no seed saved."],
    "Karta git": ["Open card", "Open card"],
    "Basım siparişleri": ["Issue orders", "Issue orders"],
    "Hazırlanan, teslim edilen ve iptal edilen kartlar burada durur.": ["Prepared, delivered and cancelled cards stay here.", "Prepared, delivered and cancelled cards stay here."],
    "Bakiye 0 başlar. Yükleme kartın altından yapılır.": ["Balance starts at 0. Top-up is done from the card.", "Balance starts at 0. Top-up is done from the card."],
    "ornek_ad": ["username", "username"],
    "Parolan": ["Your password", "Your password"],
    "Kartının adı": ["Card name", "Card name"],
    "Kısa konu": ["Short subject", "Short subject"],
    "Ne oldu, kısaca yaz.": ["What happened, in short.", "What happened, in short."],
    "Send ticket": ["Send ticket", "Send ticket"],
    "Talebi gönder": ["Send ticket", "Send ticket"],
    "Remember me": ["Remember me", "Remember me"],
    "Beni hatırla": ["Remember me", "Remember me"]
  };

  function t(key) {
    var lang = getLang();
    var row = UI[key];
    return row ? (row[lang] || row.tr) : key;
  }

  function getLang() {
    try {
      var stored = localStorage.getItem("clay-lang") || "";
      if (stored === "en" || stored === "tr") return stored;
      if (stored === "ru") return "en";
    } catch (e) {}
    var lang = document.documentElement.lang || "tr";
    return lang === "en" ? "en" : "tr";
  }

  function storeReady() {
    return typeof window.__clay === "object" && window.__clay && typeof window.__clay.get === "function";
  }
  function db() { return storeReady() ? window.__clay.get() : null; }
  function sessionId() {
    try {
      var tab = sessionStorage.getItem("clay-session") || "";
      if (tab) return tab;
      if (localStorage.getItem("clay-remember") === "1") return localStorage.getItem("clay-session") || "";
    } catch (e) {}
    return "";
  }
  function current() {
    var data = db();
    var id = sessionId();
    if (!data || !id) return null;
    return (data.users || []).find(function (user) { return user.id === id; }) || null;
  }
  function onDesk() {
    return /\/panel|\/clayadm!nxx/.test(location.pathname);
  }
  function usd(cents) {
    var n = (Number(cents) || 0) / 100;
    return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD";
  }
  function parseUsd(raw) {
    var a = String(raw || "").trim().replace(/\s/g, "").replace(",", ".");
    if (!/^\d+(\.\d{1,2})?$/.test(a)) return null;
    var parts = a.split(".");
    var cents = 100 * Number(parts[0]) + Number((parts[1] || "").padEnd(2, "0"));
    return Number.isSafeInteger(cents) ? cents : null;
  }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function icon(path) {
    return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" d="' + path + '"></path></svg>';
  }
  var COPY_ICON = icon("M8 8h11v11H8zM5 16V5h11");
  var CHECK_ICON = icon("M5 12.5 9.2 17 19 7");

  function seedLedger() {
    if (!storeReady() || window.__clay.php()) return;
    var data = db();
    var missingBin = !data.bins || ["bin_441357_facebook_ads", "bin_441357_google_ads", "bin_474613_tiktok", "bin_474613_ultima", "bin_474613_burner"].some(function (id) {
      return !data.bins.some(function (bin) { return bin.id === id; });
    });
    var missingCoupon = !data.coupons || !data.coupons.some(function (coupon) { return coupon.code === "CLAY10"; });
    var missingRoad = !Array.isArray(data.roadmap) || !data.roadmap.length;
    var missingExpiry = (data.cards || []).some(function (card) { return !card.expiresAt && card.createdAt; });
    var missingVotes = (data.users || []).some(function (user) { return !user.roadmapVotes; });
    if (!missingBin && !missingCoupon && !missingRoad && !missingExpiry && !missingVotes) return;
    window.__clay.update(function (data) {
      data.bins = data.bins || [];
      var rows = [
        ["bin_441357_facebook_ads", "facebook_ads", "441357"],
        ["bin_441357_google_ads", "google_ads", "441357"],
        ["bin_474613_tiktok", "tiktok", "474613"],
        ["bin_474613_ultima", "ultima", "474613"],
        ["bin_474613_burner", "burner", "474613"]
      ];
      data.bins = data.bins.filter(function (bin) {
        var digits = String(bin.digits || bin.label || "");
        return digits.indexOf("49387520") !== 0 && digits.indexOf("493728") !== 0 && digits.indexOf("531357") !== 0;
      });
      rows.forEach(function (row) {
        if (!data.bins.some(function (bin) { return bin.id === row[0]; })) {
          data.bins.push({ id: row[0], type: row[1], label: row[2], digits: row[2] });
        }
      });
      data.coupons = Array.isArray(data.coupons) ? data.coupons : [];
      if (!data.coupons.some(function (coupon) { return coupon.code === "CLAY10"; })) {
        data.coupons.push({ code: "CLAY10", percent: 10, active: true, createdAt: new Date().toISOString() });
      }
      if (!Array.isArray(data.roadmap) || !data.roadmap.length) {
        data.roadmap = [
          { id: "rd_limits", title: "Kart bazında ortak limit şablonları", votes: 0 },
          { id: "rd_export", title: "Aylık muhasebe dışa aktarma", votes: 0 },
          { id: "rd_alerts", title: "Bakiye eşik uyarısı", votes: 0 }
        ];
      }
      (data.cards || []).forEach(function (card) {
        if (!card.expiresAt && card.createdAt && !Number.isNaN(Date.parse(card.createdAt))) {
          card.expiresAt = new Date(Date.parse(card.createdAt) + 30 * 86400000).toISOString();
        }
      });
      (data.users || []).forEach(function (user) {
        if (!user.roadmapVotes || typeof user.roadmapVotes !== "object") user.roadmapVotes = {};
      });
    });
  }

  function fundingWord(kind) {
    if (kind === "prepaid") return t("prepaid");
    if (kind === "debit") return t("debit");
    if (kind === "credit") return t("credit");
    return "";
  }

  function onCardAdd() {
    return /\/panel\/kartlar\/yeni\/?$/.test(location.pathname);
  }

  function metaHtml(bin) {
    return '<span class="bin-meta is-global" data-bin="' + esc(bin) + '" data-source="global" data-country="">' +
      '<span class="bin-digits">' + esc(bin) + "</span></span>";
  }

  function rememberBin(bin, info) { binCache[bin] = info; }

  async function lookupBin(bin) {
    if (binCache[bin]) return binCache[bin];
    binCache[bin] = { source: "pending", type: "", country: null };
    var live = null;
    try {
      var res = await fetch("/api/bin-lookup.php?bin=" + encodeURIComponent(bin), { headers: { Accept: "application/json" } });
      if (res.ok) {
        var data = await res.json();
        if (data && data.ok && data.type) live = data;
      }
    } catch (e) {}
    var info;
    if (live) {
      var kind = live.prepaid || live.type === "prepaid" ? "prepaid" : String(live.type || "").toLowerCase();
      info = { source: live.source || "binlist", type: kind, country: null, alpha2: null, emoji: null };
    } else {
      var known = VERIFIED[bin] || { type: "", country: null, unavailableCountry: true };
      info = { source: "verified", type: known.type || "", country: null, alpha2: null, emoji: null, unavailableCountry: true };
    }
    rememberBin(bin, info);
    paintBins();
    return info;
  }

  function paintBins() {
    return;
    if (!/\/panel\/kartlar/.test(location.pathname) || !db()) return;
    document.querySelectorAll("article[id^='crd_']").forEach(function (article) {
      var card = (db().cards || []).find(function (item) { return item.id === article.id; });
      if (!card) return;
      var bin = CATALOG[card.type];
      if (!bin) return;
      var face = article.querySelector(".vcard-id");
      if (!face) return;
      var info = binCache[bin];
      if (!info || info.source === "pending") return;
      var html = metaHtml(bin);
      var slot = face.querySelector(".bin-meta");
      var key = "global|" + bin + "|" + getLang();
      if (!slot || slot.dataset.key !== key) {
        if (slot) slot.remove();
        face.insertAdjacentHTML("beforeend", html);
        var painted = face.querySelector(".bin-meta");
        if (painted) painted.dataset.key = key;
      }
    });
  }

  function ensureLangSwitch() {
    return;
    if (document.querySelector(".clay-lang")) return;
    var bar = document.createElement("div");
    bar.className = "clay-lang";
    bar.dataset.claySkip = "1";
    ["tr", "en"].forEach(function (code) {
      var button = document.createElement("button");
      button.type = "button";
      button.dataset.lang = code;
      button.textContent = code.toUpperCase();
      if (getLang() === code) button.className = "is-on";
      bar.appendChild(button);
    });
    document.body.appendChild(bar);
    document.querySelectorAll(".clay-en").forEach(function (node) {
      if (node.parentElement.querySelector(".clay-ru")) return;
      var ru = document.createElement("span");
      ru.className = "clay-ru";
      ru.textContent = "ВИРТУАЛЬНЫЕ КАРТЫ";
      node.parentElement.appendChild(ru);
    });
  }

  function translateText(value, lang) {
    if (lang === "tr" || value == null) return value;
    var exact = PHRASES[value];
    if (!exact && PHRASES[String(value).trim()] && String(value).trim() === value) exact = PHRASES[value];
    if (PHRASES[String(value).trim()] && /^\s*$/.test(value) === false) {
      var trimmed = String(value).trim();
      if (PHRASES[trimmed] && trimmed === String(value).replace(/\s+$/g, "").replace(/^\s+/g, "")) {
        var pair = PHRASES[trimmed];
        var lead = value.match(/^\s*/)[0];
        var tail = value.match(/\s*$/)[0];
        return lead + (lang === "ru" ? pair[1] : pair[0]) + tail;
      }
    }
    var source = String(value);
    var rules = [
      [/^Bu tutar kartın işlem limitini \((.+)\) aşıyor\. İşlem uygulanmadı\.$/, "This amount exceeds the card transaction limit ($1). The charge was not applied.", "Сумма выше лимита операции карты ($1). Списание не проведено."],
      [/^Bu tutar kartın günlük limitini \((.+)\) aşıyor\. Bugün kullanılan (.+)\. İşlem uygulanmadı\.$/, "This amount exceeds the card daily limit ($1). Used today: $2. The charge was not applied.", "Сумма выше дневного лимита карты ($1). Сегодня использовано $2. Списание не проведено."],
      [/^Günlük (.+) · İşlem (.+) · Bugün kullanılan (.+)$/, "Daily $1 · Transaction $2 · Used today $3", "Дневной $1 · Операция $2 · Сегодня $3"],
      [/^Harcama işlendi\. (.+) düştü\.$/, "Charge applied. $1 was deducted.", "Списание проведено. Снято $1."],
      [/^Kazanılan pasif komisyon: (.+)$/, "Passive commission earned: $1", "Начисленная комиссия: $1"],
      [/^(\d+) gün kaldı$/, "$1 days left", "$1 days left"],
      [/^Bitmesine (\d+) gün kaldı\.?$/, "Expires in $1 days.", "Expires in $1 days."],
      [/^Bitmesine (\d+) days left\.?$/, "Expires in $1 days.", "Expires in $1 days."],
      [/^Clay Prime\. Bitmesine (\d+) gün kaldı\. Yenileme (.+)$/, "Clay Prime. Expires in $1 days. Renews $2.", "Clay Prime. Expires in $1 days. Renews $2."],
      [/^Clay Prime\. Bitmesine (\d+) days left\. Yenileme (.+)$/, "Clay Prime. Expires in $1 days. Renews $2.", "Clay Prime. Expires in $1 days. Renews $2."]
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(source.trim())) {
        var replaced = source.trim().replace(rules[i][0], lang === "ru" ? rules[i][2] : rules[i][1]);
        return source.replace(source.trim(), replaced);
      }
    }
    return value;
  }

  function applyI18n(root) {
    var lang = getLang();
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
    document.querySelectorAll(".clay-lang button").forEach(function (button) {
      if (button.dataset.lang === "ru") button.hidden = true;
      button.classList.toggle("is-on", button.dataset.lang === lang);
    });
    document.querySelectorAll(".lang-option, .clay-ru").forEach(function (el) {
      var t = (el.textContent || "");
      if (el.classList.contains("clay-ru") || /Рус|Russian|Rusça/i.test(t)) el.hidden = true;
    });
    (root || document).querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!UI[key]) return;
      var next = t(key);
      if (el.textContent !== next) el.textContent = next;
    });
    (root || document).querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var bits = el.getAttribute("data-i18n-attr").split(":");
      if (UI[bits[1]]) el.setAttribute(bits[0], t(bits[1]));
    });
    var walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parent = node.parentElement;
      if (!parent || parent.closest("[data-clay-skip], [data-i18n], .bin-meta, .bell-count, .note-count, script, style, .vcard-kicker, .vcard-holder, .vcard-pan, .vcard-v")) return;
      if (!node.__clayTr) node.__clayTr = node.nodeValue;
      else if (node.nodeValue !== node.__clayTr && node.nodeValue !== translateText(node.__clayTr, "en") && node.nodeValue !== translateText(node.__clayTr, "ru")) node.__clayTr = node.nodeValue;
      var next = lang === "tr" ? node.__clayTr : translateText(node.__clayTr, lang);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
    (root || document).querySelectorAll("[placeholder], [aria-label]").forEach(function (el) {
      if (el.closest("[data-clay-skip]")) return;
      ["placeholder", "aria-label"].forEach(function (attr) {
        var store = "data-clay-src-" + attr;
        var value = el.getAttribute(attr);
        if (!value) return;
        var source = el.getAttribute(store);
        var en = source ? translateText(source, "en") : "";
        var ru = source ? translateText(source, "ru") : "";
        if (!source || (value !== source && value !== en && value !== ru)) {
          el.setAttribute(store, value);
          source = value;
        }
        var next = lang === "tr" ? source : translateText(source, lang);
        if (typeof next === "string" && next !== value) el.setAttribute(attr, next);
      });
    });
  }

  function rememberLang(code) {
    try { localStorage.setItem("clay-lang", code); } catch (e) {}
    document.cookie = "clay-lang=" + code + ";path=/;max-age=31536000;SameSite=Lax";
  }

  function pickLang(code) {
    rememberLang(code);
    document.documentElement.lang = code;
    applyI18n(document.body);
    var opener = document.querySelector(".lang-btn");
    if (!opener) return;
    opener.click();
    setTimeout(function () {
      var labels = { tr: ["Türkçe"], en: ["English"], ru: ["Russian"] };
      var option = [].slice.call(document.querySelectorAll(".lang-option")).find(function (el) {
        return labels[code].some(function (label) { return el.textContent.indexOf(label) !== -1; });
      });
      if (option) option.click();
      else if (document.querySelector(".lang-menu")) opener.click();
      applyI18n(document.body);
    }, 40);
  }

  function rememberBox() {
    if (!/\/giris\/?$/.test(location.pathname)) return;
    var form = document.querySelector("form");
    if (!form || form.querySelector("[data-remember]")) return;
    var slot = form.querySelector("button.auth-primary");
    if (!slot) return;
    var label = document.createElement("label");
    label.className = "clay-remember";
    label.innerHTML = '<input type="checkbox" data-remember name="hatirla"> <span data-i18n="remember"></span>';
    slot.parentElement.insertBefore(label, slot);
  }

  var lockFails = 0;
  try { lockFails = Number(sessionStorage.getItem("clay-lock-fails") || "0") || 0; } catch (e) { lockFails = 0; }

  function lockedFlag() {
    try { return sessionStorage.getItem("clay-locked") === "1"; } catch (e) { return false; }
  }

  function rememberAccount(name) {
    if (!name) return;
    try { sessionStorage.setItem("clay-user", name); } catch (e) {}
    try {
      if (localStorage.getItem("clay-remember") === "1") localStorage.setItem("clay-user", name);
    } catch (e) {}
  }

  function accountName() {
    var user = current();
    if (user && user.username) {
      rememberAccount(user.username);
      return user.username;
    }
    try {
      var tab = sessionStorage.getItem("clay-user") || "";
      if (tab) return tab;
      if (localStorage.getItem("clay-remember") === "1") return localStorage.getItem("clay-user") || "";
    } catch (e) {}
    return "";
  }

  function lockFrozen() {
    return lockFails >= 3;
  }

  function freezeLock() {
    var root = document.getElementById("clay-lock");
    if (!root) return;
    root.dataset.frozen = "1";
    root.querySelectorAll(".clay-lock-card input, .clay-lock-card button").forEach(function (el) { el.disabled = true; });
  }

  function thawLock() {
    var root = document.getElementById("clay-lock");
    if (!root) return;
    delete root.dataset.frozen;
    root.querySelectorAll(".clay-lock-card input, .clay-lock-card button").forEach(function (el) { el.disabled = false; });
  }

  function lockVisible() {
    var root = document.getElementById("clay-lock");
    return !!(root && !root.hidden);
  }

  function showLock() {
    if (!onDesk() || !sessionId()) return;
    if (Date.now() - lastActivity < IDLE_MS - 250) {
      try { sessionStorage.removeItem("clay-locked"); } catch (e) {}
      if (lockVisible()) hideLock();
      clearTimeout(idleTimer);
      idleTimer = null;
      armIdle();
      return;
    }
    clearTimeout(idleTimer);
    idleTimer = null;
    try { sessionStorage.setItem("clay-locked", "1"); } catch (e) {}
    accountName();
    var root = document.getElementById("clay-lock");
    if (!root) {
      root = document.createElement("div");
      root.id = "clay-lock";
      root.className = "clay-lock";
      root.dataset.idleMs = String(IDLE_MS);
      root.innerHTML = '<div class="clay-lock-stack"><form class="clay-lock-card" data-clay-skip="1"><p class="text-xs font-bold tracking-[0.18em] text-gold">CLAY</p><h2 data-i18n="lockTitle">Oturum kilitlendi</h2><p data-i18n="lockBody">Bir süredir işlem olmadı. Devam etmek için parolayı yeniden yaz.</p><label><span data-i18n="password">Parola</span><input class="field" type="password" name="parola" autocomplete="current-password" required></label><button class="btn btn-gold" type="submit" data-i18n="unlock">Kilidi aç</button><p class="clay-lock-msg" role="status"></p></form><button type="button" class="btn btn-ghost clay-seed-open" data-i18n="seedReset">Tohumla yeni parola belirle</button></div>';
      document.body.appendChild(root);
      root.querySelector(".clay-lock-card").addEventListener("submit", function (event) {
        event.preventDefault();
        unlock(root.querySelector(".clay-lock-card input").value);
      });
      root.querySelector(".clay-seed-open").addEventListener("click", function () {
        var stack = root.querySelector(".clay-lock-stack");
        var seedForm = root.querySelector(".clay-lock-seed");
        if (!seedForm) {
          seedForm = document.createElement("form");
          seedForm.className = "clay-lock-seed";
          seedForm.dataset.claySkip = "1";
          seedForm.innerHTML = '<p data-i18n="seedHint"></p><label><span data-i18n="seedPhrase"></span><textarea class="field" name="tohum" rows="3" autocomplete="off" required></textarea></label><label><span data-i18n="password"></span><input class="field" type="password" name="parola" autocomplete="new-password" required></label><label><span data-i18n="seedAgain"></span><input class="field" type="password" name="parola2" autocomplete="new-password" required></label><button class="btn btn-gold" type="submit" data-i18n="seedSave"></button><p class="clay-seed-msg" role="status"></p>';
          stack.appendChild(seedForm);
          applyI18n(seedForm);
          seedForm.addEventListener("submit", function (event) {
            event.preventDefault();
            resetWithSeed(seedForm.tohum.value, seedForm.parola.value, seedForm.parola2.value);
          });
        }
        var box = seedForm.querySelector("textarea");
        if (box) box.focus();
      });
    }
    root.hidden = false;
    applyI18n(root);
    if (lockFrozen()) freezeLock();
  }

  function hideLock() {
    var root = document.getElementById("clay-lock");
    if (root) root.hidden = true;
    try { sessionStorage.removeItem("clay-locked"); } catch (e) {}
  }

  async function passwordOk(user, password) {
    if (user.passHash && user.passSalt) {
      var bytes = new TextEncoder().encode(user.passSalt + "\n" + password);
      var digest = await crypto.subtle.digest("SHA-256", bytes);
      var hex = Array.from(new Uint8Array(digest), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      return hex === user.passHash;
    }
    return typeof user.password === "string" && user.password.length > 0 && user.password === password;
  }

  async function postLedger(action, fields) {
    var res = await fetch("/api/ledger.php", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-Clay": "1" },
      body: JSON.stringify(Object.assign({ action: action }, fields || {}))
    });
    return JSON.parse(await res.text());
  }

  function noteFail() {
    lockFails += 1;
    try { sessionStorage.setItem("clay-lock-fails", String(lockFails)); } catch (e) {}
    var root = document.getElementById("clay-lock");
    var msg = root && root.querySelector(".clay-lock-msg");
    if (lockFrozen()) {
      freezeLock();
      if (msg) msg.textContent = t("lockFrozen");
      return;
    }
    if (msg) msg.textContent = t("lockBad");
  }

  async function unlock(password) {
    var root = document.getElementById("clay-lock");
    var msg = root && root.querySelector(".clay-lock-msg");
    if (lockFrozen()) {
      freezeLock();
      if (msg) msg.textContent = t("lockFrozen");
      return;
    }
    var username = accountName();
    if (!username) {
      await new Promise(function (resolve) { setTimeout(resolve, 500); });
      username = accountName();
    }
    var ok = false;
    var triedServer = false;
    if (username) {
      triedServer = true;
      var res = window.__clay && window.__clay.call ? await window.__clay.call("login", { kullanici: username, parola: password }) : null;
      if (res && res.code === "ok") ok = true;
      if (!ok && (!res || res.code === "e-defter")) {
        try {
          var raw = await postLedger("login", { kullanici: username, parola: password });
          if (raw && raw.code === "ok" && raw.me) {
            rememberAccount(raw.me.username || username);
            try { sessionStorage.setItem("clay-session", raw.me.id); } catch (e) {}
            lockFails = 0;
            try { sessionStorage.removeItem("clay-lock-fails"); } catch (e) {}
            hideLock();
            location.reload();
            return;
          }
        } catch (e) {}
      }
    }
    if (!triedServer) {
      var user = current();
      ok = !!(user && await passwordOk(user, password));
    }
    if (!ok) {
      noteFail();
      return;
    }
    lockFails = 0;
    try { sessionStorage.removeItem("clay-lock-fails"); } catch (e) {}
    if (msg) msg.textContent = "";
    hideLock();
    armIdle();
  }

  async function resetWithSeed(seed, password, again) {
    var root = document.getElementById("clay-lock");
    var msg = root && root.querySelector(".clay-seed-msg");
    var username = accountName();
    var payload = { kullanici: username, tohum: seed, parola: password, parola2: again };
    var res = window.__clay && window.__clay.call ? await window.__clay.call("kilit-parola", payload) : null;
    if (!res || res.code === "e-defter") {
      try { res = await postLedger("kilit-parola", payload); } catch (e) { res = null; }
    }
    var code = res && res.code;
    if (code !== "sifre") {
      if (msg) msg.textContent = code === "e-tohum-yok" ? t("seedMissing") : code === "e-parola" ? t("seedShape") : t("seedBad");
      return;
    }
    lockFails = 0;
    try { sessionStorage.removeItem("clay-lock-fails"); } catch (e) {}
    thawLock();
    var pass = root && root.querySelector(".clay-lock-card input");
    if (pass) pass.value = "";
    if (msg) msg.textContent = t("seedOk");
    var lockMsg = root && root.querySelector(".clay-lock-msg");
    if (lockMsg) lockMsg.textContent = t("seedOk");
  }

  function armIdle() {
    if (idleTimer || !onDesk() || !sessionId() || lockVisible()) return;
    var wait = IDLE_MS - (Date.now() - lastActivity);
    if (wait < 0) wait = 0;
    idleTimer = setTimeout(showLock, wait);
  }

  function bumpActivity(event) {
    if (event && event.isTrusted === false) return;
    if (event && event.target && event.target.closest && event.target.closest("#clay-lock")) return;
    if (lockVisible()) return;
    stampActivity(Date.now());
    try { sessionStorage.removeItem("clay-locked"); } catch (e) {}
    clearTimeout(idleTimer);
    idleTimer = null;
    armIdle();
  }

  function copyButton(field, labelKey) {
    return '<button type="button" class="clay-copy" data-act="copy-field" data-field="' + field + '" data-i18n-attr="aria-label:' + labelKey + '" aria-label="' + esc(t(labelKey)) + '">' + COPY_ICON + "</button>";
  }

  function faceDigits(card) {
    var pan = String((card && card.pan) || "").replace(/\D/g, "");
    var last = String((card && (card.last_4 || card.last4)) || "").replace(/\D/g, "");
    if (pan.length >= 13 && pan.length <= 19) {
      return { line: pan.replace(/(.{4})/g, "$1 ").trim(), copy: pan };
    }
    if (pan.length >= 4) last = pan.slice(-4);
    if (/^\d{4}$/.test(last)) return { line: "•••• •••• •••• " + last, copy: last };
    return { line: "", copy: "" };
  }

  function paintPanNode(pan, card) {
    if (!pan) return;
    var face = faceDigits(card);
    var num = pan.querySelector(".vcard-pan-num");
    if (!num) {
      num = document.createElement("span");
      num.className = "vcard-pan-num";
      Array.prototype.slice.call(pan.childNodes).forEach(function (node) {
        if (node.nodeType === 3 || (node.nodeType === 1 && !node.matches("button, .clay-copy, svg"))) {
          num.appendChild(node);
        }
      });
      pan.insertBefore(num, pan.firstChild);
    }
    if (face.line && num.textContent !== face.line) num.textContent = face.line;
  }

  function mountCardTools() {
    if (!/\/panel\/kartlar\/?$/.test(location.pathname) || !db()) return;
    var soon = [];
    document.querySelectorAll("article[id^='crd_']").forEach(function (article) {
      var card = db().cards.find(function (item) { return item.id === article.id; });
      if (!card) return;
      var pan = article.querySelector(".vcard-pan");
      if (pan) {
        paintPanNode(pan, card);
        if (!pan.querySelector("[data-field=pan]")) pan.insertAdjacentHTML("beforeend", copyButton("pan", "copyPan"));
      }
      var dates = article.querySelectorAll(".vcard-dates .vcard-v");
      if (dates[0] && !dates[0].parentElement.querySelector("[data-field=expiry]")) dates[0].insertAdjacentHTML("afterend", copyButton("expiry", "copyExp"));
      if (dates[1] && !dates[1].parentElement.querySelector("[data-field=cvv]")) dates[1].insertAdjacentHTML("afterend", copyButton("cvv", "copyCvv"));
      var days = card.expiresAt ? Math.ceil((Date.parse(card.expiresAt) - Date.now()) / 86400000) : null;
      if (days !== null && days <= 14) soon.push(card);
      var termText = t("expiry") + ": " + (card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : "—") + (card.autoRenew ? " · " + t("renewOn") : "") + (days !== null ? " · " + days + " " + t("daysLeft") : "");
      if (article.querySelector(".clay-term")) {
        var line = article.querySelector(".clay-term-line");
        if (line) line.textContent = termText;
        var pin = article.querySelector("[data-act=pin]");
        if (pin) pin.textContent = card.pinned ? t("unpin") : t("pin");
        return;
      }
      var box = document.createElement("div");
      box.className = "clay-term";
      box.innerHTML = '<p class="clay-term-line"></p><div class="clay-term-actions"><button type="button" class="btn btn-ghost" data-act="extend" data-i18n="extend">Süreyi 30 gün uzat</button><button type="button" class="btn btn-gold" data-act="renew" data-i18n="renew">Otomatik yenile</button></div><div class="clay-renew-ask" hidden><p>Otomatik yenileme açılsın mı?</p><button type="button" class="btn btn-gold" data-act="renew-yes">Onaylıyorum</button><button type="button" class="btn btn-ghost" data-act="renew-no">Reddet</button></div><p class="clay-renew-result" role="status"></p>';
      article.appendChild(box);
      box.querySelector(".clay-term-line").textContent = termText;
      var pinBtn = box.querySelector("[data-act=pin]");
      if (pinBtn) pinBtn.textContent = card.pinned ? t("unpin") : t("pin");
    });
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var note = host.querySelector(".clay-expiry-note");
    if (!soon.length) { if (note) note.remove(); return; }
    if (!note) {
      note = document.createElement("div");
      note.className = "clay-expiry-note";
      host.insertBefore(note, host.firstChild);
    }
    note.textContent = t("notice");
  }

  function refreshTerms() {
    document.querySelectorAll(".clay-term").forEach(function (node) { node.remove(); });
    mountCardTools();
  }

  function shiftExpiry(cardId, auto) {
    var note = function () {
      if (!auto) return;
      var article = document.getElementById(cardId);
      var line = article && article.querySelector(".clay-renew-result");
      if (line) line.textContent = "Otomatik yenileme açık. Süre dolunca kart yenilenir.";
    };
    if (window.__clay.php()) {
      window.__clay.call("kart-uzat", { id: cardId, auto: auto ? "1" : "0" }).then(function () {
        refreshTerms();
        note();
      });
      return "";
    }
    window.__clay.update(function (data) {
      var card = data.cards.find(function (item) { return item.id === cardId; });
      if (!card) return;
      var base = Date.parse(card.expiresAt || "") || Date.now();
      if (base < Date.now()) base = Date.now();
      card.expiresAt = new Date(base + 30 * 86400000).toISOString();
      if (auto) card.autoRenew = true;
    });
    refreshTerms();
    note();
    return "";
  }

  async function copyField(button) {
    var article = button.closest("article[id^='crd_']");
    var card = db() && db().cards.find(function (item) { return item.id === article.id; });
    if (!card) return;
    var field = button.getAttribute("data-field");
    var value = field === "pan" ? (faceDigits(card).copy || card.pan) : field === "expiry" ? card.expiry : card.cvv;
    try { await navigator.clipboard.writeText(String(value || "")); } catch (e) {}
    button.classList.add("is-copied");
    button.innerHTML = CHECK_ICON;
    button.setAttribute("aria-label", t("copied"));
    setTimeout(function () {
      button.classList.remove("is-copied");
      button.innerHTML = COPY_ICON;
      var key = field === "pan" ? "copyPan" : field === "expiry" ? "copyExp" : "copyCvv";
      button.setAttribute("aria-label", t(key));
    }, 1200);
  }

  function ascii(value) {
    return String(value || "").replace(/ş/g, "s").replace(/Ş/g, "S").replace(/ğ/g, "g").replace(/Ğ/g, "G").replace(/ı/g, "i").replace(/İ/g, "I").replace(/ö/g, "o").replace(/Ö/g, "O").replace(/ü/g, "u").replace(/Ü/g, "U").replace(/ç/g, "c").replace(/Ç/g, "C").replace(/[^\x20-\x7E]/g, " ");
  }

  function pdfEscape(value) {
    return ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }

  function buildPdf(lines) {
    var commands = ["0.10 0.07 0.14 rg", "36 760 523 48 re f", "0.94 0.79 0.54 rg", "36 760 523 6 re f", "1 1 1 rg", "BT /F1 18 Tf 48 784 Td (" + pdfEscape(lines[0]) + ") Tj ET", "0 0 0 rg"];
    var y = 730;
    lines.slice(1).forEach(function (line) {
      commands.push("BT /F1 12 Tf 48 " + y + " Td (" + pdfEscape(line) + ") Tj ET");
      y -= 22;
    });
    var stream = commands.join("\n");
    var objects = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
      "2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj\n",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n",
      "4 0 obj << /Length " + stream.length + " >> stream\n" + stream + "\nendstream\nendobj\n",
      "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n"
    ];
    var body = "%PDF-1.4\n";
    var offsets = [0];
    objects.forEach(function (obj) { offsets.push(body.length); body += obj; });
    var xref = body.length;
    body += "xref\n0 6\n0000000000 65535 f \n";
    for (var i = 1; i <= 5; i++) body += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    body += "trailer << /Size 6 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF";
    return body;
  }

  function downloadPdf(tx) {
    var data = db();
    var card = tx.cardId && data.cards.find(function (item) { return item.id === tx.cardId; });
    var ref = card ? card.id + " · " + String(card.pan || "").slice(-4) : "cuzdan";
    var file = buildPdf([
      "CLAY",
      "IC MUHASEBE FISI",
      t("notInvoice"),
      t("amount") + ": " + usd(Math.abs(tx.amount || tx.usdMinor || 0)),
      t("card") + ": " + ref,
      t("date") + ": " + new Date(tx.createdAt).toISOString(),
      t("status") + ": " + (tx.status || ""),
      "Ref: " + tx.id
    ]);
    var blob = new Blob([file], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "clay-fis-" + tx.id + ".pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
  }

  function mountReceipts() {
    if (!/\/panel\/islemler\/?$/.test(location.pathname) || !current()) return;
    if (document.querySelector(".mt-6 article, .mt-6 table tbody tr, .mt-6 .order-slip")) return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var box = host.querySelector(".clay-receipts");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-receipts glass rounded-[28px] p-5";
      host.appendChild(box);
    }
    var user = current();
    var rows = (db().transactions || []).filter(function (tx) { return tx.userId === user.id; }).slice().reverse();
    var sig = rows.map(function (tx) { return tx.id; }).join(",");
    if (box.dataset.sig === sig + getLang()) return;
    box.dataset.sig = sig + getLang();
    box.innerHTML = '<h2 data-i18n="receipts"></h2><p data-i18n="notInvoice"></p>' + rows.map(function (tx) {
      var card = tx.cardId && db().cards.find(function (item) { return item.id === tx.cardId; });
      return '<div class="clay-ticket-row"><span>' + esc(tx.title || tx.kind) + " · " + esc(usd(tx.amount || 0)) + " · " + esc(card ? card.id : "cuzdan") + " · " + esc(tx.status || "") + '</span><button type="button" class="btn btn-gold clay-pdf" data-act="pdf" data-tx="' + esc(tx.id) + '" data-i18n="slip"></button></div>';
    }).join("");
    applyI18n(box);
  }

  function couponOf(code) {
    var data = db();
    if (!data) return null;
    return (data.coupons || []).find(function (coupon) { return coupon.active && coupon.code === String(code || "").trim().toUpperCase(); }) || null;
  }

  function mountCoupon() {
    if (!/\/panel\/yukle\/?$/.test(location.pathname)) return;
    var box = document.querySelector(".clay-coupon");
    if (!box) {
      if (mountCoupon.timer) return;
      mountCoupon.timer = window.setTimeout(function () {
        mountCoupon.timer = 0;
        if (!/\/panel\/yukle\/?$/.test(location.pathname) || document.querySelector(".clay-coupon")) return;
        var input = document.querySelector('input[name=tutar][aria-label*="deme"], input[name=tutar][data-clay-src-aria-label*="deme"]');
        var form = input && input.closest("form");
        if (!form || !form.parentElement || !form.isConnected) return;
        var made = document.createElement("section");
        made.className = "clay-coupon glass rounded-[28px] p-5";
        made.innerHTML = '<h2 data-i18n="coupon">Kupon kodu</h2><label>Tutar (USD)<input class="field" name="tutar" data-coupon-amount value="10" inputmode="decimal"></label><label>Kupon kodu<input class="field" name="kupon" data-coupon value=""></label><p class="clay-coupon-out" role="status"></p><button type="button" class="btn btn-gold" data-act="apply-coupon">Yüzde kuponunu uygula</button><p class="clay-coupon-msg" role="status"></p>';
        try { form.parentElement.insertBefore(made, form); } catch (err) { return; }
        mountCoupon();
      }, 320);
      return;
    }
    if (box.dataset.bound) return;
    box.dataset.bound = "1";
    var amount = box.querySelector("[data-coupon-amount]");
    var code = box.querySelector("[data-coupon]");
    function paint() {
      var cents = parseUsd(amount && amount.value);
      var coupon = couponOf(code && code.value);
      var out = box.querySelector(".clay-coupon-out");
      if (!out) return;
      if (!cents) { out.textContent = ""; return; }
      if (!coupon) { out.textContent = code && code.value.trim() ? t("noCode") : t("original") + ": " + usd(cents); return; }
      var pay = Math.round(cents * (100 - coupon.percent) / 100);
      out.textContent = t("original") + ": " + usd(cents) + " → " + t("reduced") + ": " + usd(pay);
      out.dataset.pay = String(pay);
    }
    if (amount) amount.addEventListener("input", paint);
    if (code) code.addEventListener("input", paint);
    applyI18n(box);
  }

  function applyCoupon() {
    var box = document.querySelector(".clay-coupon");
    if (!box) return;
    var field = box.querySelector("[data-coupon-amount]") || document.querySelector('input[name=tutar][aria-label*="Ödeme"], input[name=tutar][data-clay-src-aria-label*="Ödeme"]');
    var cents = parseUsd(field && field.value);
    var raw = String((box.querySelector("[data-coupon]") || {}).value || "").trim().toUpperCase();
    var coupon = couponOf(raw);
    var msg = box.querySelector(".clay-coupon-msg");
    if (!msg) return;
    if (!/^[A-Z0-9]{3,16}$/.test(raw)) { msg.textContent = t("noCode"); return; }
    var percent = coupon ? Number(coupon.percent) : 0;
    if (window.__clay && window.__clay.php && window.__clay.php()) {
      window.__clay.call("kupon-uygula", { kod: raw }).then(function (res) {
        var me = res && res.me;
        var off = me && Number(me.couponPercent) > 0 ? Number(me.couponPercent) : percent;
        msg.textContent = res && (res.code === "ok" || res.code === "kupon") && off
          ? ("%" + off + " · " + t("credited"))
          : ((res && res.message) || t("noCode"));
      });
      return;
    }
    if (!coupon || !(percent >= 1 && percent <= 90)) { msg.textContent = t("noCode"); return; }
    window.__clay.update(function (data) {
      var user = data.users.find(function (item) { return item.id === sessionId(); });
      if (!user) return;
      user.couponCode = raw;
      user.couponPercent = percent;
    });
    msg.textContent = "%" + percent + " · " + t("credited");
  }

  function mountRoadmap() {
    return;
    if (new URLSearchParams(location.search).get("sekme") !== "yol") return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host || !current()) return;
    var box = host.querySelector(".clay-roadmap");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-roadmap glass rounded-[28px] p-5";
      host.appendChild(box);
    }
    var user = current();
    var items = (db().roadmap || []);
    var sig = getLang() + items.map(function (item) { return item.id + ":" + item.votes + ":" + (user.roadmapVotes && user.roadmapVotes[item.id] ? 1 : 0); }).join("|");
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig;
    box.innerHTML = '<h2 data-i18n="roadmap"></h2>' + items.map(function (item) {
      var voted = user.roadmapVotes && user.roadmapVotes[item.id];
      return '<div class="clay-road-row"><span>' + esc(item.title) + '</span><span>' + item.votes + ' <span data-i18n="voteCount"></span></span><button type="button" class="btn btn-gold clay-vote' + (voted ? " is-voted" : "") + '" data-act="vote" data-road="' + esc(item.id) + '" ' + (voted ? "disabled" : "") + ' data-i18n="' + (voted ? "voted" : "vote") + '"></button></div>';
    }).join("");
    applyI18n(box);
  }

  function vote(id) {
    var paint = function () {
      var box = document.querySelector(".clay-roadmap");
      if (box) box.dataset.sig = "";
      mountRoadmap();
    };
    if (window.__clay.php()) {
      window.__clay.call("yol-oy", { id: id }).then(paint);
      return;
    }
    window.__clay.update(function (data) {
      var user = data.users.find(function (item) { return item.id === sessionId(); });
      var item = (data.roadmap || []).find(function (row) { return row.id === id; });
      if (!user || !item) return;
      user.roadmapVotes = user.roadmapVotes || {};
      if (user.roadmapVotes[id]) return;
      user.roadmapVotes[id] = true;
      item.votes = (Number(item.votes) || 0) + 1;
    });
    paint();
  }

  function mountPriority() {
    if (!/\/panel\/destek\/?$/.test(location.pathname)) return;
    var area = document.querySelector("textarea[name=sikayet]");
    var form = area && area.closest("form");
    if (!form || form.querySelector("[name=oncelik]")) return;
    var button = form.querySelector("button");
    var label = document.createElement("label");
    label.className = "grid gap-1 text-sm";
    label.innerHTML = '<span data-i18n="priority"></span><select class="field" name="oncelik" required data-clay-skip="1"><option value="normal">Normal</option><option value="acil">Acil</option><option value="reklam">Reklam Akışı Durdu</option></select>';
    form.insertBefore(label, button || area.nextSibling);
    applyI18n(label);
  }

  function mountAdmin() {
    if (!/\/clayadm!nxx\/destek\/?$/.test(location.pathname) || !db()) return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var box = host.querySelector(".clay-admin-tickets");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-admin-tickets glass rounded-[28px] p-5";
      host.insertBefore(box, host.firstChild);
    }
    var tickets = (db().tickets || []).slice().reverse();
    var notices = (db().notices || []).filter(function (notice) { return notice.ref && String(notice.ref).indexOf("oncelik:") === 0; });
    var sig = tickets.map(function (ticket) { return ticket.id + (ticket.priority || ""); }).join(",") + notices.length + getLang();
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig;
    var alerts = notices.slice().reverse().map(function (notice) {
      var cls = /Acil|Urgent|Сроч/.test(notice.title) ? "prio-acil" : "prio-reklam";
      return '<div class="clay-admin-alerts ' + cls + '"><strong>' + esc(notice.title) + "</strong><p>" + esc(notice.body) + "</p></div>";
    }).join("");
    box.innerHTML = alerts + '<h2 data-i18n="adminTickets"></h2>' + tickets.map(function (ticket) {
      var prio = ticket.priority || "normal";
      var label = prio === "acil" ? t("urgent") : prio === "reklam" ? t("ads") : t("normal");
      return '<div class="clay-ticket-row prio-' + prio + '"><span>' + esc(ticket.subject) + "</span><strong>" + esc(label) + "</strong></div>";
    }).join("");
    applyI18n(box);
  }

  function pinCouponAdmin(box) {
    if (!box) return;
    document.querySelectorAll("main.boot-screen .clay-coupon-admin").forEach(function (n) {
      if (n !== box) n.remove();
    });
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var header = host.querySelector(":scope > header") || host.querySelector("header.glass") || host.querySelector("header");
    if (header && box.parentNode === header) host.insertBefore(box, header.nextSibling);
    var live = host.querySelector(":scope > .clay-desk-live");
    var after = live || header;
    box.setAttribute("data-clay-pin", "coupon");
    box.id = box.id || "clay-coupon-admin";
    if (!after) {
      if (box.parentNode !== host) host.appendChild(box);
      return;
    }
    if (box.parentNode !== host || box.previousElementSibling !== after) host.insertBefore(box, after.nextSibling);
  }

  function mountCouponsAdmin() {
    var desk = /\/clayadm!nxx\/?$/.test(location.pathname);
    var fees = /\/clayadm!nxx\/ucretler\/?$/.test(location.pathname) && new URLSearchParams(location.search).get("sekme") === "kupon";
    if (!desk && !fees) return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    if (fees) document.body.classList.add("clay-sekme-on");
    document.querySelectorAll("main.boot-screen .clay-coupon-admin").forEach(function (n) { n.remove(); });
    var box = null;
    document.querySelectorAll(".clay-coupon-admin").forEach(function (el) {
      if (el.closest("main.boot-screen")) {
        el.remove();
        return;
      }
      if (!box) box = el;
      else if (el !== box) el.remove();
    });
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-coupon-admin clay-served glass rounded-[28px] p-5";
      box.id = "clay-coupon-admin";
      box.innerHTML = '<h2>Kupon kodları</h2><form class="clay-coupon-create"><label><span>Kupon kodu</span><input class="field" name="kod" required></label><label><span>Yüzde</span><input class="field" name="yuzde" inputmode="numeric" required></label><button class="btn btn-gold" type="submit">Kupon oluştur</button></form><div class="clay-coupon-list"></div>';
    }
    pinCouponAdmin(box);
    if (!db()) return;
    var coupons = db().coupons || [];
    var sig = getLang() + JSON.stringify(coupons);
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig;
    var list = box.querySelector(".clay-coupon-list");
    if (!list) return;
    list.innerHTML = coupons.map(function (coupon) {
      return '<div class="clay-coupon-row"><span>' + esc(coupon.code) + " · %" + coupon.percent + " · " + (coupon.active ? t("active") : t("inactive")) + "</span>" + (coupon.active ? '<button type="button" class="btn btn-ghost" data-act="disable-coupon" data-code="' + esc(coupon.code) + '">Kapat</button>' : "") + "</div>";
    }).join("");
  }

  function mountBinDemo() {
    document.querySelectorAll(".clay-bin-demo").forEach(function (node) { node.remove(); });
    return;
    if (!/\/panel\/bildirimler\/?$/.test(location.pathname)) return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host || host.querySelector(".clay-bin-demo")) return;
    var box = document.createElement("section");
    box.className = "clay-bin-demo glass rounded-[28px] p-5";
    box.innerHTML = '<button type="button" class="btn btn-ghost" data-act="bin-down" data-i18n="binDown"></button> <button type="button" class="btn btn-gold" data-act="bin-new" data-i18n="binNew"></button>';
    host.insertBefore(box, host.firstChild);
    applyI18n(box);
  }

  function confirmMarkup() {
    return '<article class="clay-sample" aria-label="Örnek kart"><p class="clay-sample-kicker">ÖRNEK</p><p class="clay-sample-brand">—</p><p class="clay-sample-line"><span>Kart</span><strong>—</strong></p><p class="clay-sample-line"><span>Yüklenen bakiye</span><strong>—</strong></p><p class="bin-badge"><span class="bin-dot"></span>Aktif</p><p class="bin-global">—</p></article><p class="clay-confirm-q">Tutarı ve kart türünü seç. Onaylıyor musun?</p><label class="clay-confirm-check"><input type="checkbox" data-clay-approve> <span>Onay kutusunu işaretleyin</span></label><div class="clay-confirm-actions"><button type="button" class="btn btn-gold" data-act="card-approve" disabled>Onaylıyorum</button><button type="button" class="btn btn-ghost" data-act="card-reject">Reddet</button></div><p class="clay-confirm-msg" role="status"></p>';
  }

  function dockConfirmBar() {
    return;
    var actions = document.querySelector(".clay-confirm-actions");
    if (!actions) return;
    var gate = document.querySelector(".clay-confirm");
    var mobile = document.body.classList.contains("clay-issue") && window.matchMedia("(max-width: 1023px)").matches;
    if (mobile) {
      if (actions.parentNode !== document.body) document.body.appendChild(actions);
      actions.classList.add("clay-confirm-dock");
      return;
    }
    actions.classList.remove("clay-confirm-dock");
    if (gate && actions.parentNode !== gate) {
      var note = gate.querySelector(".clay-confirm-msg");
      if (note) gate.insertBefore(actions, note);
      else gate.appendChild(actions);
    }
  }

  function mountCardConfirm() {
    return;
    if (!/\/panel\/kartlar\/yeni\/?$/.test(location.pathname)) {
      document.body.classList.remove("clay-issue");
      dockConfirmBar();
      return;
    }
    document.body.classList.add("clay-issue");
    var gate = document.querySelector(".clay-confirm");
    if (!gate) {
      gate = document.createElement("section");
      gate.className = "clay-confirm clay-served";
      gate.innerHTML = confirmMarkup();
      var host = document.querySelector(".mx-auto.min-h-screen") || document.body;
      host.appendChild(gate);
    }
    var field = document.querySelector('form input[name="etiket"]');
    var form = field && field.closest("form");
    var shell = document.querySelector(".mx-auto.min-h-screen") || document.body;
    if (shell.lastElementChild !== gate) shell.appendChild(gate);
    if (window.__clayPaintIssue) window.__clayPaintIssue();
    if (form && !form.dataset.clayGate) {
      form.dataset.clayGate = "1";
      form.addEventListener("submit", function (event) {
        var box = gate.querySelector("[data-clay-approve]");
        if (form.dataset.clayGo !== "1" || !box || !box.checked) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      }, true);
      var native = form.querySelector("button.btn-gold");
      if (native) native.hidden = true;
    }
    dockConfirmBar();
    if (gate.dataset.bound) return;
    gate.dataset.bound = "1";
    var box = gate.querySelector("[data-clay-approve]");
    var ok = gate.querySelector("[data-act=card-approve]");
    var note = gate.querySelector(".clay-confirm-msg");
    box.addEventListener("change", function () {
      ok.disabled = !box.checked;
      if (!box.checked && form) delete form.dataset.clayGo;
    });
    ok.addEventListener("click", function () {
      if (!box.checked || ok.disabled) return;
      var live = document.querySelector('form input[name="etiket"]');
      var liveForm = live && live.closest("form");
      var me = current();
      var balance = me ? Number(me.balance) || 0 : 0;
      if (!liveForm || balance < 1514) {
        if (liveForm) delete liveForm.dataset.clayGo;
        note.textContent = "Hesap basım ücretini karşılamıyor.";
        return;
      }
      liveForm.dataset.clayGo = "1";
      if (typeof liveForm.requestSubmit === "function") liveForm.requestSubmit();
    });
    gate.querySelector("[data-act=card-reject]").addEventListener("click", function () {
      if (form) delete form.dataset.clayGo;
      var live = document.querySelector('form input[name="etiket"]');
      var liveForm = live && live.closest("form");
      if (liveForm) delete liveForm.dataset.clayGo;
      box.checked = false;
      ok.disabled = true;
      note.textContent = "Kart oluşturulmadı.";
    });
  }

  function dressMarks() {
    document.querySelectorAll(".bin-badge").forEach(function (badge) {
      if (badge.closest(".clay-sample")) return;
      var host = badge.parentElement;
      if (!host || host.querySelector(":scope > .bin-global")) return;
      var line = document.createElement("span");
      line.className = "bin-global";
      line.textContent = "Global kart";
      host.appendChild(line);
    });
  }

  function unreadNotices() {
    var me = current();
    var data = db();
    if (!me || !data) return [];
    return (data.notices || []).filter(function (note) {
      return note && note.userId === me.id && !note.readAt;
    });
  }

  function paintBell() {
    var apply = function () {
      var unread = unreadNotices();
      var n = unread.length;
      document.querySelectorAll("a.bell").forEach(function (bell) {
        var badge = bell.querySelector(".bell-count");
        if (n < 1) {
          if (badge) badge.remove();
          return;
        }
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "note-count bell-count";
          bell.appendChild(badge);
        }
        badge.textContent = n > 9 ? "9+" : String(n);
      });
      if (!/\/panel\/bildirimler\/?$/.test(location.pathname)) return;
      var host = document.querySelector(".grid.gap-4");
      if (!host) return;
      var ul = host.querySelector("ul");
      if (!ul) {
        ul = document.createElement("ul");
        ul.className = "grid gap-3";
        var empty = host.querySelector("p.glass");
        if (empty) empty.replaceWith(ul);
        else host.appendChild(ul);
      }
      unread.forEach(function (note) {
        if (!note || !note.id || ul.querySelector('[data-note="' + note.id + '"]')) return;
        var blob = ul.textContent || "";
        if (note.title && blob.indexOf(note.title) !== -1 && note.body && blob.indexOf(note.body) !== -1) return;
        var li = document.createElement("li");
        li.className = "glass rounded-[24px] px-4 py-4";
        li.setAttribute("data-note", note.id);
        li.innerHTML = '<div class="flex flex-wrap items-start justify-between gap-3"><p class="font-display text-xl font-bold">' + esc(note.title) + '</p><span class="rounded-full bg-gold px-3 py-1 text-xs font-bold text-[#24180a]">Okunmadı</span></div><p class="mt-2 text-white/75">' + esc(note.body) + "</p>";
        ul.prepend(li);
      });
    };
    apply();
    window.setTimeout(apply, 80);
    window.setTimeout(apply, 400);
  }

  function pushNotice(title, body, ref) {
    var id = sessionId();
    if (window.__clay.php()) {
      window.__clay.call("bildirim-yaz", { baslik: title, mesaj: body, ref: ref }).then(paintBell);
      return;
    }
    window.__clay.update(function (data) {
      data.notices.push({ id: "nt_" + crypto.randomUUID(), userId: id, batch: crypto.randomUUID(), title: title, body: body, createdAt: new Date().toISOString(), readAt: null, ref: ref });
    });
    paintBell();
  }

  function mountNav() {
    if (!/\/clayadm!nxx/.test(location.pathname)) return;
    var row = document.querySelector("nav.mt-4 .flex.flex-wrap.items-center");
    if (!row || row.querySelector("[data-coupon-nav]")) return;
    var link = document.createElement("a");
    link.href = "/clayadm!nxx/ucretler/?sekme=kupon";
    link.dataset.couponNav = "1";
    link.className = "nav-pill rounded-full px-3 py-2 text-sm font-bold bg-white/5 text-white/80";
    link.textContent = "Kupon";
    row.appendChild(link);
  }

  document.addEventListener("pointerdown", bumpActivity, true);
  document.addEventListener("keydown", bumpActivity, true);
  document.addEventListener("input", bumpActivity, true);
  document.addEventListener("wheel", bumpActivity, true);
  document.addEventListener("touchstart", bumpActivity, true);
  document.addEventListener("scroll", bumpActivity, true);
  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (form && form.querySelector && /\/giris\/?$/.test(location.pathname) && window.__clay && window.__clay.php && window.__clay.php()) {
      var userField = form.querySelector("[name=kullanici]");
      var passField = form.querySelector("[name=parola]");
      if (userField && passField) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var remember = form.querySelector("[data-remember]");
        try { sessionStorage.setItem("clay-remember-choice", remember && remember.checked ? "1" : "0"); } catch (e) {}
        window.__clay.call("login", { kullanici: userField.value, parola: passField.value, hatirla: remember && remember.checked ? "1" : "0" }).then(function (res) {
          var me = res && res.me;
          if (!res || res.code !== "ok" || !me) {
            var note = form.querySelector(".clay-login-note");
            if (!note) {
              note = document.createElement("p");
              note.className = "clay-login-note banner-bad";
              note.setAttribute("role", "status");
              form.appendChild(note);
            }
            note.textContent = res && res.code === "e-askida" ? "Bu hesap askıya alındı. Giriş kapalı." : res && res.code === "e-kapali" ? "Bu hesap kalıcı olarak kapatıldı. Giriş kapalı." : "Kullanıcı adı veya parola hatalı.";
            return;
          }
          if (remember && remember.checked) {
            try {
              localStorage.setItem("clay-session", me.id);
              localStorage.setItem("clay-remember", "1");
              localStorage.setItem("clay-user", me.username);
              sessionStorage.removeItem("clay-session");
            } catch (e) {}
          } else {
            try { sessionStorage.setItem("clay-session", me.id); } catch (e) {}
            try { localStorage.removeItem("clay-session"); localStorage.removeItem("clay-remember"); localStorage.removeItem("clay-user"); } catch (e) {}
          }
          rememberAccount(me.username);
          try { sessionStorage.removeItem("clay-lock-fails"); } catch (e) {}
          location.href = me.role === "yonetici" ? "/clayadm!nxx/" : "/panel/";
        });
        return;
      }
    }
    if (form && form.querySelector && form.querySelector("[data-remember]")) {
      try { sessionStorage.setItem("clay-remember-choice", form.querySelector("[data-remember]").checked ? "1" : "0"); } catch (e) {}
    }
    if (form && form.classList.contains("clay-coupon-create")) {
      event.preventDefault();
      var code = String(form.kod.value || "").trim().toUpperCase();
      var percent = Number(form.yuzde.value);
      if (!/^[A-Z0-9]{3,16}$/.test(code) || !(percent >= 1 && percent <= 90)) return;
      var refresh = function () {
        var box = document.querySelector(".clay-coupon-admin");
        if (box) box.dataset.sig = "";
        mountCouponsAdmin();
      };
      if (window.__clay.php()) {
        window.__clay.call("kupon-kaydet", { kod: code, yuzde: String(percent) }).then(refresh);
        return;
      }
      window.__clay.update(function (data) {
        data.coupons = data.coupons || [];
        data.coupons.push({ code: code, percent: percent, active: true, createdAt: new Date().toISOString() });
      });
      refresh();
    }
  }, true);
  document.addEventListener("click", function (event) {
    var lang = event.target.closest && event.target.closest("[data-lang]");
    if (lang && lang.closest(".clay-lang")) { event.preventDefault(); pickLang(lang.dataset.lang); return; }
    var userLink = event.target.closest && event.target.closest("a[href*='kullanici?id=']");
    if (userLink && /\/clayadm!nxx/.test(location.pathname)) {
      event.preventDefault();
      location.href = userLink.getAttribute("href");
      return;
    }
    var act = event.target.closest && event.target.closest("[data-act]");
    if (!act) return;
    var name = act.getAttribute("data-act");
    if (name === "copy-field") { event.preventDefault(); copyField(act); return; }
    if (name === "pin") {
      event.preventDefault();
      var article = act.closest("article");
      if (window.__clay.php()) {
        window.__clay.call("kart-pin", { id: article.id }).then(refreshTerms);
        return;
      }
      window.__clay.update(function (data) {
        var card = data.cards.find(function (item) { return item.id === article.id; });
        if (card) card.pinned = !card.pinned;
      });
      refreshTerms();
      return;
    }
    if (name === "extend") { event.preventDefault(); shiftExpiry(act.closest("article").id, false); return; }
    if (name === "renew") {
      event.preventDefault();
      var renewArticle = act.closest("article");
      var ask = renewArticle && renewArticle.querySelector(".clay-renew-ask");
      if (ask) ask.hidden = false;
      return;
    }
    if (name === "renew-no") {
      event.preventDefault();
      var renewBox = act.closest(".clay-renew-ask");
      if (renewBox) renewBox.hidden = true;
      return;
    }
    if (name === "renew-yes") {
      event.preventDefault();
      var yesArticle = act.closest("article");
      if (!yesArticle) return;
      var yesAsk = yesArticle.querySelector(".clay-renew-ask");
      if (yesAsk) yesAsk.hidden = true;
      shiftExpiry(yesArticle.id, true);
      var yesNote = yesArticle.querySelector(".clay-renew-result");
      if (yesNote) yesNote.textContent = "Otomatik yenileme açık. Süre dolunca kart yenilenir.";
      return;
    }
    if (name === "pdf") {
      event.preventDefault();
      var tx = (db().transactions || []).find(function (item) { return item.id === act.getAttribute("data-tx"); });
      if (tx) downloadPdf(tx);
      return;
    }
    if (name === "card-pdf") {
      event.preventDefault();
      var cardArticle = act.closest("article");
      if (cardArticle) cardPdf(cardArticle);
      return;
    }
    if (name === "card-close") {
      event.preventDefault();
      var closeArticle = act.closest("article");
      if (!closeArticle) return;
      var menuBtn = closeArticle.querySelector(".card-menu-btn");
      if (menuBtn && menuBtn.getAttribute("aria-expanded") !== "true") menuBtn.click();
      setTimeout(function () {
        var item = Array.prototype.find.call(closeArticle.querySelectorAll(".card-menu-item"), function (btn) {
          return (btn.textContent || "").trim() === "Kartı kapat";
        });
        if (item) item.click();
      }, 40);
      return;
    }
    if (name === "apply-coupon") { event.preventDefault(); applyCoupon(); return; }
    if (name === "vote") { event.preventDefault(); vote(act.getAttribute("data-road")); return; }
    if (name === "disable-coupon") {
      event.preventDefault();
      var code = act.getAttribute("data-code") || "";
      if (!code) {
        var typed = document.querySelector(".clay-coupon-create [name=kod]");
        code = typed ? typed.value : "";
      }
      var refreshCoupons = function () {
        var admin = document.querySelector(".clay-coupon-admin");
        if (admin) admin.dataset.sig = "";
        mountCouponsAdmin();
      };
      if (window.__clay.php()) {
        window.__clay.call("kupon-kapat", { kod: code }).then(refreshCoupons);
        return;
      }
      window.__clay.update(function (data) {
        var coupon = (data.coupons || []).find(function (item) { return item.code === code; });
        if (coupon) coupon.active = false;
      });
      refreshCoupons();
      return;
    }
    if (name === "bin-down" || name === "bin-new") {
      event.preventDefault();
      var ref = name + ":" + crypto.randomUUID();
      pushNotice(name === "bin-down" ? "BIN arızası" : "Yeni BIN", name === "bin-down" ? "441357 kullanılamıyor" : "474613 eklendi", ref);
    }
  });

  function nudgeSupport(event) { return;
    var hit = event.target.closest(".clay-support-hit, a.tg-fab, .tg-fab-lottie");
    if (!hit) return;
    document.querySelectorAll(".clay-lottie-support, .clay-lottie-fab").forEach(function (el) {
      el.classList.add("is-hit");
      if (el.__anim && el.__anim.setSpeed) {
        el.__anim.setDirection(1);
        el.__anim.setSpeed(2.2);
        el.__anim.play();
      }
      setTimeout(function () {
        el.classList.remove("is-hit");
        if (el.__anim && el.__anim.setSpeed) el.__anim.setSpeed(1);
      }, 700);
    });
  }

  function actionButton(node) {
    if (!node || !node.closest) return null;
    var btn = node.closest("a.btn, button.btn, .auth-primary, .auth-outline, .plan-offer-cta, .clay-support-hit");
    if (!btn) return null;
    if (btn.matches(".lang-btn, .theme-pill, .clay-copy, .pw-eye, .legal-link")) return null;
    return btn;
  }

  function paintRipple(event) { return;
    var btn = actionButton(event.target);
    if (!btn) return;
    try { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; } catch (e) {}
    var rect = btn.getBoundingClientRect();
    var dot = document.createElement("span");
    dot.className = "clay-ripple";
    dot.style.left = (event.clientX - rect.left) + "px";
    dot.style.top = (event.clientY - rect.top) + "px";
    btn.appendChild(dot);
    setTimeout(function () { if (dot.parentNode) dot.parentNode.removeChild(dot); }, 600);
  }

  document.addEventListener("pointerdown", function (event) {
    paintRipple(event);
    var opt = event.target.closest && event.target.closest(".lang-option");
    if (!opt) return;
    var text = opt.textContent || "";
    var code = "";
    if (text.indexOf("English") !== -1) code = "en";
    else if (text.indexOf("Рус") !== -1 || text.indexOf("Rus") !== -1) code = "ru";
    else if (text.indexOf("Türk") !== -1) code = "tr";
    if (code) rememberLang(code);
  }, true);
  document.addEventListener("click", nudgeSupport, true);


  function mountCardFold() {
    if (!/\/panel\/kartlar\/?$/.test(location.pathname)) return;
    document.body.classList.add("clay-cards");
    document.querySelectorAll("article[id^='crd_']").forEach(function (article) {
      if (article.dataset.fold) return;
      article.dataset.fold = "1";
      article.classList.add("clay-fold");
      article.addEventListener("click", function (event) {
        if (event.target.closest("a, button, input, textarea, select, label, form")) return;
        var opening = !article.classList.contains("is-open");
        article.classList.toggle("is-open");
        if (!opening) return;
        var cvvBtn = Array.prototype.find.call(article.querySelectorAll("button"), function (btn) {
          return (btn.textContent || "").trim() === "Göster" && /CVV/.test((btn.parentElement && btn.parentElement.textContent) || "");
        });
        if (cvvBtn) cvvBtn.click();
      });
    });
  }

  function paintAuto(box, on, message) {
    var input = box.querySelector("[data-act=autofill]");
    var off = box.querySelector(".clay-autofill-off");
    var msg = box.querySelector(".clay-autofill-msg");
    if (input) input.checked = !!on;
    if (off) off.hidden = !!on;
    if (msg && typeof message === "string") msg.textContent = message;
  }

  function mountAutoFill() {
    // clay-v14.js owns the auto top-up switch; a second copy here raced it for the saved state.
    if (window.__clayAutoFillOwner) return;
    if (!/\/panel\/kartlar\/?$/.test(location.pathname) || !storeReady()) return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var box = host.querySelector(".clay-autofill");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-autofill glass rounded-[24px] p-4";
      box.innerHTML = '<label class="clay-autofill-label"><input type="checkbox" data-act="autofill" checked> <span>Minimum bakiye veya para yetersizliği durumunda otomatik kart yüklemesi</span></label><p class="clay-autofill-off" hidden>Otomatik doldurma devre dışı</p><p class="clay-autofill-msg" role="status"></p>';
      var title = host.querySelector("h1");
      var block = title && title.closest(".grid");
      if (block) block.insertBefore(box, block.firstChild);
      else host.insertBefore(box, host.firstChild);
      box.querySelector("[data-act=autofill]").addEventListener("change", function (event) {
        var on = event.target.checked;
        paintAuto(box, on, "");
        if (!(window.__clay && window.__clay.call)) return;
        window.__clay.call("oto-ayar", { acik: on ? "1" : "0" }).then(function (res) {
          var open = !res || res.code !== "kapali";
          paintAuto(box, open, "");
          if (open) window.__clay.call("oto-doldur", {}).then(function (fill) {
            if (fill && fill.message) paintAuto(box, fill.code !== "kapali", fill.message);
          });
        });
      });
    }
    if (box.dataset.asked === "1") return;
    box.dataset.asked = "1";
    if (!(window.__clay && window.__clay.call)) return;
    window.__clay.call("oto-durum", {}).then(function (res) {
      var open = !res || res.code !== "kapali";
      paintAuto(box, open, "");
      if (!open) return;
      window.__clay.call("oto-doldur", {}).then(function (fill) {
        if (fill && fill.message) paintAuto(box, fill.code !== "kapali", fill.message);
      });
    });
  }

  function cardPdf(article) {
    var card = db() && db().cards.find(function (item) { return item.id === article.id; });
    if (!card) return;
    downloadPdf({
      id: card.id,
      title: card.label || "Kart",
      amount: (Number(card.limit) || 0) - (Number(card.spent) || 0),
      cardId: card.id,
      createdAt: card.createdAt || new Date().toISOString(),
      status: card.status || ""
    });
  }

  function tick() {
    if (painting) return;
    painting = true;
    try {
      ensureLangSwitch();
      rememberBox();
      if (storeReady()) seedLedger();
      paintBins();
      mountCardTools();
      mountReceipts();
      mountCoupon();
      mountCardConfirm();
      dressMarks();
      mountRoadmap();
      mountPriority();
      mountAdmin();
      mountCouponsAdmin();
      mountBinDemo();
      mountNav();
      mountCardFold();
      mountAutoFill();
      applyI18n(document.body);
      if (onDesk() && sessionId() && Date.now() - lastActivity >= IDLE_MS - 250) showLock();
      else if (!sessionId()) hideLock();
      else {
        if (lockedFlag()) {
          try { sessionStorage.removeItem("clay-locked"); } catch (e) {}
          if (lockVisible()) hideLock();
        }
        armIdle();
      }
    } catch (err) {
      console.error(err);
    } finally {
      painting = false;
    }
  }

  Object.keys(CATALOG).forEach(function (type) {
    var bin = CATALOG[type];
    if (!binCache[bin]) lookupBin(bin);
  });
  var queued = false;
  var observer = new MutationObserver(function (muts) {
    if (queued) return;
    if (document.querySelector(".clay-lux-appmenu[open]")) return;
    for (var i = 0; i < muts.length; i++) {
      var t = muts[i].target;
      if (t && t.nodeType !== 1) t = t.parentElement;
      if (t && t.closest && t.closest(".clay-coupon-admin, .clay-desk-live, .clay-lux-appmenu, .clay-lux-notes")) return;
    }
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      tick();
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  tick();
  setInterval(function () {
    if (!onDesk() || !sessionId()) return;
    if (Date.now() - lastActivity < IDLE_MS - 250) return;
    var root = document.getElementById("clay-lock");
    if (!root || root.hidden) showLock();
  }, 400);
  var waits = 0;
  var timer = setInterval(function () {
    waits += 1;
    tick();
    if (storeReady() || waits > 40) clearInterval(timer);
  }, 150);
  window.__clayV2 = {
    idleMs: IDLE_MS,
    idleLeft: function () { return Math.max(0, IDLE_MS - (Date.now() - lastActivity)); },
    lookupBin: lookupBin,
    catalog: CATALOG,
    verified: VERIFIED
  };
})();

(function () {
  var RATE = 5;
  var drafts = {};
  var notes = {};

  function usd(cents) {
    var n = (Number(cents) || 0) / 100;
    return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD";
  }

  function parseUsd(raw) {
    var a = String(raw || "").trim().replace(/\s/g, "").replace(",", ".");
    if (!/^\d+(\.\d{1,2})?$/.test(a)) return null;
    var parts = a.split(".");
    var cents = 100 * Number(parts[0]) + Number((parts[1] || "").padEnd(2, "0"));
    return Number.isSafeInteger(cents) ? cents : null;
  }

  function dayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function storeReady() {
    return typeof window.__clay === "object" && window.__clay && typeof window.__clay.get === "function";
  }

  function db() {
    return storeReady() ? window.__clay.get() : null;
  }

  function sessionId() {
    try {
      var tab = sessionStorage.getItem("clay-session") || "";
      if (tab) return tab;
      if (localStorage.getItem("clay-remember") === "1") return localStorage.getItem("clay-session") || "";
    } catch (e) {}
    return "";
  }

  function current() {
    var data = db();
    var id = sessionId();
    if (!data || !id) return null;
    return (data.users || []).find(function (user) { return user.id === id; }) || null;
  }

  function codeOf() {
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    var out = "";
    for (var i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
    return out;
  }

  function ensureProfile() {
    if (!storeReady() || window.__clay.php()) return;
    var user = current();
    if (!user) return;
    if (user.referralCode && Array.isArray(user.sessions)) return;
    window.__clay.update(function (data) {
      var row = data.users.find(function (item) { return item.id === user.id; });
      if (!row) return;
      if (!row.referralCode) {
        var code = codeOf();
        while (data.users.some(function (item) { return item.referralCode === code; })) code = codeOf();
        row.referralCode = code;
      }
      if (!Array.isArray(row.sessions)) row.sessions = [];
      if (!Array.isArray(row.commissions)) row.commissions = [];
      if (typeof row.commissionKurus !== "number") row.commissionKurus = 0;
      if (typeof row.referredBy !== "string") row.referredBy = "";
    });
  }

  function captureQuery() {
    var params = new URLSearchParams(location.search);
    var ref = params.get("ref");
    if (ref) {
      try { sessionStorage.setItem("clay-ref", ref.replace(/[^A-Za-z0-9]/g, "").toUpperCase()); } catch (e) {}
    }
    var amount = params.get("tutar");
    if (amount && /kayit|kartlar\/yeni/.test(location.pathname)) {
      try { sessionStorage.setItem("clay-issue-amount", amount.trim()); } catch (e) {}
    }
  }

  function legalRow() {
    var row = document.createElement("p");
    row.className = "clay-legal-row";
    row.innerHTML = '<button type="button" class="legal-link" data-legal="terms">Şartlar ve Koşullar</button><button type="button" class="legal-link" data-legal="privacy">Gizlilik Politikası</button>';
    return row;
  }

  function ensureLegal() {
    document.querySelectorAll("footer").forEach(function (footer) {
      if (footer.classList.contains("vcard-foot") || footer.closest("article")) return;
      if (footer.querySelector("[data-legal]")) return;
      footer.appendChild(legalRow());
    });
    if (!document.querySelector("footer")) {
      var bar = document.querySelector("body > .clay-legal-fallback");
      if (!bar) {
        bar = document.createElement("footer");
        bar.className = "clay-legal-fallback";
        document.body.appendChild(bar);
      }
      if (!bar.querySelector("[data-legal]")) bar.appendChild(legalRow());
    }
    document.querySelectorAll("form").forEach(function (form) {
      if (!/\/(giris|kayit|sifre)\/?$/.test(location.pathname)) return;
      if (form.querySelector("[data-legal]")) return;
      if (form.closest("#clay-lock, [data-clay-skip]") || form.hasAttribute("data-clay-skip")) return;
      if (!form.querySelector(".auth-field, .field")) return;
      if (form.id === "ucret-hesap" || form.querySelector(".clay-limit")) return;
      form.appendChild(legalRow());
    });
  }

  function modalRoot() {
    var root = document.getElementById("clay-legal-modal");
    if (root) return root;
    root = document.createElement("div");
    root.id = "clay-legal-modal";
    root.className = "clay-modal";
    root.hidden = true;
    root.innerHTML = '<div class="clay-modal-back" data-legal-close="1"></div><article class="clay-modal-card glass" role="dialog" aria-modal="true" aria-labelledby="clay-legal-title"><button type="button" class="btn btn-ghost" data-legal-close="1">Kapat</button><h2 id="clay-legal-title"></h2><div class="clay-legal-body"></div></article>';
    document.body.appendChild(root);
    return root;
  }

  function termsHtml() {
    return [
      "<h3>Hizmet şartları</h3>",
      "<p>CLAY Sanal Kart Hizmetleri, reklam platformlarında kullanılmak üzere sanal kart açan bir aracı hizmettir. Hesap oluşturan kişi bu şartları, platform kurallarını ve ücret tablosunu kabul eder. Kart bakiyesi ABD doları cinsinden tutulur. Açılış bedeli, sağlayıcı ücreti ve aktarım komisyonu işlem anında ayrıca gösterilir.</p>",
      "<h3>Platform kuralları</h3>",
      "<ul><li>Hesap kullanıcı adı ve parolası başkasına devredilemez.</li><li>Seed anahtarı hesabın yedek erişimidir. Kaybeden kişi hesabına yeniden giremeyebilir.</li><li>Kartlar yalnızca yasal reklam ve ödeme amaçlarıyla kullanılır. Dolandırıcılık, yetkisiz çekim ve üçüncü kişi kart bilgisi kullanımı yasaktır.</li><li>Günlük limit ve işlem limiti kart sahibinin kendi koyduğu tavanlardır. Aşan tutar işlenmez.</li><li>CLAY, kural ihlalinde kartı dondurabilir veya hesabı kapatabilir.</li></ul>",
      "<h3>Sorumluluk reddi</h3>",
      "<p>CLAY bir banka veya elektronik para kuruluşu değildir. Kartın reklam platformunda kabulü, kampanya onayı ve döviz kurundaki değişim CLAY’in taahhüdü değildir. Hizmet olduğu gibi sunulur. Seed anahtarının kaybından, yanlış tutardan ve üçüncü kişi platformlarının ret kararından doğan zarardan CLAY sorumlu tutulamaz.</p>",
      "<h3>Kullanıcı hakları</h3>",
      "<p>Kullanıcı kendi bakiyesini, kart hareketlerini, oturum günlüğünü ve ortaklık komisyonunu panelden görür. Yanlış profil bilgisini hesap ekranından düzeltebilir. Hesabın kapatılmasını ve kişisel kayıtların silinmesini destek talebiyle isteyebilir. Ücret itirazı işlem kaydıyla birlikte incelenir.</p>"
    ].join("");
  }

  function privacyHtml() {
    return [
      "<h3>Gizlilik politikası</h3>",
      "<p>CLAY, hesabı işletmek için kullanıcı adı, parola özeti, seed özeti, bakiye, kart kayıtları, işlem geçmişi ve bu hesaba ait oturum günlüğünü saklar. Seed’in kendisi sunucuda düz metin olarak durmaz; kayıt sırasında yalnızca özeti tutulur. Veriler reklam amacıyla satılmaz.</p>",
      "<h3>Toplanan kayıtlar</h3>",
      "<ul><li>Kimlik yerine geçen kullanıcı adı ve güvenlik doğrulamaları.</li><li>Kart türü, limitler, harcama ve yükleme hareketleri.</li><li>Giriş oturumunda tarayıcı, IP adresi ve zaman. Bu liste yalnız hesap sahibine gösterilir.</li><li>Ortaklık kodu ve davet ilişkisinden doğan komisyon satırları.</li></ul>",
      "<h3>Kullanıcı hakları</h3>",
      "<p>Hesap sahibi verilerine panelden erişir, görünen adını ve iletişim notunu günceller, destek üzerinden silme veya dışa aktarma talebi açar. Talep, hesabın yasal saklama yükümlülüğü kalmadığında yerine getirilir. Oturum günlüğü yeni girişlerde satır ekler; eski satırlar silinerek gizlenmez.</p>",
      "<h3>Platform kuralları ve sorumluluk reddi</h3>",
      "<p>Gizlilik metni, hizmet şartlarının ve platform kurallarının yerine geçmez. CLAY bir banka değildir. Kartın üçüncü kişi platformunda çalışacağı garanti edilmez. Seed anahtarını kaybeden kullanıcı, bu politikanın kimlik doğrulamayı gevşetmesini isteyemez.</p>"
    ].join("");
  }

  function openLegal(kind) {
    var root = modalRoot();
    var title = root.querySelector("#clay-legal-title");
    var body = root.querySelector(".clay-legal-body");
    title.textContent = kind === "privacy" ? "Gizlilik Politikası" : "Şartlar ve Koşullar";
    body.innerHTML = kind === "privacy" ? privacyHtml() : termsHtml();
    root.hidden = false;
    var close = root.querySelector("[data-legal-close]");
    if (close) close.focus();
  }

  function closeLegal() {
    var root = document.getElementById("clay-legal-modal");
    if (root) root.hidden = true;
  }

  function usedToday(card) {
    if (!card || card.limitDay !== dayKey()) return 0;
    return Number(card.limitUsedUsd) || 0;
  }

  function limitMessage(card, cents) {
    var tx = Number(card.txLimitUsd) || 0;
    var daily = Number(card.dailyLimitUsd) || 0;
    if (tx > 0 && cents > tx) return "Bu tutar kartın işlem limitini (" + usd(tx) + ") aşıyor. İşlem uygulanmadı.";
    if (daily > 0 && usedToday(card) + cents > daily) return "Bu tutar kartın günlük limitini (" + usd(daily) + ") aşıyor. Bugün kullanılan " + usd(usedToday(card)) + ". İşlem uygulanmadı.";
    return "";
  }

  function paintFace(article, card) {
    var face = article.querySelector(".card-face .vcard-id") || article.querySelector(".vcard-id");
    if (!face) return;
    var bits = [];
    if (card.dailyLimitUsd > 0) bits.push("Günlük " + usd(card.dailyLimitUsd));
    if (card.txLimitUsd > 0) bits.push("İşlem " + usd(card.txLimitUsd));
    var line = face.querySelector(".vcard-limits");
    if (!bits.length) {
      if (line) line.remove();
      return;
    }
    if (!line) {
      line = document.createElement("p");
      line.className = "vcard-limits";
      face.appendChild(line);
    }
    var text = bits.join(" · ");
    if (line.textContent !== text) line.textContent = text;
  }

  function mountLimits() {
    if (!storeReady() || !/\/panel\/kartlar\/?$/.test(location.pathname)) return;
    var data = db();
    if (!data) return;
    document.querySelectorAll("article[id^='crd_']").forEach(function (article) {
      var card = (data.cards || []).find(function (item) { return item.id === article.id; });
      if (!card) return;
      paintFace(article, card);
      if (article.querySelector(".clay-limit")) return;
      var draft = drafts[card.id] || {};
      var box = document.createElement("section");
      box.className = "clay-limit";
      box.dataset.card = card.id;
      var daily = card.dailyLimitUsd > 0 ? usd(card.dailyLimitUsd) : "limitsiz";
      var tx = card.txLimitUsd > 0 ? usd(card.txLimitUsd) : "limitsiz";
      var note = notes[card.id] || { text: "", ok: false };
      box.innerHTML = '<p class="clay-limit-kicker">HARCAMA LİMİTLERİ</p>' +
        '<p class="clay-limit-summary text-sm text-white/70">Günlük ' + daily + ' · İşlem ' + tx + ' · Bugün kullanılan ' + usd(usedToday(card)) + '</p>' +
        '<label>Günlük limit (USD)<input class="field" name="gunluk" inputmode="decimal" value="' + (draft.gunluk || (card.dailyLimitUsd ? (card.dailyLimitUsd / 100).toFixed(2) : "")) + '" placeholder="50"></label>' +
        '<label>İşlem limiti (USD)<input class="field" name="islem" inputmode="decimal" value="' + (draft.islem || (card.txLimitUsd ? (card.txLimitUsd / 100).toFixed(2) : "")) + '" placeholder="20"></label>' +
        '<button type="button" class="btn btn-gold w-fit" data-act="save-limit">Limitleri kaydet</button>' +
        '<label>Harcama tutarı (USD)<input class="field" name="harca" inputmode="decimal" value="' + (draft.harca || "") + '" placeholder="10"></label>' +
        '<button type="button" class="btn btn-ghost w-fit" data-act="spend">Harcama yap</button>' +
        '<p class="text-xs text-white/50">Karta yükleme de aynı limitlere bakar. Limit aşılırsa tutar yazılmaz ve hata gösterilir.</p>' +
        '<p class="clay-limit-msg' + (note.text ? (note.ok ? " is-ok" : " is-bad") : "") + '" role="status">' + note.text + '</p>';
      var limitFace = article.querySelector(".card-face");
      if (limitFace && limitFace.parentElement) limitFace.parentElement.insertBefore(box, limitFace.nextSibling);
      else article.appendChild(box);
    });
  }

  function setMsg(box, text, ok) {
    notes[box.dataset.card] = { text: text, ok: !!ok };
    var msg = box.querySelector(".clay-limit-msg");
    if (!msg) return;
    msg.textContent = text;
    msg.classList.toggle("is-ok", !!ok);
    msg.classList.toggle("is-bad", !ok && !!text);
  }

  async function saveLimit(box) {
    var cardId = box.dataset.card;
    var daily = parseUsd(box.querySelector("[name=gunluk]").value);
    var tx = parseUsd(box.querySelector("[name=islem]").value);
    if (daily === null || tx === null || daily < 100 || tx < 100) {
      setMsg(box, "Günlük ve işlem limiti en az 1 USD olmalı.", false);
      return;
    }
    if (window.__clay.php()) {
      var remote = await window.__clay.call("kart-limit", { id: cardId, gunluk: (daily / 100).toFixed(2), islem: (tx / 100).toFixed(2) });
      if (!remote || remote.code !== "limit") {
        setMsg(box, (remote && remote.message) || "Limit kaydedilemedi.", false);
        return;
      }
    } else {
      window.__clay.update(function (data) {
        var card = data.cards.find(function (item) { return item.id === cardId; });
        if (card) {
          card.dailyLimitUsd = daily;
          card.txLimitUsd = tx;
        }
      });
    }
    drafts[cardId] = { gunluk: box.querySelector("[name=gunluk]").value, islem: box.querySelector("[name=islem]").value, harca: box.querySelector("[name=harca]").value };
    setMsg(box, "Limitler kaydedildi. Kartın üzerinde de görünür.", true);
    var summary = box.querySelector(".clay-limit-summary");
    if (summary) summary.textContent = "Günlük " + usd(daily) + " · İşlem " + usd(tx) + " · Bugün kullanılan " + usd(usedToday(db().cards.find(function (item) { return item.id === cardId; }) || {}));
    var article = box.closest("article");
    var card = db().cards.find(function (item) { return item.id === cardId; });
    if (article && card) paintFace(article, card);
  }

  async function spend(box) {
    var cardId = box.dataset.card;
    var cents = parseUsd(box.querySelector("[name=harca]").value);
    if (cents === null || cents < 100) {
      setMsg(box, "Harcama tutarı en az 1 USD olmalı.", false);
      return;
    }
    var data = db();
    var card = data && data.cards.find(function (item) { return item.id === cardId; });
    if (!card) {
      setMsg(box, "Kart bulunamadı.", false);
      return;
    }
    var blocked = limitMessage(card, cents);
    if (blocked) {
      setMsg(box, blocked, false);
      return;
    }
    if (window.__clay.php()) {
      var remote = await window.__clay.call("harca", { id: cardId, tutar: (cents / 100).toFixed(2) });
      if (!remote || (remote.code !== "harcama" && remote.code !== "ok")) {
        setMsg(box, (remote && remote.message) || "Harcama uygulanmadı.", false);
        return;
      }
      setMsg(box, (remote && remote.message) || "Harcama işlendi.", true);
      var auto = document.querySelector(".clay-autofill-msg");
      if (auto && remote && remote.message) auto.textContent = remote.message;
      return;
    }
    var error = "";
    window.__clay.update(function (ledger) {
      var id = sessionId();
      var user = ledger.users.find(function (item) { return item.id === id; });
      var row = ledger.cards.find(function (item) { return item.id === cardId && item.userId === id; });
      if (!user || !row) { error = "Kart bulunamadı."; return; }
      if (row.burner && (row.burnerUsed || row.status === "kapali")) { error = "Bu tek kullanımlık kart tek çekimde kapandı. Yeniden çekilemez."; return; }
      if (row.status !== "aktif") { error = "Kart harcama için aktif değil."; return; }
      var gate = limitMessage(row, cents);
      if (gate) { error = gate; return; }
      if (row.spent + cents > row.limit) { error = "Tutar kullanılabilir bakiyeyi aşıyor. İşlem uygulanmadı."; return; }
      if (cents > user.balance) { error = "Ana bakiye bu harcama için yetersiz. İşlem uygulanmadı."; return; }
      user.balance -= cents;
      row.spent += cents;
      if (row.burner) { row.burnerUsed = true; row.status = "kapali"; }
      if (row.limitDay !== dayKey()) { row.limitDay = dayKey(); row.limitUsedUsd = 0; }
      row.limitUsedUsd = (Number(row.limitUsedUsd) || 0) + cents;
      ledger.transactions.push({
        id: "tx_" + crypto.randomUUID(),
        userId: user.id,
        cardId: row.id,
        kind: "harcama",
        title: "Harcama",
        note: usd(cents) + " karttan düştü.",
        amount: -cents,
        usdMinor: -cents,
        status: "tamamlandi",
        createdAt: new Date().toISOString(),
        ref: null
      });
      creditCommission(ledger, user.id, cents, "harcama");
    });
    if (error) setMsg(box, error, false);
    else {
      setMsg(box, "Harcama işlendi. " + usd(cents) + " düştü.", true);
      var summary = box.querySelector(".clay-limit-summary");
      var card = db().cards.find(function (item) { return item.id === cardId; });
      if (summary && card) summary.textContent = "Günlük " + (card.dailyLimitUsd > 0 ? usd(card.dailyLimitUsd) : "limitsiz") + " · İşlem " + (card.txLimitUsd > 0 ? usd(card.txLimitUsd) : "limitsiz") + " · Bugün kullanılan " + usd(usedToday(card));
    }
  }

  function creditCommission() {}

  function invitedOf(user, data) {
    if (user && Array.isArray(user.invited) && user.invited.length) return user.invited;
    return (data.users || []).filter(function (item) { return item.referredBy === user.id && item.id !== user.id; }).map(function (item) {
      return { id: item.id, username: item.username, createdAt: item.createdAt };
    });
  }

  function commissionTotal(user) {
    return (user.commissions || []).reduce(function (sum, row) { return sum + (Number(row.usdMinor) || 0); }, 0);
  }

  function claimText(user) {
    var claim = user && user.referralClaim;
    if (!claim || !claim.id1 || !claim.id2) return "";
    return '<p class="clay-refer-saved">Kayıtlı talep: ' + esc(claim.id1) + " ve " + esc(claim.id2) + ". Ödeme otomatik yapılmaz.</p>";
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function affiliateHtml(user) {
    return '<p class="text-xs font-bold tracking-[0.18em] text-gold">ORTAKLIK</p>' +
      '<h2 class="font-display font-extrabold">İki arkadaş, 5 USD</h2>' +
      '<p>İki arkadaşın kimliğini ilet, 5 dolar kazan. Bakiyeye komisyon yazılmaz.</p>' +
      claimText(user) +
      '<form class="clay-refer"><label>Birinci kimlik<input class="field" name="kimlik1" required maxlength="32" autocomplete="off"></label><label>İkinci kimlik<input class="field" name="kimlik2" required maxlength="32" autocomplete="off"></label><button class="btn btn-gold" type="submit">Talebi gönder</button><p class="clay-refer-msg" role="status"></p></form>';
  }

  function securityHtml(user) {
    var rows = (user.sessions || []).slice().reverse().map(function (row) {
      return "<tr><td>" + esc(row.browser) + "</td><td>" + esc(row.ip) + "</td><td>" + new Date(row.createdAt).toLocaleString("tr-TR") + "</td></tr>";
    }).join("") || "<tr><td colspan='3'>Bu hesapta henüz oturum satırı yok.</td></tr>";
    return '<p class="text-xs font-bold tracking-[0.18em] text-gold">GÜVENLİK</p>' +
      '<h2 class="font-display font-extrabold">Aktif Oturum Bilgisi</h2>' +
      '<p>Bu hesabın giriş kayıtları.</p>' +
      '<table class="clay-table mt-4"><thead><tr><th>Tarayıcı</th><th>IP adresi</th><th>Zaman</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function mountPanels() {
    if (document.getElementById("clay-session") && document.getElementById("clay-offer")) return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host || !storeReady()) return;
    var sekme = new URLSearchParams(location.search).get("sekme");
    var panelTab = sekme === "ortaklik" || sekme === "guvenlik";
    var on = panelTab || sekme === "kupon";
    if (on) document.body.classList.add("clay-sekme-on");
    else if (!/\/clayadm!nxx\/?$/.test(location.pathname)) document.body.classList.toggle("clay-sekme-on", false);
    var box = host.querySelector(":scope > .clay-extra");
    if (!panelTab) {
      if (box) box.remove();
      return;
    }
    var user = current();
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-extra glass rounded-[28px] p-5";
      var slot = host.querySelector(":scope > .mt-6");
      if (slot) host.insertBefore(box, slot);
      else host.appendChild(box);
    }
    if (!user) {
      if (box.dataset.sig !== "giris") {
        box.dataset.sig = "giris";
        box.innerHTML = "<p>Bu paneli görmek için giriş yap.</p>";
      }
      return;
    }
    ensureProfile();
    user = current();
    var claim = user.referralClaim || {};
    var sig = sekme + "|" + user.id + "|" + (claim.id1 || "") + "|" + (claim.id2 || "") + "|" + (user.sessions || []).length;
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig;
    box.innerHTML = sekme === "ortaklik" ? affiliateHtml(user) : securityHtml(user);
  }

  function mountNav() {
    if (/\/clayadm!nxx/.test(location.pathname)) return;
    var links = [
      ["/panel/hesap?sekme=ortaklik", "Ortaklık"],
      ["/panel/hesap?sekme=guvenlik", "Aktif Oturum Bilgisi"]
    ];
    document.querySelectorAll("nav.mt-4, details .mt-2.grid").forEach(function (nav) {
      links.forEach(function (item) {
        var exists = false;
        nav.querySelectorAll("a").forEach(function (a) {
          var href = a.getAttribute("href") || "";
          if (href.split("#")[0] === item[0] || href.indexOf(item[0]) !== -1) exists = true;
        });
        if (exists) return;
        var a = document.createElement("a");
        a.href = item[0];
        a.dataset.clayNav = "1";
        a.className = "nav-pill rounded-full px-3 py-2 text-sm font-bold bg-white/5 text-white/80";
        if (location.search && item[0].indexOf(location.search) !== -1) a.classList.add("nav-on");
        a.textContent = item[1];
        nav.appendChild(a);
      });
    });
  }

  async function copyReferral(button) {
    var input = button.parentElement.querySelector("input");
    var note = button.parentElement.parentElement.querySelector(".clay-copy-note");
    var value = input ? input.value : "";
    try {
      await navigator.clipboard.writeText(value);
    } catch (e) {
      if (input) { input.focus(); input.select(); document.execCommand("copy"); }
    }
    if (note) note.textContent = "Davet bağlantısı panoya kopyalandı.";
    button.textContent = "Kopyalandı";
  }

  function runActivity() {
    return;
    var user = current();
    if (!user) return;
    if (window.__clay.php()) {
      window.__clay.call("ortaklik-hareket", {}).then(function () { mountPanels(); });
      return;
    }
    window.__clay.update(function (ledger) {
      var me = ledger.users.find(function (item) { return item.id === user.id; });
      if (!me) return;
      var guest = ledger.users.find(function (item) { return item.referredBy === me.id; });
      if (!guest) {
        var suffix = codeOf().toLowerCase().slice(0, 6);
        guest = {
          id: "usr_" + crypto.randomUUID().replace(/-/g, "").slice(0, 12),
          name: "Davetli",
          username: ("davetli_" + suffix).slice(0, 24),
          password: "",
          balance: 0,
          usdMinor: 0,
          plan: "kivilcim",
          role: "uye",
          status: "acik",
          address: "",
          createdAt: new Date().toISOString(),
          referralCode: codeOf(),
          referredBy: me.id,
          sessions: [],
          commissions: [],
          commissionKurus: 0
        };
        ledger.users.push(guest);
      }
      var cents = 4000;
      guest.balance = (Number(guest.balance) || 0) + cents;
      ledger.transactions.push({
        id: "tx_" + crypto.randomUUID(),
        userId: guest.id,
        cardId: null,
        kind: "yukleme",
        title: "Bakiye yüklemesi",
        note: "Davetli bakiye yüklemesi. " + usd(cents) + ".",
        amount: cents,
        usdMinor: cents,
        status: "tamamlandi",
        createdAt: new Date().toISOString(),
        ref: "ortaklik:" + crypto.randomUUID()
      });
      creditCommission(ledger, guest.id, cents, "bakiye");
    });
    mountPanels();
  }

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.classList || !form.classList.contains("clay-refer")) return;
    event.preventDefault();
    var first = String(form.kimlik1.value || "").trim();
    var second = String(form.kimlik2.value || "").trim();
    var msg = form.querySelector(".clay-refer-msg");
    var valid = /^[A-Za-z0-9_]{2,32}$/.test(first) && /^[A-Za-z0-9_]{2,32}$/.test(second) && first.toLowerCase() !== second.toLowerCase();
    if (!valid) {
      if (msg) msg.textContent = "İki farklı kimlik yazın.";
      return;
    }
    var me = current();
    var before = me ? Number(me.balance) || 0 : 0;
    var done = function (res) {
      var box = document.querySelector(".clay-extra");
      if (box) box.dataset.sig = "";
      mountPanels();
      var now = current();
      var same = now && (Number(now.balance) || 0) === before;
      var line = document.querySelector(".clay-refer-msg");
      if (line) line.textContent = res && res.code === "ok" && same ? "Talep alındı. Ödeme otomatik yapılmaz." : "Talep kaydedilemedi.";
    };
    if (window.__clay.php()) {
      window.__clay.call("ortaklik-talep", { kimlik1: first, kimlik2: second }).then(done);
      return;
    }
    window.__clay.update(function (ledger) {
      var user = ledger.users.find(function (item) { return item.id === me.id; });
      if (!user) return;
      user.referralClaim = { id1: first, id2: second, status: "beklemede", amountUsd: 5 };
    });
    done({ code: "ok" });
  }, true);

  document.addEventListener("click", function (event) {
    var legal = event.target.closest("[data-legal]");
    if (legal) {
      event.preventDefault();
      openLegal(legal.getAttribute("data-legal"));
      return;
    }
    if (event.target.closest("[data-legal-close]")) {
      closeLegal();
      return;
    }
    var act = event.target.closest("[data-act]");
    if (!act) return;
    var name = act.getAttribute("data-act");
    if (name === "copy-ref") { event.preventDefault(); copyReferral(act); return; }
    if (name === "ref-activity") { event.preventDefault(); runActivity(); return; }
    var box = act.closest(".clay-limit");
    if (!box) return;
    event.preventDefault();
    if (name === "save-limit") saveLimit(box);
    if (name === "spend") spend(box);
  });

  document.addEventListener("input", function (event) {
    var box = event.target.closest && event.target.closest(".clay-limit");
    if (!box) return;
    drafts[box.dataset.card] = {
      gunluk: box.querySelector("[name=gunluk]").value,
      islem: box.querySelector("[name=islem]").value,
      harca: box.querySelector("[name=harca]").value
    };
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLegal();
  });

  var painting = false;
  function tick() {
    if (painting) return;
    painting = true;
    try {
      captureQuery();
      ensureLegal();
      mountNav();
      mountLimits();
      mountPanels();
      if (storeReady()) ensureProfile();
    } finally {
      painting = false;
    }
  }

  var observer = new MutationObserver(function (muts) {
    if (document.querySelector(".clay-lux-appmenu[open]")) return;
    for (var i = 0; i < muts.length; i++) {
      var t = muts[i].target;
      if (t && t.nodeType !== 1) t = t.parentElement;
      if (t && t.closest && t.closest(".clay-coupon-admin, .clay-desk-live, .clay-lux-appmenu")) return;
    }
    tick();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  tick();
  var waits = 0;
  var timer = setInterval(function () {
    waits += 1;
    tick();
    if (storeReady() || waits > 40) clearInterval(timer);
  }, 150);
})();

}
function clayStart(){if(window.__clayAfterHydrate)window.__clayAfterHydrate(clayBoot);else clayBoot();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",clayStart);
else clayStart();
})();

(function () {
  var LIVE_KEY = "clay-live-v1";
  var AGENTS = [
    "Clay Mehmet IŞIK",
    "Clay Ayşe YILMAZ",
    "Clay Emre KAYA",
    "Clay Zeynep DEMİR",
    "Clay Burak ÇELİK",
    "Clay Elif ARSLAN",
    "Clay Kerem ŞAHİN",
    "Clay Deniz AKSOY",
    "Clay Merve KOÇ",
    "Clay Hakan YILDIZ"
  ];
  var WORDS = ["ada", "akasya", "armut", "ayna", "badem", "bahar", "bakir", "balon", "bambu", "belge", "bere", "bez", "boru", "bulut", "cam", "cami", "ceviz", "cicek", "damla", "defter", "deniz", "elma", "fener", "gece", "gol", "gumus", "harita", "kalem", "kapi", "kaya", "kitap", "limon", "masa", "nehir", "orman", "ruzgar", "sabah", "saat", "sepet", "simit", "toprak", "yildiz", "yol", "zeytin", "zincir"];

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

  function readLive() {
    try {
      var raw = JSON.parse(localStorage.getItem(LIVE_KEY) || "{}");
      if (!raw || typeof raw !== "object" || !Array.isArray(raw.threads)) raw = { threads: [] };
      return raw;
    } catch (e) {
      return { threads: [] };
    }
  }

  function writeLive(data) {
    localStorage.setItem(LIVE_KEY, JSON.stringify(data));
  }

  function tidyAdmin() {
    document.body.classList.toggle("clay-desk", admin());
    document.querySelectorAll(".clay-bin-demo").forEach(function (node) { node.remove(); });
    if (!admin()) return;
    var host = document.querySelector(".mx-auto.min-h-screen");
    if (!host) return;
    var header = host.querySelector(":scope > header") || host.querySelector("header.glass") || host.querySelector("header");
    var nav = host.querySelector(":scope > nav");
    var coupon = host.querySelector(".clay-coupon-admin");
    if (coupon && coupon.closest("main.boot-screen")) {
      coupon.remove();
      coupon = host.querySelector(".clay-coupon-admin");
    }
    if (coupon && header) {
      if (header.contains(coupon) || coupon.nextElementSibling === header || coupon.parentNode !== host) {
        var live = host.querySelector(":scope > .clay-desk-live");
        host.insertBefore(coupon, (live || header).nextSibling);
      }
    }
  }

  function cardName() {
    var picked = document.querySelector('input[name="tur"]:checked');
    if (!picked) return "";
    var map = { facebook_ads: "Facebook Ads", tiktok: "TikTok Ads", google_ads: "Google Ads", ultima: "Ultima" };
    var label = picked.closest("label");
    var node = label && label.querySelector(".font-semibold");
    var text = node && node.childNodes[0] ? String(node.childNodes[0].textContent || "").trim() : "";
    return text || map[picked.value] || "";
  }

  function syncSample() {
    if (!/\/panel\/kartlar\/yeni\/?$/.test(path())) return;
    if (window.__clayPaintIssue) {
      window.__clayPaintIssue();
      return;
    }
    var brand = document.querySelector(".clay-sample-brand");
    var name = cardName();
    if (brand && name) brand.textContent = name;
  }

  function tidyCards() {
    document.querySelectorAll("article[id^='crd_']").forEach(function (article) {
      article.querySelectorAll("[data-act=pin],[data-act=card-pdf],[data-act=card-close]").forEach(function (btn) {
        if (btn.closest(".card-menu")) return;
        btn.remove();
      });
      var term = article.querySelector(".clay-term");
      if (term) article.appendChild(term);
    });
  }

  function openPage(kind) {
    var old = document.querySelector(".clay-page-pop");
    if (old) old.remove();
    var copy = kind === "misyon"
      ? "<h2>Misyon</h2><p>CLAY reklam bütçesi için sanal kart basar. Bakiye dolar cinsindendir. Kimlik belgesi istenmez.</p>"
      : "<h2>Vizyon</h2><p>Dört kart türü tek cüzdanda durur. Ücret satırı açıktır.</p>";
    var pop = document.createElement("div");
    pop.className = "clay-page-pop";
    pop.innerHTML = '<div class="clay-page-card" role="dialog" aria-modal="true">' + copy + '<button type="button" class="btn btn-ghost" data-clay-page-close>Kapat</button></div>';
    document.body.appendChild(pop);
  }

  function mountFoot() {
    if (!publicSite()) return;
    if (document.querySelector(".clay-site-foot")) return;
    var foot = document.createElement("footer");
    foot.className = "clay-site-foot";
    foot.innerHTML = '<nav><button type="button" data-clay-page="misyon">Misyon</button><button type="button" data-clay-page="vizyon">Vizyon</button><button type="button" data-act="live-open">Canlı destek</button></nav><p>tüm hakları saklıdır</p>';
    var main = document.querySelector("main");
    if (main) main.appendChild(foot);
    else document.body.appendChild(foot);
  }

  function pickAgent(previous) {
    var pool = AGENTS.filter(function (name) { return name !== previous; });
    var bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    return pool[bytes[0] % pool.length];
  }

  function openLive() {
    return;
    var store = readLive();
    var last = "";
    try { last = sessionStorage.getItem("clay-live-agent") || ""; } catch (e) {}
    var agent = pickAgent(last);
    try { sessionStorage.setItem("clay-live-agent", agent); } catch (e) {}
    var id = "lv_" + Math.random().toString(36).slice(2, 10);
    store.threads.push({ id: id, agent: agent, at: Date.now(), messages: [] });
    writeLive(store);
    try { sessionStorage.setItem("clay-live-thread", id); } catch (e) {}
    paintLive();
  }

  function currentThread() {
    var id = "";
    try { id = sessionStorage.getItem("clay-live-thread") || ""; } catch (e) {}
    if (!id) return null;
    return readLive().threads.filter(function (row) { return row.id === id; })[0] || null;
  }

  function paintLive() {
    return;
    if (admin()) return;
    var root = document.querySelector(".clay-live");
    if (!root) {
      root = document.createElement("section");
      root.className = "clay-live";
      root.innerHTML = '<button type="button" class="clay-live-btn" data-act="live-open">Canlı destek</button><div class="clay-live-panel" hidden><header><strong class="clay-live-agent"></strong><button type="button" data-act="live-close" aria-label="Kapat">×</button></header><div class="clay-live-log" role="log"></div><form class="clay-live-form"><input name="metin" maxlength="400" placeholder="Mesaj yaz" autocomplete="off" required><button class="btn btn-gold" type="submit">Gönder</button></form></div>';
      document.body.appendChild(root);
    }
    if (!(publicSite() || member())) {
      root.hidden = true;
      return;
    }
    root.hidden = false;
    var thread = currentThread();
    var panel = root.querySelector(".clay-live-panel");
    if (!thread) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    root.querySelector(".clay-live-agent").textContent = thread.agent;
    var log = root.querySelector(".clay-live-log");
    var sig = thread.messages.map(function (row) { return row.at + row.from + row.text; }).join("|");
    if (log.dataset.sig !== sig) {
      log.dataset.sig = sig;
      log.innerHTML = thread.messages.map(function (row) {
        return '<p class="clay-live-' + (row.from === "admin" ? "admin" : "mine") + '"><span>' + esc(row.from === "admin" ? thread.agent : "Sen") + "</span>" + esc(row.text) + "</p>";
      }).join("") || "<p class=\"clay-live-empty\">Mesaj yaz. Karşı taraf aynı oturumda görür.</p>";
      log.scrollTop = log.scrollHeight;
    }
  }

  function sendLive(text, from) {
    return;
    var clean = String(text || "").trim();
    if (!clean) return;
    var store = readLive();
    var id = "";
    try { id = sessionStorage.getItem("clay-live-thread") || ""; } catch (e) {}
    var thread = store.threads.filter(function (row) { return row.id === id; })[0];
    if (!thread && from === "admin") return;
    if (!thread) return;
    thread.messages.push({ from: from, text: clean.slice(0, 400), at: Date.now() });
    writeLive(store);
  }

  function paintAdminLive() {
    return;
    if (!admin()) {
      var gone = document.querySelector(".clay-desk-live");
      if (gone) gone.remove();
      return;
    }
    var store = readLive();
    var box = document.querySelector(".clay-desk-live");
    if (!box) {
      box = document.createElement("section");
      box.className = "clay-desk-live";
      var host = document.querySelector(".mx-auto.min-h-screen") || document.body;
      host.appendChild(box);
    }
    var latest = store.threads.slice().sort(function (a, b) {
      var am = a.messages.length ? a.messages[a.messages.length - 1].at : a.at;
      var bm = b.messages.length ? b.messages[b.messages.length - 1].at : b.at;
      return bm - am;
    })[0];
    var active = box.dataset.picked === "1" ? box.dataset.thread : (latest ? latest.id : "");
    if (active && !store.threads.some(function (row) { return row.id === active; })) active = latest ? latest.id : "";
    box.dataset.thread = active;
    var thread = store.threads.filter(function (row) { return row.id === active; })[0];
    var sig = store.threads.map(function (row) {
      return row.id + ":" + row.messages.length + ":" + (row.messages.length ? row.messages[row.messages.length - 1].at : 0);
    }).join(",") + "|" + active;
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig;
    var list = store.threads.slice().reverse().map(function (row) {
      return '<button type="button" data-thread="' + esc(row.id) + '"' + (row.id === active ? ' class="is-on"' : "") + ">" + esc(row.agent) + "</button>";
    }).join("") || "<p>Henüz konuşma yok.</p>";
    var log = thread ? thread.messages.map(function (row) {
      var who = row.from === "admin" ? "Masa" : "Üye";
      return "<p><strong>" + esc(who) + "</strong> " + esc(row.text) + "</p>";
    }).join("") : "";
    box.innerHTML = '<h2>Canlı destek</h2><div class="clay-desk-live-list">' + list + '</div><div class="clay-desk-live-log">' + (log || "<p>Bir konuşma seç.</p>") + '</div><form class="clay-desk-live-form"><input name="metin" maxlength="400" placeholder="Yanıt yaz" autocomplete="off"' + (thread ? "" : " disabled") + '><button class="btn btn-gold" type="submit"' + (thread ? "" : " disabled") + ">Gönder</button></form>";
    box.dataset.thread = active;
    box.dataset.sig = sig;
  }

  function seedPhrase() {
    var bag = WORDS.slice();
    var out = [];
    while (out.length < 12 && bag.length) {
      var roll = new Uint32Array(1);
      crypto.getRandomValues(roll);
      out.push(bag.splice(roll[0] % bag.length, 1)[0]);
    }
    return out.join(" ");
  }

  function showSeed(form, phrase) {
    form.dataset.clayAccount = "1";
    form.dataset.claySeed = phrase;
    var box = form.querySelector("#signup-confirm");
    if (box) box.disabled = false;
    var reveal = form.parentNode.querySelector(".clay-seed-reveal");
    if (!reveal) {
      reveal = document.createElement("section");
      reveal.className = "clay-seed-reveal";
      form.insertAdjacentElement("afterend", reveal);
    }
    var hidden = reveal.classList.contains("is-hidden");
    var words = phrase.split(" ");
    reveal.innerHTML = '<p class="auth-label">Tohum</p><ol class="seed-words">' + words.map(function (word, index) {
      return "<li class=\"seed-word\"><span>" + (index + 1) + "</span>" + esc(word) + "</li>";
    }).join("") + '</ol><div class="seed-actions"><button type="button" class="auth-outline" data-act="seed-hide">Tohumu gizle</button><button type="button" class="auth-outline" data-act="seed-copy">Panoya Kopyala</button><button type="button" class="auth-outline" data-act="seed-file">Metin Belgesi (.txt) Olarak İndir</button></div><p class="clay-seed-note" role="status">Hesap açıldı. Tohumu kaydet, kutuyu işaretle, sonra panele geç.</p>';
    if (hidden) reveal.classList.add("is-hidden");
  }

  function regText(code, serverMessage) {
    var en = String(document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
    var map = {
      "e-kullanici": ["Kullanıcı adı 2–24 karakter olmalı. Yalnızca harf, rakam ve alt çizgi kullan.", "Username must be 2–24 characters: letters, digits and underscore only."],
      "e-parola": ["Parola 6–72 karakter olmalı ve yalnızca harf ile rakam içermeli.", "Password must be 6–72 characters, letters and digits only."],
      "e-parola2": ["İki parola aynı değil.", "The two passwords do not match."],
      "e-tohum-onay": ["Tohumu kaydettiğini onaylamak için kutuyu işaretle.", "Tick the box to confirm you saved the seed phrase."],
      "e-var": ["Bu kullanıcı adı alınmış. Başka bir ad dene.", "This username is taken. Try another one."],
      "e-tohum": ["Tohum üretilemedi. Sayfayı yenileyip tekrar dene.", "Could not create the seed phrase. Refresh and try again."],
      "e-kilit": ["Çok fazla deneme yapıldı. Bir dakika bekleyip tekrar dene.", "Too many attempts. Wait a minute and try again."],
      "e-defter": ["Hesap şu an kaydedilemedi (sunucu defteri yazılamadı). Bir süre sonra tekrar dene.", "The account could not be saved right now (server ledger write failed). Try again shortly."],
      "e-bakim": ["Site bakımda. Kısa süre sonra tekrar dene.", "The site is under maintenance. Try again shortly."],
      "e-ag": ["Sunucuya ulaşılamadı. Bağlantını kontrol edip tekrar dene.", "Could not reach the server. Check your connection and try again."],
      "e-giris": ["Hesap açıldı ama giriş yapılamadı. Giriş sayfasından kullanıcı adın ve parolanla gir.", "Account created but sign-in failed. Sign in from the login page."]
    };
    var row = map[code];
    if (row) return row[en ? 1 : 0];
    if (!en && serverMessage) return String(serverMessage);
    return (en ? "Account could not be created" : "Hesap açılamadı") + " (" + String(code || "?") + ").";
  }

  async function registerAccount(form) {
    var user = String(form.kullanici.value || "").trim();
    var pass = String(form.parola.value || "");
    var again = String(form.parola2 ? form.parola2.value : "");
    var note = form.querySelector(".clay-reg-note");
    if (!note) {
      note = document.createElement("p");
      note.className = "clay-reg-note banner-bad";
      note.setAttribute("role", "status");
      form.appendChild(note);
    }
    note.className = "clay-reg-note banner-bad";
    if (!/^[A-Za-z0-9_]{2,24}$/.test(user)) {
      note.textContent = regText("e-kullanici");
      return;
    }
    if (!/^[A-Za-z0-9]{6,72}$/.test(pass)) {
      note.textContent = regText("e-parola");
      return;
    }
    if (pass !== again) {
      note.textContent = regText("e-parola2");
      return;
    }
    if (form.dataset.clayBusy === "1") return;
    form.dataset.clayBusy = "1";
    var submit = form.querySelector("button[type=submit]");
    if (submit) submit.disabled = true;
    var phrase = seedPhrase();
    var payload = { action: "register", kullanici: user, parola: pass, parola2: again, tohum: phrase, sessiz: "1" };
    var res = null;
    try {
      var response = await fetch("/api/ledger.php", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json", "X-Clay": "1" },
        body: JSON.stringify(payload)
      });
      res = await response.json();
    } catch (e) {
      res = { code: "e-ag" };
    }
    form.dataset.clayBusy = "";
    if (submit) submit.disabled = false;
    if (!res || res.code !== "ok") {
      note.textContent = regText(res && res.code ? res.code : "e-ag", res && res.message);
      return;
    }
    note.textContent = "";
    note.className = "clay-reg-note";
    showSeed(form, phrase);
  }

  document.addEventListener("invalid", function (event) {
    var field = event.target;
    var form = field && field.form;
    if (!form || !/\/kayit\/?$/.test(path()) || !form.querySelector("[name=parola2]")) return;
    var code = field.name === "kullanici" ? "e-kullanici" : field.name === "parola" || field.name === "parola2" ? "e-parola" : field.id === "signup-confirm" ? "e-tohum-onay" : "";
    if (!code) return;
    event.preventDefault();
    if (form.querySelector(":invalid") !== field) return;
    var note = form.querySelector(".clay-reg-note");
    if (!note) {
      note = document.createElement("p");
      note.setAttribute("role", "status");
      form.appendChild(note);
    }
    note.className = "clay-reg-note banner-bad";
    note.textContent = regText(code);
    if (field.focus) field.focus();
  }, true);

  function mountPlanAsk(form) {
    return;
    var ask = form.parentNode && form.parentNode.querySelector(".clay-plan-ask[data-for='" + (form.querySelector("[name=plan]") || {}).value + "']");
    if (ask) return ask;
    ask = document.createElement("div");
    ask.className = "clay-plan-ask";
    var plan = form.querySelector("[name=plan]");
    ask.dataset.for = plan ? plan.value : "";
    ask.hidden = true;
    ask.innerHTML = "<p>Bu plan, önceki planın yerine geçsin mi?</p><button type=\"button\" class=\"btn btn-gold\" data-act=\"plan-yes\">Onaylıyorum</button><button type=\"button\" class=\"btn btn-ghost\" data-act=\"plan-no\">Reddet</button>";
    form.insertAdjacentElement("afterend", ask);
    return ask;
  }

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.matches) return;
    if (form.matches("form.clay-live-form")) {
      event.preventDefault();
      sendLive(form.metin.value, "visitor");
      form.metin.value = "";
      paintLive();
      return;
    }
    if (form.matches("form.clay-desk-live-form")) {
      event.preventDefault();
      var box = form.closest(".clay-desk-live");
      var id = box ? box.dataset.thread : "";
      try { sessionStorage.setItem("clay-live-thread", id || ""); } catch (e) {}
      sendLive(form.metin.value, "admin");
      form.metin.value = "";
      var desk = document.querySelector(".clay-desk-live");
      if (desk) desk.dataset.sig = "";
      paintAdminLive();
      return;
    }
    if (/\/kayit\/?$/.test(path()) && form.querySelector("[name=kullanici]") && form.querySelector("[name=parola2]")) {
      if (form.dataset.clayAccount === "1") {
        event.preventDefault();
        event.stopPropagation();
        var box = form.querySelector("#signup-confirm");
        var regNote = form.querySelector(".clay-reg-note");
        if (!box || !box.checked) {
          if (regNote) {
            regNote.className = "clay-reg-note banner-bad";
            regNote.textContent = String(document.documentElement.lang || "").indexOf("en") === 0 ? "Tick the box to confirm you saved the seed phrase." : "Tohumu kaydettiğini onaylamak için kutuyu işaretle.";
          }
          return;
        }
        var user = form.kullanici.value;
        var pass = form.parola.value;
        var go = function () { location.assign("/panel/"); };
        if (window.__clay && window.__clay.call) {
          window.__clay.call("login", { kullanici: user, parola: pass }).then(function (res) {
            if (res && res.code && res.code !== "ok") {
              if (regNote) {
                regNote.className = "clay-reg-note banner-bad";
                regNote.textContent = regText(res.code === "e-giris" ? "e-giris" : res.code, res.message);
              }
              return;
            }
            go();
          }, go);
          return;
        }
        go();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      registerAccount(form);
      return;
    }
    if (form.classList.contains("plan-offer-cta") && form.querySelector("[name=plan]")) {
      if (form.dataset.clayGo === "1") return;
      event.preventDefault();
      event.stopPropagation();
      var ask = mountPlanAsk(form);
      if (!ask) return;
      ask.hidden = false;
      ask.dataset.form = "1";
      form.dataset.clayAsk = "1";
    }
  }, true);

  document.addEventListener("click", function (event) {
    var page = event.target.closest && event.target.closest("[data-clay-page]");
    if (page) {
      event.preventDefault();
      openPage(page.getAttribute("data-clay-page"));
      return;
    }
    if (event.target.closest && event.target.closest("[data-clay-page-close]")) {
      var pop = document.querySelector(".clay-page-pop");
      if (pop) pop.remove();
      return;
    }
    var act = event.target.closest && event.target.closest("[data-act]");
    if (act) {
      var name = act.getAttribute("data-act");
      if (name === "live-open") {
        event.preventDefault();
        openLive();
        return;
      }
      if (name === "live-close") {
        event.preventDefault();
        try { sessionStorage.removeItem("clay-live-thread"); } catch (e) {}
        var panel = document.querySelector(".clay-live-panel");
        if (panel) panel.hidden = true;
        return;
      }
      if (name === "seed-hide") {
        event.preventDefault();
        var reveal = act.closest(".clay-seed-reveal");
        if (!reveal) return;
        var hidden = reveal.classList.toggle("is-hidden");
        act.textContent = hidden ? "Tohumu göster" : "Tohumu gizle";
        return;
      }
      if (name === "seed-copy" || name === "seed-file") {
        event.preventDefault();
        var block = act.closest(".clay-seed-reveal");
        var form = block && block.previousElementSibling;
        var phrase = form && form.dataset.claySeed;
        if (!phrase) return;
        if (name === "seed-copy") {
          navigator.clipboard.writeText(phrase).catch(function () {});
          var status = block.querySelector(".clay-seed-note");
          if (status) status.textContent = "Tohum panoya kopyalandı.";
          return;
        }
        var blob = new Blob(["CLAY seed anahtarı\n\n" + phrase + "\n"], { type: "text/plain" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = "clay-seed.txt";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return;
      }
      if (name === "plan-no") {
        event.preventDefault();
        var ask = act.closest(".clay-plan-ask");
        if (ask) ask.hidden = true;
        return;
      }
      if (name === "plan-yes") {
        event.preventDefault();
        var yes = act.closest(".clay-plan-ask");
        var planForm = yes && yes.previousElementSibling;
        if (!planForm || !planForm.classList.contains("plan-offer-cta")) return;
        planForm.dataset.clayGo = "1";
        if (yes) yes.hidden = true;
        if (typeof planForm.requestSubmit === "function") planForm.requestSubmit();
        else planForm.submit();
      }
    }
    var threadBtn = event.target.closest && event.target.closest(".clay-desk-live [data-thread]");
    if (threadBtn) {
      event.preventDefault();
      var host = threadBtn.closest(".clay-desk-live");
      if (host) {
        host.dataset.picked = "1";
        host.dataset.thread = threadBtn.getAttribute("data-thread");
        host.dataset.sig = "";
        paintAdminLive();
      }
    }
  }, true);

  document.addEventListener("change", function (event) {
    if (event.target && event.target.name === "tur") syncSample();
  });

  window.addEventListener("storage", function (event) {
    if (event.key !== LIVE_KEY) return;
    var panel = document.querySelector(".clay-live-log");
    if (panel) panel.dataset.sig = "";
    var desk = document.querySelector(".clay-desk-live");
    if (desk) desk.dataset.sig = "";
    paintLive();
    paintAdminLive();
  });

  function tick() {
    tidyAdmin();
    syncSample();
    tidyCards();
    mountFoot();
    paintLive();
    paintAdminLive();
    if (/\/kayit\/?$/.test(path())) {
      document.body.classList.add("clay-kayit");
      var form = document.querySelector("form input[name=parola2]");
      form = form && form.closest("form");
      if (form && form.dataset.clayAccount === "1") {
        var box = form.querySelector("#signup-confirm");
        if (box) box.disabled = false;
        if (form.dataset.claySeed && !document.querySelector(".clay-seed-reveal")) showSeed(form, form.dataset.claySeed);
      }
    }
  }

  var queued = false;
  var observer = new MutationObserver(function (muts) {
    if (queued) return;
    if (document.querySelector(".clay-lux-appmenu[open]")) return;
    for (var i = 0; i < muts.length; i++) {
      var t = muts[i].target;
      if (t && t.nodeType !== 1) t = t.parentElement;
      if (t && t.closest && t.closest(".clay-coupon-admin, .clay-desk-live, .clay-lux-appmenu")) return;
    }
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      tick();
    });
  });
  function boot() {
    if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true });
    tick();
    setInterval(function () {
      paintLive();
      paintAdminLive();
    }, 700);
  }
  function start() {
    if (window.__clayAfterHydrate) window.__clayAfterHydrate(boot);
    else boot();
  }
  if (document.readyState === "complete") setTimeout(start, 0);
  else window.addEventListener("load", function () { setTimeout(start, 0); });
})();
