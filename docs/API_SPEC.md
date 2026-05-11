# API Specification
# MetroWatch
## 실시간 도시철도 운영·혼잡 관제 시스템

---

# 1. 개요

본 문서는 MetroWatch 시스템의 API 명세를 정의한다.

## API Base URL

```txt
/api
```

---

# 2. 공통 응답 구조

## Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

---

## Fail Response

```json
{
  "success": false,
  "errorCode": "INTERNAL_SERVER_ERROR",
  "message": "Unexpected server error"
}
```

---

# 3. Station API

# 3-1. 역사 목록 조회

## Request

```http
GET /api/stations
```

---

## Query Params

| Name | Type | Required | Description |
|---|---|---|---|
| keyword | string | N | 역사명 검색 |
| lineCode | string | N | 노선 코드 |

---

## Response

```json
{
  "success": true,
  "data": [
    {
      "stationId": 1,
      "stationCode": "201",
      "stationName": "서면",
      "lineCode": "LINE_2",
      "lineName": "2호선",
      "transferType": "TRANSFER"
    }
  ]
}
```

---

# 3-2. 역사 상세 조회

## Request

```http
GET /api/stations/{stationId}
```

---

## Path Params

| Name | Type | Description |
|---|---|---|
| stationId | number | 역사 ID |

---

## Response

```json
{
  "success": true,
  "data": {
    "stationId": 1,
    "stationCode": "201",
    "stationName": "서면",
    "lineCode": "LINE_2",
    "lineName": "2호선",
    "latitude": 35.1577,
    "longitude": 129.0592
  }
}
```

---

# 4. Arrival API

# 4-1. 실시간 도착 정보 조회

## Request

```http
GET /api/stations/{stationId}/arrivals
```

---

## Path Params

| Name | Type | Description |
|---|---|---|
| stationId | number | 역사 ID |

---

## Response

```json
{
  "success": true,
  "data": [
    {
      "trainNo": "2034",
      "direction": "UP",
      "destination": "장산",
      "arrivalMessage": "3분 후 도착",
      "arrivalSeconds": 180,
      "collectedAt": "2026-05-12T10:00:00"
    }
  ]
}
```

---

# 4-2. Redis Cache Miss Response Flow

## 처리 흐름

```txt
Redis 조회 실패
      ▼
PostgreSQL 조회
      ▼
응답 반환
```

---

# 5. Congestion API

# 5-1. 역사 혼잡도 조회

## Request

```http
GET /api/stations/{stationId}/congestion
```

---

## Query Params

| Name | Type | Required | Description |
|---|---|---|---|
| date | string | N | 조회 날짜 |
| hour | number | N | 시간대 |

---

## Response

```json
{
  "success": true,
  "data": {
    "stationId": 1,
    "stationName": "서면",
    "hour": 8,
    "passengerCount": 12340,
    "congestionRate": 88.5,
    "congestionLevel": "HIGH"
  }
}
```

---

# 5-2. 혼잡 TOP 역사 조회

## Request

```http
GET /api/congestion/top
```

---

## Query Params

| Name | Type | Required | Description |
|---|---|---|---|
| limit | number | N | 조회 개수 |
| hour | number | N | 시간대 |

---

