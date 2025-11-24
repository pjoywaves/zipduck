import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { queryKeys } from "@/lib/queryClient";
import type { Subscription } from "@/types/Subscription";

// ===== 타입 정의 =====

export interface FavoriteItem {
  id: string;
  userId: string;
  subscriptionId: string;
  subscription: Subscription;
  addedAt: string;
  notes?: string;
}

export interface FavoritesListResponse {
  content: FavoriteItem[];
  totalCount: number;
}

export interface AddFavoriteRequest {
  subscriptionId: string;
  notes?: string;
}

export interface ComparisonItem {
  subscription: Subscription;
  addedAt: string;
}

// ===== 더미 데이터 =====

const DUMMY_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-001",
    name: "래미안 원베일리",
    location: "서울특별시 서초구 반포동",
    developer: "삼성물산",
    supplyType: "PRIVATE",
    totalUnits: 2990,
    applicationStartDate: "2025-02-01",
    applicationEndDate: "2025-02-07",
    source: "PUBLIC_DB",
    status: "UPCOMING",
    matchScore: 92,
    isEligible: true,
    eligibilityTier: "1순위",
    minPrice: 150000,
    maxPrice: 450000,
  },
  {
    id: "sub-002",
    name: "힐스테이트 판교역",
    location: "경기도 성남시 분당구",
    developer: "현대건설",
    supplyType: "PRIVATE",
    totalUnits: 1500,
    applicationStartDate: "2025-01-25",
    applicationEndDate: "2025-01-31",
    source: "PUBLIC_DB",
    status: "ACTIVE",
    matchScore: 85,
    isEligible: true,
    eligibilityTier: "2순위",
    minPrice: 120000,
    maxPrice: 350000,
  },
  {
    id: "sub-003",
    name: "신혼희망타운 마곡",
    location: "서울특별시 강서구 마곡동",
    developer: "LH",
    supplyType: "NEWLYWED",
    totalUnits: 800,
    applicationStartDate: "2025-02-10",
    applicationEndDate: "2025-02-14",
    source: "PUBLIC_DB",
    status: "UPCOMING",
    matchScore: 95,
    isEligible: true,
    eligibilityTier: "특별공급",
    minPrice: 35000,
    maxPrice: 55000,
  },
];

let DUMMY_FAVORITES: FavoriteItem[] = [
  {
    id: "fav-001",
    userId: "user-001",
    subscriptionId: "sub-001",
    subscription: DUMMY_SUBSCRIPTIONS[0],
    addedAt: "2025-01-20T10:00:00Z",
    notes: "1순위 자격 확인 필요",
  },
  {
    id: "fav-002",
    userId: "user-001",
    subscriptionId: "sub-002",
    subscription: DUMMY_SUBSCRIPTIONS[1],
    addedAt: "2025-01-18T14:30:00Z",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== API 함수 =====

/** 즐겨찾기 목록 조회 */
async function fetchFavorites(userId: string): Promise<FavoritesListResponse> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<FavoritesListResponse>>(`/favorites`);
  // return response.data.data;

  await delay(500);
  return {
    content: DUMMY_FAVORITES.filter((f) => f.userId === userId),
    totalCount: DUMMY_FAVORITES.filter((f) => f.userId === userId).length,
  };
}

/** 즐겨찾기 추가 */
async function addFavorite(request: AddFavoriteRequest): Promise<FavoriteItem> {
  // TODO: 실제 API 연동
  // const response = await api.post<ApiResponse<FavoriteItem>>(`/favorites`, request);
  // return response.data.data;

  await delay(300);

  const subscription = DUMMY_SUBSCRIPTIONS.find((s) => s.id === request.subscriptionId);
  if (!subscription) {
    throw new Error("청약 정보를 찾을 수 없습니다.");
  }

  const newFavorite: FavoriteItem = {
    id: `fav-${Date.now()}`,
    userId: "user-001",
    subscriptionId: request.subscriptionId,
    subscription,
    addedAt: new Date().toISOString(),
    notes: request.notes,
  };

  DUMMY_FAVORITES.push(newFavorite);
  return newFavorite;
}

/** 즐겨찾기 삭제 */
async function removeFavorite(favoriteId: string): Promise<void> {
  // TODO: 실제 API 연동
  // await api.delete(`/favorites/${favoriteId}`);

  await delay(300);
  DUMMY_FAVORITES = DUMMY_FAVORITES.filter((f) => f.id !== favoriteId);
}

/** 즐겨찾기 여부 확인 */
async function checkIsFavorite(subscriptionId: string): Promise<boolean> {
  await delay(100);
  return DUMMY_FAVORITES.some((f) => f.subscriptionId === subscriptionId);
}

/** 즐겨찾기 토글 */
async function toggleFavorite(subscriptionId: string): Promise<{ isFavorite: boolean }> {
  await delay(300);

  const existingIndex = DUMMY_FAVORITES.findIndex((f) => f.subscriptionId === subscriptionId);

  if (existingIndex >= 0) {
    DUMMY_FAVORITES.splice(existingIndex, 1);
    return { isFavorite: false };
  } else {
    const subscription = DUMMY_SUBSCRIPTIONS.find((s) => s.id === subscriptionId);
    if (subscription) {
      DUMMY_FAVORITES.push({
        id: `fav-${Date.now()}`,
        userId: "user-001",
        subscriptionId,
        subscription,
        addedAt: new Date().toISOString(),
      });
    }
    return { isFavorite: true };
  }
}

// ===== React Query Hooks =====

/** 즐겨찾기 목록 조회 */
export function useFavorites(userId: string) {
  return useQuery({
    queryKey: [...queryKeys.user.all, "favorites", userId],
    queryFn: () => fetchFavorites(userId),
    enabled: !!userId,
  });
}

/** 즐겨찾기 추가 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}

/** 즐겨찾기 삭제 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}

/** 즐겨찾기 토글 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
  });
}

/** 즐겨찾기 여부 확인 */
export function useIsFavorite(subscriptionId: string) {
  return useQuery({
    queryKey: [...queryKeys.user.all, "isFavorite", subscriptionId],
    queryFn: () => checkIsFavorite(subscriptionId),
    enabled: !!subscriptionId,
  });
}

// ===== 비교 관련 =====

const COMPARISON_STORAGE_KEY = "zipduck_comparison_items";
const MAX_COMPARISON_ITEMS = 4;

/** 비교 목록 가져오기 (로컬 스토리지) */
export function getComparisonItems(): string[] {
  try {
    const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/** 비교 목록 저장 */
export function setComparisonItems(items: string[]): void {
  localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_COMPARISON_ITEMS)));
}

/** 비교 목록에 추가 */
export function addToComparison(subscriptionId: string): boolean {
  const items = getComparisonItems();
  if (items.length >= MAX_COMPARISON_ITEMS) {
    return false;
  }
  if (!items.includes(subscriptionId)) {
    items.push(subscriptionId);
    setComparisonItems(items);
  }
  return true;
}

/** 비교 목록에서 제거 */
export function removeFromComparison(subscriptionId: string): void {
  const items = getComparisonItems();
  setComparisonItems(items.filter((id) => id !== subscriptionId));
}

/** 비교 목록 초기화 */
export function clearComparison(): void {
  localStorage.removeItem(COMPARISON_STORAGE_KEY);
}

/** 비교 여부 확인 */
export function isInComparison(subscriptionId: string): boolean {
  return getComparisonItems().includes(subscriptionId);
}
