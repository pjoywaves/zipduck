# Frontend 작업 목록

**출처**: `specs/001-personalized-recommendation/tasks.md`
**생성일**: 2025-11-24
**최종 업데이트**: 2025-11-24

---

## Phase 2: Foundational (기반 인프라) - ✅ 완료

| ID | 병렬 | 설명 | 파일 경로 | 상태 |
|:---|:---:|:-----|:----------|:----:|
| T019 | [P] | Axios HTTP client 설정 | `frontend/src/services/api.ts` | ✅ |
| T020 | [P] | React Router 설정 | `frontend/src/App.tsx` | ✅ |
| T021 | [P] | 기본 TypeScript 타입 생성 | `frontend/src/types/` | ✅ |

---

## Phase 3: User Story 1 - 프로필 생성 및 통합 추천 뷰 (P1) - ✅ 완료

### User Profile (FR-001, FR-002, FR-006, FR-014)

| ID | 병렬 | 설명 | 파일 경로 | 상태 |
|:---|:---:|:-----|:----------|:----:|
| T042 | [P] | User TypeScript 타입 생성 | `frontend/src/types/User.ts` | ✅ |
| T043 | [P] | userService API 호출 서비스 생성 | `frontend/src/services/userService.ts` | ✅ |
| T044 | [P] | useProfile 커스텀 훅 생성 | `frontend/src/hooks/useProfile.ts` | ✅ |
| T045 | | ProfileForm 컴포넌트 구현 (유효성 검사 포함) | `frontend/src/components/profile/ProfileForm.tsx` | ✅ |
| T046 | | ProfileDisplay 컴포넌트 구현 | `frontend/src/components/profile/ProfileDisplay.tsx` | ✅ |
| T047 | | ProfilePage 페이지 생성 | `frontend/src/pages/ProfilePage.tsx` | ✅ |

### Unified Subscription View (FR-004, FR-005, FR-026, FR-027)

| ID | 병렬 | 설명 | 파일 경로 | 상태 |
|:---|:---:|:-----|:----------|:----:|
| T048 | [P] | Subscription TypeScript 타입 생성 | `frontend/src/types/Subscription.ts` | ✅ |
| T049 | [P] | subscriptionService API 호출 서비스 생성 | `frontend/src/services/subscriptionService.ts` | ✅ |
| T050 | [P] | useSubscriptions 커스텀 훅 생성 | `frontend/src/hooks/useSubscriptions.ts` | ✅ |
| T051 | | SourceFilter 컴포넌트 구현 (ALL, PUBLIC_DB, PDF_UPLOAD 필터) | `frontend/src/components/subscriptions/SourceFilter.tsx` | ✅ |
| T052 | | SubscriptionCard 컴포넌트 구현 (소스 배지 포함) | `frontend/src/components/subscriptions/SubscriptionCard.tsx` | ✅ |
| T053 | | SubscriptionList 컴포넌트 구현 | `frontend/src/components/subscriptions/SubscriptionList.tsx` | ✅ |
| T054 | | SubscriptionsPage 페이지 생성 (통합 뷰 및 소스 필터링) | `frontend/src/pages/SubscriptionsPage.tsx` | ✅ |
| T055 | | HomePage 페이지 생성 | `frontend/src/pages/HomePage.tsx` | ✅ |

---

## Phase 4: User Story 2 - AI 기반 PDF 분석 (P1) - ✅ 완료

### PDF Upload & Analysis (FR-016, FR-022, FR-036, FR-037, FR-038)

| ID | 병렬 | 설명 | 파일 경로 | 상태 |
|:---|:---:|:-----|:----------|:----:|
| T081 | [P] | Pdf TypeScript 타입 생성 | `frontend/src/types/Pdf.ts` | ✅ |
| T082 | [P] | pdfService API 호출 서비스 생성 | `frontend/src/services/pdfService.ts` | ✅ |
| T083 | [P] | usePdfUpload 커스텀 훅 생성 | `frontend/src/hooks/usePdfUpload.ts` | ✅ |
| T084 | [P] | usePdfStatus 폴링 훅 생성 (2초 간격) | `frontend/src/hooks/usePdfStatus.ts` | ✅ |
| T085 | | PdfUploader 컴포넌트 구현 (파일 유효성 검사 포함) | `frontend/src/components/pdf/PdfUploader.tsx` | ✅ |
| T086 | | PdfStatusPoller 컴포넌트 구현 (로딩 상태 포함) | `frontend/src/components/pdf/PdfStatusPoller.tsx` | ✅ |
| T087 | | AnalysisResultDisplay 컴포넌트 구현 (매치 점수 및 추천 표시) | `frontend/src/components/pdf/AnalysisResultDisplay.tsx` | ✅ |

