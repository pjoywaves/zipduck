# ZipDuck Frontend - 구현 명세서

## 1. 개요

ZipDuck 프론트엔드는 **주택 청약 자격 매칭 플랫폼**의 사용자 인터페이스로, React 19 및 최신 웹 기술을 활용하여 구축되었습니다.

**핵심 기술:**
- React 19.0.0
- TypeScript 5.6.0
- Vite 6.0.0
- TanStack React Query 5.90.10
- Tailwind CSS 4.0.0
- Radix UI (shadcn/ui)

---

## 2. 구현된 화면 및 페이지

### 2.1 인증 플로우 (5개 화면)

- **SplashScreen** - 앱 초기 스플래시 화면
- **NewOnboardingScreen** - 신규 사용자 온보딩 경험
- **NewSignUpScreen** - 이메일/비밀번호 회원가입, 약관 동의
- **LoginScreen** - 로그인 (이메일/비밀번호)
- **FindAccountScreen** - 계정 찾기/복구

### 2.2 메인 네비게이션 (탭 기반, 4개 화면)

- **HomeScreen** - 메인 대시보드
  - 청약 목록 표시
  - 빠른 액세스 FAB 메뉴
  - 추천 청약 섹션
- **SearchScreen** - 고급 검색 및 필터링
- **NewFavoritesScreen** - 즐겨찾기 관리
- **MyPageScreen** - 사용자 프로필 및 설정 허브

### 2.3 상세 정보 및 분석 (3개 화면)

- **DetailScreenNew** - 청약 상세 정보
  - 탭 구조 (개요, 일정, 위치, AI 분석)
  - 차트 및 그래프
  - 자격 요건 표시
- **AIRecommendationScreen** - AI 기반 청약 추천
- **AIChatScreen** - 대화형 AI 챗봇

### 2.4 AI 분석 및 인텔리전스 (3개 화면)

- **AIConsultScreen** - AI 상담 기능
- **AIRecommendBestScreen** - 상위 3개 AI 추천
- **AnalyticsScreen** - 사용자 분석 및 자격 대시보드

### 2.5 지도 및 시각화 (3개 화면)

- **CalendarScreen** - 청약 일정 캘린더 뷰
- **RegionMapScreen** - 지역 기반 지도 탐색
- **DistanceMapScreen** - 거리 기반 분석 시각화

### 2.6 필터링 및 사용자 정의 (1개 화면)

- **CustomFilterScreen** - 고급 필터 UI

### 2.7 설정 및 사용자 관리 (9개 화면)

- **SettingsScreen** - 메인 설정 허브
- **ProfileEditScreen** - 프로필 정보 수정
- **AppearanceScreen** - 테마/외관 설정
- **PasswordChangeScreen** - 비밀번호 변경 (검증 포함)
- **EmailChangeScreen** - 이메일 주소 변경
- **RegionPreferenceScreen** - 지역 선호도 관리
- **NotificationScreen** - 알림 센터
- **NotificationSettingsScreen** - 알림 설정

### 2.8 정보 페이지 (4개 화면)

- **HelpScreen** - 도움말 및 FAQ
- **PrivacyPolicyScreen** - 개인정보처리방침
- **TermsOfServiceScreen** - 이용약관
- **AnnouncementScreen** - 공지사항

**총 화면 수: 35개+**

---

## 3. 주요 기능 및 특징

### 3.1 핵심 기능

| 기능 | 설명 |
|------|------|
| **청약 관리** | 공공 데이터베이스 또는 PDF 업로드를 통한 청약 조회, 검색, 필터링 및 저장 |
| **자격 확인** | AI 기반 자동 자격 평가 및 상세 요건 분석 |
| **AI 추천** | 사용자 프로필에 맞는 머신러닝 기반 청약 추천 |
| **즐겨찾기 관리** | 메모와 함께 청약 저장 및 관리 |
| **PDF 분석** | OCR 및 AI 추출을 통한 청약 PDF 문서 업로드 및 파싱 |
| **비교** | 최대 4개 청약 나란히 비교 (localStorage에 저장) |
| **프로필 관리** | 자격 관련 정보를 포함한 포괄적인 사용자 프로필 |
| **분석 대시보드** | 자격 및 매칭에 대한 시각적 분석 및 통계 |
| **실시간 알림** | 푸시 알림 및 알림 센터 |
| **다중 출처 데이터** | 공공 데이터베이스, PDF 업로드 및 병합 데이터 출처 지원 |

