import { Loader2, SearchX, RefreshCw } from "lucide-react";
import { SubscriptionCard } from "./SubscriptionCard";
import { SourceFilter } from "./SourceFilter";
import { Button } from "@/components/ui/button";
import { SkeletonSubscriptionCard, Skeleton } from "@/components/ui/skeleton";
import type { Subscription, SubscriptionSource } from "@/types/Subscription";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  error?: Error | null;
  onItemClick?: (subscription: Subscription) => void;
  onFavorite?: (subscription: Subscription) => void;
  favorites?: Set<string>;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  showSourceFilter?: boolean;
  sourceFilter?: SubscriptionSource | "ALL";
  onSourceFilterChange?: (source: SubscriptionSource | "ALL") => void;
  sourceCounts?: {
    all: number;
    publicDb: number;
    pdfUpload: number;
    merged: number;
  };
  cardVariant?: "default" | "compact" | "horizontal";
  onRefresh?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function SubscriptionList({
  subscriptions,
  isLoading = false,
  error,
  onItemClick,
  onFavorite,
  favorites = new Set(),
  emptyMessage = "청약 정보가 없습니다",
  emptyIcon,
  showSourceFilter = false,
  sourceFilter = "ALL",
  onSourceFilterChange,
  sourceCounts,
  cardVariant = "default",
  onRefresh,
  header,
  footer,
}: SubscriptionListProps) {
  // 로딩 상태
  if (isLoading && subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">청약 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <SearchX className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-foreground font-medium mb-2">오류가 발생했습니다</p>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        )}
      </div>
    );
  }

  // 빈 상태
  if (subscriptions.length === 0) {
    return (
      <div className="space-y-4">
        {showSourceFilter && onSourceFilterChange && (
          <SourceFilter
            value={sourceFilter}
            onChange={onSourceFilterChange}
            counts={sourceCounts}
          />
        )}

        <div className="flex flex-col items-center justify-center py-16">
          {emptyIcon || (
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 소스 필터 */}
      {showSourceFilter && onSourceFilterChange && (
        <SourceFilter
          value={sourceFilter}
          onChange={onSourceFilterChange}
          counts={sourceCounts}
        />
      )}

      {/* 헤더 */}
      {header}

      {/* 결과 수 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{subscriptions.length}</span>건
        </p>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* 리스트 - 반응형 그리드 */}
      <div
        className={
          cardVariant === "default"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-3"
        }
      >
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onClick={() => onItemClick?.(subscription)}
            onFavorite={onFavorite ? () => onFavorite(subscription) : undefined}
            isFavorite={favorites.has(subscription.id)}
            variant={cardVariant}
          />
        ))}
      </div>

      {/* 푸터 */}
      {footer}
    </div>
  );
}

/** 스켈레톤 로딩 컴포넌트 */
export function SubscriptionListSkeleton({
  count = 4,
  variant = "default",
}: {
  count?: number;
  variant?: "default" | "compact" | "horizontal";
}) {
  return (
    <div className="space-y-4">
      {/* 필터 스켈레톤 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* 결과 수 스켈레톤 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
      </div>

      {/* 카드 스켈레톤 - 반응형 그리드 */}
      <div
        className={
          variant === "default"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-3"
        }
      >
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonSubscriptionCard key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

/** 인피니트 스크롤 목록 */
interface InfiniteSubscriptionListProps extends Omit<SubscriptionListProps, 'subscriptions'> {
  subscriptions: Subscription[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export function InfiniteSubscriptionList({
  subscriptions,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  ...props
}: InfiniteSubscriptionListProps) {
  return (
    <SubscriptionList
      {...props}
      subscriptions={subscriptions}
      footer={
        hasNextPage ? (
          <div className="flex justify-center py-4">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={isFetchingNextPage}
              className="w-full max-w-xs"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  불러오는 중...
                </>
              ) : (
                "더 보기"
              )}
            </Button>
          </div>
        ) : subscriptions.length > 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            모든 청약 정보를 불러왔습니다
          </p>
        ) : null
      }
    />
  );
}
