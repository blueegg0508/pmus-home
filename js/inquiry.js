// 회사 소개 페이지의 '시뮬레이션 · 프로그램 문의' (2026-11-27 원장님 요청)
// 문의는 Supabase 표 inquiries 에 들어가고, 관리자 화면(www.pmus.io/admin/inquiries.html)에서 본다.
// 표 · 권한: D:\PMUS_어드민\tools\inquiry-schema.sql — 누구나 '넣기'만 되고, 읽기 · 고치기는 승인된 관리자만.
// 아래 키는 공개 키(publishable)다. 비밀 키는 여기에 넣지 않는다.
(function () {
    "use strict";
    var SB_URL = "https://qkdpzsmipwtlzabsfagi.supabase.co";
    var SB_KEY = "sb_publishable_bCCohNIlpyFaCOL0MFn-ow_SAs8-YpX";
    var form = document.getElementById("inqForm");
    if (!form) return;
    var msg = document.getElementById("inqMsg"), btn = document.getElementById("inqSend");
    var opened = Date.now();
    var I = window.PMUS_I18N;
    var L = function (ko) { return I && I.lang !== "ko" && I.dict && I.dict() ? I.t(ko) : ko; };
    function say(text, bad) { msg.textContent = text ? L(text) : ""; msg.className = "dg-msg" + (bad ? " err" : ""); }
    function val(n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        say("");
        var kindEl = form.querySelector("input[name=kind]:checked");
        var row = {
            kind: kindEl ? kindEl.value : "기타",
            name: val("name"), shop: val("shop") || null, phone: val("phone").replace(/[^\d+\-\s]/g, "").trim(),
            email: val("email") || null, message: val("message"),
            lang: (I && I.lang) || "ko", page: location.pathname.slice(0, 200), agreed_at: new Date().toISOString()
        };
        if (!row.name) { say("이름을 적어 주세요.", true); form.elements.name.focus(); return; }
        if (row.phone.replace(/\D/g, "").length < 8) { say("연락받으실 휴대전화 번호를 적어 주세요.", true); form.elements.phone.focus(); return; }
        if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) { say("이메일 주소를 확인해 주세요.", true); form.elements.email.focus(); return; }
        if (row.message.length < 5) { say("문의 내용을 조금 더 적어 주세요.", true); form.elements.message.focus(); return; }
        if (!form.elements.agree.checked) { say("개인정보 수집 · 이용에 동의해 주세요.", true); form.elements.agree.focus(); return; }
        // 자동 입력 프로그램 거르기: 숨은 칸이 채워졌거나 페이지를 연 지 3초도 안 됐으면 보낸 척만 한다
        if (val("website") || Date.now() - opened < 3000) { done(); return; }
        btn.disabled = true; say("보내는 중…");
        fetch(SB_URL + "/rest/v1/inquiries", {
            method: "POST",
            headers: { apikey: SB_KEY, "content-type": "application/json", prefer: "return=minimal" },
            body: JSON.stringify(row)
        }).then(function (r) {
            if (!r.ok) throw new Error(String(r.status));
            done();
        }).catch(function () {
            btn.disabled = false;
            say("보내지 못했어요. 잠시 뒤 다시 시도하시거나 카카오톡 채널로 문의해 주세요.", true);
        });
    });

    function done() {
        var box = document.createElement("div");
        box.className = "dg-done";
        box.innerHTML = "<strong></strong><p></p>";
        box.querySelector("strong").textContent = L("문의가 접수되었습니다.");
        box.querySelector("p").textContent = L("확인한 뒤 남겨 주신 연락처로 연락드리겠습니다. 감사합니다.");
        var again = document.createElement("button");
        again.type = "button"; again.className = "dg-btn dark"; again.textContent = L("다른 문의 남기기");
        again.onclick = function () { location.reload(); };
        box.appendChild(again);
        form.innerHTML = ""; form.appendChild(box);
        form.scrollIntoView({ block: "center", behavior: "smooth" });
    }
})();
