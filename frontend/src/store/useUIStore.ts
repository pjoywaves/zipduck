import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TabType } from "@/types";

interface UIState {
  // Tab navigation
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;

  // Drawer/Modal states
  isFilterDrawerOpen: boolean;
  setFilterDrawerOpen: (open: boolean) => void;

  isComparisonDrawerOpen: boolean;
  setComparisonDrawerOpen: (open: boolean) => void;

  // Loading states
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Toast/Notification state
  toastMessage: string | null;
  toastType: "success" | "error" | "info" | "warning" | null;
  showToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Tab navigation
      currentTab: "home",
      setCurrentTab: (tab) => set({ currentTab: tab }),

      // Drawer/Modal states
      isFilterDrawerOpen: false,
      setFilterDrawerOpen: (open) => set({ isFilterDrawerOpen: open }),

      isComparisonDrawerOpen: false,
      setComparisonDrawerOpen: (open) => set({ isComparisonDrawerOpen: open }),

      // Loading states
      isGlobalLoading: false,
      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

      // Toast/Notification state
      toastMessage: null,
      toastType: null,
      showToast: (message, type) => set({ toastMessage: message, toastType: type }),
      hideToast: () => set({ toastMessage: null, toastType: null }),
    }),
    {
      name: "zipduck-ui-store",
      // Only persist specific keys
      partialize: (state) => ({
        currentTab: state.currentTab,
      }),
    }
  )
);
