import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SubscriptionFilter, SubscriptionSource, SubscriptionStatus } from "@/types/Subscription";

interface FilterState extends SubscriptionFilter {
  // Search
  keyword: string;
  setKeyword: (keyword: string) => void;

  // Source filter
  setSource: (source: SubscriptionSource | "ALL") => void;

  // Status filter
  setStatus: (status: SubscriptionStatus | "ALL") => void;

  // Region filter
  regions: string[];
  setRegions: (regions: string[]) => void;
  addRegion: (region: string) => void;
  removeRegion: (region: string) => void;

  // Match score filter
  setMinMatchScore: (score: number | undefined) => void;

  // Sort
  sortBy: "matchScore" | "applicationEndDate" | "price" | "createdAt";
  sortOrder: "asc" | "desc";
  setSortBy: (sortBy: "matchScore" | "applicationEndDate" | "price" | "createdAt") => void;
  setSortOrder: (order: "asc" | "desc") => void;

  // Reset
  resetFilters: () => void;
}

const initialState = {
  keyword: "",
  source: "ALL" as const,
  status: undefined,
  regions: [],
  minMatchScore: undefined,
  sortBy: "matchScore" as const,
  sortOrder: "desc" as const,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,

      // Keyword
      setKeyword: (keyword) => set({ keyword }),

      // Source
      setSource: (source) => set({ source: source === "ALL" ? undefined : source }),

      // Status
      setStatus: (status) => set({ status: status === "ALL" ? undefined : status }),

      // Regions
      setRegions: (regions) => set({ regions }),
      addRegion: (region) =>
        set((state) => ({
          regions: [...state.regions, region],
        })),
      removeRegion: (region) =>
        set((state) => ({
          regions: state.regions.filter((r) => r !== region),
        })),

      // Match score
      setMinMatchScore: (minMatchScore) => set({ minMatchScore }),

      // Sort
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),

      // Reset
      resetFilters: () => set(initialState),
    }),
    {
      name: "zipduck-filter-store",
    }
  )
);
