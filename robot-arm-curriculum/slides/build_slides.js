const pptx = require("pptxgenjs");
const p = new pptx();
p.layout = "LAYOUT_WIDE";           // 13.3 x 7.5 in
const W = 13.3, H = 7.5;
const FONT = "맑은 고딕";

// ---- palette ----
const NAVY = "0B1233", DEEPBLUE = "0B3D91", BLUE = "1F6FEB";
const ORANGE = "E76F23", ORANGETINT = "FFF3EA", ORANGEEDGE = "F4A261";
const BLUETINT = "EFF5FF", CAREERTINT = "E9F5EC", GREEN = "2E7D46";
const GRAY = "3A3A3A", WHITE = "FFFFFF";

function sh() { return { type: "outer", color: "9AB0D0", blur: 8, offset: 3, angle: 90, opacity: 0.35 }; }
function card(s, x, y, w, h, fill) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.09, fill: { color: fill }, line: { type: "none" }, shadow: sh() });
}
function circle(s, x, y, d, fill, txt, size, tc) {
  s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, shadow: sh() });
  s.addText(txt, { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: FONT, fontSize: size, bold: true, color: tc || WHITE });
}

// ================= 1. TITLE =================
let s = p.addSlide(); s.background = { color: NAVY };
s.addShape(p.ShapeType.ellipse, { x: 10.6, y: -1.4, w: 4.2, h: 4.2, fill: { color: "16204A" }, line: { type: "none" } });
s.addShape(p.ShapeType.ellipse, { x: -1.3, y: 5.4, w: 3.8, h: 3.8, fill: { color: "16204A" }, line: { type: "none" } });
circle(s, 0.9, 0.8, 1.5, ORANGE, "🤖", 40);
s.addText("진로수업", { x: 2.7, y: 1.0, w: 9, h: 0.6, fontFace: FONT, fontSize: 22, bold: true, color: "8FA6D8" });
s.addText("아두이노 6자유도 로봇팔", { x: 0.9, y: 2.7, w: 11.5, h: 1.1, fontFace: FONT, fontSize: 48, bold: true, color: WHITE });
s.addText("로봇팔로 배우는 스마트 자동화 · 진로 탐색", { x: 0.9, y: 3.9, w: 11.5, h: 0.7, fontFace: FONT, fontSize: 26, color: "CADCFC" });
s.addText("2시간 × 6회  ·  하나씩 완성해 가는 성취형 수업", { x: 0.9, y: 5.6, w: 11.5, h: 0.6, fontFace: FONT, fontSize: 20, color: ORANGE, bold: true });

// ================= 2. ROADMAP =================
const road = [
  ["1", "로봇팔을 내 손으로 움직인다", "조종 + 관절 지도 완성"],
  ["2", "코드를 읽고 내 팔로 길들인다", "안정 홈 자세 세팅"],
  ["3", "물건을 집어 옮긴다", "수동 Pick & Place 성공"],
  ["4", "로봇과 대화하고 기록한다", "포즈 데이터 완성"],
  ["5", "함수로 자동화한다", "버튼 원클릭 자동화"],
  ["6", "나만의 미션 & 데모데이", "작품 완성 + 진로 발표"],
];
s = p.addSlide(); s.background = { color: WHITE };
s.addText("수업 로드맵 — 6회의 여정", { x: 0.6, y: 0.4, w: 12, h: 0.8, fontFace: FONT, fontSize: 34, bold: true, color: DEEPBLUE });
s.addText("매 회차마다 '오늘 완성한 것'을 손에 쥐고 돌아갑니다.", { x: 0.6, y: 1.15, w: 12, h: 0.5, fontFace: FONT, fontSize: 18, color: GRAY });
let cx = 0.6, cy = 1.9, cw = 3.95, ch = 2.45, gx = 0.28, gy = 0.3;
road.forEach((r, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = cx + col * (cw + gx), y = cy + row * (ch + gy);
  card(s, x, y, cw, ch, i < 3 ? BLUETINT : "F2F7FF");
  circle(s, x + 0.25, y + 0.28, 0.85, i % 2 ? ORANGE : BLUE, r[0], 30);
  s.addText(r[1], { x: x + 1.25, y: y + 0.3, w: cw - 1.45, h: 0.9, fontFace: FONT, fontSize: 18, bold: true, color: DEEPBLUE, valign: "middle" });
  s.addText("완성: " + r[2], { x: x + 0.3, y: y + 1.5, w: cw - 0.6, h: 0.7, fontFace: FONT, fontSize: 17, color: GRAY, valign: "top" });
});

