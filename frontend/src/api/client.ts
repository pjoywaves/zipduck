import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// API 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const isDevelopment = import.meta.env.DEV;

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  // 자동 재시도 설정 (선택적)
  validateStatus: (status) => status >= 200 && status < 300,
});

// 로컬 스토리지 토큰 키
const AUTH_TOKEN_KEY = "zipduck-auth-token";

// 에러 메시지 맵
const ERROR_MESSAGES: Record<number, string> = {
  400: "잘못된 요청입니다.",
  401: "인증이 필요합니다.",
  403: "접근 권한이 없습니다.",
  404: "요청한 리소스를 찾을 수 없습니다.",
  409: "이미 존재하는 데이터입니다.",
  422: "입력 데이터를 확인해주세요.",
  429: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
  500: "서버 오류가 발생했습니다.",
  502: "서버에 일시적인 문제가 있습니다.",
  503: "서비스를 일시적으로 사용할 수 없습니다.",
};

// Request Interceptor - 인증 토큰 자동 추가
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 개발 환경에서 요청 로깅
    if (isDevelopment) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    // 토큰 추가
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Request ID 추가 (디버깅용)
    if (config.headers) {
      config.headers["X-Request-ID"] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - 에러 처리
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 개발 환경에서 응답 로깅
    if (isDevelopment) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;

    // 개발 환경에서 에러 로깅
    if (isDevelopment) {
      console.error("[API Error]", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error?.message || ERROR_MESSAGES[status] || "알 수 없는 오류가 발생했습니다.";

      // 에러 메시지를 Error 객체에 추가
      const enhancedError = new Error(errorMessage) as AxiosError<ApiError>;
      enhancedError.response = error.response;
      enhancedError.config = error.config;
      enhancedError.request = error.request;

      switch (status) {
        case 401:
          // 인증 만료 - 토큰 제거
          localStorage.removeItem(AUTH_TOKEN_KEY);
          // Router를 통한 리다이렉트는 앱 레벨에서 처리하도록 함
          // 여기서는 에러만 throw
          break;
        case 403:
          console.error("접근 권한이 없습니다.");
          break;
        case 429:
          // Rate limit - 재시도 로직 추가 가능
          console.warn("API 호출 제한에 도달했습니다.");
          break;
        case 500:
        case 502:
        case 503:
          console.error("서버 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
          break;
      }

      return Promise.reject(enhancedError);
    } else if (error.request) {
      const networkError = new Error("네트워크 연결을 확인해주세요.") as AxiosError;
      networkError.request = error.request;
      console.error("네트워크 오류:", error.message);
      return Promise.reject(networkError);
    } else {
      console.error("요청 설정 오류:", error.message);
      return Promise.reject(error);
    }
  }
);

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// 에러 응답 타입
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  timestamp: string;
}

// 토큰 관리 함수
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default api;
