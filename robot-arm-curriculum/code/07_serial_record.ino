// ============================================================
//  [07] 조이스틱 제어 + 시리얼로 "각도값 기록"
// ------------------------------------------------------------
//  1단계 코드에 Serial(시리얼 통신)을 추가했다.
//  기본 코드만으로는 "지금 서보가 몇 도인지" 볼 방법이 없어서
//  8차시(각도값 기록)를 진행할 수 없다. 이 코드가 그 문제를 푼다.
//
//  사용법:
//   1) 로봇팔을 조이스틱으로 원하는 자세로 맞춘다.
//   2) 시리얼 모니터(9600 baud)에서 p 를 입력하고 Enter.
//   3) 현재 6축 각도가 { } 형태로 출력된다 → 활동지/코드에 그대로 복사.
// ============================================================

#include <Servo.h>          // 서보모터 제어 라이브러리

const int SERVOS = 6;       // 서보(관절) 개수
int PIN[SERVOS];            // 각 서보의 핀 번호
int value[SERVOS];          // 조이스틱 입력값(0~1023)
int idle[SERVOS];           // 멈춤 상태 카운터(확장용)
int currentAngle[SERVOS];   // 현재 각도
int MIN[SERVOS];            // 최소 각도(안전 하한)
int MAX[SERVOS];            // 최대 각도(안전 상한)
int INITANGLE[SERVOS];      // 시작 각도
int previousAngle[SERVOS];  // 직전 각도(확장용)
int ANA[SERVOS];            // 조이스틱 아날로그 채널
Servo myservo[SERVOS];      // 실제 서보 6개

void setup() {
  Serial.begin(9600);                       // ★ 추가: 컴퓨터와 통신 시작(9600 속도)

  //          핀   최소   최대    시작각   조이스틱
  PIN[0] = 3;   MIN[0] = 0; MAX[0] = 180; INITANGLE[0] = 90; ANA[0] = 0; // 1번
  PIN[1] = 2;   MIN[1] = 0; MAX[1] = 180; INITANGLE[1] = 90; ANA[1] = 1; // 2번
  PIN[2] = 9;   MIN[2] = 0; MAX[2] = 180; INITANGLE[2] = 90; ANA[2] = 2; // 3번
  PIN[3] = 8;   MIN[3] = 0; MAX[3] = 180; INITANGLE[3] = 90; ANA[3] = 3; // 4번
  PIN[4] = 4;   MIN[4] = 0; MAX[4] = 180; INITANGLE[4] = 90; ANA[4] = 4; // 5번
  PIN[5] = 5;   MIN[5] = 0; MAX[5] = 90;  INITANGLE[5] = 45; ANA[5] = 5; // 6번 그리퍼: 열림0/닫힘90

  for (int i = 0; i < SERVOS; i++) {  // 서보 6개를 하나씩 준비
    myservo[i].attach(PIN[i]);        // i번 서보를 핀에 연결
    myservo[i].write(INITANGLE[i]);   // 초기 자세로 이동
    value[i] = 0;                     // 조이스틱 값 초기화
    idle[i] = 0;                      // 멈춤 카운터 초기화
    previousAngle[i] = INITANGLE[i];  // 직전 각도를 초기각으로
  }

  Serial.println(F("로봇팔 준비 완료. 자세를 맞춘 뒤 p 를 입력하면 각도값이 기록됩니다."));
}

void loop() {
  delay(50);  // 속도 조정용 딜레이

  // ── 조이스틱 직접 제어 (1단계와 동일) ──
  for (int i = 0; i < SERVOS; i++) {
    value[i] = analogRead(ANA[i]);        // 조이스틱 값 읽기
    currentAngle[i] = myservo[i].read();  // 현재 각도 읽기

    if (value[i] > 612) {                             // 한쪽으로 밀면 +방향
      if (currentAngle[i] < MAX[i]) ++currentAngle[i];        // 최대각 전까지 +1도
      if (!myservo[i].attached()) myservo[i].attach(PIN[i]);  // 끊겼으면 재연결
      myservo[i].write(currentAngle[i]);              // 이동
    } else if (value[i] < 412) {                      // 반대로 밀면 -방향
      if (currentAngle[i] > MIN[i]) --currentAngle[i];        // 최소각 전까지 -1도
      if (!myservo[i].attached()) myservo[i].attach(PIN[i]);  // 끊겼으면 재연결
      myservo[i].write(currentAngle[i]);              // 이동
    }
    // 412~612 사이(가운데)는 멈춤(데드존)
  }

  // ── ★ 추가: 시리얼 명령으로 현재 각도 기록 ──
  if (Serial.available() > 0) {           // 시리얼로 입력된 글자가 있으면
    char cmd = Serial.read();             // 그 글자를 한 개 읽어서
    if (cmd == 'p' || cmd == 'P') {       // p(또는 P)이면
      printAngles();                      // 현재 각도를 출력
    }
  }
}

// 현재 6축 각도를 한 줄로 출력한다.
// 출력 예:  현재 각도 -> { 90, 120, 60, 90, 90, 20 }
void printAngles() {
  Serial.print(F("현재 각도 -> { "));
  for (int i = 0; i < SERVOS; i++) {      // 6개 서보를 하나씩
    Serial.print(myservo[i].read());      // 현재 각도를 출력
    if (i < SERVOS - 1) Serial.print(F(", "));  // 마지막이 아니면 쉼표로 구분
  }
  Serial.println(F(" }"));                // 줄을 닫고 줄바꿈
}
