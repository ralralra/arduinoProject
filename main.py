# micro:bit LED에는 작은 하트를 표시합니다.
# OLED 화면을 새로 그리는 함수
def redraw_oled():
    OLED.clear()
    # 화면에 있던 문자와 그래프를 모두 지웁니다.
    OLED.write_string("BPM: ")
    # OLED 첫 번째 줄에 "BPM: "을 표시합니다.
    OLED.write_num_new_line(bpm)
    # 현재 계산된 BPM을 표시하고 다음 줄로 이동합니다.
    OLED.draw_line(0, 16, 127, 16)
graph_x = 0
limited_value = 0
new_bpm = 0
beat_interval = 0
last_beat = 0
heart_off_time = 0
now = 0
sensor_value = 0
bpm = 0
# 이번에 새로 계산한 BPM입니다.
# 2. 박동을 한 번만 감지하기 위한 변수
# 센서값이 기준값을 넘었을 때 박동을 한 번만 세도록 합니다.
# True  : 새로운 박동을 감지할 준비가 된 상태
# False : 현재 박동을 이미 감지한 상태
beat_armed = True
# 큰 하트를 잠시 보여 준 작은 하트로 되돌릴 시간을 저장합니다.
# 3. 심박 감지 기준값
# 센서값이 이 값보다 커지면 박동이 시작된 것으로 판단합니다. 예제값인 600을 기본값으로 사용합니다.
THRESHOLD_HIGH = 600
THRESHOLD_LOW = 550
# 센서값이 이 값보다 작아지면 다음 박동을 감지할 준비를 합니다.
# HIGH와 LOW를 다르게 설정하는 이유는 센서값이 600 근처에서 흔들릴 때 한 박동을 여러 번 세는현상을 줄이기 위해서입니다.
# 4. 정상적인 BPM 범위
# 300ms보다 빠르게 박동이 감지되면 1분에 200회보다 빠른 값이 됩니다.
MIN_INTERVAL = 300
# 1500ms보다 느리게 박동이 감지되면 1분에 40회보다 느린 값이 됩니다.
MAX_INTERVAL = 1500
# 현재 그래프를 그릴 가로 위치입니다.
graph_y = 63
# 현재 센서값을 OLED의 세로 좌표로 변환한 값입니다.
previous_y = 63
# 바로 전에 그렸던 그래프의 세로 위치입니다.
# OLED 위쪽은 BPM 숫자를 표시하는 공간으로 남겨 둡니다.그래프는 y=20부터 y=63 사이에
GRAPH_TOP = 20
GRAPH_BOTTOM = 63
# 심박 센서값을 그래프로 변환할 때 사용할 범위
# 200보다 작은 값은 200으로, 900보다 큰 값은 900으로 제한합니다.
SIGNAL_MIN = 200
SIGNAL_MAX = 900
# 6. OLED 시작 설정
OLED.init(128, 64)
# OLED의 크기를 128×64로 설정합니다.
# 두 번째 값 0은 아이콘을 표시한 뒤 기다리지 않는다는 뜻입니다.
basic.show_icon(IconNames.SMALL_HEART, 0)# 숫자 영역과 그래프 영역을 구분하는 선을 그립니다.
redraw_oled()
# 프로그램 시작 시 OLED의 기본 화면을 한 번 그립니다.
# 8. 심박수 측정 및 그래프 출력
# 위에서 만든 함수를 계속 반복 실행합니다.

