// Subscription Types for ZipDuck

/** 청약 소스 타입 */
export type SubscriptionSource = "PUBLIC_DB" | "PDF_UPLOAD" | "MERGED";

/** 청약 상태 */
export type SubscriptionStatus = "ACTIVE" | "CLOSED" | "UPCOMING";

/** 공급 유형 */
export type SupplyType =
  | "PUBLIC" // 공공분양
  | "PRIVATE" // 민간분양
  | "PUBLIC_RENTAL" // 공공임대
  | "PRIVATE_RENTAL" // 민간임대
  | "NEWLYWED" // 신혼희망타운
  | "HAPPY_HOUSE"; // 행복주택

/** 주택 타입 */
export type HousingType =
  | "APT" // 아파트
  | "OFFICETEL" // 오피스텔
  | "URBAN_HOUSING" // 도시형생활주택
  | "TOWNHOUSE"; // 연립/다세대

/** 청약 정보 */
export interface Subscription {
  id: string;

  // 기본 정보
  name: string; // 단지명
  location: string; // 위치 (시/도 + 구/군)
  address?: string; // 상세 주소

  // 시행/시공
  developer: string; // 시행사
  constructor?: string; // 시공사

  // 분양 정보
  supplyType: SupplyType;
  housingType?: HousingType;
  totalUnits: number; // 총 세대수
  supplyUnits?: number; // 공급 세대수

  // 평형 정보
  sizes?: SubscriptionSize[];
  minSize?: number; // 최소 전용면적 (㎡)
  maxSize?: number; // 최대 전용면적 (㎡)

  // 가격 정보
  minPrice?: number; // 최저 분양가 (만원)
  maxPrice?: number; // 최고 분양가 (만원)
  avgPricePerPyeong?: number; // 평균 평당가 (만원)

  // 일정
  applicationStartDate: string;
  applicationEndDate: string;
  announcementDate?: string; // 당첨자 발표일
  contractStartDate?: string; // 계약 시작일
  contractEndDate?: string; // 계약 종료일
  moveInDate?: string; // 입주 예정일

  // 메타
  source: SubscriptionSource;
  status: SubscriptionStatus;

  // 자격/매칭
  matchScore?: number; // 매칭 점수 (0-100)
  isEligible?: boolean;
  eligibilityTier?: string; // 1순위, 2순위 등

  // 상세 정보
  description?: string;
  websiteUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;

  // PDF 관련
  pdfDocumentId?: string;

  createdAt: string;
  updatedAt: string;
}

/** 평형별 정보 */
export interface SubscriptionSize {
  id: string;
  sizeType: string; // 타입명 (예: 59A, 84B)
  exclusiveArea: number; // 전용면적 (㎡)
  supplyArea?: number; // 공급면적 (㎡)
  supplyUnits: number; // 공급 세대수
  price?: number; // 분양가 (만원)
  floorPlanUrl?: string; // 평면도 URL
}

/** 청약 필터 옵션 */
export interface SubscriptionFilter {
  source?: SubscriptionSource | "ALL";
  status?: SubscriptionStatus | "ALL";
  supplyType?: SupplyType | "ALL";
  housingType?: HousingType | "ALL";
  regions?: string[];
  minMatchScore?: number;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  keyword?: string;
}

/** 청약 정렬 옵션 */
export type SubscriptionSortBy =
  | "matchScore" // 매칭률순
  | "applicationEndDate" // 마감임박순
  | "applicationStartDate" // 시작일순
  | "price" // 가격순
  | "createdAt"; // 등록일순

export type SortOrder = "asc" | "desc";

/** 청약 목록 요청 */
export interface SubscriptionListRequest {
  filter?: SubscriptionFilter;
  sortBy?: SubscriptionSortBy;
  sortOrder?: SortOrder;
  page?: number;
  size?: number;
}

/** 청약 목록 응답 */
export interface SubscriptionListResponse {
  content: Subscription[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** 청약 상세 응답 */
export interface SubscriptionDetailResponse {
  subscription: Subscription;
  eligibility?: SubscriptionEligibility;
  relatedSubscriptions?: Subscription[];
}

/** 청약별 자격 정보 */
export interface SubscriptionEligibility {
  subscriptionId: string;
  isEligible: boolean;
  matchScore: number;
  tier?: string;
  requirementsMet: EligibilityRequirement[];
  requirementsFailed: EligibilityRequirement[];
  recommendations: string[];
}

/** 자격 요건 항목 */
export interface EligibilityRequirement {
  name: string;
  description: string;
  category: RequirementCategory;
  isMet: boolean;
  userValue?: string | number;
  requiredValue?: string | number;
  importance: "HIGH" | "MEDIUM" | "LOW";
}

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

/** 청약 비교 요청 */
export interface CompareSubscriptionsRequest {
  subscriptionIds: string[]; // 최대 5개
}

/** 청약 비교 응답 */
export interface CompareSubscriptionsResponse {
  subscriptions: Subscription[];
  comparisonMatrix: ComparisonItem[];
}

/** 비교 항목 */
export interface ComparisonItem {
  label: string;
  category: string;
  values: Record<string, string | number | boolean | null>;
}
