// ============================================================
//  [09] 로봇팔 군무(robot dance) — 함수를 나눠 안무 완성하기 (심화)
// ------------------------------------------------------------
//  9차시 "함수 만들기"의 확장 미션.
//   · 학생마다 '동작 함수'를 하나씩 만든다 (wave, bow, twist ...)
//   · 팀이 routine() 에서 그 함수들을 순서대로 불러 안무를 완성한다.
//
//  ★ 동기화(여러 대 군무)의 비밀: moveTimed()
//    이동 거리에 상관없이 "정확히 정해진 시간(BEAT)" 동안 움직인다.
//    → 모든 팀이 같은 routine() 을 쓰고 "3·2·1!"에 동시에 버튼을 누르면
//      박자가 맞는 군무가 된다. (공통 시작선을 쓰면 더 정확)
//
//  하드웨어: 그리퍼(6번) 열림 0°/닫힘 90°, 1~5번 중심 90°,
//           조이스틱 SW → 디지털 7번 + GND (시작 버튼)
//  실행: 버튼을 누르면 routine() 1회 실행. 시리얼 '1' 로도 가능.
// ============================================================

#include <Servo.h>

const int SERVOS = 6;
const int GRIPPER = 5;
const int BUTTON_PIN = 7;
const int BEAT = 700;            // 한 박자(ms). 모든 팀이 같은 값을 써야 군무가 맞는다.
int PIN[SERVOS], MIN[SERVOS], MAX[SERVOS], INITANGLE[SERVOS], ANA[SERVOS];
Servo myservo[SERVOS];

const int GRIP_OPEN = 0, GRIP_CLOSE = 90;

// ── 안무에 쓸 자세들 { 1번,2번,3번,4번,5번, (6번 그리퍼는 무시) } ──
int READY[SERVOS]   = { 90,  90,  90,  90,  90, 0 };  // 기본 준비 자세
int WAVE_L[SERVOS]  = { 60,  90, 110,  90,  60, 0 };  // 왼쪽으로 손 흔들기
int WAVE_R[SERVOS]  = {120,  90, 110,  90, 120, 0 };  // 오른쪽으로
int BOW[SERVOS]     = { 90, 130, 130,  90,  90, 0 };  // 인사(앞으로 숙이기)
int TWIST_L[SERVOS] = { 45,  90,  90,  90,  90, 0 };  // 허리 비틀기 좌
int TWIST_R[SERVOS] = {135,  90,  90,  90,  90, 0 };  // 우
int UP[SERVOS]      = { 90,  60,  60,  90,  90, 0 };  // 번쩍 들기
int DOWN[SERVOS]    = { 90, 120, 120,  90,  90, 0 };  // 내리기

boolean lastButton = HIGH;

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  //          핀   최소   최대    시작각   조이스틱
  PIN[0] = 3;   MIN[0] = 0; MAX[0] = 180; INITANGLE[0] = 90; ANA[0] = 0; // 1번 서보
  PIN[1] = 2;   MIN[1] = 0; MAX[1] = 180; INITANGLE[1] = 90; ANA[1] = 1; // 2번 서보
  PIN[2] = 9;   MIN[2] = 0; MAX[2] = 180; INITANGLE[2] = 90; ANA[2] = 2; // 3번 서보
  PIN[3] = 8;   MIN[3] = 0; MAX[3] = 180; INITANGLE[3] = 90; ANA[3] = 3; // 4번 서보
  PIN[4] = 4;   MIN[4] = 0; MAX[4] = 180; INITANGLE[4] = 90; ANA[4] = 4; // 5번 서보
  PIN[5] = 5;   MIN[5] = 0; MAX[5] = 90;  INITANGLE[5] = 0;  ANA[5] = 5; // 6번 그리퍼

  for (int i = 0; i < SERVOS; i++) { myservo[i].attach(PIN[i]); myservo[i].write(INITANGLE[i]); }
  Serial.println(F("군무 준비 완료. 버튼(또는 시리얼 1)으로 시작. '3,2,1!'에 다 같이 누르세요."));
}

void loop() {
  boolean nowButton = digitalRead(BUTTON_PIN);
  if (lastButton == HIGH && nowButton == LOW) { delay(20); if (digitalRead(BUTTON_PIN) == LOW) routine(); }
  lastButton = nowButton;

  if (Serial.available() > 0 && Serial.read() == '1') routine();
}

// ============================================================
//   ★ 군무 동기화의 핵심 함수 — 거리와 상관없이 dur(ms) 만에 도착
//     팔(1~5번)만 움직이고, 그리퍼는 따로 제어한다.
// ============================================================
void moveTimed(int target[], int dur) {
  int start[GRIPPER];
  for (int i = 0; i < GRIPPER; i++) start[i] = myservo[i].read();
  unsigned long t0 = millis();
  while (true) {
    unsigned long e = millis() - t0;
    float f = (e >= (unsigned long)dur) ? 1.0 : (float)e / dur;   // 진행률 0.0~1.0
    for (int i = 0; i < GRIPPER; i++)
      myservo[i].write(start[i] + (int)((target[i] - start[i]) * f));
    if (e >= (unsigned long)dur) break;
    delay(15);
  }
}

void gripperOpen()  { myservo[GRIPPER].write(GRIP_OPEN); }
void gripperClose() { myservo[GRIPPER].write(GRIP_CLOSE); }

// ============================================================
//   동작 함수 — 학생들이 하나씩 나눠 맡는다 (각 동작 = 정해진 박자)
// ============================================================
void waveHand() { moveTimed(WAVE_L, BEAT);  moveTimed(WAVE_R, BEAT); }   // 2박
void bow()      { moveTimed(BOW, BEAT);      moveTimed(READY, BEAT); }   // 2박
void twist()    { moveTimed(TWIST_L, BEAT);  moveTimed(TWIST_R, BEAT); } // 2박
void pump()     { moveTimed(UP, BEAT/2);     moveTimed(DOWN, BEAT/2); }  // 1박
void clap()     { gripperClose(); delay(BEAT/2); gripperOpen(); delay(BEAT/2); } // 1박(손뼉)

// ── [학생 작성 칸] 나만의 동작 만들기 ──
//   1) 위 READY 처럼 포즈 배열을 만든다  (예: int MY[SERVOS] = {..};)
//   2) moveTimed(MY, BEAT); 로 움직인다.  3) routine() 에 넣는다.
void myMove1() { /* TODO: 학생 A 작성 */ }
void myMove2() { /* TODO: 학생 B 작성 */ }
void myMove3() { /* TODO: 학생 C 작성 */ }

// ============================================================
//   안무 타임라인 — 팀이 동작 함수를 순서대로 부른다
//   (모든 팀이 동일한 순서·박자를 쓰면 군무가 맞는다)
// ============================================================
void routine() {
  Serial.println(F(">> 군무 시작"));
  moveTimed(READY, BEAT);   // 준비
  waveHand();               // 2박
  twist();                  // 2박
  pump(); pump();           // 2박
  clap(); clap();           // 2박
  bow();                    // 2박 (마무리 인사)
  // myMove1(); myMove2(); myMove3();   // ← 학생 동작을 완성하면 주석 해제
  moveTimed(READY, BEAT);
  Serial.println(F(">> 끝"));
}
