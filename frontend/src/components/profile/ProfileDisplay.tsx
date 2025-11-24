import { User, MapPin, Home, Wallet, Users, Calendar, Heart, Baby, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface ProfileDisplayProps {
  onEdit?: () => void;
  compact?: boolean;
}

export function ProfileDisplay({ onEdit, compact = false }: ProfileDisplayProps) {
  const { profile, isProfileLoading, completionRate, eligibilitySummary } = useProfile();

  if (isProfileLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-32 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-muted/50 rounded-2xl p-6 text-center">
        <User className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">프로필을 설정해주세요</p>
        {onEdit && (
          <button
            onClick={onEdit}
            className="mt-3 text-primary font-medium hover:underline"
          >
            프로필 설정하기
          </button>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{profile.age}세</p>
              <p className="text-xs text-muted-foreground">
                {profile.currentRegion || "지역 미설정"} · 가구원 {profile.householdMembers}명
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">완성도</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 프로필 완성도 */}
      <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/5 dark:to-slate-800 border border-primary/20 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-foreground">프로필 완성도</span>
          <span className="text-2xl font-bold text-primary">{completionRate}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        {completionRate < 100 && (
          <p className="mt-2 text-xs text-muted-foreground">
            더 정확한 추천을 위해 프로필을 완성해주세요
          </p>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">기본 정보</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <User size={18} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">나이</p>
              <p className="font-medium text-foreground">{profile.age}세</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Wallet size={18} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">연소득</p>
              <p className="font-medium text-foreground">
                {(profile.annualIncome / 10000).toFixed(1)}억원
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Users size={18} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">가구원</p>
              <p className="font-medium text-foreground">{profile.householdMembers}명</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Home size={18} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">주택 소유</p>
              <p className="font-medium text-foreground">{profile.housingOwned}채</p>
            </div>
          </div>
        </div>

        {profile.currentRegion && (
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <MapPin size={18} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">선호 지역</p>
              <p className="font-medium text-foreground">{profile.currentRegion}</p>
            </div>
          </div>
        )}
      </div>

      {/* 청약 자격 */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground">청약 자격 현황</h3>

        <div className="space-y-3">
          {profile.subscriptionPeriod !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-muted-foreground" />
                <span className="text-sm text-foreground">청약통장 납입</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {profile.subscriptionPeriod}개월
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {eligibilitySummary.isFirstTimeBuyer && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                <Sparkles size={12} />
                생애최초
              </span>
            )}
            {eligibilitySummary.isNewlyMarried && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
                <Heart size={12} />
                신혼부부
              </span>
            )}
            {eligibilitySummary.isMultiChild && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                <Baby size={12} />
                다자녀
              </span>
            )}
            {profile.housingOwned === 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                <Home size={12} />
                무주택
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 수정 버튼 */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="w-full py-3 text-center text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors"
        >
          프로필 수정하기
        </button>
      )}
    </div>
  );
}
