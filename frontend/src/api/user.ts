import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./client";
import { queryKeys } from "@/lib/queryClient";
import type {
  User,
  UserProfile,
  UserProfileRequest,
  UserProfileResponse,
  LoginRequest,
  AuthResponse,
  SignUpRequest,
  PasswordChangeRequest,
  EmailChangeRequest,
} from "@/types/User";
import type { ApiResponse } from "@/types";

// ===== 더미 데이터 =====

const DUMMY_USER: User = {
  id: "user-001",
  email: "zipduck@example.com",
  name: "집덕이",
  profileImageUrl: undefined,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const DUMMY_PROFILE: UserProfile = {
  userId: "user-001",
  age: 32,
  annualIncome: 6000,
  householdMembers: 2,
  housingOwned: 0,
  currentRegion: "서울특별시",
  preferredRegions: ["서울특별시", "경기도"],
  subscriptionPeriod: 24,
  isMarried: true,
  hasChildren: false,
  isFirstTimeHomeBuyer: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== API 함수 =====

/** 현재 사용자 정보 조회 */
async function fetchCurrentUser(): Promise<User> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<User>>("/users/me");
  // return response.data.data;

  await delay(500);
  return DUMMY_USER;
}

/** 내 프로필 조회 */
async function fetchMyProfile(): Promise<UserProfile> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<UserProfile>>("/users/me/profile");
  // return response.data.data;

  await delay(600);
  const stored = localStorage.getItem("zipduck-user-profile");
  if (stored) {
    return JSON.parse(stored);
  }
  return DUMMY_PROFILE;
}

/** 프로필 저장/수정 */
async function saveProfile(data: UserProfileRequest): Promise<UserProfile> {
  // TODO: 실제 API 연동
  // const response = await api.post<ApiResponse<UserProfile>>("/users/me/profile", data);
  // return response.data.data;

  await delay(800);
  const profile: UserProfile = {
    ...DUMMY_PROFILE,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem("zipduck-user-profile", JSON.stringify(profile));
  return profile;
}

/** 로그인 */
async function login(data: LoginRequest): Promise<AuthResponse> {
  // TODO: 실제 API 연동
  // const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
  // return response.data.data;

  await delay(1000);

  // 간단한 검증 (데모용)
  if (!data.email.includes("@")) {
    throw new Error("올바른 이메일 형식이 아닙니다.");
  }
  if (data.password.length < 6) {
    throw new Error("비밀번호는 6자리 이상이어야 합니다.");
  }

  const token = `demo-token-${Date.now()}`;
  localStorage.setItem("zipduck-auth-token", token);

  return {
    accessToken: token,
    refreshToken: `refresh-${token}`,
    expiresIn: 3600,
    user: DUMMY_USER,
  };
}

/** 회원가입 */
async function signUp(data: SignUpRequest): Promise<AuthResponse> {
  // TODO: 실제 API 연동
  // const response = await api.post<ApiResponse<AuthResponse>>("/auth/signup", data);
  // return response.data.data;

  await delay(1200);

  if (!data.agreeToTerms || !data.agreeToPrivacy) {
    throw new Error("필수 약관에 동의해주세요.");
  }

  const token = `demo-token-${Date.now()}`;
  localStorage.setItem("zipduck-auth-token", token);

  return {
    accessToken: token,
    refreshToken: `refresh-${token}`,
    expiresIn: 3600,
    user: { ...DUMMY_USER, email: data.email, name: data.name },
  };
}

/** 로그아웃 */
async function logout(): Promise<void> {
  // TODO: 실제 API 연동
  // await api.post("/auth/logout");

  await delay(300);
  localStorage.removeItem("zipduck-auth-token");
  localStorage.removeItem("zipduck-user-profile");
}

/** 비밀번호 변경 */
async function changePassword(data: PasswordChangeRequest): Promise<void> {
  // TODO: 실제 API 연동
  // await api.post("/users/me/password", data);

  await delay(800);

  if (data.newPassword !== data.confirmPassword) {
    throw new Error("새 비밀번호가 일치하지 않습니다.");
  }
  if (data.newPassword.length < 6) {
    throw new Error("비밀번호는 6자리 이상이어야 합니다.");
  }
}

/** 이메일 변경 */
async function changeEmail(data: EmailChangeRequest): Promise<User> {
  // TODO: 실제 API 연동
  // const response = await api.post<ApiResponse<User>>("/users/me/email", data);
  // return response.data.data;

  await delay(800);

  if (!data.newEmail.includes("@")) {
    throw new Error("올바른 이메일 형식이 아닙니다.");
  }

  return { ...DUMMY_USER, email: data.newEmail };
}

// ===== React Query Hooks =====

/** 현재 사용자 조회 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 10, // 10분
  });
}

/** 내 프로필 조회 */
export function useMyProfile() {
  return useQuery({
    queryKey: [...queryKeys.user.me(), "profile"],
    queryFn: fetchMyProfile,
  });
}

/** 프로필 저장 */
export function useSaveProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProfile,
    onSuccess: (data) => {
      queryClient.setQueryData([...queryKeys.user.me(), "profile"], data);
      // 추천 목록도 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
  });
}

/** 로그인 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.me(), data.user);
    },
  });
}

/** 회원가입 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.me(), data.user);
    },
  });
}

/** 로그아웃 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

/** 비밀번호 변경 */
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

/** 이메일 변경 */
export function useChangeEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeEmail,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.me(), data);
    },
  });
}
