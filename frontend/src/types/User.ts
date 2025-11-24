// User Types for ZipDuck

/** 사용자 기본 정보 */
export interface User {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** 사용자 프로필 (청약 자격 판정용) */
export interface UserProfile {
  userId: string;

  // 기본 정보
  age: number;
  birthYear?: number;

  // 소득 정보
  annualIncome: number; // 연소득 (만원)
  monthlyIncome?: number; // 월소득 (만원)

  // 가구 정보
  householdMembers: number; // 가구원 수
  householdType?: HouseholdType;

  // 주택 정보
  housingOwned: number; // 주택 소유 수
  isHomeowner?: boolean;

  // 청약 정보
  subscriptionPeriod?: number; // 청약 납입 기간 (개월)
  subscriptionSavings?: number; // 청약저축 납입금액 (만원)

  // 혼인/가족
  isMarried?: boolean;
  hasChildren?: boolean;
  numberOfChildren?: number;

  // 특수 자격
  isFirstTimeHomeBuyer?: boolean; // 생애최초 여부
  isNewlyMarried?: boolean; // 신혼부부 여부
  isMultiChildFamily?: boolean; // 다자녀가구 여부
  isElderly?: boolean; // 노부모부양 여부

  // 지역 정보
  currentRegion?: string; // 현재 거주 지역
  preferredRegions?: string[]; // 선호 지역 목록
  residencePeriod?: number; // 현 거주지 거주 기간 (개월)

  // 직업 정보
  employmentType?: EmploymentType;
  employmentPeriod?: number; // 근무 기간 (개월)

  // 메타
  createdAt: string;
  updatedAt: string;
}

/** 가구 유형 */
export type HouseholdType =
  | "SINGLE" // 1인가구
  | "COUPLE" // 부부
  | "FAMILY" // 가족
  | "MULTI_GENERATION"; // 다세대

/** 고용 형태 */
export type EmploymentType =
  | "REGULAR" // 정규직
  | "CONTRACT" // 계약직
  | "SELF_EMPLOYED" // 자영업
  | "FREELANCE" // 프리랜서
  | "UNEMPLOYED" // 무직
  | "STUDENT" // 학생
  | "RETIRED"; // 은퇴

/** 프로필 생성/수정 요청 */
export interface UserProfileRequest {
  age: number;
  annualIncome: number;
  householdMembers: number;
  housingOwned: number;
  region?: string;
  preferredRegions?: string[];
  subscriptionPeriod?: number;
  subscriptionSavings?: number;
  isMarried?: boolean;
  hasChildren?: boolean;
  numberOfChildren?: number;
  isFirstTimeHomeBuyer?: boolean;
  isNewlyMarried?: boolean;
  isMultiChildFamily?: boolean;
  employmentType?: EmploymentType;
}

/** 프로필 응답 */
export interface UserProfileResponse {
  profile: UserProfile;
  eligibilitySummary?: EligibilitySummary;
}

/** 자격 요약 */
export interface EligibilitySummary {
  totalRecommendations: number;
  highMatchCount: number; // 매칭률 80% 이상
  mediumMatchCount: number; // 매칭률 50-79%
  lowMatchCount: number; // 매칭률 50% 미만
  lastUpdated: string;
}

/** 인증 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 인증 응답 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

/** 회원가입 요청 */
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing?: boolean;
}

/** 비밀번호 변경 요청 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** 이메일 변경 요청 */
export interface EmailChangeRequest {
  newEmail: string;
  password: string;
}