// ================= 3. HARDWARE / PREP =================
s = p.addSlide(); s.background = { color: WHITE };
s.addText("준비 · 하드웨어 기준", { x: 0.6, y: 0.4, w: 12, h: 0.8, fontFace: FONT, fontSize: 34, bold: true, color: DEEPBLUE });
const hw = [
  ["⚙️", "그리퍼(6번)", "열림 0°  /  닫힘 90°"],
  ["↔️", "1~5번 서보", "중심 90°  (0~180°)"],
  ["🔘", "시작 버튼", "조이스틱 SW → 디지털 7번 + GND"],
  ["🔌", "전원", "외부 전원 권장 (떨림 방지)"],
];
hw.forEach((r, i) => {
  const y = 1.5 + i * 1.32;
  card(s, 0.6, y, 6.6, 1.15, i % 2 ? "F2F7FF" : BLUETINT);
  circle(s, 0.85, y + 0.2, 0.75, BLUE, r[0], 26);
  s.addText(r[1], { x: 1.8, y: y + 0.12, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 19, bold: true, color: DEEPBLUE });
  s.addText(r[2], { x: 1.8, y: y + 0.58, w: 5.3, h: 0.5, fontFace: FONT, fontSize: 17, color: GRAY });
});
card(s, 7.5, 1.5, 5.2, 5.28, ORANGETINT);
s.addText("🛡️  안전 수칙", { x: 7.8, y: 1.75, w: 4.6, h: 0.6, fontFace: FONT, fontSize: 22, bold: true, color: "C45911" });
s.addText([
  { text: "동작 중 관절 사이에 손을 넣지 않기", options: { bullet: true, breakLine: true } },
  { text: "첫 실행은 MIN/MAX로 가동범위를 좁혀 테스트", options: { bullet: true, breakLine: true } },
  { text: "전원·GND 연결을 확실히 (공통 접지)", options: { bullet: true, breakLine: true } },
  { text: "떨림 발생 시 외부 전원부터 점검", options: { bullet: true } },
], { x: 7.9, y: 2.5, w: 4.6, h: 4.0, fontFace: FONT, fontSize: 18, color: GRAY, paraSpaceAfter: 14, valign: "top" });

// ================= SESSIONS =================
const sessions = [
  { no: "1", title: "로봇팔을 내 손으로 움직인다", complete: "조종 가능한 로봇팔 + 관절 지도 완성",
    goal: "관절 구조와 서보의 역할을 이해하고 정밀 조작의 감을 잡는다.",
    career: "로봇 하드웨어 엔지니어 — 로봇을 만들고 정비하는 사람", code: "코드 04",
    mission: "워밍업 게임 — 30초 안에 그리퍼로 목표 지점 터치! + 컵 옮기기 타임어택",
    tl: [["0–15", "오프닝 · 진로 훅 (완성 미리보기)"], ["15–35", "구조 · 배선 + 관절 매핑표 채우기"],
         ["35–75", "자유 조작 실습 + 워밍업 게임"], ["75–105", "정밀 조작 챌린지"], ["105–120", "완성 확인 · 성찰"]] },
  { no: "2", title: "코드를 읽고 내 팔로 길들인다", complete: "내 팔 전용 안정 홈 자세 세팅",
    goal: "코드 구조(setup/loop·핀·각도)를 읽고 값 수정의 영향을 안다.",
    career: "제어 · 임베디드 개발자 — 값을 조정해 기계를 최적화", code: "코드 04",
    mission: "코드 탐정 — delay·MAX·PIN을 바꿔 무슨 일이 나는지 알아내기",
    tl: [["0–10", "복습 · 오늘 완성물 예고"], ["10–35", "코드 해석표 (값 찾기)"],
         ["35–65", "코드 탐정 실험"], ["65–100", "홈 포지션 만들기 (초기각 수정)"], ["100–120", "안정성 점검 · 진로"]] },
  { no: "3", title: "물건을 집어 옮긴다", complete: "수동 Pick & Place 성공",
    goal: "그리퍼 각도를 조절하고, 작업을 순서로 분해한다.",
    career: "물류 자동화 · 스마트팩토리 — 집고 옮기는 공정 설계", code: "코드 04·07",
    mission: "택배 분류 타임어택 — A구역 → B구역, 가장 빠르고 정확하게!",
    tl: [["0–10", "복습 · 예고"], ["10–40", "그리퍼 장인 (물체별 집기 실험)"],
         ["40–70", "작업 순서 설계"], ["70–105", "택배 분류 타임어택"], ["105–120", "완성 확인 · 진로"]] },
  { no: "4", title: "로봇과 대화하고 자세를 기록한다", complete: "나만의 포즈 데이터 (HOME/PICK/PLACE)",
    goal: "시리얼 통신을 이해하고 동작을 '숫자(데이터)'로 기록한다.",
    career: "로봇 티칭 · 데이터 — 로봇에게 자세를 가르치는 작업", code: "코드 07",
    mission: "자세 사진사 — 멋진 포즈를 각도값으로 캡처해 친구와 교환·재현",
    tl: [["0–10", "복습 · 예고"], ["10–35", "Serial 추가 · 각도 읽기(p)"],
         ["35–65", "자세 사진사"], ["65–105", "포즈 카드 완성"], ["105–120", "재현성 확인 · 진로"]] },
  { no: "5", title: "함수로 자동화한다", complete: "버튼 한 번에 자동 동작 완성", star: true,
    goal: "함수·매개변수·재사용을 이해하고 함수 합성으로 자동화한다.",
    career: "자동화 엔지니어 — 반복노동을 코드로 대체", code: "코드 08",
    mission: "원클릭 공장 — 버튼 한 번에 집기→옮기기→놓기 자동! 10회 성공률",
    tl: [["0–10", "복습 · 완성물 시연"], ["10–40", "함수 만들기 (gripper·goHome·moveTo)"],
         ["40–75", "autoPickAndPlace 조립 (시리얼 먼저)"], ["75–105", "버튼 연결 · 원클릭 완성 · 튜닝"], ["105–120", "완성 확인 · 진로"]] },
  { no: "6", title: "나만의 미션 & 데모데이", complete: "팀 작품 완성 · 시연 + 진로 발표",
    goal: "배운 것을 종합해 문제를 정의·해결하고 진로와 연결한다.",
    career: "나의 진로 설계 — 내가 없애고 싶은 반복노동은?", code: "코드 08·09",
    mission: "팀 미션 자유 설계 → 데모데이 시연 · 촬영 → 진로 발표",
    tl: [["0–15", "미션 선택 · 설계"], ["15–70", "구현 · 반복 튜닝"],
         ["70–95", "데모데이 (시연 · 촬영)"], ["95–115", "진로 발표"], ["115–120", "자기평가 · 마무리"]] },
];

