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
    var targets = document.querySelectorAll(".section-head, .pain, .shift, .voice-card, .feat, .more-grid, .consult-scene, .flow-list, .price-wrap, .apply > *");
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
            });
        }, { rootMargin: "0px 0px -10% 0px" });
        targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
    }

    // 가격: 판매 수(data-sold)로 지금 가격과 남은 얼리버드 자리를 계산한다
    var priceSec = document.getElementById("price");
    if (priceSec) {
        var EARLY = 50, BASE = 290000, STEP = 1000, LIST = 490000;
        var sold = Math.max(0, parseInt(priceSec.getAttribute("data-sold"), 10) || 0);
        var priceOf = function (n) { return n <= EARLY ? BASE : Math.min(LIST, BASE + (n - EARLY) * STEP); };
        var won = function (v) { return v.toLocaleString("ko-KR"); };
        var q = function (k) { return priceSec.querySelector('[data-p="' + k + '"]'); };
        var next = sold + 1, now = priceOf(next);
        q("now").textContent = won(now);
        q("vat").textContent = won(Math.round(now * 1.1));
        if (sold < EARLY) {
            var left = EARLY - sold;
            q("badge").textContent = "얼리버드";
            q("left").innerHTML = "얼리버드 " + EARLY + "자리 중 <strong>" + left + "자리</strong> 남음";
            q("bar").style.width = (sold / EARLY * 100) + "%";
            q("meter-label").setAttribute("aria-label", "얼리버드 " + EARLY + "자리 중 " + left + "자리 남음");
        } else {
            q("badge").textContent = now < LIST ? "얼리버드 마감" : "";
            q("left").innerHTML = now < LIST
                ? next + "번째 구매 가격 · 다음 구매부터 <strong>" + won(priceOf(next + 1)) + "원</strong>"
                : "정가입니다. 더 오르지 않습니다.";
            q("bar").style.width = ((now - BASE) / (LIST - BASE) * 100) + "%";
            q("meter-label").setAttribute("aria-label", "정가까지 " + won(LIST - now) + "원 남음");
            q("cta").textContent = "지금 신청하기";
        }
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