### 3.2 고급 기능

- **매칭 점수 계산**: 청약 관련성에 대한 0-100 점수 시스템
- **순위 분류**: 1순위, 2순위, 특별 공급 (신혼부부, 생애최초, 다자녀, 노부모)
- **요건 그룹화**: 카테고리별 자격 요건 분류 (소득, 주택, 지역, 연령, 가구원 수, 청약, 특별)
- **OCR 처리**: 신뢰도 점수 및 품질 평가를 포함한 텍스트 추출
- **진행 상황 추적**: 진행 표시기를 포함한 실시간 PDF 처리 상태
- **지역 선호도**: 타겟 결과를 위한 다중 지역 선호도 관리

---

## 4. 서비스 및 API 통합

### 4.1 서비스 파일 (7개 핵심 서비스)

```
src/services/
├── api.ts                    # 인증 인터셉터를 포함한 Axios 설정
├── subscriptionService.ts    # 청약 CRUD 및 필터링
├── favoritesService.ts       # 즐겨찾기 및 비교 관리
├── eligibilityService.ts     # 자격 확인 및 분석
├── pdfService.ts             # PDF 업로드 및 처리
├── userService.ts            # 사용자 인증 및 프로필 관리
└── userProfileService.ts     # 추가 프로필 서비스
```

### 4.2 주요 서비스 기능

#### api.ts
- 설정 가능한 Base URL을 가진 Axios 인스턴스 (VITE_API_BASE_URL)
- 요청 인터셉터: localStorage에서 Bearer 토큰 자동 추가
- 응답 인터셉터: 401/403/404/500 에러 처리, 인증 실패 시 리다이렉트
- 토큰 관리 함수: setAuthToken, getAuthToken, removeAuthToken, isAuthenticated

#### subscriptionService.ts
- `useSubscriptions()` - 필터링/정렬이 있는 페이지네이션된 청약 목록
- `useInfiniteSubscriptions()` - 무한 스크롤 구현
- `useRecommendations()` - 개인화된 추천
- `useSubscriptionDetail()` - 단일 청약 상세 정보
- `useCompareSubscriptions()` - 다중 청약 비교
- `useFilteredSubscriptions()` - 출처 기반 필터링
- 더미 데이터: 다양한 유형과 상태의 샘플 청약 5개

#### favoritesService.ts
- `useFavorites()` - 사용자의 즐겨찾기 청약 조회
- `useAddFavorite()` - 선택적 메모와 함께 즐겨찾기에 추가
- `useRemoveFavorite()` - 즐겨찾기에서 제거
- `useToggleFavorite()` - 즐겨찾기 상태 토글
- `useIsFavorite()` - 청약이 즐겨찾기 되었는지 확인
- 비교 헬퍼: `addToComparison()`, `removeFromComparison()`, `isInComparison()`
- 최대 비교 항목: 4개 청약

#### eligibilityService.ts
- `useCheckEligibility()` - 청약 자격 확인
- `useEligibility()` - 청약별 자격 세부사항 조회
- `useEligibilitySummary()` - 집계된 자격 통계
- `groupRequirementsByCategory()` - 카테고리별 요건 정리
- 색상/라벨 유틸리티: `getMatchScoreColor()`, `getMatchScoreLabel()`

#### pdfService.ts
- `usePdfUpload()` - 진행 상황 추적과 함께 PDF 업로드
- `usePdfStatus()` - 처리 상태 폴링 (기본 2초 간격)
- `usePdfAnalysis()` - OCR 및 AI 분석 결과 조회
- `usePdfList()` - 사용자의 업로드된 PDF 목록
- `useDeletePdf()` - PDF 문서 삭제
- 처리 상태: PENDING, UPLOADING, PROCESSING, OCR_IN_PROGRESS, ANALYZING, COMPLETED, FAILED

