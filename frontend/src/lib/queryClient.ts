import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30, // 30분 (구 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Query Keys - 타입 안전한 쿼리 키 관리
export const queryKeys = {
  // User
  user: {
    all: ["user"] as const,
    profile: (userId: string) => ["user", "profile", userId] as const,
    me: () => ["user", "me"] as const,
  },
  // Subscriptions
  subscriptions: {
    all: ["subscriptions"] as const,
    list: (filters?: Record<string, unknown>) => ["subscriptions", "list", filters] as const,
    detail: (id: string) => ["subscriptions", "detail", id] as const,
    recommendations: (userId: string) => ["subscriptions", "recommendations", userId] as const,
  },
  // PDF
  pdf: {
    all: ["pdf"] as const,
    list: (userId: string) => ["pdf", "list", userId] as const,
    detail: (id: string) => ["pdf", "detail", id] as const,
    status: (id: string) => ["pdf", "status", id] as const,
    analysis: (id: string) => ["pdf", "analysis", id] as const,
  },
  // Favorites
  favorites: {
    all: ["favorites"] as const,
    list: (userId: string) => ["favorites", "list", userId] as const,
  },
  // Eligibility
  eligibility: {
    all: ["eligibility"] as const,
    check: (subscriptionId: string, userId: string) => ["eligibility", subscriptionId, userId] as const,
  },
} as const;
