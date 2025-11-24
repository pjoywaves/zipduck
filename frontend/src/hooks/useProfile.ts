import { useMemo, useCallback } from "react";
import { useMyProfile, useSaveProfile, useCurrentUser } from "@/services/userService";
import type { UserProfileRequest } from "@/types/User";

/**
 * 사용자 프로필 관리 커스텀 훅
 *
 * 프로필 조회, 저장, 유효성 검증을 통합 관리
 */
export function useProfile() {
  const userQuery = useCurrentUser();
  const profileQuery = useMyProfile();
  const saveMutation = useSaveProfile();

  // 프로필 완성도 계산
  const completionRate = useMemo(() => {
    if (!profileQuery.data) return 0;

    const profile = profileQuery.data;
    const fields = [
      profile.age,
      profile.annualIncome,
      profile.householdMembers,
      profile.housingOwned !== undefined,
      profile.currentRegion,
      profile.subscriptionPeriod,
      profile.isMarried !== undefined,
      profile.hasChildren !== undefined,
      profile.isFirstTimeHomeBuyer !== undefined,
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [profileQuery.data]);

  // 프로필 저장
  const saveProfile = useCallback(
    async (data: UserProfileRequest) => {
      return saveMutation.mutateAsync(data);
    },
    [saveMutation]
  );

  // 필수 항목 누락 여부
  const missingRequiredFields = useMemo(() => {
    if (!profileQuery.data) return ["전체"];

    const profile = profileQuery.data;
    const missing: string[] = [];

    if (!profile.age) missing.push("나이");
    if (!profile.annualIncome) missing.push("연소득");
    if (profile.householdMembers === undefined) missing.push("가구원 수");
    if (profile.housingOwned === undefined) missing.push("주택 소유 수");

    return missing;
  }, [profileQuery.data]);

  // 청약 자격 요약
  const eligibilitySummary = useMemo(() => {
    if (!profileQuery.data) {
      return {
        isFirstTimeBuyer: false,
        isNewlyMarried: false,
        isMultiChild: false,
        hasSubscription: false,
      };
    }

    const profile = profileQuery.data;
    return {
      isFirstTimeBuyer: profile.isFirstTimeHomeBuyer ?? false,
      isNewlyMarried: profile.isNewlyMarried ?? false,
      isMultiChild: profile.isMultiChildFamily ?? false,
      hasSubscription: (profile.subscriptionPeriod ?? 0) > 0,
    };
  }, [profileQuery.data]);

  return {
    // 사용자 정보
    user: userQuery.data,
    isUserLoading: userQuery.isLoading,

    // 프로필 정보
    profile: profileQuery.data,
    isProfileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,

    // 프로필 저장
    saveProfile,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
    saveSuccess: saveMutation.isSuccess,

    // 유틸리티
    completionRate,
    missingRequiredFields,
    eligibilitySummary,
    isProfileComplete: missingRequiredFields.length === 0,

    // 리프레시
    refetch: profileQuery.refetch,
  };
}

/**
 * 프로필 폼 상태 관리 훅
 */
export function useProfileForm(initialData?: Partial<UserProfileRequest>) {
  const { profile, saveProfile, isSaving } = useProfile();

  const defaultValues: UserProfileRequest = useMemo(
    () => ({
      age: initialData?.age ?? profile?.age ?? 30,
      annualIncome: initialData?.annualIncome ?? profile?.annualIncome ?? 5000,
      householdMembers: initialData?.householdMembers ?? profile?.householdMembers ?? 1,
      housingOwned: initialData?.housingOwned ?? profile?.housingOwned ?? 0,
      region: initialData?.region ?? profile?.currentRegion ?? "",
      subscriptionPeriod: initialData?.subscriptionPeriod ?? profile?.subscriptionPeriod ?? 0,
      isMarried: initialData?.isMarried ?? profile?.isMarried ?? false,
      hasChildren: initialData?.hasChildren ?? profile?.hasChildren ?? false,
      isFirstTimeHomeBuyer:
        initialData?.isFirstTimeHomeBuyer ?? profile?.isFirstTimeHomeBuyer ?? false,
    }),
    [profile, initialData]
  );

  return {
    defaultValues,
    onSubmit: saveProfile,
    isSubmitting: isSaving,
  };
}
