import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import api from "./client";
import { queryKeys } from "@/lib/queryClient";
import type {
  Subscription,
  SubscriptionSource,
  SubscriptionFilter,
  SubscriptionListRequest,
  SubscriptionListResponse,
  SubscriptionDetailResponse,
  SubscriptionEligibility,
  CompareSubscriptionsRequest,
  CompareSubscriptionsResponse,
} from "@/types/Subscription";

// ===== 더미 데이터 =====

const DUMMY_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-001",
    name: "래미안 원베일리",
    location: "서울특별시 서초구",
    address: "서울특별시 서초구 반포동 1-1",
    developer: "삼성물산",
    constructor: "삼성물산 건설부문",
    supplyType: "PRIVATE",
    housingType: "APT",
    totalUnits: 2990,
    supplyUnits: 224,
    minSize: 59,
    maxSize: 244,
    minPrice: 150000,
    maxPrice: 450000,
    applicationStartDate: "2025-02-01",
    applicationEndDate: "2025-02-07",
    announcementDate: "2025-02-15",
    moveInDate: "2027-06",
    source: "PUBLIC_DB",
    status: "UPCOMING",
    matchScore: 85,
    isEligible: true,
    eligibilityTier: "1순위",
    thumbnailUrl: "/images/apt-1.jpg",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "sub-002",
    name: "힐스테이트 판교역",
    location: "경기도 성남시 분당구",
    developer: "현대건설",
    constructor: "현대건설",
    supplyType: "PRIVATE",
    housingType: "APT",
    totalUnits: 1500,
    minSize: 84,
    maxSize: 135,
    minPrice: 120000,
    maxPrice: 250000,
    applicationStartDate: "2025-01-20",
    applicationEndDate: "2025-01-25",
    source: "PUBLIC_DB",
    status: "ACTIVE",
    matchScore: 72,
    isEligible: true,
    eligibilityTier: "2순위",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "sub-003",
    name: "e편한세상 광명 어반파크",
    location: "경기도 광명시",
    developer: "대림산업",
    constructor: "대림산업",
    supplyType: "PUBLIC",
    housingType: "APT",
    totalUnits: 800,
    minPrice: 45000,
    maxPrice: 85000,
    applicationStartDate: "2025-01-15",
    applicationEndDate: "2025-01-20",
    source: "PDF_UPLOAD",
    status: "CLOSED",
    matchScore: 92,
    isEligible: true,
    eligibilityTier: "1순위",
    pdfDocumentId: "pdf-001",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
  },
  {
    id: "sub-004",
    name: "신혼희망타운 마곡지구",
    location: "서울특별시 강서구",
    developer: "LH 한국토지주택공사",
    constructor: "LH 한국토지주택공사",
    supplyType: "NEWLYWED",
    housingType: "APT",
    totalUnits: 500,
    minSize: 46,
    maxSize: 59,
    minPrice: 35000,
    maxPrice: 55000,
    applicationStartDate: "2025-02-10",
    applicationEndDate: "2025-02-17",
    source: "PUBLIC_DB",
    status: "UPCOMING",
    matchScore: 95,
    isEligible: true,
    eligibilityTier: "1순위",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
  },
  {
    id: "sub-005",
    name: "행복주택 위례신도시",
    location: "경기도 성남시 수정구",
    developer: "LH 한국토지주택공사",
    constructor: "LH 한국토지주택공사",
    supplyType: "HAPPY_HOUSE",
    housingType: "APT",
    totalUnits: 300,
    minSize: 26,
    maxSize: 45,
    applicationStartDate: "2025-01-25",
    applicationEndDate: "2025-01-31",
    source: "PUBLIC_DB",
    status: "ACTIVE",
    matchScore: 45,
    isEligible: false,
    createdAt: "2025-01-12T00:00:00Z",
    updatedAt: "2025-01-12T00:00:00Z",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== API 함수 =====

/** 청약 목록 조회 */
async function fetchSubscriptions(
  request: SubscriptionListRequest = {}
): Promise<SubscriptionListResponse> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<SubscriptionListResponse>>("/subscriptions", { params: request });
  // return response.data.data;

  await delay(800);

  let filtered = [...DUMMY_SUBSCRIPTIONS];
  const { filter, sortBy = "matchScore", sortOrder = "desc", page = 0, size = 10 } = request;

  // 필터 적용
  if (filter) {
    if (filter.source && filter.source !== "ALL") {
      filtered = filtered.filter((s) => s.source === filter.source);
    }
    if (filter.status && filter.status !== "ALL") {
      filtered = filtered.filter((s) => s.status === filter.status);
    }
    if (filter.minMatchScore) {
      filtered = filtered.filter((s) => (s.matchScore || 0) >= filter.minMatchScore!);
    }
    if (filter.regions && filter.regions.length > 0) {
      filtered = filtered.filter((s) =>
        filter.regions!.some((r) => s.location.includes(r))
      );
    }
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(keyword) ||
          s.location.toLowerCase().includes(keyword)
      );
    }
  }

  // 정렬
  filtered.sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    switch (sortBy) {
      case "matchScore":
        aVal = a.matchScore || 0;
        bVal = b.matchScore || 0;
        break;
      case "applicationEndDate":
        aVal = a.applicationEndDate;
        bVal = b.applicationEndDate;
        break;
      case "price":
        aVal = a.minPrice || 0;
        bVal = b.minPrice || 0;
        break;
      default:
        aVal = a.createdAt;
        bVal = b.createdAt;
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  // 페이지네이션
  const start = page * size;
  const end = start + size;
  const content = filtered.slice(start, end);

  return {
    content,
    page,
    size,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
    first: page === 0,
    last: end >= filtered.length,
  };
}

