import { useState } from "react";
import { ChevronLeft, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubscriptionList, SubscriptionListSkeleton } from "@/components/subscriptions/SubscriptionList";
import { useSubscriptionList } from "@/hooks/useSubscriptions";
import type { Subscription, SubscriptionSortBy } from "@/types/Subscription";

interface SubscriptionsPageProps {
  onBack?: () => void;
  onNavigateToDetail?: (subscription: Subscription) => void;
}

const SORT_OPTIONS: { value: SubscriptionSortBy; label: string }[] = [
  { value: "matchScore", label: "매칭률순" },
  { value: "applicationEndDate", label: "마감임박순" },
  { value: "applicationStartDate", label: "시작일순" },
  { value: "price", label: "가격순" },
  { value: "createdAt", label: "등록일순" },
];

export function SubscriptionsPage({ onBack, onNavigateToDetail }: SubscriptionsPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const {
    subscriptions,
    isLoading,
    error,
    filter,
    setSourceFilter,
    setKeyword,
    sortBy,
    setSortBy,
    stats,
    refetch,
  } = useSubscriptionList();

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchQuery);
  };

  // 즐겨찾기 토글
  const handleFavorite = (subscription: Subscription) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(subscription.id)) {
        next.delete(subscription.id);
      } else {
        next.add(subscription.id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {onBack && (
              <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeft size={24} className="text-foreground" />
              </button>
            )}
            <h2 className="font-bold ml-4 text-foreground">청약 목록</h2>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? "bg-primary text-white" : "hover:bg-muted"
            }`}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* 검색바 */}
        <div className="px-6 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="단지명, 지역으로 검색"
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setKeyword("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            )}
          </form>
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <div className="px-6 pb-4 border-t border-border pt-4 bg-muted/30">
            <div className="space-y-4">
              {/* 정렬 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  정렬
                </label>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        sortBy === option.value
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 통계 요약 */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">전체</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-green-600">{stats.eligible}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">자격충족</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-blue-600">{stats.active}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">접수중</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-purple-600">{stats.upcoming}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">예정</p>
          </div>
        </div>
      </div>

      {/* 청약 목록 */}
      <div className="px-6 pb-6">
        {isLoading && subscriptions.length === 0 ? (
          <SubscriptionListSkeleton count={4} />
        ) : (
          <SubscriptionList
            subscriptions={subscriptions}
            isLoading={isLoading}
            error={error as Error | null}
            onItemClick={onNavigateToDetail}
            onFavorite={handleFavorite}
            favorites={favorites}
            showSourceFilter
            sourceFilter={filter.source || "ALL"}
            onSourceFilterChange={setSourceFilter}
            sourceCounts={{
              all: subscriptions.length,
              publicDb: subscriptions.filter((s) => s.source === "PUBLIC_DB").length,
              pdfUpload: subscriptions.filter((s) => s.source === "PDF_UPLOAD").length,
              merged: subscriptions.filter((s) => s.source === "MERGED").length,
            }}
            onRefresh={refetch}
            emptyMessage={
              filter.source !== "ALL" || searchQuery
                ? "검색 결과가 없습니다"
                : "청약 정보가 없습니다"
            }
          />
        )}
      </div>
    </div>
  );
}

export default SubscriptionsPage;
