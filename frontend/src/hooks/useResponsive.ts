import { useState, useEffect } from "react";

// Tailwind 기본 breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  breakpoint: Breakpoint | "xs";
}

/**
 * 반응형 상태 관리 훅
 *
 * 화면 크기에 따른 breakpoint 및 디바이스 타입 반환
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === "undefined") {
      return {
        width: 0,
        height: 0,
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        isLargeDesktop: false,
        breakpoint: "xs",
      };
    }

    return getResponsiveState(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    const handleResize = () => {
      setState(getResponsiveState(window.innerWidth, window.innerHeight));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
}

function getResponsiveState(width: number, height: number): ResponsiveState {
  const breakpoint = getBreakpoint(width);

  return {
    width,
    height,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    isLargeDesktop: width >= breakpoints.xl,
    breakpoint,
  };
}

function getBreakpoint(width: number): Breakpoint | "xs" {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

/**
 * 미디어 쿼리 훅
 *
 * 특정 미디어 쿼리 조건 충족 여부 반환
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Breakpoint 이상인지 확인하는 훅
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);
}

/**
 * 모바일 여부 확인 훅
 */
export function useIsMobile(): boolean {
  return !useBreakpoint("md");
}

/**
 * 데스크탑 여부 확인 훅
 */
export function useIsDesktop(): boolean {
  return useBreakpoint("lg");
}

// 반응형 유틸리티 클래스
export const responsiveClasses = {
  // 컨테이너
  container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  containerNarrow: "w-full max-w-3xl mx-auto px-4 sm:px-6",
  containerWide: "w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8",

  // 그리드
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",
  grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
  grid4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",

  // 카드 그리드
  cardGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  listGrid: "flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4",

  // 텍스트
  headingXl: "text-2xl sm:text-3xl lg:text-4xl font-bold",
  headingLg: "text-xl sm:text-2xl lg:text-3xl font-bold",
  headingMd: "text-lg sm:text-xl font-semibold",
  headingSm: "text-base sm:text-lg font-medium",

  // 숨김/표시
  hideOnMobile: "hidden md:block",
  hideOnDesktop: "md:hidden",
  showOnlyMobile: "block md:hidden",
  showOnlyDesktop: "hidden md:block",

  // 스택/플렉스
  stackToRow: "flex flex-col md:flex-row",
  rowToStack: "flex flex-row md:flex-col",

  // 패딩
  sectionPadding: "py-8 md:py-12 lg:py-16",
  cardPadding: "p-4 md:p-6",
} as const;

export default useResponsive;
