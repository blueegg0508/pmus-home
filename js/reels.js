// 홈페이지 '영상으로 보기' — PMUS 인스타그램 릴스를 인스타그램 공식 퍼가기(embed)로 보여 준다 (2026-11-25 원장님 요청)
// 목록은 js/reels.json (새 릴스가 올라오면 tools/reels-update.mjs 가 더하고 다시 올린다). 화면에 가까워질 때만 인스타 스크립트를 부른다.
(function () {
    "use strict";
    var box = document.querySelector("[data-reels]");
    if (!box) return;
    function load() {
        fetch("js/reels.json?t=" + Math.floor(Date.now() / 600000), { cache: "no-store" })
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var items = (d.items || []).slice(0, 6);
                if (!items.length) { box.closest("section").hidden = true; return; }
                box.innerHTML = items.map(function (it) {
                    var url = "https://www.instagram.com/reel/" + it.id + "/";
                    return '<div class="reel"><blockquote class="instagram-media" data-instgrm-permalink="' + url +
                        '?utm_source=ig_embed" data-instgrm-version="14"><a href="' + url + '" target="_blank" rel="noopener">Instagram</a></blockquote></div>';
                }).join("");
                if (window.instgrm) { window.instgrm.Embeds.process(); return; }
                var s = document.createElement("script");
                s.async = true; s.src = "https://www.instagram.com/embed.js";
                document.body.appendChild(s);
            })
            .catch(function () { box.closest("section").hidden = true; });
    }
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin: "600px" });
        io.observe(box);
    } else { load(); }
})();
