# System Architecture
# MetroWatch
## 실시간 도시철도 운영·혼잡 관제 시스템

---

# 1. 아키텍처 개요

MetroWatch는 공공데이터 API를 기반으로 도시철도 실시간 도착 정보와 역사별 승하차 데이터를 수집하고, 이를 분석하여 사용자와 운영자에게 제공하는 시스템이다.

본 시스템은 다음 관점을 중심으로 설계한다.

- 실시간 데이터 조회 성능
- 공공 API 장애 대응
- 데이터 수집 이력 관리
- 혼잡도 계산 및 저장
- 운영자 관제 기능 제공

---

# 2. 전체 시스템 구조

```txt
[Public Data API]
   ├─ 실시간 열차 도착 정보
   ├─ 역사별 승하차 인원
   └─ 역사/노선 정보
        │
        ▼
[Collector / Scheduler]
   ├─ API 호출
   ├─ 데이터 검증
   ├─ 실패 재시도
   └─ 수집 로그 저장
        │
        ▼
[NestJS Backend]
   ├─ Station Module
   ├─ Arrival Module
   ├─ Congestion Module
   ├─ Dashboard Module
   ├─ Alert Module
   └─ System Log Module
        │
        ├────▶ [Redis]
        │       └─ 실시간 도착 정보 캐싱
        │
        └────▶ [PostgreSQL]
                ├─ 역/노선 정보
                ├─ 승하차 통계
                ├─ 혼잡도 결과
                ├─ 수집 로그
                └─ 알림 이력

        ▼
[React Frontend]
   ├─ 사용자 화면
   └─ 관리자 관제 화면
```

---

# 3. 아키텍처 구성 요소

## 3-1. Public Data API

외부 공공데이터 API를 통해 도시철도 관련 데이터를 수집한다.

### 수집 대상 데이터

- 실시간 열차 도착 정보
- 역사별 승하차 인원
- 역사 및 노선 정보

---

## 3-2. Collector / Scheduler

공공 API 데이터를 주기적으로 수집하는 계층이다.

### 주요 역할

- 공공 API 호출
- 응답 데이터 파싱
- 데이터 유효성 검증
- 실패 시 재시도
- 수집 성공/실패 로그 저장

### 설계 이유

공공 API를 프론트엔드에서 직접 호출하지 않고 Collector를 분리함으로써 다음 이점을 얻는다.

- API Key 보호
- 장애 재시도 가능
- 데이터 수집 이력 관리 가능
- 데이터 정합성 검증 가능
- 운영자 관점의 수집 상태 확인 가능

---

## 3-3. NestJS Backend

전체 비즈니스 로직과 API 제공을 담당한다.

### 주요 모듈

| Module | 역할 |
|---|---|
| Station Module | 역사/노선 정보 관리 |
| Arrival Module | 실시간 열차 도착 정보 조회 |
| Congestion Module | 혼잡도 계산 및 조회 |
| Dashboard Module | 운영자 대시보드 데이터 제공 |
| Alert Module | 장애 및 혼잡 알림 관리 |
| System Log Module | 수집 로그 및 시스템 로그 관리 |

---

## 3-4. Redis

실시간성이 높은 데이터를 캐싱하는 저장소이다.

### 저장 대상

- 실시간 열차 도착 정보
- 자주 조회되는 혼잡도 데이터

### 설계 이유

실시간 열차 도착 정보는 짧은 주기로 변경되며 조회 빈도가 높다.  
따라서 매 요청마다 DB 또는 외부 API를 호출하지 않고 Redis TTL 캐시를 활용하여 응답 속도를 개선한다.

---

## 3-5. PostgreSQL

영속적으로 관리해야 하는 데이터를 저장한다.

### 저장 대상

- 노선 정보
- 역사 정보
- 승하차 통계
- 혼잡도 계산 결과
- API 수집 로그
- 알림 이력

---

## 3-6. React Frontend

사용자 화면과 관리자 관제 화면을 제공한다.

### 사용자 화면

- 역 검색
- 실시간 열차 도착 정보 조회
- 역사별 혼잡도 조회

### 관리자 화면

- 혼잡 TOP 역사 조회
- API 수집 상태 확인
- 장애 로그 조회
- 알림 이력 조회

---

# 4. 데이터 흐름

## 4-1. 실시간 열차 도착 정보 흐름

```txt
1. Scheduler가 공공 API 호출
2. Collector가 응답 데이터 검증
3. Redis에 실시간 도착 정보 저장
4. 사용자가 특정 역 도착 정보 조회
5. Backend가 Redis에서 데이터 조회
6. Frontend에 응답
```

### Redis Key 예시

```txt
arrival:station:{stationId}
```

### Redis Value 예시

```json
{
  "stationId": 1,
  "stationName": "서면",
  "lineName": "2호선",
  "direction": "상행",
  "destination": "장산",
  "arrivalMessage": "3분 후 도착",
  "arrivalSeconds": 180,
  "collectedAt": "2026-05-12T10:00:00"
}
```

### TTL

```txt
30 ~ 60초
```

---

## 4-2. 승하차 통계 수집 흐름

```txt
1. Scheduler가 승하차 통계 API 호출
2. Collector가 응답 데이터 검증
3. passenger_statistics 테이블에 저장
4. Congestion Module이 혼잡도 계산
5. congestion_statistics 테이블에 저장
6. Dashboard에서 혼잡도 데이터 조회
```

---

## 4-3. 장애 및 알림 흐름

```txt
1. API 호출 실패 발생
2. collector_logs에 실패 이력 저장
3. Alert Module이 장애 유형 판단
4. alert_histories에 알림 이력 저장
5. 관리자 대시보드에 장애 상태 표시
```

---

# 5. Collector 설계

