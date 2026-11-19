/* Logo Köprüsü — hafif etkileşimler. Sunucu yok; her şey tarayıcıda çalışır. */
(function () {
  "use strict";

  // Mobil menü
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("site-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Entegrasyon kataloğu: kategori + arama filtresi (?kategori=... destekler)
  var grid = document.querySelector("[data-catalog]");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-category]"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var search = document.querySelector("[data-search]");
    var count = document.querySelector("[data-count]");
    var empty = document.querySelector("[data-empty]");
    var active = "Tümü";

    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get("kategori");
    if (fromUrl) active = fromUrl;

    function apply() {
      var q = (search && search.value ? search.value : "").trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var catOk = active === "Tümü" || card.getAttribute("data-category") === active;
        var text = card.textContent.toLowerCase();
        var qOk = !q || text.indexOf(q) !== -1;
        var visible = catOk && qOk;
        card.hidden = !visible;
        if (visible) shown++;
      });
      chips.forEach(function (chip) {
        var on = chip.getAttribute("data-filter") === active;
        chip.setAttribute("aria-pressed", String(on));
      });
      if (count) count.textContent = shown + " entegrasyon gösteriliyor";
      if (empty) empty.classList.toggle("is-visible", shown === 0);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        active = chip.getAttribute("data-filter");
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
    apply();
  }

  // Planlama maketleri: üretim emri seçimi (Üretim Çizelgeleme)
  var orders = Array.prototype.slice.call(document.querySelectorAll("[data-order]"));
  var detail = document.querySelector("[data-order-detail]");
  if (orders.length && detail) {
    orders.forEach(function (o) {
      o.setAttribute("role", "button");
      o.setAttribute("tabindex", "0");
      o.setAttribute("aria-pressed", "false");
      function pick() {
        orders.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        o.setAttribute("aria-pressed", "true");
        detail.innerHTML = o.getAttribute("data-order");
      }
      o.addEventListener("click", pick);
      o.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
      });
    });
  }

  // Çeki listesi maketi: satır seçimi ve sayaç
  var rows = Array.prototype.slice.call(document.querySelectorAll("[data-pull-row]"));
  var pullCount = document.querySelector("[data-pull-count]");
  if (rows.length && pullCount) {
    function refresh() {
      var n = rows.filter(function (r) { return r.querySelector("input").checked; }).length;
      pullCount.textContent = n + " satır seçili";
      rows.forEach(function (r) {
        r.classList.toggle("is-selected", r.querySelector("input").checked);
      });
    }
    rows.forEach(function (r) {
      r.querySelector("input").addEventListener("change", refresh);
      r.addEventListener("click", function (e) {
        if (e.target.tagName !== "INPUT") {
          var cb = r.querySelector("input");
          cb.checked = !cb.checked;
          refresh();
        }
      });
    });
    refresh();
  }

  // Planlama sayfası: aktif bölüm vurgusu
  var chipLinks = Array.prototype.slice.call(document.querySelectorAll(".sticky-chips a[href^='#']"));
  if (chipLinks.length && "IntersectionObserver" in window) {
    var map = {};
    chipLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (a && en.isIntersecting) {
          chipLinks.forEach(function (x) { x.removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();