sessions.forEach((ss) => {
  // --- divider (dark) ---
  let d = p.addSlide(); d.background = { color: NAVY };
  d.addShape(p.ShapeType.ellipse, { x: 10.9, y: 4.7, w: 4.4, h: 4.4, fill: { color: "16204A" }, line: { type: "none" } });
  circle(d, 0.9, 2.55, 2.2, ss.star ? ORANGE : BLUE, ss.no, 48);
  d.addText((ss.star ? "★ 절정  ·  " : "") + ss.no + "회차", { x: 3.5, y: 2.35, w: 9, h: 0.6, fontFace: FONT, fontSize: 22, bold: true, color: "8FA6D8" });
  d.addText(ss.title, { x: 3.5, y: 2.95, w: 9.2, h: 1.5, fontFace: FONT, fontSize: 40, bold: true, color: WHITE, valign: "top" });
  d.addText("✅  오늘 완성하는 것 :  " + ss.complete, { x: 3.5, y: 4.55, w: 9.2, h: 0.8, fontFace: FONT, fontSize: 20, bold: true, color: ORANGE });

  // --- content (light) ---
  let c = p.addSlide(); c.background = { color: WHITE };
  circle(c, 0.6, 0.4, 0.9, ss.star ? ORANGE : BLUE, ss.no, 30);
  c.addText(ss.title, { x: 1.7, y: 0.42, w: 8.5, h: 0.9, fontFace: FONT, fontSize: 30, bold: true, color: DEEPBLUE, valign: "middle" });
  c.addText(ss.code, { x: 10.2, y: 0.55, w: 2.5, h: 0.6, fontFace: FONT, fontSize: 17, bold: true, color: BLUE, align: "right", valign: "middle" });

  // left column
  card(c, 0.6, 1.55, 6.1, 1.35, BLUETINT);
  c.addText("🎯  학습목표", { x: 0.85, y: 1.68, w: 5.6, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: DEEPBLUE });
  c.addText(ss.goal, { x: 0.85, y: 2.12, w: 5.6, h: 0.7, fontFace: FONT, fontSize: 17, color: GRAY, valign: "top" });

  card(c, 0.6, 3.05, 6.1, 1.35, CAREERTINT);
  c.addText("🧭  진로 연결", { x: 0.85, y: 3.18, w: 5.6, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: GREEN });
  c.addText(ss.career, { x: 0.85, y: 3.62, w: 5.6, h: 0.7, fontFace: FONT, fontSize: 17, color: GRAY, valign: "top" });

  card(c, 0.6, 4.55, 6.1, 2.25, ORANGETINT);
  c.addText("🏆  도전 미션", { x: 0.85, y: 4.72, w: 5.6, h: 0.5, fontFace: FONT, fontSize: 20, bold: true, color: "C45911" });
  c.addText(ss.mission, { x: 0.85, y: 5.25, w: 5.6, h: 1.4, fontFace: FONT, fontSize: 19, color: GRAY, valign: "top" });

  // right column: timeline
  c.addText("⏱  2시간 활동 흐름", { x: 7.1, y: 1.55, w: 5.6, h: 0.5, fontFace: FONT, fontSize: 20, bold: true, color: DEEPBLUE });
  ss.tl.forEach((row, i) => {
    const y = 2.2 + i * 0.92;
    card(c, 7.1, y, 5.6, 0.78, i % 2 ? "F2F7FF" : BLUETINT);
    c.addShape(p.ShapeType.roundRect, { x: 7.3, y: y + 0.16, w: 1.15, h: 0.46, rectRadius: 0.06, fill: { color: ss.star ? ORANGE : BLUE }, line: { type: "none" } });
    c.addText(row[0], { x: 7.3, y: y + 0.16, w: 1.15, h: 0.46, align: "center", valign: "middle", fontFace: FONT, fontSize: 16, bold: true, color: WHITE });
    c.addText(row[1], { x: 8.65, y: y, w: 3.9, h: 0.78, fontFace: FONT, fontSize: 16, color: GRAY, valign: "middle" });
  });
});

