// ============================================================
//  [08] 함수 만들기 + 버튼으로 자동 Pick & Place
// ------------------------------------------------------------
//  9~12차시의 핵심 코드. 두 가지를 새로 배운다.
//   (1) 반복되는 동작을 "함수"로 묶기  → moveTo(), goHome(), grip...()
//   (2) 버튼 한 번으로 동작을 "자동" 실행하기 → autoPickAndPlace()
//
//  ★ 하드웨어 설정 (이 로봇팔 기준)
//    - 그리퍼(6번 서보): 닫힘 = 90도, 열림 = 0도
//    - 1~5번 서보: 중심 90도, 0~180도
//    - 조이스틱 SW핀 → 디지털 7번 + GND 에 버튼 배선 추가
//      (SW는 누르면 GND와 연결됨 → INPUT_PULLUP 사용, 눌림 = LOW)
//
//  실행 방법
//    · 버튼(조이스틱 SW)을 누르면  → 자동 Pick & Place 실행
//    · 시리얼 모니터(9600)에서도 가능: 1=자동실행, h=홈, p=각도출력
//    · 평소에는 조이스틱으로 수동 조작도 그대로 된다.
// ============================================================

#include <Servo.h>

const int SERVOS = 6;
const int GRIPPER = 5;          // 그리퍼는 6번 서보(인덱스 5)
const int BUTTON_PIN = 7;       // ★ 조이스틱 SW를 연결할 디지털 핀 (실제 배선에 맞게)
int PIN[SERVOS], MIN[SERVOS], MAX[SERVOS], INITANGLE[SERVOS], ANA[SERVOS];
Servo myservo[SERVOS];

// ── 그리퍼 각도 (이 로봇팔: 열림 0도 / 닫힘 90도) ──
const int GRIP_OPEN  = 0;
const int GRIP_CLOSE = 90;

// ── 기록해 둔 자세들 (8차시에서 구한 각도값으로 바꿔 넣는다) ──
//    { 1번, 2번, 3번, 4번, 5번 }  ※ 그리퍼(6번)는 moveTo가 건드리지 않는다.
//    팔(1~5번)만 옮기고, 손(그리퍼)은 gripperOpen()/gripperClose()로 따로 제어.
int HOME[SERVOS]        = { 90,  90,  90,  90,  90, 0 };
int PICK_READY[SERVOS]  = { 60, 100,  80,  90,  90, 0 };  // 집을 물체 위(상공)
int PICK[SERVOS]        = { 60, 130, 110,  90,  90, 0 };  // 집는 위치(내려간 곳)
int PLACE_READY[SERVOS] = {120, 100,  80,  90,  90, 0 };  // 놓을 곳 위(상공)
int PLACE[SERVOS]       = {120, 130, 110,  90,  90, 0 };  // 놓는 위치

boolean lastButton = HIGH;      // 버튼 직전 상태(눌림 감지용)

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);   // ★ 버튼 입력(내부 풀업)

  //          핀   최소   최대    시작각   조이스틱
  PIN[0] = 3;   MIN[0] = 0; MAX[0] = 180; INITANGLE[0] = 90; ANA[0] = 0; // 1번 서보
  PIN[1] = 2;   MIN[1] = 0; MAX[1] = 180; INITANGLE[1] = 90; ANA[1] = 1; // 2번 서보
  PIN[2] = 9;   MIN[2] = 0; MAX[2] = 180; INITANGLE[2] = 90; ANA[2] = 2; // 3번 서보
  PIN[3] = 8;   MIN[3] = 0; MAX[3] = 180; INITANGLE[3] = 90; ANA[3] = 3; // 4번 서보
  PIN[4] = 4;   MIN[4] = 0; MAX[4] = 180; INITANGLE[4] = 90; ANA[4] = 4; // 5번 서보
  PIN[5] = 5;   MIN[5] = 0; MAX[5] = 90;  INITANGLE[5] = 0;  ANA[5] = 5; // 6번 그리퍼: 0(열림)으로 시작

  for (int i = 0; i < SERVOS; i++) {
    myservo[i].attach(PIN[i]);
    myservo[i].write(INITANGLE[i]);
  }
  Serial.println(F("준비 완료. 버튼을 누르면 자동 실행. (시리얼: 1=실행, h=홈, p=각도)"));
}