def on_forever():
    global sensor_value, now, beat_armed, heart_off_time, beat_interval, new_bpm, bpm, last_beat, limited_value, graph_y, graph_x, previous_y
    # 8-1. 심박 센서값 읽기
    # P1 핀에 연결된 심박 센서의 아날로그 값을 읽습니다.
    sensor_value = pins.analog_read_pin(AnalogReadWritePin.P1)
    # 프로그램이 시작된 후 지금까지 지난 시간을 가져옵니다.
    now = input.running_time()
    # 8-2. 새로운 박동 감지
    # 센서값이 높은 기준값을 넘었고,새로운 박동을 감지할 준비가 되어 있는지 확인합니다.
    if sensor_value > THRESHOLD_HIGH and beat_armed:
        # 현재 박동을 이미 감지했으므로 같은 박동을 다시 세지 않도록 False로 바꿉니다.
        beat_armed = False
        basic.show_icon(IconNames.HEART,0)
        # micro:bit LED에 큰 하트를 표시합니다.
        heart_off_time = now + 120
        # 120ms 후 작은 하트로 되돌리기 위해 시간을 기록합니다.
        # last_beat가 0이면 첫 번째 박동입니다.첫 번째 박동만으로는 박동 사이의 시간을 계산할 수 없습니다.
        if last_beat > 0:
            beat_interval = now - last_beat
            # 현재 박동 시각에서 이전 박동 시각을 뺍니다.
            # 너무 빠르거나 너무 느린 신호는 센서 잡음일 수 있으므로 계산에서 제외합니다.
            if beat_interval >= MIN_INTERVAL and beat_interval <= MAX_INTERVAL:
                # BPM 계산식
                # 1분은 60,000밀리초입니다.
                # 60,000을 박동 간격으로 나누면 BPM이 됩니다.
                # 예:  박동 간격이 1000ms이면 60000 ÷ 1000 = 60BPM입니다.
                new_bpm = Math.round(60000 / beat_interval)
                if bpm == 0:
                    bpm = new_bpm
                else:
                    # 처음 계산한 BPM이라면 바로 저장합니다.
                    # 기존 BPM이 있다면 새로운 값과 섞어 평균을 냅니다.갑자기 숫자가 크게 바뀌는 현상을 줄여 줍니다.
                    bpm = Math.round((bpm * 3 + new_bpm) / 4)
        # 현재 박동 시각을 다음 계산을 위해 저장합니다.
        last_beat = now
    # 8-3. 다음 박동을 감지할 준비
    # 센서값이 낮은 기준값 아래로 내려가면  현재 박동이 끝난 것으로 판단합니다.
    if sensor_value < THRESHOLD_LOW:
        beat_armed = True
    # 8-4. 하트 표시 크기 되돌리기
    # 큰 하트를 표시한 후 120ms가 지났으면 시 작은 하트로 변경합니다.
    if heart_off_time > 0 and now >= heart_off_time:
        basic.show_icon(IconNames.SMALL_HEART,0)
        heart_off_time = 0
    # 8-5. 일정 시간 동안 박동이 없으면 BPM을 0으로 변경
    # 2.5초 동안 새로운 박동이 감지되지 않으면 손가락이 센서에서 떨어진 것으로 판단합니다.
    if last_beat > 0 and now - last_beat > 2500:
        bpm = 0
    # 8-6. 센서값을 그래프의 세로 좌표로 변환
    # 너무 작거나 큰 센서값을 일정 범위로 제한합니다.
    limited_value = Math.constrain(sensor_value, SIGNAL_MIN, SIGNAL_MAX)
    # 센서값 200~900을 OLED의 y좌표 63~20으로 변환합니다.
    # 
    # OLED는 위쪽이 y=0이고 아래쪽이 y=63입니다.
    # 센서값이 커질수록 그래프가 위로 올라가도록 변환합니다.
    graph_y = Math.round(Math.map(limited_value,
            SIGNAL_MIN,
            SIGNAL_MAX,
            GRAPH_BOTTOM,
            GRAPH_TOP))
    # 8-7. OLED에 심박 그래프 그리기
    # 그래프가 OLED 오른쪽 끝에 도착했는지 확인합니다.
    if graph_x >= 126:
        redraw_oled()
        # 화면을 지우고 최신 BPM을 다시 표시합니다.
        graph_x = 0
        # 그래프를 왼쪽 처음 위치에서 다시 시작합니다.
        previous_y = graph_y
    else:
        OLED.draw_line(graph_x, previous_y, graph_x + 2, graph_y)
    # 이전 위치와 현재 위치를 선으로 연결합니다.
    # 이렇게 하면 점만 표시하는 것보다 연속된 심박 파형처럼 보이게 됩니다.
    graph_x += 2
    # 다음 그래프를 오른쪽으로 2픽셀 이동합니다
    previous_y = graph_y
    # 현재 y좌표를 다음 선의 시작점으로 저장합니다.
    # 8-8. 측정 속도 조절
    # 20ms 동안 기다립니다. 약 1초에 50번 센서값을 측정합니다.
    basic.pause(20)
basic.forever(on_forever)
