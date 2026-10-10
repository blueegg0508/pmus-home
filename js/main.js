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
    var targets = document.querySelectorAll(".section-head, .pain, .shift, .voice-card, .feat, .more-grid, .consult-scene, .flow-list, .apply > *");
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
            });
        }, { rootMargin: "0px 0px -10% 0px" });
        targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
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
