# 🚇 MetroWatch
### 실시간 도시철도 운영·혼잡 관제 시스템

공공데이터 기반 도시철도 실시간 운영 관제 플랫폼입니다.

실시간 열차 도착 정보, 역사별 승하차 데이터, 혼잡도 데이터를 수집·분석하여:

- 시민에게는 실시간 혼잡도 및 열차 정보를 제공하고
- 운영자에게는 혼잡 구간 및 이상 상황을 관제할 수 있는 기능을 제공합니다.

---

# 📌 Project Overview

## 프로젝트 목적

기존 공공데이터는 단순 조회 형태로 제공되는 경우가 많으며,
실시간 운영 관점에서 통합적으로 분석·시각화하기 어렵습니다.

MetroWatch는 공공데이터를 기반으로:

- 실시간 데이터 수집
- 혼잡도 분석
- 운영 관제
- 장애 감지
- 데이터 검증

기능을 제공하는 운영형 시스템 구축을 목표로 합니다.

---

# 🛠️ Tech Stack

## Backend
- NestJS
- TypeScript
- Node.js

## Frontend
- React
- TailwindCSS

## Database
- PostgreSQL
- Redis

## Infra
- Docker
- Docker Compose
- GitHub Actions

---

# 🏗️ System Architecture

```txt
[Public Data API]
        │
        ▼
[Collector / Scheduler]
        │
        ▼
[NestJS Backend]
   ├─ Arrival Module
   ├─ Congestion Module
   ├─ Dashboard Module
   ├─ Alert Module
   └─ System Log Module
        │
        ├────▶ Redis
        └────▶ PostgreSQL

        ▼
[React Frontend]
```

---

# ✨ Core Features

## 🚉 실시간 열차 도착 정보
- 역 검색
- 상·하행 도착 정보 제공
- Redis 기반 실시간 캐싱

---

## 📊 역사별 혼잡도 분석
- 시간대별 승하차 분석
- 혼잡 단계 계산
- 혼잡 TOP 역사 조회

---

## 🖥️ 운영 관제 대시보드
- 데이터 수집 상태 확인
- API 장애 상태 모니터링
- 혼잡 현황 실시간 확인

---

## 🚨 장애 감지 및 알림
- API 실패 감지
- 혼잡 임계치 초과 알림
- 데이터 이상 탐지

---

# ⚙️ Key Design Points

## Redis 기반 실시간 캐시 최적화
실시간 열차 도착 정보는 Redis TTL 캐시를 활용하여 응답 속도를 최적화하였습니다.

---

## Collector 계층 분리
공공 API 수집 계층을 별도로 분리하여:
- 장애 재시도
- 수집 로그 관리
- 데이터 검증

이 가능하도록 설계하였습니다.

---

## 운영형 시스템 설계
단순 CRUD 서비스가 아니라:
- 운영 로그
- 장애 추적
- 관리자 관제
- 데이터 정합성

관점을 고려하여 설계하였습니다.

---

# 📂 Project Structure

```txt
metro-watch
│
├─ docs
│   ├─ PRD.md
│   ├─ SYSTEM_ARCHITECTURE.md
│   ├─ ERD.md
│   ├─ API_SPEC.md
│   └─ TROUBLE_SHOOTING.md
│
├─ backend
├─ frontend
└─ infra
```

---

# 📖 Documents

| Document | Description |
|---|---|
| PRD.md | 프로젝트 요구사항 정의 |
| SYSTEM_ARCHITECTURE.md | 시스템 아키텍처 설계 |
| ERD.md | 데이터베이스 설계 |
| API_SPEC.md | API 명세 |
| TROUBLE_SHOOTING.md | 장애 대응 및 트러블슈팅 |

---

# 📡 Public Data

- 서울 열린데이터광장
- 공공데이터포털
- 부산광역시 공공데이터포털

활용 데이터:
- 실시간 열차 도착 정보
- 역사별 승하차 인원
- 역사/노선 정보

---

# 🎯 Expected Outcomes

- 공공데이터 기반 실시간 시스템 구축 경험
- 운영형 백엔드 시스템 설계 경험
- Redis 캐시 및 장애 대응 경험
- 데이터 수집 및 검증 시스템 구축 경험

---

# 💡 Interview Point

> 공공 API를 단순 조회하는 방식이 아니라,
> 데이터 수집 계층을 별도로 분리하여 장애 재시도, 데이터 검증,
> 캐싱, 운영 로그 관리까지 고려한 운영형 시스템으로 설계하였습니다.