// PMUS 랜딩 — 비교 슬라이더, 디자인 바꾸기, 기존 눈썹 흐리기, 스크롤 등장
(function () {
    "use strict";

    // 첫 화면 비교: 투명한 range 를 사진 위에 깔아 터치·마우스·키보드를 한 번에 받는다
    document.querySelectorAll("[data-compare]").forEach(function (fig) {
        var frame = fig.querySelector(".compare-frame");
        var range = fig.querySelector(".compare-range");
        function set(v) { frame.style.setProperty("--pos", v + "%"); }
        range.addEventListener("input", function () { set(range.value); });
        set(range.value);
    });

    // 디자인 바꾸기
    var chips = document.querySelectorAll("[data-pick]");
    chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            var key = chip.getAttribute("data-pick");
            chips.forEach(function (c) { c.classList.toggle("is-on", c === chip); });
            document.querySelectorAll(".swap-img").forEach(function (img) {
                img.classList.toggle("is-on", img.getAttribute("data-design") === key);
            });
        });
    });

    // 기존 눈썹 진하기: 100 = 원래 눈썹 그대로인 그림을 위에 덮고, 0 이면 걷어 낸다
    var fade = document.querySelector("[data-fade]");
    var fadeTop = document.querySelector(".fade-top");
    var fadeOut = document.querySelector("[data-fade-out]");
    if (fade && fadeTop) {
        var apply = function () {
            fadeTop.style.opacity = fade.value / 100;
            if (fadeOut) fadeOut.textContent = fade.value;
        };
        fade.addEventListener("input", apply);
        apply();
    }

    // 스크롤 등장
    var targets = document.querySelectorAll(".section-head, .ask-col, .ask-punch, .pain, .shift, .voice-card, .feat, .more-grid, .consult-scene, .flow-list, .price-wrap, .apply > *");
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
            });
        }, { rootMargin: "0px 0px -10% 0px" });
        targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
    }

    // 가격: 오늘 날짜로 지금 시기(오픈가 · 행사가 · 정상가)를 골라 채운다 (표는 js/pricing.js).
    // HTML 에는 오픈가가 미리 들어 있어 스크립트가 없어도 그대로 보인다.
    var priceSec = document.getElementById("price");
    var P = window.PMUS_PRICE;
    if (priceSec && P) {
        var q = function (k) { return priceSec.querySelector('[data-p="' + k + '"]'); };
        var cur = P.periodOn(new Date()), idx = P.PERIODS.indexOf(cur), nxt = P.PERIODS[idx + 1];
        var md = function (s) { var p = s.split("-"); return p[0] + "년 " + parseInt(p[1], 10) + "월"; };
        q("eyebrow").textContent = cur.label + (cur.until ? " · " + md(cur.until) + "까지" : "");
        q("badge").textContent = cur.label + " · " + cur.edition;
        q("plans").innerHTML = P.PLANS.map(function (pl) {
            return '<li' + (pl.id === "year" ? ' class="pp-best"' : "") + '><span class="pp-name">' + pl.name + (pl.id === "year" ? " <em>추천</em>" : "") +
                '</span><span class="pp-price">' + P.won(cur[pl.id]) + '<small>원</small></span><span class="pp-month">월 ' + P.won(P.monthly(cur[pl.id], pl.months)) + "원</span></li>";
        }).join("");
        q("day").innerHTML = "12개월권을 하루로 나누면 <strong>약 " + P.won(Math.round(cur.year / 365 / 10) * 10) + "원</strong> <span>(" + P.won(cur.year) + "원 ÷ 365일, VAT 포함)</span>";
        q("cta").textContent = cur.label + "로 신청하기";
        q("lead").textContent = "3개월 · 6개월 · 12개월 중에 고르세요." + P.PERIODS.slice(idx + 1).map(function (p) { return " " + md(p.from) + "부터는 " + p.label; }).join(",") + (nxt ? "로 바뀝니다." : "");
        [].forEach.call(q("steps").children, function (li, i) { li.className = i === idx ? "on" : i < idx ? "past" : ""; });
        q("faq").textContent = nxt
            ? "물론 괜찮습니다. 먼저 7일 무료 체험으로 충분히 써 보세요. 다만 " + cur.label + "는 " + md(cur.until) + "까지이고, " + md(nxt.from) + "부터는 12개월권이 " + P.won(nxt.year) + "원으로 바뀝니다. 지금 시작하시면 더 낮은 가격으로, 앞으로 추가될 기능도 이용 기간 동안 함께 받아 보실 수 있습니다."
            : "물론 괜찮습니다. 먼저 7일 무료 체험으로 충분히 써 보세요. 써 보시고 필요한 기간만큼 고르시면 됩니다.";
    }

    // 아직 연결하지 않은 버튼은 누르면 알려 준다 (결제·상담 링크 연결 전)
    document.querySelectorAll("[data-todo]").forEach(function (a) {
        a.addEventListener("click", function (e) {
            if (a.getAttribute("href") === "#") {
                e.preventDefault();
                alert(a.getAttribute("data-todo") + "는 준비 중입니다.");
            }
        });
    });
})();