/** 추천 청약 목록 조회 */
async function fetchRecommendations(userId: string): Promise<Subscription[]> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<Subscription[]>>(`/subscriptions/recommendations`);
  // return response.data.data;

  await delay(600);

  // 매칭 점수 기준으로 상위 5개 반환
  return DUMMY_SUBSCRIPTIONS
    .filter((s) => s.isEligible)
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 5);
}

/** 청약 상세 조회 */
async function fetchSubscriptionDetail(id: string): Promise<SubscriptionDetailResponse> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<SubscriptionDetailResponse>>(`/subscriptions/${id}`);
  // return response.data.data;

  await delay(500);

  const subscription = DUMMY_SUBSCRIPTIONS.find((s) => s.id === id);
  if (!subscription) {
    throw new Error("청약 정보를 찾을 수 없습니다.");
  }

  return {
    subscription,
    eligibility: {
      subscriptionId: id,
      isEligible: subscription.isEligible || false,
      matchScore: subscription.matchScore || 0,
      tier: subscription.eligibilityTier,
      requirementsMet: [
        { name: "소득요건", description: "도시근로자 평균소득 130% 이하", category: "INCOME", isMet: true, importance: "HIGH" },
        { name: "무주택요건", description: "무주택세대구성원", category: "HOUSING", isMet: true, importance: "HIGH" },
      ],
      requirementsFailed: [
        { name: "청약통장", description: "24개월 이상 납입", category: "SUBSCRIPTION", isMet: false, userValue: "18개월", requiredValue: "24개월", importance: "MEDIUM" },
      ],
      recommendations: ["청약통장 6개월 추가 납입 시 1순위 자격 획득 가능"],
    },
    relatedSubscriptions: DUMMY_SUBSCRIPTIONS.filter((s) => s.id !== id).slice(0, 3),
  };
}

/** 청약 비교 */
async function compareSubscriptions(
  request: CompareSubscriptionsRequest
): Promise<CompareSubscriptionsResponse> {
  await delay(700);

  const subscriptions = DUMMY_SUBSCRIPTIONS.filter((s) =>
    request.subscriptionIds.includes(s.id)
  );

  return {
    subscriptions,
    comparisonMatrix: [
      { label: "분양가 (최저)", category: "가격", values: Object.fromEntries(subscriptions.map((s) => [s.id, s.minPrice || "-"])) },
      { label: "전용면적", category: "면적", values: Object.fromEntries(subscriptions.map((s) => [s.id, `${s.minSize || "-"}~${s.maxSize || "-"}㎡`])) },
      { label: "매칭률", category: "자격", values: Object.fromEntries(subscriptions.map((s) => [s.id, `${s.matchScore || 0}%`])) },
    ],
  };
}

// ===== React Query Hooks =====

/** 청약 목록 조회 */
export function useSubscriptions(request: SubscriptionListRequest = {}) {
  return useQuery({
    queryKey: queryKeys.subscriptions.list(request as Record<string, unknown>),
    queryFn: () => fetchSubscriptions(request),
  });
}

/** 청약 목록 무한 스크롤 */
export function useInfiniteSubscriptions(request: Omit<SubscriptionListRequest, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.subscriptions.list(request), "infinite"],
    queryFn: ({ pageParam = 0 }) => fetchSubscriptions({ ...request, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
  });
}

/** 추천 청약 조회 */
export function useRecommendations(userId: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.recommendations(userId),
    queryFn: () => fetchRecommendations(userId),
    enabled: !!userId,
  });
}

/** 청약 상세 조회 */
export function useSubscriptionDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.detail(id),
    queryFn: () => fetchSubscriptionDetail(id),
    enabled: !!id,
  });
}

/** 청약 비교 */
export function useCompareSubscriptions() {
  return useMutation({
    mutationFn: compareSubscriptions,
  });
}

/** 소스별 필터링 훅 */
export function useFilteredSubscriptions(source: SubscriptionSource | "ALL" = "ALL") {
  return useSubscriptions({
    filter: { source: source === "ALL" ? undefined : source },
    sortBy: "matchScore",
    sortOrder: "desc",
  });
}
