import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load components for better performance
const SplashScreen = lazy(() => import("@/components/SplashScreen").then(m => ({ default: m.SplashScreen })));
const NewOnboardingScreen = lazy(() => import("@/components/NewOnboardingScreen").then(m => ({ default: m.NewOnboardingScreen })));
const NewSignUpScreen = lazy(() => import("@/components/NewSignUpScreen").then(m => ({ default: m.NewSignUpScreen })));
const LoginScreen = lazy(() => import("@/components/LoginScreen").then(m => ({ default: m.LoginScreen })));
const FindAccountScreen = lazy(() => import("@/components/FindAccountScreen").then(m => ({ default: m.FindAccountScreen })));
const HomeScreen = lazy(() => import("@/components/HomeScreen").then(m => ({ default: m.HomeScreen })));
const SearchScreen = lazy(() => import("@/components/SearchScreen").then(m => ({ default: m.SearchScreen })));
const NewFavoritesScreen = lazy(() => import("@/components/NewFavoritesScreen").then(m => ({ default: m.NewFavoritesScreen })));
const MyPageScreen = lazy(() => import("@/components/MyPageScreen").then(m => ({ default: m.MyPageScreen })));
const DetailScreenNew = lazy(() => import("@/components/DetailScreenNew").then(m => ({ default: m.DetailScreenNew })));
const AIRecommendationScreen = lazy(() => import("@/components/AIRecommendationScreen").then(m => ({ default: m.AIRecommendationScreen })));
const AIChatScreen = lazy(() => import("@/components/AIChatScreen").then(m => ({ default: m.AIChatScreen })));
const SettingsScreen = lazy(() => import("@/components/SettingsScreen").then(m => ({ default: m.SettingsScreen })));
const AppearanceScreen = lazy(() => import("@/components/AppearanceScreen").then(m => ({ default: m.AppearanceScreen })));
const NotificationScreen = lazy(() => import("@/components/NotificationScreen").then(m => ({ default: m.NotificationScreen })));
const CustomFilterScreen = lazy(() => import("@/components/CustomFilterScreen").then(m => ({ default: m.CustomFilterScreen })));
const RegionMapScreen = lazy(() => import("@/components/RegionMapScreen").then(m => ({ default: m.RegionMapScreen })));
const AnalyticsScreen = lazy(() => import("@/components/AnalyticsScreen").then(m => ({ default: m.AnalyticsScreen })));
const AnnouncementScreen = lazy(() => import("@/components/AnnouncementScreen").then(m => ({ default: m.AnnouncementScreen })));
const DistanceMapScreen = lazy(() => import("@/components/DistanceMapScreen").then(m => ({ default: m.DistanceMapScreen })));
const AIConsultScreen = lazy(() => import("@/components/AIConsultScreen").then(m => ({ default: m.AIConsultScreen })));
const CalendarScreen = lazy(() => import("@/components/CalendarScreen").then(m => ({ default: m.CalendarScreen })));
const AIRecommendBestScreen = lazy(() => import("@/components/AIRecommendBestScreen").then(m => ({ default: m.AIRecommendBestScreen })));
const RegionPreferenceScreen = lazy(() => import("@/components/RegionPreferenceScreen").then(m => ({ default: m.RegionPreferenceScreen })));
const NotificationSettingsScreen = lazy(() => import("@/components/NotificationSettingsScreen").then(m => ({ default: m.NotificationSettingsScreen })));
const HelpScreen = lazy(() => import("@/components/HelpScreen").then(m => ({ default: m.HelpScreen })));
const PrivacyPolicyScreen = lazy(() => import("@/components/PrivacyPolicyScreen").then(m => ({ default: m.PrivacyPolicyScreen })));
const TermsOfServiceScreen = lazy(() => import("@/components/TermsOfServiceScreen").then(m => ({ default: m.TermsOfServiceScreen })));
const ProfileEditScreen = lazy(() => import("@/components/ProfileEditScreen").then(m => ({ default: m.ProfileEditScreen })));
const EmailChangeScreen = lazy(() => import("@/components/EmailChangeScreen").then(m => ({ default: m.EmailChangeScreen })));
const PasswordChangeScreen = lazy(() => import("@/components/PasswordChangeScreen").then(m => ({ default: m.PasswordChangeScreen })));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

