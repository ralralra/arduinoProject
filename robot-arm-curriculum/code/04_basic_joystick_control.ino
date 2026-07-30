// ============================================================================
//  [04] 기본 조이스틱 제어 — 로봇팔을 조이스틱으로 움직이기 (표준 코드)
// ----------------------------------------------------------------------------
//   · 1차시: 이 코드를 올려 조이스틱으로 로봇팔을 조작한다(워밍업 게임).
//   · 2차시: 이 코드를 '해석'하고(코드 해석표), 값을 바꿔 실험한다(코드 탐정).
//
//   [코드 해석표에서 찾을 값]
//     - 서보모터 개수      → SERVOS
//     - 서보 핀 번호        → PIN[0]~PIN[5]
//     - 조이스틱 입력 핀    → ANA[0]~ANA[5]
//     - 초기 각도값        → INITANGLE[ ]
//     - 최소/최대 각도      → MIN[ ] / MAX[ ]
//     - 조이스틱 기준값     → 612 / 412  (loop 안)
// ============================================================================

#include <Servo.h>

const int SERVOS = 6;                 // 서보(관절) 개수
int PIN[SERVOS], MIN[SERVOS], MAX[SERVOS], INITANGLE[SERVOS], ANA[SERVOS];
int currentAngle[SERVOS], value[SERVOS];
Servo myservo[SERVOS];

void setup() {
  // 서보별 설정:  핀 / 최소각 / 최대각 / 초기각 / 조이스틱(아날로그) 번호
  PIN[0] = 2;  MIN[0] = 0;  MAX[0] = 180;  INITANGLE[0] = 90;  ANA[0] = 0;  // 1번
  PIN[1] = 3;  MIN[1] = 0;  MAX[1] = 180;  INITANGLE[1] = 90;  ANA[1] = 1;  // 2번
  PIN[2] = 9;  MIN[2] = 0;  MAX[2] = 180;  INITANGLE[2] = 90;  ANA[2] = 2;  // 3번
  PIN[3] = 8;  MIN[3] = 0;  MAX[3] = 180;  INITANGLE[3] = 90;  ANA[3] = 3;  // 4번
  PIN[4] = 4;  MIN[4] = 0;  MAX[4] = 180;  INITANGLE[4] = 90;  ANA[4] = 4;  // 5번
  PIN[5] = 5;  MIN[5] = 0;  MAX[5] = 90;   INITANGLE[5] = 45;  ANA[5] = 5;  // 6번(그리퍼)

  // 서보 6개를 핀에 연결하고 초기 각도로 보낸다
  for (int i = 0; i < SERVOS; i++) {
    myservo[i].attach(PIN[i]);
    myservo[i].write(INITANGLE[i]);
    currentAngle[i] = INITANGLE[i];
  }
}

void loop() {
  delay(50);   // 로봇팔 속도 조절 (숫자가 작을수록 빠름)  ← 2차시 코드 탐정 실험 대상

  for (int i = 0; i < SERVOS; i++) {
    value[i] = analogRead(ANA[i]);          // 조이스틱 값 읽기 (0~1023)
    currentAngle[i] = myservo[i].read();    // 현재 각도

    if (value[i] > 612) {                    // 한쪽으로 밀면 → 각도 +1
      if (currentAngle[i] < MAX[i]) currentAngle[i]++;
      myservo[i].write(currentAngle[i]);
    }
    else if (value[i] < 412) {               // 반대로 밀면 → 각도 -1
      if (currentAngle[i] > MIN[i]) currentAngle[i]--;
      myservo[i].write(currentAngle[i]);
    }
    // 412~612 사이(가운데)는 멈춤 — 조이스틱 중립 구간(데드존)
  }
}
