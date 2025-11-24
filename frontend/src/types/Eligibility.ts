// Eligibility Types for ZipDuck

/** 요건 카테고리 */
export type RequirementCategory =
  | "INCOME" // 소득
  | "ASSET" // 자산
  | "HOUSING" // 주택소유
  | "REGION" // 지역
  | "AGE" // 나이
  | "HOUSEHOLD" // 가구
  | "SUBSCRIPTION" // 청약통장
  | "SPECIAL"; // 특별공급 자격

/** 중요도 */
export type ImportanceLevel = "HIGH" | "MEDIUM" | "LOW";

/** 자격 요건 항목 */
export interface EligibilityRequirement {
  id: string;
  name: string;
  description: string;
  category: RequirementCategory;
  isMet: boolean;
  importance: ImportanceLevel;
  userValue?: string | number;
  requiredValue?: string | number;
  comparison?: "EQUALS" | "GREATER_THAN" | "LESS_THAN" | "BETWEEN" | "IN_LIST";
  note?: string;
}

/** 자격 판정 결과 */
export interface EligibilityResult {
  subscriptionId: string;
  userId: string;
  isEligible: boolean;
  matchScore: number; // 0-100
  tier?: EligibilityTier;
  tierDescription?: string;
  requirementsMet: EligibilityRequirement[];
  requirementsFailed: EligibilityRequirement[];
  requirementsPartial?: EligibilityRequirement[];
  recommendations: Recommendation[];
  analyzedAt: string;
}

/** 자격 순위 */
export type EligibilityTier =
  | "PRIORITY_1" // 1순위
  | "PRIORITY_2" // 2순위
  | "GENERAL" // 일반
  | "SPECIAL_NEWLYWED" // 신혼부부 특별공급
  | "SPECIAL_FIRST_TIME" // 생애최초 특별공급
  | "SPECIAL_MULTI_CHILD" // 다자녀 특별공급
  | "SPECIAL_ELDERLY" // 노부모부양 특별공급
  | "INELIGIBLE"; // 자격 미달

/** 추천 사항 */
export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  actionItems?: string[];
  priority: ImportanceLevel;
  estimatedImpact?: string;
  relatedRequirements?: string[]; // requirement IDs
}

/** 추천 유형 */
export type RecommendationType =
  | "ACTION_REQUIRED" // 필수 조치
  | "IMPROVEMENT" // 개선 가능
  | "INFORMATION" // 정보 제공
  | "WARNING"; // 경고

/** 자격 검사 요청 */
export interface EligibilityCheckRequest {
  subscriptionId: string;
  userId?: string;
  userProfile?: EligibilityUserProfile;
}

/** 자격 검사용 사용자 프로필 */
export interface EligibilityUserProfile {
  age: number;
  annualIncome: number;
  householdMembers: number;
  housingOwned: number;
  region?: string;
  subscriptionPeriod?: number;
  isMarried?: boolean;
  hasChildren?: boolean;
  numberOfChildren?: number;
  isFirstTimeHomeBuyer?: boolean;
}

/** 자격 비교 결과 */
export interface EligibilityComparison {
  subscriptionId: string;
  subscriptionName: string;
  isEligible: boolean;
  matchScore: number;
  tier?: EligibilityTier;
  keyRequirements: EligibilityRequirement[];
}

/** 자격 요약 */
export interface EligibilitySummary {
  totalChecked: number;
  eligibleCount: number;
  ineligibleCount: number;
  averageMatchScore: number;
  byTier: Record<EligibilityTier, number>;
  topMatches: EligibilityComparison[];
}

/** 카테고리별 요건 그룹 */
export interface RequirementGroup {
  category: RequirementCategory;
  categoryLabel: string;
  requirements: EligibilityRequirement[];
  metCount: number;
  totalCount: number;
  score: number; // 0-100
}

/** 매칭 점수 범위 */
export interface MatchScoreRange {
  min: number;
  max: number;
  label: string;
  color: string;
  description: string;
}

/** 매칭 점수 범위 상수 */
export const MATCH_SCORE_RANGES: MatchScoreRange[] = [
  { min: 90, max: 100, label: "최상", color: "green", description: "자격 요건을 거의 모두 충족" },
  { min: 70, max: 89, label: "상", color: "blue", description: "대부분의 요건 충족" },
  { min: 50, max: 69, label: "중", color: "yellow", description: "일부 요건 충족" },
  { min: 30, max: 49, label: "하", color: "orange", description: "보완 필요" },
  { min: 0, max: 29, label: "미달", color: "red", description: "자격 요건 미충족" },
];

/** 카테고리 라벨 */
export const CATEGORY_LABELS: Record<RequirementCategory, string> = {
  INCOME: "소득 요건",
  ASSET: "자산 요건",
  HOUSING: "주택 소유",
  REGION: "지역 요건",
  AGE: "연령 요건",
  HOUSEHOLD: "가구 구성",
  SUBSCRIPTION: "청약통장",
  SPECIAL: "특별공급",
};

/** 순위 라벨 */
export const TIER_LABELS: Record<EligibilityTier, string> = {
  PRIORITY_1: "1순위",
  PRIORITY_2: "2순위",
  GENERAL: "일반공급",
  SPECIAL_NEWLYWED: "신혼부부 특별공급",
  SPECIAL_FIRST_TIME: "생애최초 특별공급",
  SPECIAL_MULTI_CHILD: "다자녀 특별공급",
  SPECIAL_ELDERLY: "노부모부양 특별공급",
  INELIGIBLE: "자격 미달",
};
