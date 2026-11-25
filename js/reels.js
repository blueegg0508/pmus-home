// 홈페이지 '영상으로 보기' — PMUS 인스타그램 릴스를 홈페이지 안에서 바로 재생 (2026-11-25 원장님 요청)
// 원장님: "인스타그램 하단 프레임은 안 보여도 되고, 흰 틀은 이질감 — 블랙 톤으로, 창 전환 없이 홈페이지에서 바로 재생"
// 목록 js/reels.json, 영상 assets/video/reels/<아이디>.mp4 · .jpg (tools/reels-update.mjs 가 더한다).
// 화면에 보이는 영상만 소리 없이 자동 재생, 누르면 소리 켜짐 / 끄기.
(function () {
    "use strict";
    var box = document.querySelector("[data-reels]");
    if (!box) return;
    var T = window.PMUS_T || function (s) { return s; };

    function card(it) {
        var base = "assets/video/reels/" + it.id;
        return '<figure class="reel" data-id="' + it.id + '">' +
            '<div class="reel-top"><span class="reel-ava">PMUS</span><span class="reel-name">pmus_2026</span></div>' +
            '<div class="reel-vid"><video src="' + base + '.mp4" poster="' + base + '.jpg" muted loop playsinline preload="none"></video>' +
            '<button type="button" class="reel-sound" aria-label="' + T("소리 켜기") + '"><span class="on">🔊</span><span class="off">🔇</span></button></div>' +
            "</figure>";
    }

    function wire() {
        var vids = [].slice.call(box.querySelectorAll("video"));
        // 화면에 들어온 영상만 재생 (휴대폰 데이터 · 배터리 아끼기)
        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (es) {
                es.forEach(function (e) {
                    var v = e.target;
                    if (e.isIntersecting && e.intersectionRatio > 0.5) { v.preload = "auto"; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
                    else v.pause();
                });
            }, { threshold: [0, 0.5, 1] });
            vids.forEach(function (v) { io.observe(v); });
        }
        // 누르면 소리 켜기 · 끄기 (한 번에 한 영상만 소리)
        box.addEventListener("click", function (ev) {
            var fig = ev.target.closest(".reel"); if (!fig) return;
            var v = fig.querySelector("video");
            var turnOn = v.muted;
            vids.forEach(function (o) { o.muted = true; o.closest(".reel").classList.remove("sound"); });
            if (turnOn) { v.muted = false; fig.classList.add("sound"); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        });
    }

    fetch("js/reels.json?t=" + Math.floor(Date.now() / 600000), { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (d) {
            var items = (d.items || []).slice(0, 6);
            if (!items.length) { box.closest("section").hidden = true; return; }
            box.innerHTML = items.map(card).join("");
            wire();
        })
        .catch(function () { box.closest("section").hidden = true; });
})();
