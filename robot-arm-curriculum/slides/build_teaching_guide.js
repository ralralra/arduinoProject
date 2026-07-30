const pptx = require("pptxgenjs");
const p = new pptx();
p.layout = "LAYOUT_WIDE";
const FONT = "맑은 고딕", MONO = "Consolas";
const NAVY = "0B1233", DEEPBLUE = "0B3D91", BLUE = "1F6FEB";
const ORANGE = "E76F23", ORANGETINT = "FFF3EA", GREEN = "2E7D46", GREENTINT = "E9F5EC";
const BLUETINT = "EFF5FF", GRAY = "3A3A3A", WHITE = "FFFFFF", CODEBG = "10182E";

function sh() { return { type: "outer", color: "9AB0D0", blur: 8, offset: 3, angle: 90, opacity: 0.35 }; }
function card(s, x, y, w, h, fill) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.09, fill: { color: fill }, line: { type: "none" }, shadow: sh() });
}
function circle(s, x, y, d, fill, txt, size, tc) {
  s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, shadow: sh() });
  s.addText(txt, { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: FONT, fontSize: size, bold: true, color: tc || WHITE });
}
function codebox(s, x, y, w, h, lines) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: CODEBG }, line: { type: "none" }, shadow: sh() });
  const runs = lines.map((ln, i) => ({ text: ln === "" ? " " : ln,
    options: { breakLine: true, color: ln.trim().startsWith("//") ? "7FA7D9" : "E6EDF7" } }));
  s.addText(runs, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: h - 0.3, fontFace: MONO, fontSize: 14, align: "left", valign: "top", lineSpacingMultiple: 1.05 });
}
function titleband(s, txt, sub) {
  s.addText(txt, { x: 0.6, y: 0.4, w: 12.1, h: 0.75, fontFace: FONT, fontSize: 32, bold: true, color: DEEPBLUE });
  if (sub) s.addText(sub, { x: 0.62, y: 1.12, w: 12.1, h: 0.5, fontFace: FONT, fontSize: 17, color: GRAY });
}

// ===== 1. TITLE =====
let s = p.addSlide(); s.background = { color: NAVY };
s.addShape(p.ShapeType.ellipse, { x: 10.6, y: -1.4, w: 4.2, h: 4.2, fill: { color: "16204A" }, line: { type: "none" } });
circle(s, 0.9, 0.85, 1.4, ORANGE, "🤖", 38);
s.addText("교사용 수업 진행 가이드", { x: 2.6, y: 1.05, w: 9, h: 0.6, fontFace: FONT, fontSize: 21, bold: true, color: "8FA6D8" });
s.addText("아두이노 6자유도 로봇팔", { x: 0.9, y: 2.7, w: 11.6, h: 1.0, fontFace: FONT, fontSize: 44, bold: true, color: WHITE });
s.addText("코드 구획 이해 · 함수 만들기 · 활동지 12단계 지도", { x: 0.9, y: 3.85, w: 11.6, h: 0.7, fontFace: FONT, fontSize: 24, color: "CADCFC" });
s.addText("충남교육청 진로융합교육원 · bridgE", { x: 0.9, y: 5.7, w: 11.6, h: 0.5, fontFace: FONT, fontSize: 17, color: ORANGE, bold: true });