## 5-1. Collector 책임

Collector는 외부 공공 API와 내부 시스템 사이의 데이터 수집 계층이다.

### 담당 기능

- 외부 API 호출
- 응답 데이터 파싱
- 필수 값 검증
- 데이터 변환
- 저장소 반영
- 수집 로그 기록

---

## 5-2. Retry 전략

공공 API 장애 또는 일시적 네트워크 오류에 대비하여 재시도 전략을 적용한다.

### Retry 조건

- Timeout
- 5xx 응답
- 네트워크 오류
- 응답 데이터 파싱 실패

### Retry 정책

```txt
최대 재시도 횟수: 3회
재시도 간격: 1초 → 3초 → 5초
```

---

## 5-3. Timeout 전략

외부 API 응답 지연으로 전체 시스템이 지연되지 않도록 Timeout을 설정한다.

```txt
API Timeout: 5초
```

---

## 5-4. 수집 로그 저장

모든 수집 결과는 collector_logs 테이블에 저장한다.

### 저장 항목

- API 이름
- 요청 URL
- 성공/실패 상태
- 응답 시간
- 에러 메시지
- 수집 시각

---

# 6. 혼잡도 계산 구조

## 6-1. 계산 기준

혼잡도는 시간대별 승하차 인원 데이터를 기반으로 계산한다.

```txt
혼잡률 = 현재 시간대 이용객 수 / 기준 수용 인원 × 100
```

---

## 6-2. 혼잡 단계

| 단계 | 기준 | 설명 |
|---|---:|---|
| LOW | 0 ~ 40% | 여유 |
| NORMAL | 41 ~ 70% | 보통 |
| HIGH | 71 ~ 90% | 혼잡 |
| VERY_HIGH | 91% 이상 | 매우 혼잡 |

---

## 6-3. 계산 방식

```txt
1. passenger_statistics 조회
2. 시간대별 total_count 계산
3. 역별 기준값과 비교
4. congestion_rate 계산
5. congestion_level 산정
6. congestion_statistics 저장
```

---

# 7. 장애 대응 설계

## 7-1. 공공 API 장애

### 발생 가능 상황

- API 응답 지연
- API 서버 오류
- 인증키 오류
- 응답 포맷 변경
- 데이터 누락

### 대응 방식

- Timeout 설정
- Retry 처리
- 실패 로그 저장
- 관리자 알림 생성
- 이전 정상 데이터 활용

---

## 7-2. Redis 장애

### 대응 방식

Redis 장애 발생 시 DB 조회로 fallback 한다.

```txt
Redis 조회 실패
      ▼
PostgreSQL 조회
      ▼
응답 제공
```

---

## 7-3. 데이터 이상 상황

### 검증 대상

- 필수 값 누락
- 음수 승하차 인원
- 비정상적으로 큰 수치
- 중복 데이터
- 날짜/시간 포맷 오류

### 대응 방식

- 검증 실패 데이터 저장 제외
- collector_logs에 실패 사유 기록
- 필요 시 alert_histories 생성

---

# 8. 운영 로그 전략

## 8-1. Collector Log

외부 API 수집 상태를 추적한다.

### 활용 목적

- 장애 원인 분석
- 수집 성공률 확인
- API 응답 시간 추적
- 데이터 최신화 여부 확인

---

## 8-2. Alert History

장애 및 이상 상황 발생 이력을 관리한다.

### 활용 목적

- 장애 발생 시각 확인
- 조치 여부 확인
- 반복 장애 패턴 분석

---

# 9. Scheduler 설계

## 9-1. 실시간 도착 정보 수집

```txt
주기: 30초 ~ 1분
저장소: Redis
```

---

## 9-2. 승하차 통계 수집

```txt
주기: 하루 1회
저장소: PostgreSQL
```

---

## 9-3. 혼잡도 계산

```txt
주기: 승하차 통계 수집 이후 실행
저장소: PostgreSQL
```

---

# 10. API 응답 흐름

## 실시간 도착 정보 조회

```txt
Client
  ▼
GET /stations/{stationId}/arrivals
  ▼
Arrival Module
  ▼
Redis 조회
  ▼
응답 반환
```

---

## 혼잡도 조회

```txt
Client
  ▼
GET /stations/{stationId}/congestion
  ▼
Congestion Module
  ▼
PostgreSQL 조회
  ▼
응답 반환
```

---

## 관리자 대시보드 조회

```txt
Client
  ▼
GET /admin/dashboard
  ▼
Dashboard Module
  ▼
PostgreSQL 조회
  ▼
응답 반환
```

---

# 11. 확장성 고려사항

## 지역 확장

초기에는 서울 또는 부산 데이터를 기준으로 구성하되, 추후 다른 도시철도 데이터도 연동 가능하도록 설계한다.

## 데이터 확장

추후 아래 데이터를 추가할 수 있다.

- 날씨 데이터
- 버스 도착 정보
- 재난 정보
- 민원 데이터

## 기능 확장

- WebSocket 기반 실시간 관제
- AI 기반 혼잡도 예측
- Slack / Email 알림
- 관리자 권한 관리
- 장애 리포트 자동 생성

---

# 12. 설계 핵심 요약

MetroWatch의 핵심 아키텍처는 다음과 같다.

- 공공 API 직접 조회가 아닌 Collector 기반 수집 구조
- Redis를 활용한 실시간 데이터 캐싱
- PostgreSQL 기반 운영 데이터 저장
- 수집 로그 및 알림 이력 기반 장애 추적
- 관리자 대시보드 중심의 운영형 시스템 설계

---

> 단순 정보 제공 서비스가 아니라 장애 감지, 수집 로그, 관리자 관제까지 고려한 운영형 백엔드 시스템을 목표로 설계했습니다.