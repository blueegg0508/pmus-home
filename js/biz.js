// 사업자 정보 — 여기만 채우면 랜딩 맨 아래와 약관·환불·개인정보 페이지에 모두 들어간다.
// 비어 있는 칸은 화면에 '입력 예정'으로 보인다. 지어낸 정보를 넣지 않는다.
window.PMUS_BIZ = {
    name: "드림가온",      // 상호 (사업자등록증명 2026-10-10 발급 기준)
    ceo: "박헌남",        // 대표자
    bizNo: "834-03-04036", // 사업자등록번호
    mailOrderNo: "",     // 통신판매업 신고번호
    address: "경기도 평택시 비전2로 320, 504동 4층 405호 (죽백동, 가내마을 5단지)", // 사업장 주소
    phone: "",           // 전화
    email: "",           // 이메일
    privacyOfficer: "",  // 개인정보 보호책임자 (이름 · 연락처)
    pg: "",              // 결제대행사 (PG사 이름)
    effectiveDate: "",   // 약관 시행일 (예: 2026년 11월 1일)
    kakao: "https://pf.kakao.com/_wkiFX"
};

(function () {
    "use strict";
    var biz = window.PMUS_BIZ;
    document.querySelectorAll("[data-biz]").forEach(function (el) {
        var v = biz[el.getAttribute("data-biz")];
        if (v) { el.textContent = v; el.classList.remove("tbd"); }
        else { el.textContent = "입력 예정"; el.classList.add("tbd"); }
    });
})();
