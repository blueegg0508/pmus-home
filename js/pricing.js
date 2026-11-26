// PMUS 기간 이용권 최종 가격표 (2026-11-20 원장님 결정) — 랜딩 · 결제 시뮬레이션이 함께 쓴다.
// 기간별 일시 결제 · VAT 포함. 결제하는 날의 시기 가격이 적용된다.
// 앱 쪽 같은 표: 브로우리스트_모바일/license/sign.mjs PRICE_PERIODS — 바꿀 때 둘 다 바꾼다.
window.PMUS_PRICE = (function () {
    "use strict";
    var PERIODS = [
        { id: "open", label: "오픈가", edition: "스탠다드", from: "", until: "2026-12-31", m3: 79000, m6: 120000, year: 179000 },
        { id: "event", label: "행사가", edition: "프로 · 옵션1", from: "2027-01-01", until: "2027-06-30", m3: 99000, m6: 150000, year: 239000 },
        { id: "regular", label: "정상가", edition: "프로 · 옵션1,2", from: "2027-07-01", until: "", m3: 119000, m6: 180000, year: 299000 }
    ];
    var PLANS = [{ id: "m3", name: "3개월", months: 3, days: 91 }, { id: "m6", name: "6개월", months: 6, days: 182 }, { id: "year", name: "12개월", months: 12, days: 365 }];
    function ymd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    function periodOn(date) {
        var t = ymd(date || new Date()), cur = PERIODS[0];
        PERIODS.forEach(function (p) { if (!p.from || p.from <= t) cur = p; });
        return cur;
    }
    function monthly(price, months) { return Math.round(price / months); }
    function won(v) { return v.toLocaleString("ko-KR"); }
    return { PERIODS: PERIODS, PLANS: PLANS, periodOn: periodOn, monthly: monthly, won: won };
})();
