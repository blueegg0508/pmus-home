// PMUS 랜딩 — 언어 고르기 (2026-11-21 원장님 요청: 랜딩에도 언어팩)
// 번역 장치는 앱과 같은 js/i18n.js, 사전은 i18n/<언어>.json (tools/i18n-extract.mjs · i18n-check.mjs).
// 이 파일은 i18n.js 보다 먼저 싣는다 — 고른 적이 없으면 브라우저 언어를 따르게 한다.
(function () {
    "use strict";
    window.__I18N_AUTO = true;

    // 약관 · 환불 · 개인정보 번역본 맨 위 — 효력은 한국어 원문 (앱의 결제 · 환불 규정과 같은 문구)
    var NOTE = {
        en: ["This translation is for reference only. If it differs from the Korean original, the Korean original prevails.", "View Korean original"],
        ja: ["この翻訳は参考用です。韓国語の原文と内容が異なる場合は、韓国語の原文が優先されます。", "韓国語の原文を見る"],
        zh: ["本译文仅供参考。如与韩文原文不一致，以韩文原文为准。", "查看韩文原文"],
        es: ["Esta traducción es solo de referencia. En caso de discrepancia con el original en coreano, prevalece el texto en coreano.", "Ver original en coreano"],
        fr: ["Cette traduction est fournie à titre indicatif. En cas de divergence avec l'original coréen, le texte coréen fait foi.", "Voir l'original coréen"],
        pt: ["Esta tradução é apenas para referência. Em caso de divergência com o original em coreano, prevalece o texto em coreano.", "Ver original em coreano"],
        ru: ["Этот перевод носит справочный характер. При расхождении с оригиналом на корейском языке преимущественную силу имеет корейский текст.", "Оригинал на корейском"],
        ar: ["هذه الترجمة للاستئناس فقط. في حال وجود أي اختلاف عن الأصل الكوري، يُعتمد النص الكوري.", "عرض الأصل الكوري"]
    };

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var I = window.PMUS_I18N;
        if (!I) return;
        // 언어 고르기 — 이름은 그 나라 말로 적어 두고 번역하지 않는다
        document.querySelectorAll("[data-lang-pick]").forEach(function (box) {
            box.setAttribute("data-no-i18n", "");
            var sel = document.createElement("select");
            sel.className = "lang-pick";
            sel.setAttribute("aria-label", "Language");
            I.langs.forEach(function (l) {
                var o = document.createElement("option");
                o.value = l[0];
                o.textContent = l[1];
                o.lang = l[0];
                if (l[0] === I.lang) o.selected = true;
                sel.appendChild(o);
            });
            sel.addEventListener("change", function () { I.set(sel.value); });
            box.appendChild(sel);
        });
        // 약관 · 환불 · 개인정보 번역본
        var note = NOTE[I.lang];
        var doc = document.querySelector("[data-legal] .doc");
        if (note && doc) {
            var bar = document.createElement("div");
            bar.className = "legal-note";
            bar.setAttribute("data-no-i18n", "");
            if (I.lang === "ar") bar.dir = "rtl";
            var p = document.createElement("p");
            p.textContent = note[0];
            var b = document.createElement("button");
            b.type = "button";
            b.textContent = note[1];
            b.addEventListener("click", function () { I.set("ko"); });
            bar.appendChild(p);
            bar.appendChild(b);
            var h1 = doc.querySelector("h1");
            if (h1 && h1.nextSibling) doc.insertBefore(bar, h1.nextSibling);
            else doc.insertBefore(bar, doc.firstChild);
        }
    });
})();
