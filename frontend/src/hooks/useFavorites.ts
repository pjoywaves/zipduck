import { useState, useCallback, useEffect } from "react";
import {
  useFavorites as useFavoritesQuery,
  useToggleFavorite,
  getComparisonItems,
  addToComparison,
  removeFromComparison,
  isInComparison,
  clearComparison,
} from "@/services/favoritesService";

/**
 * 즐겨찾기 관리 커스텀 훅
 */
export function useFavoritesManager(userId: string) {
  const favoritesQuery = useFavoritesQuery(userId);
  const toggleMutation = useToggleFavorite();

  // 즐겨찾기 토글
  const toggleFavorite = useCallback(
    async (subscriptionId: string) => {
      await toggleMutation.mutateAsync(subscriptionId);
    },
    [toggleMutation]
  );

  // 즐겨찾기 여부 확인
  const isFavorite = useCallback(
    (subscriptionId: string) => {
      return favoritesQuery.data?.content.some((f) => f.subscriptionId === subscriptionId) ?? false;
    },
    [favoritesQuery.data]
  );

  // 즐겨찾기 ID 목록
  const favoriteIds = favoritesQuery.data?.content.map((f) => f.subscriptionId) || [];

  return {
    favorites: favoritesQuery.data?.content || [],
    favoriteIds,
    totalCount: favoritesQuery.data?.totalCount || 0,
    isLoading: favoritesQuery.isLoading,
    error: favoritesQuery.error,
    toggleFavorite,
    isFavorite,
    isToggling: toggleMutation.isPending,
    refetch: favoritesQuery.refetch,
  };
}

/**
 * 비교 목록 관리 커스텀 훅
 */
export function useComparison() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  // 초기 로드
  useEffect(() => {
    setComparisonIds(getComparisonItems());
  }, []);

  // 비교에 추가
  const addToCompare = useCallback((subscriptionId: string): boolean => {
    const success = addToComparison(subscriptionId);
    if (success) {
      setComparisonIds(getComparisonItems());
    }
    return success;
  }, []);

  // 비교에서 제거
  const removeFromCompare = useCallback((subscriptionId: string) => {
    removeFromComparison(subscriptionId);
    setComparisonIds(getComparisonItems());
  }, []);

  // 비교 목록 초기화
  const clearAll = useCallback(() => {
    clearComparison();
    setComparisonIds([]);
  }, []);

  // 비교 여부 확인
  const isComparing = useCallback(
    (subscriptionId: string) => {
      return comparisonIds.includes(subscriptionId);
    },
    [comparisonIds]
  );

  // 비교 토글
  const toggleCompare = useCallback(
    (subscriptionId: string): boolean => {
      if (isInComparison(subscriptionId)) {
        removeFromCompare(subscriptionId);
        return false;
      } else {
        return addToCompare(subscriptionId);
      }
    },
    [addToCompare, removeFromCompare]
  );

  return {
    comparisonIds,
    count: comparisonIds.length,
    maxCount: 4,
    isFull: comparisonIds.length >= 4,
    addToCompare,
    removeFromCompare,
    clearAll,
    isComparing,
    toggleCompare,
  };
}