## Response

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "stationId": 1,
      "stationName": "서면",
      "lineName": "2호선",
      "congestionRate": 95.1,
      "congestionLevel": "VERY_HIGH"
    }
  ]
}
```

---

# 6. Dashboard API

# 6-1. 관리자 대시보드 조회

## Request

```http
GET /api/admin/dashboard
```

---

## Response

```json
{
  "success": true,
  "data": {
    "todayCollectedCount": 1200,
    "todayFailCount": 12,
    "activeAlertCount": 3,
    "topCongestionStations": [
      {
        "stationName": "서면",
        "congestionRate": 95.1
      }
    ]
  }
}
```

---

# 6-2. 수집 상태 조회

## Request

```http
GET /api/admin/collector/status
```

---

## Response

```json
{
  "success": true,
  "data": {
    "lastCollectedAt": "2026-05-12T10:00:00",
    "successCount": 1200,
    "failCount": 12,
    "averageResponseTime": 350
  }
}
```

---

# 7. Collector Log API

# 7-1. 수집 로그 목록 조회

## Request

```http
GET /api/admin/collector-logs
```

---

## Query Params

| Name | Type | Required | Description |
|---|---|---|---|
| status | string | N | SUCCESS / FAIL |
| apiName | string | N | API 이름 |

---

## Response

```json
{
  "success": true,
  "data": [
    {
      "collectorLogId": 1,
      "apiName": "REALTIME_ARRIVAL_API",
      "status": "SUCCESS",
      "responseTimeMs": 320,
      "collectedAt": "2026-05-12T10:00:00"
    }
  ]
}
```

---

# 7-2. 수집 로그 상세 조회

## Request

```http
GET /api/admin/collector-logs/{collectorLogId}
```

---

## Response

```json
{
  "success": true,
  "data": {
    "collectorLogId": 1,
    "apiName": "REALTIME_ARRIVAL_API",
    "requestUrl": "https://api.example.com",
    "status": "FAIL",
    "responseTimeMs": 5200,
    "errorMessage": "Timeout",
    "collectedAt": "2026-05-12T10:00:00"
  }
}
```

---

# 8. Alert API

# 8-1. 알림 목록 조회

## Request

```http
GET /api/admin/alerts
```

---

## Query Params

| Name | Type | Required | Description |
|---|---|---|---|
| resolved | boolean | N | 해결 여부 |
| alertType | string | N | 알림 유형 |

---

## Response

```json
{
  "success": true,
  "data": [
    {
      "alertId": 1,
      "alertType": "API_FAIL",
      "alertLevel": "HIGH",
      "message": "실시간 도착 정보 API 장애 발생",
      "isResolved": false,
      "occurredAt": "2026-05-12T10:00:00"
    }
  ]
}
```

---

# 8-2. 알림 해결 처리

## Request

```http
PATCH /api/admin/alerts/{alertId}/resolve
```

---

## Response

```json
{
  "success": true,
  "message": "Alert resolved successfully"
}
```

---

# 9. Health Check API

# 9-1. 서버 상태 조회

## Request

```http
GET /api/health
```

---

## Response

```json
{
  "success": true,
  "data": {
    "status": "UP",
    "serverTime": "2026-05-12T10:00:00",
    "redis": "UP",
    "postgresql": "UP"
  }
}
```

---

# 10. Error Code

| Error Code | Description |
|---|---|
| INTERNAL_SERVER_ERROR | 서버 내부 오류 |
| INVALID_PARAMETER | 잘못된 요청 파라미터 |
| STATION_NOT_FOUND | 존재하지 않는 역사 |
| REDIS_CONNECTION_ERROR | Redis 연결 오류 |
| DATABASE_CONNECTION_ERROR | DB 연결 오류 |
| PUBLIC_API_ERROR | 공공 API 오류 |
| COLLECTOR_TIMEOUT | 수집 Timeout 발생 |

---

# 11. 인증/인가 (향후 확장)

초기 MVP에서는 인증 기능을 제외한다.

향후 관리자 기능 확장을 위해 JWT 기반 인증 구조를 고려한다.

---

# 12. API 설계 포인트

## RESTful API 구조

리소스 중심 URI 구조를 사용한다.

예시:

```txt
/api/stations
/api/stations/{stationId}
/api/stations/{stationId}/arrivals
```

---

## 관리자 API 분리

운영자 기능은 `/admin` prefix를 사용하여 일반 사용자 API와 분리한다.

예시:

```txt
/api/admin/dashboard
/api/admin/collector-logs
/api/admin/alerts
```

---

## Redis 기반 실시간 처리

실시간 도착 정보는 Redis TTL 캐시를 우선 조회한다.

이를 통해:
- 응답 속도 개선
- 공공 API 호출 최소화
- DB 부하 감소

를 달성한다.

---

## 운영 로그 기반 장애 추적

모든 Collector 작업은 로그를 저장한다.

이를 통해:
- API 장애 추적
- 응답 시간 분석
- 수집 성공률 확인

이 가능하다.

---

# 13. 향후 확장 예정 API

| API | 설명 |
|---|---|
| WebSocket /ws/arrivals | 실시간 도착 정보 Push |
| GET /api/weather | 날씨 정보 연동 |
| GET /api/incidents | 장애/민원 조회 |
| POST /api/admin/notifications/test | 알림 테스트 |
| GET /api/admin/statistics/daily | 일간 통계 |

---

# 14. Swagger 적용 예정

NestJS Swagger를 활용하여 API 문서 자동화를 적용할 예정이다.

```txt
/api-docs
```
