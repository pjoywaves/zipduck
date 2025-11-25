import { useMemo, useState, useCallback } from "react";
import {
  useSubscriptions,
  useInfiniteSubscriptions,
  useRecommendations,
  useFilteredSubscriptions,
} from "@/api/subscription";
import type {
  SubscriptionFilter,
  SubscriptionSource,
  SubscriptionStatus,
  SubscriptionSortBy,
  SortOrder,
} from "@/types/Subscription";

/**
 * 청약 목록 관리 커스텀 훅
 *
 * 필터링, 정렬, 페이지네이션 통합 관리
 */
export function useSubscriptionList() {
  // 필터 상태
  const [filter, setFilter] = useState<SubscriptionFilter>({
    source: "ALL",
    status: "ALL",
  });

  // 정렬 상태
  const [sortBy, setSortBy] = useState<SubscriptionSortBy>("matchScore");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // 쿼리
  const query = useSubscriptions({
    filter,
    sortBy,
    sortOrder,
  });

  // 소스 필터 변경
  const setSourceFilter = useCallback((source: SubscriptionSource | "ALL") => {
    setFilter((prev) => ({ ...prev, source }));
  }, []);

  // 상태 필터 변경
  const setStatusFilter = useCallback((status: SubscriptionStatus | "ALL") => {
    setFilter((prev) => ({ ...prev, status }));
  }, []);

  // 지역 필터 변경
  const setRegionFilter = useCallback((regions: string[]) => {
    setFilter((prev) => ({ ...prev, regions }));
  }, []);

  // 키워드 검색
  const setKeyword = useCallback((keyword: string) => {
    setFilter((prev) => ({ ...prev, keyword }));
  }, []);

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilter({ source: "ALL", status: "ALL" });
    setSortBy("matchScore");
    setSortOrder("desc");
  }, []);

  // 통계
  const stats = useMemo(() => {
    const data = query.data?.content || [];
    return {
      total: query.data?.totalElements || 0,
      eligible: data.filter((s) => s.isEligible).length,
      highMatch: data.filter((s) => (s.matchScore || 0) >= 80).length,
      active: data.filter((s) => s.status === "ACTIVE").length,
      upcoming: data.filter((s) => s.status === "UPCOMING").length,
    };
  }, [query.data]);

  return {
    // 데이터
    subscriptions: query.data?.content || [],
    totalPages: query.data?.totalPages || 0,
    totalElements: query.data?.totalElements || 0,

    // 로딩/에러
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    // 필터
    filter,
    setFilter,
    setSourceFilter,
    setStatusFilter,
    setRegionFilter,
    setKeyword,
    resetFilters,

    // 정렬
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // 통계
    stats,

    // 리프레시
    refetch: query.refetch,
  };
}

/**
 * 무한 스크롤 청약 목록 훅
 */
export function useInfiniteSubscriptionList(filter?: SubscriptionFilter) {
  const query = useInfiniteSubscriptions({ filter });

  const allSubscriptions = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.content) || [];
  }, [query.data]);

  return {
    subscriptions: allSubscriptions,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * 소스별 청약 목록 훅
 */
export function useSubscriptionsBySource() {
  const [source, setSource] = useState<SubscriptionSource | "ALL">("ALL");
  const query = useFilteredSubscriptions(source);

  const sourceStats = useMemo(() => {
    const data = query.data?.content || [];
    return {
      all: data.length,
      publicDb: data.filter((s) => s.source === "PUBLIC_DB").length,
      pdfUpload: data.filter((s) => s.source === "PDF_UPLOAD").length,
      merged: data.filter((s) => s.source === "MERGED").length,
    };
  }, [query.data]);

  return {
    subscriptions: query.data?.content || [],
    isLoading: query.isLoading,
    source,
    setSource,
    sourceStats,
  };
}

/**
 * 추천 청약 훅
 */
export function useRecommendedSubscriptions(userId: string) {
  const query = useRecommendations(userId);

  const topRecommendations = useMemo(() => {
    return query.data?.slice(0, 3) || [];
  }, [query.data]);

  const matchCategories = useMemo(() => {
    const data = query.data || [];
    return {
      excellent: data.filter((s) => (s.matchScore || 0) >= 90),
      good: data.filter((s) => (s.matchScore || 0) >= 70 && (s.matchScore || 0) < 90),
      moderate: data.filter((s) => (s.matchScore || 0) >= 50 && (s.matchScore || 0) < 70),
    };
  }, [query.data]);

  return {
    recommendations: query.data || [],
    topRecommendations,
    matchCategories,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
