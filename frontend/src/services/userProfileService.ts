import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { queryKeys } from "@/lib/queryClient";
import type { UserProfile, ApiResponse } from "@/types";

// ===== API 함수 =====

// 더미 데이터 (실제 API 연동 전 테스트용)
const DUMMY_PROFILE: UserProfile = {
  userId: "user-001",
  age: 32,
  annualIncome: 6000, // 6천만원
  householdMembers: 2,
  housingOwned: 0,
  region: "서울특별시",
  subscriptionPeriod: 24,
  isMarried: true,
  hasChildren: false,
  isFirstTimeHomeBuyer: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

// API 호출 지연 시뮬레이션
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 내 프로필 조회 */
async function fetchMyProfile(): Promise<UserProfile> {
  // TODO: 실제 API 연동 시 주석 해제
  // const response = await api.get<ApiResponse<UserProfile>>("/users/me/profile");
  // return response.data.data;

  // 더미 응답
  await delay(800);
  const stored = localStorage.getItem("demo-user-profile");
  if (stored) {
    return JSON.parse(stored);
  }
  return DUMMY_PROFILE;
}

/** 프로필 생성/수정 요청 타입 */
export interface UserProfileRequest {
  age: number;
  annualIncome: number;
  householdMembers: number;
  housingOwned: number;
  region?: string;
  subscriptionPeriod?: number;
  isMarried?: boolean;
  hasChildren?: boolean;
  isFirstTimeHomeBuyer?: boolean;
}

/** 프로필 저장 */
async function saveProfile(data: UserProfileRequest): Promise<UserProfile> {
  // TODO: 실제 API 연동 시 주석 해제
  // const response = await api.post<ApiResponse<UserProfile>>("/users/me/profile", data);
  // return response.data.data;

  // 더미 응답
  await delay(1000);
  const profile: UserProfile = {
    ...DUMMY_PROFILE,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem("demo-user-profile", JSON.stringify(profile));
  return profile;
}

/** 프로필 수정 */
async function updateProfile(data: Partial<UserProfileRequest>): Promise<UserProfile> {
  // TODO: 실제 API 연동 시 주석 해제
  // const response = await api.put<ApiResponse<UserProfile>>("/users/me/profile", data);
  // return response.data.data;

  // 더미 응답
  await delay(800);
  const current = await fetchMyProfile();
  const updated: UserProfile = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem("demo-user-profile", JSON.stringify(updated));
  return updated;
}

// ===== React Query Hooks =====

/** 내 프로필 조회 훅 */
export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: fetchMyProfile,
  });
}

/** 프로필 저장 훅 */
export function useSaveProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProfile,
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(queryKeys.user.me(), data);
    },
  });
}

/** 프로필 수정 훅 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(queryKeys.user.me(), data);
    },
    // Optimistic update 예시
    onMutate: async (newData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.user.me() });

      // 이전 값 스냅샷
      const previousProfile = queryClient.getQueryData<UserProfile>(queryKeys.user.me());

      // Optimistic update
      if (previousProfile) {
        queryClient.setQueryData(queryKeys.user.me(), {
          ...previousProfile,
          ...newData,
        });
      }

      return { previousProfile };
    },
    onError: (_err, _newData, context) => {
      // 에러 시 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.user.me(), context.previousProfile);
      }
    },
  });
}

/** 프로필 초기화 (테스트용) */
export function useResetProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await delay(500);
      localStorage.removeItem("demo-user-profile");
      return DUMMY_PROFILE;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.me(), data);
    },
  });
}