#### userService.ts
- `useCurrentUser()` - 현재 사용자 정보 조회 (10분 stale time)
- `useMyProfile()` - 자격 요약과 함께 사용자 프로필 조회
- `useSaveProfile()` - 프로필 저장/업데이트
- `useLogin()` - 사용자 로그인
- `useSignUp()` - 사용자 회원가입
- `useLogout()` - 세션 및 캐시 지우기
- `useChangePassword()` - 검증과 함께 비밀번호 변경
- `useChangeEmail()` - 이메일 업데이트

---

## 5. 상태 관리 및 훅

### 5.1 React Query (TanStack Query v5)

**기본 설정** (`src/lib/queryClient.ts`)
- Stale time: 5분
- GC time (캐시): 30분
- 재시도: 쿼리 1회, 뮤테이션 0회
- 윈도우 포커스 시 재조회 안 함

**타입 안전 쿼리 키**
```typescript
queryKeys = {
  user: { all, profile(userId), me() },
  subscriptions: { all, list(filters), detail(id), recommendations(userId) },
  pdf: { all, list(userId), detail(id), status(id), analysis(id) },
  favorites: { all, list(userId) },
  eligibility: { all, check(subscriptionId, userId) }
}
```

### 5.2 커스텀 훅

#### src/hooks/useFavorites.ts
- `useFavoritesManager(userId)` - 통합 즐겨찾기 관리
  - `toggleFavorite()`, `isFavorite()`, `favoriteIds`, `totalCount`
- `useComparison()` - 비교 목록 관리
  - `addToCompare()`, `removeFromCompare()`, `toggleCompare()`
  - `isFull` 플래그와 함께 최대 4개 항목

#### src/hooks/useSubscriptions.ts
- `useSubscriptionList()` - 포괄적인 목록 관리
  - 필터링 (출처, 상태, 지역, 키워드)
  - 정렬 (매칭 점수, 날짜, 가격 등)
  - 통계 계산 (전체, 자격 있음, 높은 매칭, 활성, 예정)
- `useInfiniteSubscriptionList()` - 무한 스크롤 지원
- `useSubscriptionsBySource()` - 출처별 필터링
- `useRecommendedSubscriptions()` - 카테고리화와 함께 상위 추천

#### src/hooks/useProfile.ts
- `useProfile()` - 프로필 관리
  - 완성도 계산
  - 누락된 필수 필드 감지
  - 자격 요약 집계
- `useProfileForm()` - 기본값이 있는 폼 상태

#### src/hooks/usePdfStatus.ts
- `usePdfStatusPolling(pdfId)` - 실시간 PDF 처리
  - 설정 가능한 간격으로 자동 폴링 (기본 2초)
  - 완료/실패 시 자동 중지
  - 단계 라벨 및 진행 색상
- `useMultiplePdfStatus()` - 배치 PDF 추적

#### src/hooks/useResponsive.ts
- 반응형 디자인 유틸리티

#### src/hooks/usePdfUpload.ts
- 파일 업로드 처리

---

## 6. UI 컴포넌트

### 6.1 컴포넌트 라이브러리: Radix UI (shadcn/ui)

**핵심 컴포넌트**
```
입력 및 폼
- Input, Button, Checkbox, Radio Group, Switch
- Select, Label, Textarea, OTP Input
- Calendar, Date Picker (react-day-picker 사용)

피드백
- Dialog, Alert Dialog, Toast (Sonner)
- Popover, Tooltip, Hover Card
- Progress Bar, Slider

네비게이션
- Navigation Menu, Menubar, Dropdown Menu
- Breadcrumb, Pagination, Tabs, Accordion
- Sidebar (react-resizable-panels 사용)
- Drawer, Context Menu

표시
- Card, Badge, Avatar
- Separator, AspectRatio
- Carousel (Embla), ScrollArea
- Scroll indicators

특수
- Command (Cmdk), Command Palette
- Chart components (Recharts로 커스텀)
- Collapse/Expandable sections
```

### 6.2 커스텀 컴포넌트

