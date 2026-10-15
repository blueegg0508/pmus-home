// PMUS 1년 이용권 가격 규칙 (2026-10-10 원장님 결정, 2026-10-15 얼리버드 50 → 200명) — 랜딩·결제 시뮬레이션이 함께 쓴다.
// 1~200번째 290,000원 → 201번째부터 구매 한 건마다 +1,000원 → 정가 490,000원에서 멈춤. 모두 VAT 별도.
window.PMUS_PRICE = (function () {
    "use strict";
    var EARLY = 200, BASE = 290000, STEP = 1000, LIST = 490000, VAT = 0.1;
    function priceOf(n) { return n <= EARLY ? BASE : Math.min(LIST, BASE + (n - EARLY) * STEP); }
    function withVat(v) { return Math.round(v * (1 + VAT)); }
    function won(v) { return v.toLocaleString("ko-KR"); }
    return { EARLY: EARLY, BASE: BASE, STEP: STEP, LIST: LIST, priceOf: priceOf, withVat: withVat, won: won };
})();