void loop() {
  // 1) 버튼(조이스틱 SW) 확인 — 눌리는 '순간'에만 1번 실행
  boolean nowButton = digitalRead(BUTTON_PIN);
  if (lastButton == HIGH && nowButton == LOW) {   // HIGH→LOW = 방금 눌림
    delay(20);                                    // 떨림(채터링) 방지
    if (digitalRead(BUTTON_PIN) == LOW) autoPickAndPlace();
  }
  lastButton = nowButton;

  // 2) 시리얼 명령(보조)
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    if (cmd == '1') autoPickAndPlace();
    else if (cmd == 'h' || cmd == 'H') goHome();
    else if (cmd == 'p' || cmd == 'P') printAngles();
  }

  // 3) 명령이 없으면 평소처럼 조이스틱 수동 조작
  joystickControl();
  delay(20);
}

// ============================================================
//   여기서부터가 "함수 만들기"의 핵심 — 반복 동작을 묶는다
// ============================================================

// [함수1] 팔(1~5번)을 목표 자세로 1도씩 부드럽게 이동.
//   ※ 그리퍼(6번)는 일부러 건드리지 않는다 → 옮기는 도중 물체를 놓치지 않게.
void moveTo(int target[]) {
  boolean moving = true;
  while (moving) {
    moving = false;
    for (int i = 0; i < GRIPPER; i++) {          // 0~4번만(그리퍼 제외)
      int cur = myservo[i].read();
      if (cur < target[i])      { myservo[i].write(cur + 1); moving = true; }
      else if (cur > target[i]) { myservo[i].write(cur - 1); moving = true; }
    }
    delay(15);   // 클수록 천천히 움직인다(물체를 치면 값을 키운다)
  }
}

// [함수2] 그리퍼 열기 / 닫기 — 손만 제어
void gripperOpen()  { myservo[GRIPPER].write(GRIP_OPEN);  delay(400); }
void gripperClose() { myservo[GRIPPER].write(GRIP_CLOSE); delay(400); }

// [함수3] 홈 자세로
void goHome() { moveTo(HOME); }

// [함수4] 자동 Pick & Place — 위 함수들을 "순서대로" 부르면 끝!
void autoPickAndPlace() {
  Serial.println(F(">> 자동 Pick & Place 시작"));
  gripperOpen();            // 손을 펴고
  moveTo(PICK_READY);       // 집을 물체 위로
  moveTo(PICK);             // 내려가서
  gripperClose();           // 집고
  moveTo(PICK_READY);       // 들어올리고
  moveTo(PLACE_READY);      // 놓을 곳 위로
  moveTo(PLACE);            // 내려놓을 위치로
  gripperOpen();            // 놓고
  moveTo(PLACE_READY);      // 다시 올라와서
  goHome();                 // 홈으로
  Serial.println(F(">> 완료"));
}

// ============================================================
//   보조 함수들
// ============================================================

// 조이스틱 수동 조작 (1단계 loop 내용을 함수로 분리한 것)
void joystickControl() {
  for (int i = 0; i < SERVOS; i++) {
    int v = analogRead(ANA[i]);
    int cur = myservo[i].read();
    if (v > 612 && cur < MAX[i])      myservo[i].write(cur + 1);
    else if (v < 412 && cur > MIN[i]) myservo[i].write(cur - 1);
  }
}

void printAngles() {
  Serial.print(F("현재 각도 -> { "));
  for (int i = 0; i < SERVOS; i++) {
    Serial.print(myservo[i].read());
    if (i < SERVOS - 1) Serial.print(F(", "));
  }
  Serial.println(F(" }"));
}