**figma/**
- `ImageWithFallback` - 이미지 에러 처리

**subscriptions/**
- 청약 관련 컴포넌트 (상세, 목록, 비교)

**favorites/**
- 즐겨찾기 관리 UI 컴포넌트

**pdf/**
- PDF 업로드 및 처리 UI

**profile/**
- 프로필 폼 및 편집 컴포넌트

### 6.3 디자인 시스템 (`src/styles/design-system/tokens/`)

- **colors.ts** - 브랜드 색상 및 시맨틱 색상
- **typography.ts** - 폰트 크기, 굵기, 줄 높이
- **spacing.ts** - 간격 스케일
- **radius.ts** - 보더 반경 토큰
- **shadows.ts** - 고도 그림자
- **border.ts** - 보더 스타일
- **motion.ts** - 애니메이션 타이밍
- **zIndex.ts** - Z-index 스케일
- **breakpoints.ts** - 반응형 브레이크포인트
- **icons.ts** - 아이콘 정의

### 6.4 스타일링 스택

- **Tailwind CSS v4** - 유틸리티 우선 CSS
- **class-variance-authority** - 컴포넌트 변형
- **clsx** - 클래스 조합
- **tailwind-merge** - 스마트 Tailwind 병합
- **PostCSS** - CSS 처리

### 6.5 차트 컴포넌트

- **Recharts v3.4.1** - 데이터 시각화
  - 자격 분석을 위한 라인 차트, 바 차트, 레이더 차트

---

## 7. 라우팅 구조

### 7.1 라우터 설정 (`src/router/index.tsx`)

**공개 라우트**
```
/ (SPLASH) - 스플래시 화면
/onboarding (ONBOARDING) - 온보딩
/login (LOGIN) - 로그인
/signup (SIGNUP) - 회원가입
/find-account (FIND_ACCOUNT) - 계정 찾기
```

**보호된 라우트 (인증 가드)**
```
/home (HOME) - 메인 대시보드
/search (SEARCH) - 청약 검색
/favorites (FAVORITES) - 저장된 청약
/mypage (MYPAGE) - 사용자 프로필

/detail/:id (DETAIL) - 청약 상세

/ai-recommendation (AI_RECOMMENDATION) - AI 추천
/ai-chat (AI_CHAT) - AI 챗봇
/ai-consult (AI_CONSULT) - AI 상담
/ai-best (AI_BEST) - 상위 3개 추천

/filter (FILTER) - 커스텀 필터
/region-map (REGION_MAP) - 지역 지도
/distance-map (DISTANCE_MAP) - 거리 분석
/analytics (ANALYTICS) - 분석 대시보드
/announcement (ANNOUNCEMENT) - 공지사항
/calendar (CALENDAR) - 타임라인 캘린더

/settings (SETTINGS)
├── /settings/appearance (APPEARANCE) - 외관 설정
├── /settings/profile (PROFILE_EDIT) - 프로필 편집
├── /settings/email (EMAIL_CHANGE) - 이메일 변경
├── /settings/password (PASSWORD_CHANGE) - 비밀번호 변경
├── /settings/region-preference (REGION_PREFERENCE) - 지역 선호도
├── /settings/notifications (NOTIFICATION_SETTINGS) - 알림 설정
├── /settings/help (HELP) - 도움말
├── /settings/privacy-policy (PRIVACY_POLICY) - 개인정보처리방침
└── /settings/terms-of-service (TERMS_OF_SERVICE) - 이용약관
```

**인증 구현**
- `RequireAuth` 가드 컴포넌트가 localStorage "zipduck-auth-token" 확인
- 인증되지 않은 사용자를 /login으로 리다이렉트
- Suspense 폴백과 함께 지연 로딩 (스피너 로더)
- 성능을 위한 라우트 기반 코드 분할

---

## 8. 주요 기술 및 프레임워크

### 8.1 프론트엔드 프레임워크

| 기술 | 버전 | 목적 |
|------|------|------|
| **React** | 19.0.0 | UI 프레임워크 |
| **React Router** | 7.9.6 | 클라이언트 사이드 라우팅 |
| **TypeScript** | 5.6.0 | 타입 안전성 |
| **Vite** | 6.0.0 | 빌드 도구 및 개발 서버 |

### 8.2 상태 관리 및 데이터 페칭

| 기술 | 버전 | 목적 |
|------|------|------|
| **TanStack React Query** | 5.90.10 | 서버 상태 관리, 캐싱, 동기화 |
| **Zustand** | 5.0.3 | 클라이언트 상태 관리 |
| **Axios** | 1.13.2 | 인터셉터를 포함한 HTTP 클라이언트 |

### 8.3 폼 및 검증

| 기술 | 버전 | 목적 |
|------|------|------|
| **React Hook Form** | 7.66.1 | 효율적인 폼 상태 |
| **Zod** | 3.25.76 | 타입 안전 스키마 검증 |

### 8.4 UI 컴포넌트 및 스타일링

| 기술 | 버전 | 목적 |
|------|------|------|
| **Radix UI** | 1.x | 헤드리스 UI 프리미티브 (20개+ 컴포넌트) |
| **Tailwind CSS** | 4.0.0 | 유틸리티 우선 CSS 프레임워크 |
| **class-variance-authority** | 0.7.1 | 컴포넌트 변형 관리 |
| **Lucide React** | 0.554.0 | 아이콘 라이브러리 (200개+ 아이콘) |
| **Recharts** | 3.4.1 | 데이터 시각화 |
| **Embla Carousel** | 8.6.0 | 캐러셀 컴포넌트 |
| **Sonner** | 2.0.7 | 토스트 알림 |
| **Vaul** | 1.1.2 | 드로어/시트 컴포넌트 |
| **cmdk** | 1.1.1 | 커맨드 팔레트 |
| **input-otp** | 1.4.2 | OTP 입력 |
| **react-day-picker** | 9.11.1 | 캘린더/날짜 선택기 |
| **react-resizable-panels** | 3.0.6 | 크기 조절 가능한 패널 레이아웃 |

### 8.5 개발 도구

| 기술 | 버전 | 목적 |
|------|------|------|
| **@vitejs/plugin-react** | 4.0.0 | React Fast Refresh |
| **@tailwindcss/postcss** | 4.0.0 | Tailwind 처리 |
| **PostCSS** | 8.4.0 | CSS 변환 |
| **Autoprefixer** | 10.4.0 | CSS 벤더 프리픽스 |
| **ESLint** | Latest | 코드 린팅 |

### 8.6 환경 및 설정

- **Vite 환경 변수**: VITE_API_BASE_URL (기본값 /api/v1)
- **인증 저장소**: localStorage (키: "zipduck-auth-token")
- **프로필 저장소**: localStorage (키: "zipduck-user-profile")
- **비교 저장소**: localStorage (키: "zipduck_comparison_items")

---

## 9. 아키텍처 특징

### 9.1 주요 특징

1. **타입 안전**: Zod 검증을 포함한 완전한 TypeScript 구현
2. **성능**: 지연 로딩된 라우트, React Query 캐싱, Tailwind CSS
3. **확장 가능**: 서비스 지향 아키텍처, 재사용성을 위한 커스텀 훅
4. **사용자 중심**: 포괄적인 온보딩, 다중 AI 기능, 상세 분석
5. **모바일 최적화**: 최대 너비 420px 컨테이너, 반응형 디자인, 터치 친화적 UI
6. **오프라인 지원**: 인증, 프로필 및 비교 데이터를 위한 LocalStorage
7. **실시간 기능**: PDF 처리 폴링, 알림 시스템, 라이브 분석

### 9.2 통계 요약

| 메트릭 | 개수 |
|--------|------|
| **총 화면 수** | 35+ |
| **API 서비스** | 7 |
| **커스텀 훅** | 8+ |
| **타입 정의** | 50+ 인터페이스 |
| **UI 컴포넌트** | 50+ Radix UI 컴포넌트 |
| **라우트** | 30+ |
| **쿼리 키** | 5개 카테고리 |

---

## 10. 파일 경로 요약

- 컴포넌트: `frontend/src/components/`
- 서비스: `frontend/src/services/`
- 훅: `frontend/src/hooks/`
- 타입: `frontend/src/types/`
- 라우터: `frontend/src/router/index.tsx`
- UI 라이브러리: `frontend/src/components/ui/`
- 디자인 시스템: `frontend/src/styles/design-system/tokens/`

---

이 포괄적인 프론트엔드 구현은 최신 React 생태계와 최고의 사용자 경험 패턴을 활용한 프로덕션 준비 주택 청약 매칭 플랫폼을 제공합니다.