// ===== 2. ROADMAP (12 steps) =====
const steps = [
  ["1", "awake robot Arm", "로봇팔 깨우기",
    ["6개 서보 = 6개 관절, 서보가 '각도'를 만든다", "전원·GND 연결이 안정 동작의 기본", false],
    "30초 안에 조이스틱으로 그리퍼를 '목표 지점' 터치!", "관절 매핑표를 함께 채우며 '어느 서보가 어디를?' 확인", false],
  ["2", "Code Dissection", "코드 해부",
    ["코드는 3덩어리 — 준비 · setup · loop", "핀·시작각·조건문(612/412)을 코드에서 찾기", false],
    "숫자를 일부러 바꿔 무슨 일이 나는지 알아내기(코드 탐정)", "'이 값 바꾸면?' 먼저 예측 → 실험 → 되돌리기", false],
  ["3", "Joystick Master", "조이스틱 마스터",
    ["한 번에 크게 움직이면 흔들림 → 조금씩", "정밀 제어의 감을 잡는다", false],
    "블록 타워 높이 / 컵 옮기기 타임어택 — 팀 최고기록", "점수 기록판 + 안정 조작 '나만의 요령' 공유", false],
  ["4", "Home Position", "홈 포지션",
    ["INITANGLE = 전원 켤 때의 자세", "안전 — 갑자기 크게 튀지 않는 안정 자세", false],
    "1mm 챌린지 — 매번 같은 점에 펜 끝 닿기", "초기각을 직접 수정하고 안정성 점검표로 확인", false],
  ["5", "gripper craftsman", "그리퍼 장인",
    ["그리퍼: 열림 0° / 닫힘 90°", "힘·각도 조절로 섬세하게 집기", false],
    "마시멜로·종이컵을 안 터뜨리고 옮기기", "물체별 각도 기록, '왜 어려운가' 토론", false],
  ["6", "Talking to a Robot", "로봇과 대화 (Serial)",
    ["Serial 추가 → 'p'로 현재 각도 읽기", "동작을 '숫자(데이터)'로 남긴다", false],
    "자세 사진사 — 멋진 포즈를 각도값으로 캡처", "친구와 각도값 교환 → 똑같이 재현해 보기", false],
  ["7", "Pick & Place", "픽 앤 플레이스",
    ["작업을 순서로 분해: 집기→들기→이동→놓기", "순서 설계가 자동화의 씨앗", false],
    "택배 분류 타임어택 — A→B 가장 빠르고 정확하게", "작업 순서 설계표를 먼저 그리고 실행", false],
  ["8", "Posture Recipe Book", "포즈 레시피북",
    ["성공 자세 = 각도 데이터 = 자동화 재료", "HOME / PICK / PLACE 포즈 카드", false],
    "포즈 카드 완성 → 다음 시간 '자동화'의 재료", "같은 값 다시 넣으면 재현되는지 점검", false],
  ["9", "Create a function", "함수 만들기",
    ["반복 덩어리에 '이름' 붙이기 = 함수", "loop() 바깥에 만들고 이름()으로 부른다", false],
    "gripperOpen/Close → goHome → 나만의 함수", "함수 전(복붙) vs 후 코드 비교 → 왜 편한가", true],
  ["10", "Automatic Pick & Place", "자동 픽 앤 플레이스",
    ["함수를 '순서대로' 부르면 자동화", "버튼(조이스틱 SW, 디지털 7번) 한 번에 실행", false],
    "원클릭 공장 — 10회 중 성공률 도전", "흐름도 작성, 실패 시 어떤 값을 조정할지", true],
  ["11", "Final Mission Design", "최종 미션 설계",
    ["배운 것 종합 → 문제 정의·설계", "반복 테스트로 성공률 높이기", false],
    "팀 미션 자유 설계(분류·피라미드·도미노·군무…)", "우리 미션이 어떤 산업 사례와 닮았나", false],
  ["12", "Demo & Career", "데모데이 & 진로",
    ["시연·상호 관람·촬영", "활동을 진로와 연결", false],
    "데모데이 + 우리 로봇팔의 '직업' 발표", "'내가 없애고 싶은 반복노동은?' 진로 발문", false],
];
s = p.addSlide(); s.background = { color: WHITE };
titleband(s, "활동지 전체 흐름 — 12단계", "각 단계는 '하나씩 완성해 가는' 성취의 사다리로 이어집니다.");
let gx = 0.6, gy = 1.75, cw = 3.02, ch = 1.28, sx = 0.14, sy = 0.16;
steps.forEach((st, i) => {
  const col = i % 4, row = Math.floor(i / 4);
  const x = gx + col * (cw + sx), y = gy + row * (ch + sy);
  card(s, x, y, cw, ch, i < 8 ? BLUETINT : "F2F7FF");
  circle(s, x + 0.16, y + 0.2, 0.72, st[6] ? ORANGE : BLUE, st[0], 24);
  s.addText(st[2], { x: x + 0.95, y: y + 0.18, w: cw - 1.1, h: 0.5, fontFace: FONT, fontSize: 15, bold: true, color: DEEPBLUE });
  s.addText(st[1], { x: x + 0.95, y: y + 0.66, w: cw - 1.1, h: 0.45, fontFace: FONT, fontSize: 12, italic: true, color: "6B7A90" });
});
s.addText("+ 심화: group dance mission (함수 나눠 군무)", { x: 0.6, y: 7.0, w: 12, h: 0.4, fontFace: FONT, fontSize: 15, color: ORANGE, bold: true });

