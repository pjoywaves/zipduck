import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";
import type { UserProfileRequest } from "@/types/User";

// 유효성 검증 스키마
const profileSchema = z.object({
  age: z.number().min(19, "만 19세 이상이어야 합니다").max(100, "올바른 나이를 입력해주세요"),
  annualIncome: z.number().min(0, "소득은 0 이상이어야 합니다"),
  householdMembers: z.number().min(1, "가구원 수는 1명 이상이어야 합니다").max(10),
  housingOwned: z.number().min(0, "주택 소유 수는 0 이상이어야 합니다"),
  subscriptionPeriod: z.number().min(0).optional(),
  isMarried: z.boolean().optional(),
  hasChildren: z.boolean().optional(),
  isFirstTimeHomeBuyer: z.boolean().optional(),
});

interface ProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const REGIONS = [
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

export function ProfileForm({ onSuccess, onCancel }: ProfileFormProps) {
  const { profile, saveProfile, isSaving, saveError, saveSuccess } = useProfile();

  const [formData, setFormData] = useState<UserProfileRequest>({
    age: 30,
    annualIncome: 5000,
    householdMembers: 1,
    housingOwned: 0,
    region: "",
    subscriptionPeriod: 0,
    isMarried: false,
    hasChildren: false,
    isFirstTimeHomeBuyer: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 기존 프로필 데이터 로드
  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age,
        annualIncome: profile.annualIncome,
        householdMembers: profile.householdMembers,
        housingOwned: profile.housingOwned,
        region: profile.currentRegion || "",
        subscriptionPeriod: profile.subscriptionPeriod || 0,
        isMarried: profile.isMarried || false,
        hasChildren: profile.hasChildren || false,
        isFirstTimeHomeBuyer: profile.isFirstTimeHomeBuyer ?? true,
      });
    }
  }, [profile]);

  // 성공 시 콜백
  useEffect(() => {
    if (saveSuccess && onSuccess) {
      onSuccess();
    }
  }, [saveSuccess, onSuccess]);

  const handleChange = (field: keyof UserProfileRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    await saveProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">기본 정보</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">나이 *</label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
            min={19}
            max={100}
            className={errors.age ? "border-destructive" : ""}
          />
          {errors.age && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.age}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">연소득 (만원) *</label>
          <Input
            type="number"
            value={formData.annualIncome}
            onChange={(e) => handleChange("annualIncome", parseInt(e.target.value) || 0)}
            min={0}
            step={100}
            className={errors.annualIncome ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">
            약 {(formData.annualIncome / 10000).toFixed(1)}억원 / 월 {Math.round(formData.annualIncome / 12).toLocaleString()}만원
          </p>
          {errors.annualIncome && (
            <p className="text-xs text-destructive">{errors.annualIncome}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">가구원 수 *</label>
            <Input
              type="number"
              value={formData.householdMembers}
              onChange={(e) => handleChange("householdMembers", parseInt(e.target.value) || 1)}
              min={1}
              max={10}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">주택 소유 수 *</label>
            <Input
              type="number"
              value={formData.housingOwned}
              onChange={(e) => handleChange("housingOwned", parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
        </div>
      </div>

      {/* 지역 및 청약 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">지역 및 청약</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">선호 지역</label>
          <select
            value={formData.region}
            onChange={(e) => handleChange("region", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="">선택하세요</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">청약통장 납입 기간 (개월)</label>
          <Input
            type="number"
            value={formData.subscriptionPeriod}
            onChange={(e) => handleChange("subscriptionPeriod", parseInt(e.target.value) || 0)}
            min={0}
          />
          <p className="text-xs text-muted-foreground">
            {formData.subscriptionPeriod && formData.subscriptionPeriod >= 24
              ? "✅ 1순위 자격 충족"
              : `1순위까지 ${Math.max(0, 24 - (formData.subscriptionPeriod || 0))}개월 남음`}
          </p>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">추가 정보</h3>

        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-foreground">결혼 여부</p>
              <p className="text-xs text-muted-foreground">신혼부부 특별공급 자격</p>
            </div>
            <Switch
              checked={formData.isMarried}
              onCheckedChange={(checked) => handleChange("isMarried", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-foreground">자녀 유무</p>
              <p className="text-xs text-muted-foreground">다자녀가구 특별공급 자격</p>
            </div>
            <Switch
              checked={formData.hasChildren}
              onCheckedChange={(checked) => handleChange("hasChildren", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-foreground">생애최초 주택 구매</p>
              <p className="text-xs text-muted-foreground">생애최초 특별공급 자격</p>
            </div>
            <Switch
              checked={formData.isFirstTimeHomeBuyer}
              onCheckedChange={(checked) => handleChange("isFirstTimeHomeBuyer", checked)}
            />
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {saveError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle size={16} />
            {(saveError as Error).message || "저장 중 오류가 발생했습니다."}
          </p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12">
            취소
          </Button>
        )}
        <Button type="submit" disabled={isSaving} className="flex-1 h-12">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              프로필 저장
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
