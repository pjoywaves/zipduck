import { useState, useEffect } from "react";
import { ChevronLeft, Save, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  useMyProfile,
  useSaveProfile,
} from "@/api/user";
import type { UserProfileRequest } from "@/types/User";

// Mock reset profile hook since it doesn't exist in the new API
function useResetProfile() {
  const saveProfile = useSaveProfile();
  return {
    mutate: () => {
      localStorage.removeItem("zipduck-user-profile");
      window.location.reload();
    },
    isPending: false,
  };
}

interface ProfileFormDemoProps {
  onBack: () => void;
}

export function ProfileFormDemo({ onBack }: ProfileFormDemoProps) {
  // TanStack Query hooks
  const { data: profile, isLoading, isError, error } = useMyProfile();
  const saveProfile = useSaveProfile();
  const resetProfile = useResetProfile();

  // 폼 상태
  const [formData, setFormData] = useState<UserProfileRequest>({
    age: 30,
    annualIncome: 5000,
    householdMembers: 1,
    housingOwned: 0,
    region: "",
    subscriptionPeriod: 12,
    isMarried: false,
    hasChildren: false,
    isFirstTimeHomeBuyer: true,
  });

  // 프로필 데이터 로드 시 폼 업데이트
  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age,
        annualIncome: profile.annualIncome,
        householdMembers: profile.householdMembers,
        housingOwned: profile.housingOwned,
        region: profile.region || "",
        subscriptionPeriod: profile.subscriptionPeriod || 0,
        isMarried: profile.isMarried || false,
        hasChildren: profile.hasChildren || false,
        isFirstTimeHomeBuyer: profile.isFirstTimeHomeBuyer || false,
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile.mutate(formData);
  };

  const handleReset = () => {
    resetProfile.mutate();
  };

  const handleChange = (field: keyof UserProfileRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 지역 옵션
  const regions = [
    "서울특별시",
    "경기도",
    "인천광역시",
    "부산광역시",
    "대구광역시",
    "대전광역시",
    "광주광역시",
    "울산광역시",
    "세종특별자치시",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주특별자치도",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">프로필 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">프로필을 불러올 수 없습니다.</p>
          <p className="text-sm text-muted-foreground">{(error as Error)?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-foreground" />
            </button>
            <h2 className="font-bold ml-4 text-foreground">프로필 설정 (Demo)</h2>
          </div>
          <button
            onClick={handleReset}
            disabled={resetProfile.isPending}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw size={20} className={resetProfile.isPending ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* 안내 배너 */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">TanStack Query 데모</span>
            <br />
            <span className="text-muted-foreground">
              이 폼은 더미 API와 연동되어 있습니다. 데이터는 localStorage에 저장됩니다.
            </span>
          </p>
        </div>

        {/* 기본 정보 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">기본 정보</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">나이</label>
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
              min={19}
              max={100}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">연소득 (만원)</label>
            <Input
              type="number"
              value={formData.annualIncome}
              onChange={(e) => handleChange("annualIncome", parseInt(e.target.value) || 0)}
              min={0}
              step={100}
            />
            <p className="text-xs text-muted-foreground">
              {(formData.annualIncome / 10000).toFixed(1)}억원
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">가구원 수</label>
            <Input
              type="number"
              value={formData.householdMembers}
              onChange={(e) => handleChange("householdMembers", parseInt(e.target.value) || 1)}
              min={1}
              max={10}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">주택 소유 수</label>
            <Input
              type="number"
              value={formData.housingOwned}
              onChange={(e) => handleChange("housingOwned", parseInt(e.target.value) || 0)}
              min={0}
              max={10}
            />
          </div>
        </div>

        {/* 지역 설정 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">지역 설정</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">선호 지역</label>
            <select
              value={formData.region}
              onChange={(e) => handleChange("region", e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="">선택하세요</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">청약 납입 기간 (개월)</label>
            <Input
              type="number"
              value={formData.subscriptionPeriod}
              onChange={(e) => handleChange("subscriptionPeriod", parseInt(e.target.value) || 0)}
              min={0}
              max={600}
            />
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">추가 정보</h3>

          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-foreground">결혼 여부</p>
                <p className="text-xs text-muted-foreground">기혼인 경우 ON</p>
              </div>
              <Switch
                checked={formData.isMarried}
                onCheckedChange={(checked) => handleChange("isMarried", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-foreground">자녀 유무</p>
                <p className="text-xs text-muted-foreground">자녀가 있는 경우 ON</p>
              </div>
              <Switch
                checked={formData.hasChildren}
                onCheckedChange={(checked) => handleChange("hasChildren", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-foreground">생애최초 주택 구매자</p>
                <p className="text-xs text-muted-foreground">주택을 처음 구매하는 경우 ON</p>
              </div>
              <Switch
                checked={formData.isFirstTimeHomeBuyer}
                onCheckedChange={(checked) => handleChange("isFirstTimeHomeBuyer", checked)}
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <Button
          type="submit"
          disabled={saveProfile.isPending}
          className="w-full h-14 rounded-2xl font-semibold"
        >
          {saveProfile.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              프로필 저장
            </>
          )}
        </Button>

        {/* 성공 메시지 */}
        {saveProfile.isSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-green-700 dark:text-green-300">
              프로필이 성공적으로 저장되었습니다!
            </p>
          </div>
        )}

        {/* 에러 메시지 */}
        {saveProfile.isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              저장 중 오류가 발생했습니다: {(saveProfile.error as Error)?.message}
            </p>
          </div>
        )}

        {/* 현재 상태 디버그 */}
        <details className="bg-muted/50 rounded-xl p-4">
          <summary className="text-sm font-medium text-muted-foreground cursor-pointer">
            현재 저장된 데이터 (디버그)
          </summary>
          <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </details>
      </form>
    </div>
  );
}