// ===== CODE ANATOMY =====
// A. 3덩어리 개요
s = p.addSlide(); s.background = { color: WHITE };
titleband(s, "코드 이해 ① — 코드는 '3덩어리'다", "긴 코드도 이 세 부분만 알면 읽힌다.");
const parts = [
  ["①", "준비 구역", "라이브러리 · 변수(배열)", "로봇팔이 쓸 재료를 미리 꺼내 둔다", BLUE],
  ["②", "setup()", "핀 · 각도 설정 (딱 한 번)", "전원을 켜면 한 번만 실행되는 초기 설정", GREEN],
  ["③", "loop()", "조이스틱 → 각도 → write (계속)", "쉬지 않고 반복되는 로봇팔의 실제 동작", ORANGE],
];
parts.forEach((r, i) => {
  const x = 0.6 + i * 4.15;
  card(s, x, 1.9, 3.9, 4.6, i === 1 ? GREENTINT : (i === 2 ? ORANGETINT : BLUETINT));
  circle(s, x + 0.3, 2.2, 1.0, r[4], r[0], 34);
  s.addText(r[1], { x: x + 1.45, y: 2.35, w: 2.4, h: 0.7, fontFace: FONT, fontSize: 21, bold: true, color: DEEPBLUE, valign: "middle" });
  s.addText(r[2], { x: x + 0.3, y: 3.45, w: 3.3, h: 0.9, fontFace: FONT, fontSize: 17, bold: true, color: GRAY });
  s.addText(r[3], { x: x + 0.3, y: 4.5, w: 3.3, h: 1.7, fontFace: FONT, fontSize: 16, color: GRAY });
});

// B. ① 준비 구역
s = p.addSlide(); s.background = { color: WHITE };
titleband(s, "코드 이해 ② — ① 준비 구역", "6개 서보의 정보를 '배열'로 한 줄에 묶어 관리한다.");
codebox(s, 0.6, 1.85, 7.1, 4.7, [
  "#include <Servo.h>   // 서보 도구상자 불러오기", "",
  "const int SERVOS = 6;   // 관절(서보) 개수", "",
  "int PIN[SERVOS];        // 각 서보의 핀 번호",
  "int MIN[SERVOS], MAX[SERVOS];   // 안전 각도범위",
  "int INITANGLE[SERVOS];  // 시작 각도",
  "int ANA[SERVOS];        // 조이스틱 번호",
  "Servo myservo[SERVOS];  // 서보 6개 (실제 모터)",
]);
card(s, 8.0, 1.85, 4.7, 4.7, BLUETINT);
s.addText("💡  왜 배열을 쓸까?", { x: 8.3, y: 2.1, w: 4.1, h: 0.5, fontFace: FONT, fontSize: 19, bold: true, color: DEEPBLUE });
s.addText([
  { text: "변수를 6벌 만드는 대신 [ ]로 한 줄에 묶는다", options: { bullet: true, breakLine: true } },
  { text: "for문으로 6개를 한 번에 처리 → 코드가 짧아짐", options: { bullet: true, breakLine: true } },
  { text: "숫자만 바꾸면 6축 전체에 반영 (수정 쉬움)", options: { bullet: true } },
], { x: 8.4, y: 2.7, w: 4.1, h: 3.5, fontFace: FONT, fontSize: 16, color: GRAY, paraSpaceAfter: 12, valign: "top" });