// Auth guard component
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("zipduck-auth-token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Wrapper for lazy loaded components
function LazyWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

// Route paths
export const ROUTES = {
  SPLASH: "/",
  ONBOARDING: "/onboarding",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FIND_ACCOUNT: "/find-account",
  HOME: "/home",
  SEARCH: "/search",
  FAVORITES: "/favorites",
  MYPAGE: "/mypage",
  DETAIL: "/detail/:id",
  AI_RECOMMENDATION: "/ai-recommendation",
  AI_CHAT: "/ai-chat",
  SETTINGS: "/settings",
  APPEARANCE: "/settings/appearance",
  NOTIFICATIONS: "/notifications",
  FILTER: "/filter",
  REGION_MAP: "/region-map",
  ANALYTICS: "/analytics",
  ANNOUNCEMENT: "/announcement",
  DISTANCE_MAP: "/distance-map",
  AI_CONSULT: "/ai-consult",
  CALENDAR: "/calendar",
  AI_BEST: "/ai-best",
  REGION_PREFERENCE: "/settings/region-preference",
  NOTIFICATION_SETTINGS: "/settings/notifications",
  HELP: "/settings/help",
  PRIVACY_POLICY: "/settings/privacy-policy",
  TERMS_OF_SERVICE: "/settings/terms-of-service",
  PROFILE_EDIT: "/settings/profile",
  EMAIL_CHANGE: "/settings/email",
  PASSWORD_CHANGE: "/settings/password",
} as const;

// Router configuration
export const router = createBrowserRouter([
  // Public routes
  {
    path: ROUTES.SPLASH,
    element: <LazyWrapper><SplashScreen onComplete={() => window.location.href = ROUTES.ONBOARDING} /></LazyWrapper>,
  },
  {
    path: ROUTES.ONBOARDING,
    element: <LazyWrapper><NewOnboardingScreen onComplete={() => window.location.href = ROUTES.LOGIN} /></LazyWrapper>,
  },
  {
    path: ROUTES.LOGIN,
    element: <LazyWrapper><LoginScreen
      onLogin={() => {
        localStorage.setItem("zipduck-auth-token", "demo-token");
        window.location.href = ROUTES.HOME;
      }}
      onNavigateToSignUp={() => window.location.href = ROUTES.SIGNUP}
      onNavigateToFindAccount={() => window.location.href = ROUTES.FIND_ACCOUNT}
    /></LazyWrapper>,
  },
  {
    path: ROUTES.SIGNUP,
    element: <LazyWrapper><NewSignUpScreen
      onBack={() => window.location.href = ROUTES.LOGIN}
      onSignUp={() => window.location.href = ROUTES.HOME}
      onNavigateToLogin={() => window.location.href = ROUTES.LOGIN}
    /></LazyWrapper>,
  },
  {
    path: ROUTES.FIND_ACCOUNT,
    element: <LazyWrapper><FindAccountScreen onBack={() => window.location.href = ROUTES.LOGIN} /></LazyWrapper>,
  },

  // Protected routes (require authentication)
  {
    path: ROUTES.HOME,
    element: <RequireAuth><LazyWrapper><HomeScreen
      onNavigateToDetail={() => window.location.href = "/detail/1"}
      onNavigateToAI={() => window.location.href = ROUTES.AI_RECOMMENDATION}
      onNavigateToChat={() => window.location.href = ROUTES.AI_CHAT}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.SEARCH,
    element: <RequireAuth><LazyWrapper><SearchScreen
      onNavigateToDetail={() => window.location.href = "/detail/1"}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.FAVORITES,
    element: <RequireAuth><LazyWrapper><NewFavoritesScreen
      onNavigateToDetail={() => window.location.href = "/detail/1"}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.MYPAGE,
    element: <RequireAuth><LazyWrapper><MyPageScreen
      onNavigateToSettings={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.DETAIL,
    element: <RequireAuth><LazyWrapper><DetailScreenNew
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.AI_RECOMMENDATION,
    element: <RequireAuth><LazyWrapper><AIRecommendationScreen
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.AI_CHAT,
    element: <RequireAuth><LazyWrapper><AIChatScreen
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.SETTINGS,
    element: <RequireAuth><LazyWrapper><SettingsScreen
      onBack={() => window.location.href = ROUTES.MYPAGE}
      onNavigateToAppearance={() => window.location.href = ROUTES.APPEARANCE}
      onNavigateToProfile={() => window.location.href = ROUTES.PROFILE_EDIT}
      onNavigateToRegionPreference={() => window.location.href = ROUTES.REGION_PREFERENCE}
      onNavigateToNotificationSettings={() => window.location.href = ROUTES.NOTIFICATION_SETTINGS}
      onNavigateToHelp={() => window.location.href = ROUTES.HELP}
      onNavigateToPrivacyPolicy={() => window.location.href = ROUTES.PRIVACY_POLICY}
      onNavigateToTerms={() => window.location.href = ROUTES.TERMS_OF_SERVICE}
      onNavigateToEmailChange={() => window.location.href = ROUTES.EMAIL_CHANGE}
      onNavigateToPasswordChange={() => window.location.href = ROUTES.PASSWORD_CHANGE}
      onLogout={() => {
        localStorage.removeItem("zipduck-auth-token");
        window.location.href = ROUTES.LOGIN;
      }}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.APPEARANCE,
    element: <RequireAuth><LazyWrapper><AppearanceScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <RequireAuth><LazyWrapper><NotificationScreen
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.FILTER,
    element: <RequireAuth><LazyWrapper><CustomFilterScreen
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.REGION_MAP,
    element: <RequireAuth><LazyWrapper><RegionMapScreen
      onBack={() => window.location.href = ROUTES.HOME}
      onNavigateToDetail={() => window.location.href = "/detail/1"}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.ANALYTICS,
    element: <RequireAuth><LazyWrapper><AnalyticsScreen
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.ANNOUNCEMENT,
    element: <RequireAuth><LazyWrapper><AnnouncementScreen
      onBack={() => window.location.href = ROUTES.MYPAGE}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.DISTANCE_MAP,
    element: <RequireAuth><LazyWrapper><DistanceMapScreen
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.AI_CONSULT,
    element: <RequireAuth><LazyWrapper><AIConsultScreen
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.CALENDAR,
    element: <RequireAuth><LazyWrapper><CalendarScreen
      onBack={() => window.location.href = ROUTES.HOME}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.AI_BEST,
    element: <RequireAuth><LazyWrapper><AIRecommendBestScreen
      onBack={() => window.location.href = ROUTES.HOME}
      onNavigateToDetail={() => window.location.href = "/detail/1"}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.REGION_PREFERENCE,
    element: <RequireAuth><LazyWrapper><RegionPreferenceScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.NOTIFICATION_SETTINGS,
    element: <RequireAuth><LazyWrapper><NotificationSettingsScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.HELP,
    element: <RequireAuth><LazyWrapper><HelpScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.PRIVACY_POLICY,
    element: <RequireAuth><LazyWrapper><PrivacyPolicyScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.TERMS_OF_SERVICE,
    element: <RequireAuth><LazyWrapper><TermsOfServiceScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.PROFILE_EDIT,
    element: <RequireAuth><LazyWrapper><ProfileEditScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.EMAIL_CHANGE,
    element: <RequireAuth><LazyWrapper><EmailChangeScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.PASSWORD_CHANGE,
    element: <RequireAuth><LazyWrapper><PasswordChangeScreen
      onBack={() => window.location.href = ROUTES.SETTINGS}
    /></LazyWrapper></RequireAuth>,
  },

  // Fallback route
  {
    path: "*",
    element: <Navigate to={ROUTES.SPLASH} replace />,
  },
]);
