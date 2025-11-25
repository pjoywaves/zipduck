import { useState } from "react";
import { Heart, Trash2, GitCompare, MoreVertical, Filter } from "lucide-react";
import { useFavorites, useRemoveFavorite, addToComparison, isInComparison } from "@/api/favorites";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import type { FavoriteItem } from "@/api/favorites";

interface FavoritesListProps {
  userId: string;
  onSubscriptionClick?: (subscriptionId: string) => void;
  onCompareClick?: () => void;
  className?: string;
}

type SortOption = "addedAt" | "matchScore" | "applicationDate" | "name";

/**
 * 즐겨찾기 목록 컴포넌트
 *
 * 즐겨찾기한 청약 목록 표시, 정렬, 삭제, 비교 추가 기능
 */
export function FavoritesList({
  userId,
  onSubscriptionClick,
  onCompareClick,
  className = "",
}: FavoritesListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("addedAt");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const { data, isLoading, error } = useFavorites(userId);
  const removeMutation = useRemoveFavorite();

  // 정렬
  const sortedFavorites = [...(data?.content || [])].sort((a, b) => {
    switch (sortBy) {
      case "matchScore":
        return (b.subscription.matchScore || 0) - (a.subscription.matchScore || 0);
      case "applicationDate":
        return new Date(a.subscription.applicationEndDate).getTime() - new Date(b.subscription.applicationEndDate).getTime();
      case "name":
        return a.subscription.name.localeCompare(b.subscription.name);
      case "addedAt":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  // 선택 토글
  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 선택 항목 삭제
  const handleDeleteSelected = async () => {
    for (const id of selectedItems) {
      await removeMutation.mutateAsync(id);
    }
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  // 비교에 추가
  const handleAddToCompare = (subscriptionId: string) => {
    const success = addToComparison(subscriptionId);
    if (!success) {
      alert("비교 목록은 최대 4개까지 추가할 수 있습니다.");
    }
  };

  // 선택 항목 비교에 추가
  const handleCompareSelected = () => {
    let added = 0;
    for (const id of selectedItems) {
      const favorite = data?.content.find((f) => f.id === id);
      if (favorite && added < 4) {
        if (addToComparison(favorite.subscriptionId)) {
          added++;
        }
      }
    }
    setSelectedItems(new Set());
    setIsSelectionMode(false);
    onCompareClick?.();
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`bg-destructive/10 text-destructive rounded-lg p-4 ${className}`}>
        즐겨찾기를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 빈 상태
  if (!data?.content.length) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Heart size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">즐겨찾기가 비어있어요</h3>
        <p className="text-sm text-muted-foreground text-center">
          관심 있는 청약을 하트 버튼으로 저장하세요
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-red-500" fill="currentColor" />
          <h2 className="font-semibold text-foreground">
            즐겨찾기 <span className="text-muted-foreground">({data.totalCount})</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* 정렬 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm bg-muted border-none rounded-lg px-3 py-1.5 text-foreground"
          >
            <option value="addedAt">최근 추가순</option>
            <option value="matchScore">매칭률순</option>
            <option value="applicationDate">마감 임박순</option>
            <option value="name">이름순</option>
          </select>

          {/* 선택 모드 토글 */}
          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedItems(new Set());
            }}
            className={`p-2 rounded-lg transition-colors ${
              isSelectionMode ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* 선택 모드 액션 바 */}
      {isSelectionMode && selectedItems.size > 0 && (
        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
          <span className="text-sm text-foreground">
            {selectedItems.size}개 선택됨
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompareSelected}
              disabled={selectedItems.size < 2}
              className="flex items-center gap-1 text-sm px-3 py-1.5 bg-primary text-primary-foreground rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GitCompare size={14} />
              비교하기
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 text-sm px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg"
            >
              <Trash2 size={14} />
              삭제
            </button>
          </div>
        </div>
      )}

      {/* 즐겨찾기 목록 */}
      <div className="flex flex-col gap-4">
        {sortedFavorites.map((favorite) => (
          <FavoriteItem
            key={favorite.id}
            favorite={favorite}
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.has(favorite.id)}
            onSelect={() => toggleSelection(favorite.id)}
            onClick={() => onSubscriptionClick?.(favorite.subscriptionId)}
            onRemove={() => removeMutation.mutate(favorite.id)}
            onAddToCompare={() => handleAddToCompare(favorite.subscriptionId)}
          />
        ))}
      </div>
    </div>
  );
}

// 즐겨찾기 아이템 컴포넌트
interface FavoriteItemProps {
  favorite: FavoriteItem;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onRemove: () => void;
  onAddToCompare: () => void;
}

function FavoriteItem({
  favorite,
  isSelectionMode,
  isSelected,
  onSelect,
  onClick,
  onRemove,
  onAddToCompare,
}: FavoriteItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const inComparison = isInComparison(favorite.subscriptionId);

  return (
    <div className="relative">
      {/* 선택 체크박스 */}
      {isSelectionMode && (
        <button
          onClick={onSelect}
          className={`absolute top-4 left-4 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center
                      transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-muted-foreground"
                      }`}
        >
          {isSelected && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      )}

      {/* 메뉴 버튼 */}
      {!isSelectionMode && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 bg-background/80 rounded-full flex items-center justify-center
                       text-muted-foreground hover:text-foreground transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 bg-card border border-border rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                <button
                  onClick={() => {
                    onAddToCompare();
                    setShowMenu(false);
                  }}
                  disabled={inComparison}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-muted
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GitCompare size={14} />
                  {inComparison ? "비교 중" : "비교에 추가"}
                </button>
                <button
                  onClick={() => {
                    onRemove();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-destructive hover:bg-muted"
                >
                  <Trash2 size={14} />
                  즐겨찾기 삭제
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 카드 */}
      <div className={isSelectionMode ? "pl-10" : ""}>
        <SubscriptionCard
          subscription={favorite.subscription}
          onClick={isSelectionMode ? onSelect : onClick}
          variant="horizontal"
          isFavorite={true}
        />
      </div>

      {/* 노트 */}
      {favorite.notes && (
        <div className="mt-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
          {favorite.notes}
        </div>
      )}
    </div>
  );
}

export default FavoritesList;