// C. ② setup 구역
s = p.addSlide(); s.background = { color: WHITE };
titleband(s, "코드 이해 ③ — ② setup() 설정 구역", "핀 / 최소·최대각 / 시작각 / 조이스틱 번호를 정한다 (딱 한 번).");
codebox(s, 0.6, 1.85, 7.1, 4.7, [
  "//        핀  최소 최대 시작 조이스틱",
  "setServo(0, 2, 0, 180, 90, 0); // 1번",
  "setServo(1, 3, 0, 180, 90, 1); // 2번",
  "  ...",
  "setServo(5, 5, 0,  90, 45, 5); // 그리퍼", "",
  "for (int i=0; i<SERVOS; i++){",
  "  myservo[i].attach(PIN[i]);   // 핀 연결",
  "  myservo[i].write(INITANGLE[i]); // 시작각",
  "}",
]);
card(s, 8.0, 1.85, 4.7, 4.7, GREENTINT);
s.addText("🔑  꼭 짚을 점", { x: 8.3, y: 2.1, w: 4.1, h: 0.5, fontFace: FONT, fontSize: 19, bold: true, color: GREEN });
s.addText([
  { text: "setup은 전원 켤 때 '한 번만' 실행", options: { bullet: true, breakLine: true } },
  { text: "attach = 서보를 그 핀에 연결하는 것", options: { bullet: true, breakLine: true } },
  { text: "MIN/MAX = 로봇팔을 지키는 안전 범위", options: { bullet: true, breakLine: true } },
  { text: "그리퍼(6번)만 0~90° (열림0·닫힘90)", options: { bullet: true } },
], { x: 8.4, y: 2.7, w: 4.1, h: 3.5, fontFace: FONT, fontSize: 16, color: GRAY, paraSpaceAfter: 11, valign: "top" });

// D. ③ loop 구역
s = p.addSlide(); s.background = { color: WHITE };
titleband(s, "코드 이해 ④ — ③ loop() 동작 구역", "핵심 한 줄: 조이스틱을 읽어 → 각도 +1/−1 → 서보에 쓴다.");
codebox(s, 0.6, 1.85, 7.1, 4.7, [
  "value = analogRead(ANA[i]); // 조이스틱(0~1023)", "",
  "if (value > 612) {          // 한쪽으로 밀면",
  "   currentAngle++;          //   각도 +1",
  "   myservo[i].write(currentAngle);",
  "}",
  "else if (value < 412) {     // 반대로 밀면",
  "   currentAngle--;          //   각도 -1",
  "   myservo[i].write(currentAngle);",
  "}",
  "// 412~612 사이는 '멈춤'(데드존)",
]);
card(s, 8.0, 1.85, 4.7, 4.7, ORANGETINT);
s.addText("🎮  발문 포인트", { x: 8.3, y: 2.1, w: 4.1, h: 0.5, fontFace: FONT, fontSize: 19, bold: true, color: "C45911" });
s.addText([
  { text: "612 / 412는 무엇일까? → 중립 구간 경계", options: { bullet: true, breakLine: true } },
  { text: "왜 조금씩(+1/−1)? → 부드럽고 안정적", options: { bullet: true, breakLine: true } },
  { text: "delay(50)을 줄이면? → 더 빠르게(거칠게)", options: { bullet: true, breakLine: true } },
  { text: "loop는 1초에 수십 번 반복된다", options: { bullet: true } },
], { x: 8.4, y: 2.7, w: 4.1, h: 3.5, fontFace: FONT, fontSize: 16, color: GRAY, paraSpaceAfter: 11, valign: "top" });

