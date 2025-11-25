// Base Types for ZipDuck Frontend
// This file contains only common/shared types used across the application
// Domain-specific types are in their respective files (User.ts, Subscription.ts, etc.)

// ===== 공통 API 타입 =====

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

// ===== Domain Types Re-exports =====
// Re-export domain types for convenience
export * from "./User";
export * from "./Subscription";
export * from "./Pdf";
export * from "./Eligibility";
