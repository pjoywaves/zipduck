import { useQuery, useMutation } from "@tanstack/react-query";
import api from "./client";
import { queryKeys } from "@/lib/queryClient";
import type {
  EligibilityResult,
  EligibilityCheckRequest,
  EligibilitySummary,
  RequirementGroup,
  RequirementCategory,
  CATEGORY_LABELS,
} from "@/types/Eligibility";

// ===== 더미 데이터 =====

const DUMMY_ELIGIBILITY_RESULT: EligibilityResult = {
  subscriptionId: "sub-001",
  userId: "user-001",
  isEligible: true,
  matchScore: 85,
  tier: "PRIORITY_1",
  tierDescription: "1순위 자격 충족",
  requirementsMet: [
    {
      id: "req-001",
      name: "소득요건",
      description: "세대 연소득이 도시근로자 평균소득 130% 이하",
      category: "INCOME",
      isMet: true,
      importance: "HIGH",
      userValue: "6,000만원",
      requiredValue: "7,800만원 이하",
    },
    {
      id: "req-002",
      name: "무주택요건",
      description: "세대 구성원 전원 무주택",
      category: "HOUSING",
      isMet: true,
      importance: "HIGH",
      userValue: "0채",
      requiredValue: "무주택",
    },
    {
      id: "req-003",
      name: "거주지역",
      description: "해당 지역 거주자",
      category: "REGION",
      isMet: true,
      importance: "MEDIUM",
      userValue: "서울특별시",
      requiredValue: "서울특별시",
    },
    {
      id: "req-004",
      name: "연령요건",
      description: "만 19세 이상",
      category: "AGE",
      isMet: true,
      importance: "HIGH",
      userValue: "32세",
      requiredValue: "19세 이상",
    },
  ],
  requirementsFailed: [
    {
      id: "req-005",
      name: "청약통장 납입기간",
      description: "청약저축 24개월 이상 납입",
      category: "SUBSCRIPTION",
      isMet: false,
      importance: "MEDIUM",
      userValue: "18개월",
      requiredValue: "24개월 이상",
      note: "6개월 추가 납입 필요",
    },
  ],
  recommendations: [
    {
      id: "rec-001",
      type: "ACTION_REQUIRED",
      title: "청약통장 납입 기간 충족",
      description: "현재 18개월 납입 중이며, 6개월 추가 납입 시 자격 충족됩니다.",
      actionItems: ["매월 정기 납입 유지", "자동이체 설정 확인"],
      priority: "HIGH",
      estimatedImpact: "1순위 자격 확정",
      relatedRequirements: ["req-005"],
    },
    {
      id: "rec-002",
      type: "INFORMATION",
      title: "생애최초 특별공급 검토",
      description: "생애최초 주택 구매자로 특별공급 자격이 있을 수 있습니다.",
      priority: "MEDIUM",
    },
  ],
  analyzedAt: new Date().toISOString(),
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== API 함수 =====

/** 자격 검사 */
async function checkEligibility(request: EligibilityCheckRequest): Promise<EligibilityResult> {
  // TODO: 실제 API 연동
  // const response = await api.post<ApiResponse<EligibilityResult>>("/eligibility/check", request);
  // return response.data.data;

  await delay(800);
  return { ...DUMMY_ELIGIBILITY_RESULT, subscriptionId: request.subscriptionId };
}

/** 청약별 자격 조회 */
async function fetchEligibility(subscriptionId: string, userId: string): Promise<EligibilityResult> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<EligibilityResult>>(`/eligibility/${subscriptionId}`);
  // return response.data.data;

  await delay(600);
  return { ...DUMMY_ELIGIBILITY_RESULT, subscriptionId, userId };
}

