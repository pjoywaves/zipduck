# Frontend-Backend API Mapping

**작성일**: 2025-11-25
**최종 수정일**: 2025-11-25
**기준 문서**: `specs/001-personalized-recommendation/spec.md`

이 문서는 ZipDuck 프로젝트의 프론트엔드 화면/컴포넌트와 백엔드 API 엔드포인트 간의 맵핑을 정의합니다.

## 목차
- [프론트엔드 기술 스택](#프론트엔드-기술-스택)
- [API 엔드포인트 개요](#api-엔드포인트-개요)
- [화면별 API 맵핑](#화면별-api-맵핑)
- [TanStack Query 사용 가이드](#tanstack-query-사용-가이드)
- [상세 API 스펙](#상세-api-스펙)
- [구현 우선순위](#구현-우선순위)

---

## 프론트엔드 기술 스택

### 데이터 페칭 & 상태 관리
- **TanStack Query v5** (React Query): 서버 상태 관리, 캐싱, 동기화
- **Axios**: HTTP 클라이언트
- **React**: UI 라이브러리

### 프로젝트 구조
```
frontend/src/
├── api/              # API 클라이언트 및 React Query 훅
│   ├── client.ts     # Axios 인스턴스 설정
│   ├── subscription.ts
│   ├── pdf.ts
│   ├── user.ts
│   ├── userProfile.ts
│   ├── favorites.ts
│   └── eligibility.ts
├── hooks/            # 커스텀 훅 (비즈니스 로직)
├── components/       # UI 컴포넌트
└── types/            # TypeScript 타입 정의
```

---

## API 엔드포인트 개요

### 인증 (Authentication)
| 메서드 | 엔드포인트 | 설명 | React Query 훅 | 우선순위 |
|--------|-----------|------|---------------|---------|
| POST | `/api/auth/signup` | 회원가입 | `useSignUp()` | P2 |
| POST | `/api/auth/login` | 로그인 | `useLogin()` | P2 |
| POST | `/api/auth/logout` | 로그아웃 | `useLogout()` | P2 |
| POST | `/api/auth/refresh` | 토큰 갱신 | `useRefreshToken()` | P2 |
| POST | `/api/auth/password/reset` | 비밀번호 재설정 | `useResetPassword()` | P3 |

### 사용자 프로필 (User Profile)
| 메서드 | 엔드포인트 | 설명 | React Query 훅 | 우선순위 |
|--------|-----------|------|---------------|---------|
| GET | `/api/users/me` | 현재 사용자 정보 조회 | `useCurrentUser()` | P1 |
| PUT | `/api/users/me` | 사용자 정보 수정 | `useUpdateUser()` | P1 |
| GET | `/api/users/me/profile` | 사용자 프로필 조회 | `useMyProfile()` | P1 |
| POST | `/api/users/me/profile` | 사용자 프로필 생성 | `useSaveProfile()` | P1 |
| PUT | `/api/users/me/profile` | 사용자 프로필 수정 | `useSaveProfile()` | P1 |
| DELETE | `/api/users/me` | 회원 탈퇴 | `useDeleteAccount()` | P3 |

### 청약 정보 (Subscriptions)
| 메서드 | 엔드포인트 | 설명 | React Query 훅 | 우선순위 |
|--------|-----------|------|---------------|---------|
| GET | `/api/subscriptions` | 청약 목록 조회 | `useSubscriptions()` | P1 |
| GET | `/api/subscriptions` | 청약 목록 무한 스크롤 | `useInfiniteSubscriptions()` | P1 |
| GET | `/api/subscriptions/{id}` | 청약 상세 조회 | `useSubscriptionDetail()` | P1 |
| GET | `/api/subscriptions/recommendations` | 추천 청약 목록 | `useRecommendations()` | P1 |
| POST | `/api/subscriptions/compare` | 청약 비교 | `useCompareSubscriptions()` | P3 |
| GET | `/api/subscriptions/{id}/eligibility` | 자격 분석 | `useEligibilityCheck()` | P1 |

### PDF 분석 (PDF Analysis)
| 메서드 | 엔드포인트 | 설명 | React Query 훅 | 우선순위 |
|--------|-----------|------|---------------|---------|
| POST | `/api/pdf/upload` | PDF 업로드 | `usePdfUpload()` | P1 |
| GET | `/api/pdf/{id}/status` | 처리 상태 조회 | `usePdfStatus()` | P1 |
| GET | `/api/pdf/{id}/analysis` | 분석 결과 조회 | `usePdfAnalysis()` | P1 |
| GET | `/api/pdf/list` | PDF 목록 조회 | `usePdfList()` | P2 |
| DELETE | `/api/pdf/{id}` | PDF 삭제 | `useDeletePdf()` | P2 |

### 즐겨찾기 (Favorites)
| 메서드 | 엔드포인트 | 설명 | React Query 훅 | 우선순위 |
|--------|-----------|------|---------------|---------|
| GET | `/api/favorites` | 즐겨찾기 목록 조회 | `useFavorites()` | P3 |
| POST | `/api/favorites/{subscriptionId}` | 즐겨찾기 추가 | `useToggleFavorite()` | P3 |
| DELETE | `/api/favorites/{subscriptionId}` | 즐겨찾기 제거 | `useToggleFavorite()` | P3 |

### 알림 (Notifications)
| 메서드 | 엔드포인트 | 설명 | React Query 훅 | 우선순위 |
|--------|-----------|------|---------------|---------|
| GET | `/api/notifications` | 알림 목록 조회 | `useNotifications()` | P3 |
| PUT | `/api/notifications/{id}/read` | 알림 읽음 처리 | `useMarkAsRead()` | P3 |
| GET | `/api/notifications/settings` | 알림 설정 조회 | `useNotificationSettings()` | P3 |
| PUT | `/api/notifications/settings` | 알림 설정 변경 | `useUpdateNotificationSettings()` | P3 |

---

## 화면별 API 맵핑

### 1. HomeScreen (`HomeScreen.tsx`)
**용도**: 메인 화면 - 마감임박 청약, 추천 청약 표시

**React Query 훅 사용**:
```tsx
import { useRecommendations, useSubscriptions } from "@/api/subscription";
import { useMyProfile } from "@/api/user";

function HomeScreen() {
  // 추천 청약 목록
  const { data: recommendations, isLoading: isLoadingRec } = useRecommendations("user-id");

  // 마감 임박 청약
  const { data: urgentSubscriptions, isLoading: isLoadingUrgent } = useSubscriptions({
    filter: { status: "ACTIVE" },
    sortBy: "applicationEndDate",
    sortOrder: "asc",
    size: 5,
  });

  // 사용자 프로필 (인사말)
  const { data: profile } = useMyProfile();

  // ...
}
```

**필요 API**:
- `GET /api/subscriptions/recommendations` - 추천 청약 목록
- `GET /api/subscriptions?filter[status]=ACTIVE&sortBy=applicationEndDate&sortOrder=asc&size=5` - 마감 임박 청약
- `GET /api/users/me/profile` - 사용자 프로필

**캐싱 전략**:
- 추천 청약: `staleTime: 5분`, 자동 백그라운드 갱신
- 마감 임박: `staleTime: 1분`, 실시간성 중요

---

### 2. ProfileForm (`profile/ProfileForm.tsx`)
**용도**: 사용자 프로필(청약 자격 정보) 입력/수정

**React Query 훅 사용**:
```tsx
import { useMyProfile, useSaveProfile } from "@/api/user";

function ProfileForm() {
  // 프로필 조회
  const { data: profile, isLoading } = useMyProfile();

  // 프로필 저장 (생성/수정)
  const { mutate: saveProfile, isPending } = useSaveProfile();

  const handleSubmit = (data: UserProfileRequest) => {
    saveProfile(data, {
      onSuccess: () => {
        toast.success("프로필이 저장되었습니다");
      },
      onError: (error) => {
        toast.error("저장 실패: " + error.message);
      },
    });
  };

  // ...
}
```

**필요 API**:
- `GET /api/users/me/profile` - 기존 프로필 조회
- `POST /api/users/me/profile` - 프로필 생성 (신규)
- `PUT /api/users/me/profile` - 프로필 수정

**요청 바디 예시** (`POST/PUT`):
```json
{
  "age": 32,
  "annualIncome": 6000,
  "householdMembers": 2,
  "housingOwned": 0,
  "region": "서울특별시",
  "subscriptionPeriod": 24,
  "isMarried": true,
  "hasChildren": false,
  "isFirstTimeHomeBuyer": true
}
```

**Mutation 후 처리**:
- 성공 시: 프로필 쿼리 무효화 (`queryClient.invalidateQueries(['profile'])`)
- 추천 청약 재조회 트리거

---

### 3. SubscriptionList (`subscriptions/SubscriptionList.tsx`)
**용도**: 청약 목록 표시 (필터링, 정렬, 페이징)

**React Query 훅 사용**:
```tsx
import { useSubscriptions, useInfiniteSubscriptions } from "@/api/subscription";

// 일반 페이징
function SubscriptionList() {
  const [filter, setFilter] = useState<SubscriptionFilter>({
    source: "ALL",
    status: "ACTIVE",
    minMatchScore: 70,
  });

  const { data, isLoading, error } = useSubscriptions({
    filter,
    sortBy: "matchScore",
    sortOrder: "desc",
    page: 0,
    size: 10,
  });

  // ...
}

// 무한 스크롤
function InfiniteSubscriptionList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSubscriptions({
    filter: { status: "ACTIVE" },
    sortBy: "matchScore",
    size: 10,
  });

  // ...
}
```

**필요 API**:
- `GET /api/subscriptions` - 청약 목록 조회

**쿼리 파라미터**:
```
?filter[source]=ALL|PUBLIC_DB|PDF_UPLOAD|MERGED
&filter[status]=ALL|ACTIVE|CLOSED|UPCOMING
&filter[minMatchScore]=80
&filter[regions][]=서울특별시
&filter[keyword]=힐스테이트
&sortBy=matchScore|applicationEndDate|price|createdAt
&sortOrder=asc|desc
&page=0
&size=10
```

**응답 예시**:
```json
{
  "content": [
    {
      "id": "sub-001",
      "name": "래미안 원베일리",
      "location": "서울특별시 서초구",
      "developer": "삼성물산",
      "supplyType": "PRIVATE",
      "totalUnits": 2990,
      "minPrice": 150000,
      "maxPrice": 450000,
      "applicationStartDate": "2025-02-01",
      "applicationEndDate": "2025-02-07",
      "source": "PUBLIC_DB",
      "status": "UPCOMING",
      "matchScore": 85,
      "isEligible": true
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 42,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

**캐싱 & 필터 전략**:
- 필터 변경 시 자동 refetch
- 각 필터 조합별로 독립 캐시 유지
- `staleTime: 3분`

---

### 4. DetailScreen (`DetailScreen.tsx` / `DetailScreenNew.tsx`)
**용도**: 청약 상세 정보 및 자격 분석 표시

**React Query 훅 사용**:
```tsx
import { useSubscriptionDetail } from "@/api/subscription";

function DetailScreen({ subscriptionId }: Props) {
  const { data, isLoading, error } = useSubscriptionDetail(subscriptionId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const { subscription, eligibility, relatedSubscriptions } = data;

  // ...
}
```

**필요 API**:
- `GET /api/subscriptions/{id}` - 청약 상세 조회 (자격 분석 포함)

**응답 예시**:
```json
{
  "subscription": {
    "id": "sub-001",
    "name": "래미안 원베일리",
    "location": "서울특별시 서초구",
    "developer": "삼성물산",
    "supplyType": "PRIVATE",
    "totalUnits": 2990,
    "minPrice": 150000,
    "maxPrice": 450000,
    "applicationStartDate": "2025-02-01",
    "applicationEndDate": "2025-02-07",
    "status": "UPCOMING",
    "matchScore": 85,
    "isEligible": true,
    "eligibilityTier": "1순위"
  },
  "eligibility": {
    "subscriptionId": "sub-001",
    "isEligible": true,
    "matchScore": 85,
    "tier": "1순위",
    "requirementsMet": [...],
    "requirementsFailed": [...],
    "recommendations": [...]
  },
  "relatedSubscriptions": [...]
}
```

---

### 5. PdfUploader & AnalysisResultDisplay
**용도**: PDF 업로드 및 분석 결과 표시

**React Query 훅 사용**:
```tsx
import { usePdfUpload } from "@/api/pdf";
import { usePdfStatusPolling } from "@/hooks/usePdfStatus";

function PdfUploader() {
  // PDF 업로드
  const { mutate: uploadPdf, isPending: isUploading } = usePdfUpload();

  const [pdfId, setPdfId] = useState<string | null>(null);

  // 상태 폴링 (2초마다)
  const {
    status,
    analysis,
    isPolling,
    isComplete,
    isFailed,
  } = usePdfStatusPolling(pdfId, {
    pollingInterval: 2000,
    onComplete: (result) => {
      toast.success("분석 완료!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpload = (file: File) => {
    uploadPdf(
      { request: { file } },
      {
        onSuccess: (response) => {
          setPdfId(response.pdfId);
        },
      }
    );
  };

  // ...
}
```

**필요 API**:
- `POST /api/pdf/upload` - PDF 업로드
- `GET /api/pdf/{id}/status` - 처리 상태 폴링
- `GET /api/pdf/{id}/analysis` - 분석 결과 조회

**업로드 플로우**:
1. 사용자가 PDF 파일 선택
2. `usePdfUpload()` mutation 실행
3. 응답으로 `pdfId` 수신
4. `usePdfStatusPolling()` 자동 시작 (2초 간격)
5. status가 `COMPLETED`가 되면 폴링 자동 중지
6. 분석 결과 자동 조회 및 표시

**상태 값**:
- `PENDING`: 대기 중
- `UPLOADING`: 업로드 중
- `PROCESSING`: 처리 중
- `OCR_IN_PROGRESS`: OCR 진행 중
- `ANALYZING`: AI 분석 중
- `COMPLETED`: 완료
- `FAILED`: 실패

---

### 6. ComparisonView (`subscriptions/ComparisonView.tsx`)
**용도**: 청약 비교 (최대 4개)

**React Query 훅 사용**:
```tsx
import { useSubscriptionDetail } from "@/api/subscription";

function ComparisonView() {
  const comparisonIds = getComparisonItems(); // localStorage

  // 각 ID별로 상세 정보 조회
  const subscriptions = comparisonIds.map(id => {
    const { data } = useSubscriptionDetail(id);
    return data?.subscription;
  });

  // ...
}
```

**구현 방식**:
- 클라이언트에서 비교 ID 관리 (localStorage)
- 각 ID별로 `useSubscriptionDetail()` 훅 사용
- React Query가 자동으로 병렬 요청 처리
- 서버 사이드 비교 API는 P3 우선순위 (선택적)

---

### 7. FavoritesScreen (`FavoritesScreen.tsx`, `favorites/FavoritesList.tsx`)
**용도**: 즐겨찾기 목록 표시

**React Query 훅 사용**:
```tsx
import { useFavorites, useToggleFavorite } from "@/api/favorites";

function FavoritesList({ userId }: Props) {
  // 즐겨찾기 목록 조회
  const { data: favorites, isLoading } = useFavorites(userId);

  // 즐겨찾기 토글 (추가/제거)
  const { mutate: toggleFavorite } = useToggleFavorite();

  const handleToggle = (subscriptionId: string) => {
    toggleFavorite(subscriptionId, {
      onSuccess: () => {
        // 자동으로 즐겨찾기 목록 refetch
        queryClient.invalidateQueries(['favorites', userId]);
      },
    });
  };

  // ...
}
```

**필요 API**:
- `GET /api/favorites` - 즐겨찾기 목록 조회
- `POST /api/favorites/{subscriptionId}` - 즐겨찾기 추가
- `DELETE /api/favorites/{subscriptionId}` - 즐겨찾기 제거

**Optimistic Update**:
```tsx
const { mutate: toggleFavorite } = useToggleFavorite({
  onMutate: async (subscriptionId) => {
    // Optimistic update
    await queryClient.cancelQueries(['favorites', userId]);
    const previous = queryClient.getQueryData(['favorites', userId]);

    queryClient.setQueryData(['favorites', userId], (old) => {
      // UI 즉시 업데이트
      return toggleFavoriteInList(old, subscriptionId);
    });

    return { previous };
  },
  onError: (err, variables, context) => {
    // 실패 시 롤백
    queryClient.setQueryData(['favorites', userId], context.previous);
  },
});
```

---

## TanStack Query 사용 가이드

### Query Keys 구조

모든 Query Key는 `frontend/src/lib/queryClient.ts`에서 중앙 관리합니다:

```tsx
export const queryKeys = {
  // 사용자
  users: {
    all: ['users'] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
  },

  // 프로필
  profile: {
    all: ['profile'] as const,
    my: () => [...queryKeys.profile.all, 'my'] as const,
  },

  // 청약
  subscriptions: {
    all: ['subscriptions'] as const,
    lists: () => [...queryKeys.subscriptions.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.subscriptions.lists(), filters] as const,
    details: () => [...queryKeys.subscriptions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.subscriptions.details(), id] as const,
    recommendations: (userId: string) =>
      [...queryKeys.subscriptions.all, 'recommendations', userId] as const,
  },

  // PDF
  pdf: {
    all: ['pdf'] as const,
    status: (id: string) => [...queryKeys.pdf.all, 'status', id] as const,
    analysis: (id: string) => [...queryKeys.pdf.all, 'analysis', id] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.pdf.all, 'list', filters] as const,
  },

  // 즐겨찾기
  favorites: {
    all: ['favorites'] as const,
    list: (userId: string) => [...queryKeys.favorites.all, userId] as const,
  },
};
```

### 전역 설정

`frontend/src/lib/queryClient.ts`:

```tsx
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30, // 30분 (구 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### API 파일 구조 예시

`frontend/src/api/subscription.ts`:

```tsx
import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import api from "./client";
import { queryKeys } from "@/lib/queryClient";

// API 함수
async function fetchSubscriptions(request: SubscriptionListRequest) {
  const { data } = await api.get('/subscriptions', { params: request });
  return data;
}

// React Query 훅
export function useSubscriptions(request: SubscriptionListRequest = {}) {
  return useQuery({
    queryKey: queryKeys.subscriptions.list(request),
    queryFn: () => fetchSubscriptions(request),
  });
}

export function useInfiniteSubscriptions(request: Omit<SubscriptionListRequest, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.subscriptions.list(request), 'infinite'],
    queryFn: ({ pageParam = 0 }) => fetchSubscriptions({ ...request, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
  });
}
```

### Mutation 예시

```tsx
export function useSaveProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserProfileRequest) => {
      const { data: response } = await api.post('/users/me/profile', data);
      return response;
    },
    onSuccess: () => {
      // 프로필 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.my() });

      // 추천 청약도 재조회 필요
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
  });
}
```

### 폴링 예시

```tsx
export function usePdfStatus(pdfId: string, options?: { enabled?: boolean; refetchInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.pdf.status(pdfId),
    queryFn: async () => {
      const { data } = await api.get(`/pdf/${pdfId}/status`);
      return data;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval ?? 2000, // 2초마다 폴링
    refetchIntervalInBackground: false,
  });
}
```

---

## 상세 API 스펙

### 공통 응답 포맷

모든 API는 다음 공통 포맷을 따릅니다:

**성공 응답**:
```json
{
  "success": true,
  "data": { ... },
  "message": "성공적으로 처리되었습니다",
  "timestamp": "2025-11-25T10:30:00Z"
}
```

**에러 응답**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "필수 입력값이 누락되었습니다",
    "details": {
      "field": "age",
      "reason": "나이는 19세 이상이어야 합니다"
    }
  },
  "timestamp": "2025-11-25T10:30:00Z"
}
```

**에러 코드**:
- `INVALID_INPUT`: 입력값 검증 실패
- `UNAUTHORIZED`: 인증 실패
- `FORBIDDEN`: 권한 없음
- `NOT_FOUND`: 리소스 없음
- `CONFLICT`: 중복 리소스
- `INTERNAL_ERROR`: 서버 내부 오류
- `SERVICE_UNAVAILABLE`: 외부 서비스 오류

---

### 인증 헤더

인증이 필요한 API는 다음 헤더를 포함해야 합니다:

```
Authorization: Bearer {accessToken}
```

Axios 인터셉터에서 자동 처리:

```tsx
// frontend/src/api/client.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 페이지네이션

목록 조회 API는 페이지네이션을 지원합니다:

**요청**:
```
?page=0&size=10
```

**응답**:
```json
{
  "content": [...],
  "page": 0,
  "size": 10,
  "totalElements": 42,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

---

## 구현 우선순위

### Phase 1 (P1) - MVP 필수 기능
**목표**: User Story 1, 2 구현

#### 프로필 & 추천
- ✅ `useMyProfile()` - 프로필 조회
- ✅ `useSaveProfile()` - 프로필 생성/수정
- ✅ `useRecommendations()` - 추천 청약 목록

#### 청약 조회
- ✅ `useSubscriptions()` - 청약 목록 조회
- ✅ `useInfiniteSubscriptions()` - 무한 스크롤
- ✅ `useSubscriptionDetail()` - 청약 상세 조회

#### PDF 분석
- ✅ `usePdfUpload()` - PDF 업로드
- ✅ `usePdfStatus()` - 상태 조회 (폴링)
- ✅ `usePdfAnalysis()` - 분석 결과 조회

**예상 기간**: 3-4주

---

### Phase 2 (P2) - 사용자 편의 기능
**목표**: User Story 3 구현

#### 인증
- `useSignUp()` - 회원가입
- `useLogin()` - 로그인
- `useLogout()` - 로그아웃
- `useRefreshToken()` - 토큰 갱신

#### 사용자 관리
- `useCurrentUser()` - 사용자 정보 조회
- `useUpdateUser()` - 사용자 정보 수정

#### PDF 관리
- `usePdfList()` - PDF 목록 조회
- `useDeletePdf()` - PDF 삭제

**예상 기간**: 2-3주

---

### Phase 3 (P3) - 부가 기능
**목표**: User Story 5, 6 구현

#### 즐겨찾기
- `useFavorites()` - 즐겨찾기 목록
- `useToggleFavorite()` - 추가/제거

#### 청약 비교
- `useCompareSubscriptions()` - 청약 비교

#### 알림
- `useNotifications()` - 알림 목록
- `useMarkAsRead()` - 읽음 처리
- `useNotificationSettings()` - 알림 설정
- `useUpdateNotificationSettings()` - 알림 설정 변경

#### 기타
- `useDeleteAccount()` - 회원 탈퇴
- `useResetPassword()` - 비밀번호 재설정

**예상 기간**: 2-3주

---

## 백엔드 기술 스택 권장사항

### Backend
- **Framework**: Spring Boot 3.x (Kotlin)
- **Database**: PostgreSQL (청약 데이터, 사용자 프로필)
- **Cache**: Redis (세션, 청약 캐시)
- **File Storage**: S3 or MinIO (PDF 파일)
- **OCR**: AWS Textract, Google Cloud Vision, or Tesseract
- **AI**: OpenAI GPT-4, Claude API, or Custom Model

### API Documentation
- **OpenAPI/Swagger** 3.0 스펙 작성
- **Postman Collection** 제공

### 인증/보안
- **JWT** 기반 인증
- **OAuth 2.0** (선택적, 소셜 로그인)
- **HTTPS** 필수
- **Rate Limiting** 적용

---

## 다음 단계

1. **OpenAPI 스펙 작성**: 각 엔드포인트의 상세 스펙을 OpenAPI 3.0 포맷으로 작성
2. **Mock API 서버 구축**: MSW (Mock Service Worker)를 사용한 Mock API
3. **API 계약 테스트**: Contract Testing (Pact, Spring Cloud Contract)
4. **데이터베이스 스키마 설계**: ERD 작성 및 마이그레이션 스크립트
5. **Backend 구현**: Phase 1부터 순차적으로 구현

---

## 참고 문서

- [Feature Specification](../specs/001-personalized-recommendation/spec.md)
- Frontend Types: `frontend/src/types/`
- Frontend API: `frontend/src/api/`
- Frontend Hooks: `frontend/src/hooks/`

---

**작성자**: Claude
**최종 수정일**: 2025-11-25