// ================= MISSION MENU =================
s = p.addSlide(); s.background = { color: WHITE };
s.addText("6회차 미션 메뉴 — 팀이 고른다", { x: 0.6, y: 0.4, w: 12, h: 0.8, fontFace: FONT, fontSize: 32, bold: true, color: DEEPBLUE });
const menu = [
  ["🏁", "스피드런 / 타임어택"], ["🎯", "정확도 사격 (칸 넣기)"], ["🧱", "블록 타워 / 컵 피라미드"],
  ["🎨", "색깔·모양 분류 (스마트팩토리)"], ["🥚", "깨지기 쉬운 화물 운반"], ["✒️", "로봇팔 캘리그래피"],
  ["🏀", "미니 농구"], ["🔁", "반 협동 컨베이어"], ["💃", "로봇팔 군무 (함수 합성)"],
];
menu.forEach((m, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.6 + col * 4.15, y = 1.55 + row * 1.65;
  card(s, x, y, 3.9, 1.4, i % 2 ? "F2F7FF" : BLUETINT);
  circle(s, x + 0.22, y + 0.32, 0.78, i % 3 === 2 ? ORANGE : BLUE, m[0], 24);
  s.addText(m[1], { x: x + 1.15, y: y, w: 2.65, h: 1.4, fontFace: FONT, fontSize: 18, bold: true, color: DEEPBLUE, valign: "middle" });
});

// ================= CLOSING =================
s = p.addSlide(); s.background = { color: NAVY };
s.addShape(p.ShapeType.ellipse, { x: -1.2, y: -1.3, w: 4, h: 4, fill: { color: "16204A" }, line: { type: "none" } });
s.addText("진로수업을 관통하는 4가지 장치", { x: 0.9, y: 0.7, w: 11.5, h: 0.9, fontFace: FONT, fontSize: 34, bold: true, color: WHITE });
const pillars = [
  ["완성의 사다리", "매회 '오늘 된 것'을 확인 → 성취감 누적"],
  ["선택권", "미션을 직접 고르고 설계 → 자율성"],
  ["직업 렌즈", "매회 '이 활동 = 어떤 어른의 밥벌이?'"],
  ["기록의 자산화", "활동지 = 진로 포트폴리오 · 생기부 근거"],
];
pillars.forEach((r, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.9 + col * 6.0, y = 2.0 + row * 2.15;
  card(s, x, y, 5.6, 1.85, "16204A");
  circle(s, x + 0.28, y + 0.5, 0.85, ORANGE, String(i + 1), 30);
  s.addText(r[0], { x: x + 1.35, y: y + 0.25, w: 4.0, h: 0.6, fontFace: FONT, fontSize: 22, bold: true, color: WHITE });
  s.addText(r[1], { x: x + 1.35, y: y + 0.85, w: 4.05, h: 0.85, fontFace: FONT, fontSize: 17, color: "CADCFC", valign: "top" });
});
s.addText("완성품을 보여주지 말고, 하나씩 완성하게 하라.", { x: 0.9, y: 6.5, w: 11.5, h: 0.6, fontFace: FONT, fontSize: 20, bold: true, color: ORANGE });

p.writeFile({ fileName: "/home/user/myClaud/robot-arm-curriculum/slides/로봇팔_수업진행_통합.pptx" })
  .then((f) => console.log("saved", f));