// E. ④ 함수 만드는 곳
s = p.addSlide(); s.background = { color: WHITE };
titleband(s, "함수 만들기 — 어디에, 어떻게", "반복되는 동작 덩어리에 '이름'을 붙인 것이 함수. loop() 바깥에 만든다.");
codebox(s, 0.6, 1.85, 7.1, 4.7, [
  "// loop() '바깥' (파일 아래쪽)에 만든다", "",
  "void gripperOpen()  { myservo[5].write(0); }",
  "void gripperClose() { myservo[5].write(90); }", "",
  "void goHome() {",
  "  for(int i=0;i<SERVOS;i++)",
  "     myservo[i].write(INITANGLE[i]);",
  "}", "",
  "// 부를 때:  goHome();  gripperClose();",
]);
card(s, 8.0, 1.85, 4.7, 4.7, BLUETINT);
s.addText("🧩  만드는 3요소", { x: 8.3, y: 2.1, w: 4.1, h: 0.5, fontFace: FONT, fontSize: 19, bold: true, color: DEEPBLUE });
s.addText([
  { text: "① 이름  ② void(돌려줄 값 없음)  ③ { 할 일 }", options: { bullet: true, breakLine: true } },
  { text: "어디에? → loop() 바깥, 파일 아래쪽", options: { bullet: true, breakLine: true } },
  { text: "어떻게 쓰나? → 어디서든 이름(); 한 줄", options: { bullet: true, breakLine: true } },
  { text: "함수들을 '순서대로' 부르면 = 자동화!", options: { bullet: true } },
], { x: 8.4, y: 2.7, w: 4.1, h: 3.5, fontFace: FONT, fontSize: 16, color: GRAY, paraSpaceAfter: 11, valign: "top" });

// ===== STEP-BY-STEP TEACHING =====
steps.forEach((st) => {
  let c = p.addSlide(); c.background = { color: WHITE };
  circle(c, 0.6, 0.42, 0.95, st[6] ? ORANGE : BLUE, st[0], 30);
  c.addText("STEP " + st[0] + "  ·  " + st[1], { x: 1.75, y: 0.42, w: 11, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: "6B7A90" });
  c.addText(st[2], { x: 1.75, y: 0.86, w: 11, h: 0.7, fontFace: FONT, fontSize: 28, bold: true, color: DEEPBLUE });

  card(c, 0.6, 1.85, 12.1, 2.0, BLUETINT);
  c.addText("🧑‍🏫  이 단계에서 설명할 것", { x: 0.9, y: 2.02, w: 11.4, h: 0.5, fontFace: FONT, fontSize: 19, bold: true, color: DEEPBLUE });
  c.addText([
    { text: st[3][0], options: { bullet: true, breakLine: true } },
    { text: st[3][1], options: { bullet: true } },
  ], { x: 1.0, y: 2.55, w: 11.3, h: 1.2, fontFace: FONT, fontSize: 18, color: GRAY, paraSpaceAfter: 8, valign: "top" });

  card(c, 0.6, 4.0, 12.1, 1.4, ORANGETINT);
  c.addText("🏆  미션", { x: 0.9, y: 4.16, w: 3, h: 0.5, fontFace: FONT, fontSize: 19, bold: true, color: "C45911" });
  c.addText(st[4], { x: 2.7, y: 4.16, w: 9.8, h: 1.1, fontFace: FONT, fontSize: 18, color: GRAY, valign: "middle" });

  card(c, 0.6, 5.55, 12.1, 1.4, GREENTINT);
  c.addText("🙋  참여·발문", { x: 0.9, y: 5.71, w: 3, h: 0.5, fontFace: FONT, fontSize: 19, bold: true, color: GREEN });
  c.addText(st[5], { x: 2.9, y: 5.71, w: 9.6, h: 1.1, fontFace: FONT, fontSize: 18, color: GRAY, valign: "middle" });
});

