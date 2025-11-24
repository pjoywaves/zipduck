import { Bell, ChevronRight, Sparkles, FileText, TrendingUp, Calendar } from "lucide-react";
import { ProfileDisplay } from "@/components/profile/ProfileDisplay";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { SubscriptionListSkeleton } from "@/components/subscriptions/SubscriptionList";
import { useRecommendedSubscriptions } from "@/hooks/useSubscriptions";
import { useProfile } from "@/hooks/useProfile";
import type { Subscription } from "@/types/Subscription";

interface HomePageProps {
  onNavigateToProfile?: () => void;
  onNavigateToSubscriptions?: () => void;
  onNavigateToDetail?: (subscription: Subscription) => void;
  onNavigateToAI?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToPdfUpload?: () => void;
  onNavigateToCalendar?: () => void;
}

export function HomePage({
  onNavigateToProfile,
  onNavigateToSubscriptions,
  onNavigateToDetail,
  onNavigateToAI,
  onNavigateToNotifications,
  onNavigateToPdfUpload,
  onNavigateToCalendar,
}: HomePageProps) {
  const { user, profile } = useProfile();
  const { recommendations, isLoading, topRecommendations } = useRecommendedSubscriptions(
    user?.id || "user-001"
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-white px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm">안녕하세요,</p>
            <h1 className="text-xl font-bold">{user?.name || "집덕이"}님</h1>
          </div>
          <button
            onClick={onNavigateToNotifications}
            className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* 프로필 요약 */}
        {profile && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">매칭 가능한 청약</p>
                <p className="text-2xl font-bold">{recommendations.length}건</p>
              </div>
              <button
                onClick={onNavigateToProfile}
                className="text-sm text-white/80 hover:text-white flex items-center gap-1"
              >
                프로필 보기
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* 프로필 미설정 시 */}
        {!profile && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <ProfileDisplay compact onEdit={onNavigateToProfile} />
          </div>
        )}

        {/* 빠른 액션 */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onNavigateToAI}
            className="bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Sparkles size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-foreground text-center">AI 추천</p>
          </button>

          <button
            onClick={onNavigateToPdfUpload}
            className="bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <FileText size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-foreground text-center">PDF 분석</p>
          </button>

          <button
            onClick={onNavigateToCalendar}
            className="bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Calendar size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-foreground text-center">캘린더</p>
          </button>
        </div>

        {/* TOP 추천 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              <h2 className="font-bold text-foreground">TOP 추천 청약</h2>
            </div>
            <button
              onClick={onNavigateToSubscriptions}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              전체보기
              <ChevronRight size={16} />
            </button>
          </div>

          {isLoading ? (
            <SubscriptionListSkeleton count={2} />
          ) : topRecommendations.length > 0 ? (
            <div className="space-y-4">
              {topRecommendations.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onClick={() => onNavigateToDetail?.(subscription)}
                  variant="horizontal"
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">
                프로필을 설정하면 맞춤 추천을 받을 수 있어요
              </p>
              <button
                onClick={onNavigateToProfile}
                className="mt-3 text-primary font-medium hover:underline"
              >
                프로필 설정하기
              </button>
            </div>
          )}
        </section>

        {/* 마감 임박 */}
        {recommendations.filter((s) => s.status === "ACTIVE").length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                마감 임박
              </h2>
            </div>

            <div className="space-y-3">
              {recommendations
                .filter((s) => s.status === "ACTIVE")
                .slice(0, 2)
                .map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onClick={() => onNavigateToDetail?.(subscription)}
                    variant="compact"
                  />
                ))}
            </div>
          </section>
        )}

        {/* 배너 */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-50 dark:from-primary/5 dark:to-slate-800 border border-primary/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">AI 맞춤 분석</h3>
              <p className="text-sm text-muted-foreground mb-3">
                내 조건에 맞는 청약을 AI가 분석해드려요
              </p>
              <button
                onClick={onNavigateToAI}
                className="text-sm font-medium text-primary hover:underline"
              >
                분석 시작하기 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
