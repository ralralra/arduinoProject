// ============================================================
//  [05] 안전 시작(soft-start) 조이스틱 제어 — 시작 슬램/기어 파손 방지판
// ------------------------------------------------------------
//  [문제]  전원/업로드 순간 서보가 초기각으로 '전속력'으로 튀면서(슬램)
//          어깨(2번)가 전체 무게+중력+운동에너지를 받아 기어가 상한다.
//
//  [이 코드의 대책]
//   ① 서보를 한 개씩 순차 연결(동시 인러시 전류 → 브라운아웃 슬램 완화)
//   ② 초기각까지 '천천히(1도씩)' 이동(softStart)
//   ③ 평소 조작도 1도씩만 움직여 급가속 방지
//
//  [함께 지켜야 효과 큼 — 하드웨어]
//   · 전원 켜기 전, 팔을 홈 자세(대략 90도) 근처로 접어 둔다.
//   · 서보 전원은 외부 전원(5~6V, 2~3A↑) + 아두이노와 공통 GND.
//   · 어깨(2번)는 카운터밸런스(고무줄/스프링) 또는 메탈기어 서보 권장.
//  ※ 피드백 없는 서보 특성상 '연결 순간의 90도 잡기'는 완전히 없앨 수 없다.
//     → 팔을 90도 근처로 두고 시작하면 그 순간 움직임이 가장 작다.
// ============================================================

#include <Servo.h>

const int SERVOS = 6;
int PIN[SERVOS], MIN[SERVOS], MAX[SERVOS], INITANGLE[SERVOS], ANA[SERVOS];
int currentAngle[SERVOS];
Servo myservo[SERVOS];

void setup() {
  //          핀   최소   최대    시작각   조이스틱
  PIN[0] = 2;  MIN[0] = 0; MAX[0] = 180; INITANGLE[0] = 90; ANA[0] = 0; // 1번
  PIN[1] = 3;  MIN[1] = 0; MAX[1] = 180; INITANGLE[1] = 90; ANA[1] = 1; // 2번(어깨)
  PIN[2] = 9;  MIN[2] = 0; MAX[2] = 180; INITANGLE[2] = 90; ANA[2] = 2; // 3번
  PIN[3] = 8;  MIN[3] = 0; MAX[3] = 180; INITANGLE[3] = 90; ANA[3] = 3; // 4번
  PIN[4] = 4;  MIN[4] = 0; MAX[4] = 180; INITANGLE[4] = 90; ANA[4] = 4; // 5번
  PIN[5] = 5;  MIN[5] = 0; MAX[5] = 90;  INITANGLE[5] = 45; ANA[5] = 5; // 6번 그리퍼

  softStart();   // ★ 급출발 대신 부드럽게 시작
}

void loop() {
  delay(50);
  for (int i = 0; i < SERVOS; i++) {
    int value = analogRead(ANA[i]);          // 조이스틱 값(0~1023)
    currentAngle[i] = myservo[i].read();     // 현재 각도

    if (value > 612) {                       // 한쪽 → +1도
      if (currentAngle[i] < MAX[i]) myservo[i].write(++currentAngle[i]);
    } else if (value < 412) {                // 반대 → -1도
      if (currentAngle[i] > MIN[i]) myservo[i].write(--currentAngle[i]);
    }
    // 412~612(가운데)는 멈춤
  }
}

// ------------------------------------------------------------
//  softStart() : 슬램 없이 부드럽게 초기 자세로 진입
//   1) 서보를 한 개씩 순차 연결(중간에 delay → 동시 전류 급증 방지)
//   2) 모든 축을 90도에서 초기각까지 100단계에 걸쳐 천천히 이동
// ------------------------------------------------------------
void softStart() {
  const int FROM = 90;                       // 서보 기본 펄스 ≈ 90도로 가정

  for (int i = 0; i < SERVOS; i++) {         // ① 순차 연결
    myservo[i].attach(PIN[i]);
    myservo[i].write(FROM);                  // 우선 90도로 잡아 둔다
    currentAngle[i] = FROM;
    delay(150);                              // 한 개씩 → 전류 몰림/슬램 완화
  }
  delay(300);

  for (int step = 0; step <= 100; step++) {  // ② 초기각까지 서서히(≈1.7초)
    for (int i = 0; i < SERVOS; i++) {
      int a = FROM + (INITANGLE[i] - FROM) * step / 100;
      myservo[i].write(a);
      currentAngle[i] = a;
    }
    delay(15);
  }
}