### Eligibility Breakdown (FR-007, FR-018, FR-019, FR-020, FR-021)

| ID | 병렬 | 설명 | 파일 경로 | 상태 |
|:---|:---:|:-----|:----------|:----:|
| T088 | [P] | Eligibility TypeScript 타입 생성 | `frontend/src/types/Eligibility.ts` | ✅ |
| T089 | [P] | eligibilityService API 호출 서비스 생성 | `frontend/src/services/eligibilityService.ts` | ✅ |
| T090 | | EligibilityBreakdown 컴포넌트 구현 (충족/미충족 요구사항 표시) | `frontend/src/components/subscriptions/EligibilityBreakdown.tsx` | ✅ |
| T091 | | SubscriptionCard에 매치 점수 배지 추가 | `frontend/src/components/subscriptions/SubscriptionCard.tsx` | ✅ |

---

## Phase 6: 추가 P1 기능 - 즐겨찾기 및 비교 - ✅ 완료

| ID | 병렬 | 설명 | 파일 경로 | 상태 |
|:---|:---:|:-----|:----------|:----:|
| T101 | [P] | FavoritesList 컴포넌트 생성 | `frontend/src/components/favorites/FavoritesList.tsx` | ✅ |
| T102 | [P] | ComparisonView 컴포넌트 생성 | `frontend/src/components/subscriptions/ComparisonView.tsx` | ✅ |
| T103 | | SubscriptionCard에 즐겨찾기 관리 UI 추가 | `frontend/src/components/subscriptions/SubscriptionCard.tsx` | ✅ |
| T104 | | ComparisonPage 페이지 생성 (나란히 비교 테이블) | `frontend/src/pages/ComparisonPage.tsx` | ✅ |

---

## Phase 7: 마무리 및 폴리싱 - ✅ 완료

| ID | 병렬 | 설명 | 파일 경로 | 상태 |
|:---|:---:|:-----|:----------|:----:|
| T111 | [P] | 모든 프론트엔드 컴포넌트에 반응형 디자인 적용 (TailwindCSS) | 전체 컴포넌트 | ✅ |
| T112 | [P] | 모든 비동기 작업에 로딩 스켈레톤 생성 | 전체 컴포넌트 | ✅ |

---

## 요약

| Phase | 작업 수 | 완료 | 설명 |
|:------|:------:|:----:|:-----|
| Phase 2 | 3 | ✅ 3/3 | 기반 인프라 |
| Phase 3 | 14 | ✅ 14/14 | User Story 1 (프로필 & 통합 뷰) |
| Phase 4 | 11 | ✅ 11/11 | User Story 2 (AI PDF 분석) |
| Phase 6 | 4 | ✅ 4/4 | 즐겨찾기 & 비교 |
| Phase 7 | 2 | ✅ 2/2 | 폴리싱 |
| **총계** | **34** | **34/34** | **100% 완료** |

---

## 다음 단계

### Phase 7 (폴리싱)
- T111: 모든 컴포넌트에 반응형 디자인 적용 (TailwindCSS)
- T112: 모든 비동기 작업에 로딩 스켈레톤 생성

---

## 추가 설정 완료 항목

- ✅ TanStack Query (React Query) 설정 - src/lib/queryClient.ts
- ✅ 더미 API 서비스 - src/services/userProfileService.ts
- ✅ 데모 폼 컴포넌트 - src/components/ProfileFormDemo.tsx
- ✅ 즐겨찾기 서비스 - src/services/favoritesService.ts
- ✅ 즐겨찾기/비교 훅 - src/hooks/useFavorites.ts