/** 자격 요약 조회 */
async function fetchEligibilitySummary(userId: string): Promise<EligibilitySummary> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<EligibilitySummary>>(`/eligibility/summary`);
  // return response.data.data;

  await delay(500);
  return {
    totalChecked: 15,
    eligibleCount: 8,
    ineligibleCount: 7,
    averageMatchScore: 72,
    byTier: {
      PRIORITY_1: 3,
      PRIORITY_2: 5,
      GENERAL: 0,
      SPECIAL_NEWLYWED: 2,
      SPECIAL_FIRST_TIME: 1,
      SPECIAL_MULTI_CHILD: 0,
      SPECIAL_ELDERLY: 0,
      INELIGIBLE: 4,
    },
    topMatches: [
      {
        subscriptionId: "sub-001",
        subscriptionName: "래미안 원베일리",
        isEligible: true,
        matchScore: 92,
        tier: "PRIORITY_1",
        keyRequirements: [],
      },
      {
        subscriptionId: "sub-004",
        subscriptionName: "신혼희망타운 마곡지구",
        isEligible: true,
        matchScore: 95,
        tier: "SPECIAL_NEWLYWED",
        keyRequirements: [],
      },
    ],
  };
}

// ===== React Query Hooks =====

/** 자격 검사 실행 */
export function useCheckEligibility() {
  return useMutation({
    mutationFn: checkEligibility,
  });
}

/** 청약별 자격 조회 */
export function useEligibility(subscriptionId: string, userId: string) {
  return useQuery({
    queryKey: queryKeys.eligibility.check(subscriptionId, userId),
    queryFn: () => fetchEligibility(subscriptionId, userId),
    enabled: !!subscriptionId && !!userId,
  });
}

/** 자격 요약 조회 */
export function useEligibilitySummary(userId: string) {
  return useQuery({
    queryKey: [...queryKeys.eligibility.all, "summary", userId],
    queryFn: () => fetchEligibilitySummary(userId),
    enabled: !!userId,
  });
}

// ===== 유틸리티 함수 =====

/** 요건을 카테고리별로 그룹화 */
export function groupRequirementsByCategory(
  result: EligibilityResult
): RequirementGroup[] {
  const allRequirements = [...result.requirementsMet, ...result.requirementsFailed];
  const categoryLabels: Record<RequirementCategory, string> = {
    INCOME: "소득 요건",
    ASSET: "자산 요건",
    HOUSING: "주택 소유",
    REGION: "지역 요건",
    AGE: "연령 요건",
    HOUSEHOLD: "가구 구성",
    SUBSCRIPTION: "청약통장",
    SPECIAL: "특별공급",
  };

  const groups: Map<RequirementCategory, RequirementGroup> = new Map();

  allRequirements.forEach((req) => {
    if (!groups.has(req.category)) {
      groups.set(req.category, {
        category: req.category,
        categoryLabel: categoryLabels[req.category],
        requirements: [],
        metCount: 0,
        totalCount: 0,
        score: 0,
      });
    }

    const group = groups.get(req.category)!;
    group.requirements.push(req);
    group.totalCount++;
    if (req.isMet) group.metCount++;
  });

  // 점수 계산
  groups.forEach((group) => {
    group.score = group.totalCount > 0 ? Math.round((group.metCount / group.totalCount) * 100) : 0;
  });

  return Array.from(groups.values()).sort((a, b) => {
    // 중요도 순서: INCOME, HOUSING, SUBSCRIPTION, REGION, AGE, HOUSEHOLD, ASSET, SPECIAL
    const order: RequirementCategory[] = [
      "INCOME",
      "HOUSING",
      "SUBSCRIPTION",
      "REGION",
      "AGE",
      "HOUSEHOLD",
      "ASSET",
      "SPECIAL",
    ];
    return order.indexOf(a.category) - order.indexOf(b.category);
  });
}

/** 매칭 점수에 따른 색상 반환 */
export function getMatchScoreColor(score: number): string {
  if (score >= 90) return "green";
  if (score >= 70) return "blue";
  if (score >= 50) return "yellow";
  if (score >= 30) return "orange";
  return "red";
}

/** 매칭 점수에 따른 라벨 반환 */
export function getMatchScoreLabel(score: number): string {
  if (score >= 90) return "최상";
  if (score >= 70) return "상";
  if (score >= 50) return "중";
  if (score >= 30) return "하";
  return "미달";
}