// ===== GROUP DANCE =====
s = p.addSlide(); s.background = { color: NAVY };
s.addShape(p.ShapeType.ellipse, { x: 10.7, y: 4.8, w: 4.4, h: 4.4, fill: { color: "16204A" }, line: { type: "none" } });
circle(s, 0.9, 0.75, 1.2, ORANGE, "💃", 34);
s.addText("심화 · group dance mission", { x: 2.35, y: 0.95, w: 10, h: 0.7, fontFace: FONT, fontSize: 30, bold: true, color: WHITE });
card(s, 0.9, 2.2, 5.7, 4.2, "16204A");
s.addText("함수를 나눠 군무 완성", { x: 1.2, y: 2.45, w: 5.1, h: 0.6, fontFace: FONT, fontSize: 21, bold: true, color: ORANGE });
s.addText([
  { text: "학생마다 동작 함수를 하나씩 맡아 만든다", options: { bullet: true, breakLine: true } },
  { text: "moveTimed(포즈, BEAT)로 '한 박자'에 이동", options: { bullet: true, breakLine: true } },
  { text: "모든 팀이 같은 BEAT → 박자가 맞는 군무", options: { bullet: true, breakLine: true } },
  { text: "'3·2·1!'에 동시 시작 (또는 공통 버튼)", options: { bullet: true } },
], { x: 1.3, y: 3.15, w: 5.1, h: 3.1, fontFace: FONT, fontSize: 17, color: "CADCFC", paraSpaceAfter: 12, valign: "top" });
codebox(s, 7.0, 2.2, 5.6, 4.2, [
  "void waveHand(){ moveTimed(WAVE_L,BEAT);",
  "                moveTimed(WAVE_R,BEAT); }", "",
  "void routine(){    // 팀이 합치는 안무",
  "  waveHand();",
  "  twist();",
  "  bow();",
  "}",
]);

// ===== CLOSING =====
s = p.addSlide(); s.background = { color: NAVY };
s.addShape(p.ShapeType.ellipse, { x: -1.2, y: -1.3, w: 4, h: 4, fill: { color: "16204A" }, line: { type: "none" } });
s.addText("수업을 이끄는 4가지 원칙", { x: 0.9, y: 0.8, w: 11.5, h: 0.9, fontFace: FONT, fontSize: 32, bold: true, color: WHITE });
const rules = [
  ["완성의 사다리", "매 단계 '오늘 된 것'을 확인 → 성취감", false],
  ["예측 → 실험", "값을 바꾸기 전에 먼저 예측하게 한다", false],
  ["직업 렌즈", "이 활동 = 어떤 어른의 밥벌이? 매번 연결", false],
  ["기록의 자산화", "활동지 = 진로 포트폴리오 · 생기부 근거", false],
];
rules.forEach((r, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.9 + col * 6.0, y = 2.0 + row * 2.15;
  card(s, x, y, 5.6, 1.85, "16204A");
  circle(s, x + 0.28, y + 0.5, 0.85, ORANGE, String(i + 1), 30);
  s.addText(r[0], { x: x + 1.35, y: y + 0.28, w: 4.0, h: 0.6, fontFace: FONT, fontSize: 21, bold: true, color: WHITE });
  s.addText(r[1], { x: x + 1.35, y: y + 0.88, w: 4.05, h: 0.85, fontFace: FONT, fontSize: 16, color: "CADCFC", valign: "top" });
});
s.addText("코드를 보여주지 말고, 하나씩 완성하게 하라.", { x: 0.9, y: 6.55, w: 11.5, h: 0.6, fontFace: FONT, fontSize: 20, bold: true, color: ORANGE });

p.writeFile({ fileName: "/home/user/myClaud/robot-arm-curriculum/slides/로봇팔_교사용_수업가이드.pptx" }).then((f) => console.log("saved", f));
