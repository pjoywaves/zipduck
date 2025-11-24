// Base Types for ZipDuck Frontend

// ===== 공통 타입 =====

/** API 응답 기본 타입 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/** 페이지네이션 요청 파라미터 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** API 에러 응답 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  timestamp: string;
}

// ===== 사용자 관련 타입 =====

/** 사용자 기본 정보 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/** 사용자 프로필 */
export interface UserProfile {
  userId: string;
  age: number;
  annualIncome: number; // 연소득 (만원)
  householdMembers: number; // 가구원 수
  housingOwned: number; // 주택 소유 수
  region?: string; // 선호 지역
  subscriptionPeriod?: number; // 청약 납입 기간 (개월)
  isMarried?: boolean;
  hasChildren?: boolean;
  isFirstTimeHomeBuyer?: boolean; // 생애최초 여부
  createdAt: string;
  updatedAt: string;
}

// ===== 청약 관련 타입 =====

/** 청약 소스 타입 */
export type SubscriptionSource = "PUBLIC_DB" | "PDF_UPLOAD" | "MERGED";

/** 청약 상태 */
export type SubscriptionStatus = "ACTIVE" | "CLOSED" | "UPCOMING";

/** 청약 정보 */
export interface Subscription {
  id: string;
  name: string; // 단지명
  location: string; // 위치
  developer: string; // 시행사
  supplyType: string; // 공급유형
  totalUnits: number; // 총 세대수
  applicationStartDate: string;
  applicationEndDate: string;
  announcementDate?: string;
  source: SubscriptionSource;
  status: SubscriptionStatus;
  matchScore?: number; // 매칭 점수 (0-100)
  isEligible?: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 청약 필터 옵션 */
export interface SubscriptionFilter {
  source?: SubscriptionSource | "ALL";
  status?: SubscriptionStatus;
  region?: string;
  minMatchScore?: number;
}

// ===== PDF 분석 관련 타입 =====

/** PDF 처리 상태 */
export type PdfProcessingStatus =
  | "PENDING"
  | "PROCESSING"
  | "OCR_IN_PROGRESS"
  | "ANALYZING"
  | "COMPLETED"
  | "FAILED";

/** PDF 문서 정보 */
export interface PdfDocument {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  status: PdfProcessingStatus;
  hasOcr: boolean;
  uploadedAt: string;
  processedAt?: string;
}

/** PDF 분석 결과 */
export interface PdfAnalysisResult {
  pdfId: string;
  extractedText?: string;
  subscriptionInfo?: Partial<Subscription>;
  eligibilityResult?: EligibilityResult;
  ocrQuality?: "HIGH" | "MEDIUM" | "LOW";
  processingTimeMs: number;
  createdAt: string;
}

// ===== 자격 판정 관련 타입 =====

/** 자격 요건 항목 */
export interface EligibilityRequirement {
  name: string;
  description: string;
  isMet: boolean;
  userValue?: string | number;
  requiredValue?: string | number;
}

/** 자격 판정 결과 */
export interface EligibilityResult {
  subscriptionId: string;
  userId: string;
  isEligible: boolean;
  matchScore: number; // 0-100
  tier?: string; // 1순위, 2순위 등
  requirementsMet: EligibilityRequirement[];
  requirementsFailed: EligibilityRequirement[];
  recommendations: string[];
  analyzedAt: string;
}

// ===== 즐겨찾기 관련 타입 =====

/** 즐겨찾기 */
export interface Favorite {
  id: string;
  userId: string;
  subscriptionId: string;
  subscription?: Subscription;
  memo?: string;
  createdAt: string;
}

// ===== 라우팅 관련 타입 =====

/** 화면 타입 */
export type ScreenType =
  | "splash"
  | "onboarding"
  | "signup"
  | "login"
  | "find-account"
  | "home"
  | "search"
  | "favorites"
  | "mypage"
  | "detail"
  | "ai-recommendation"
  | "ai-chat"
  | "settings"
  | "appearance"
  | "notifications"
  | "filter"
  | "region-map"
  | "analytics"
  | "announcement"
  | "distance-map"
  | "ai-consult"
  | "calendar"
  | "ai-best"
  | "region-preference"
  | "notification-settings"
  | "settings-detail"
  | "help"
  | "privacy-policy"
  | "terms-of-service"
  | "profile-edit"
  | "email-change"
  | "password-change";

/** 탭 타입 */
export type TabType = "home" | "search" | "favorites" | "mypage";

// ===== 유틸리티 타입 =====

/** 로딩 상태 */
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

/** 폼 상태 */
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}
