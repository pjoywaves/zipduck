import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load components for better performance
// Auth pages
const SplashScreen = lazy(() => import("@/pages/auth/SplashScreen").then(m => ({ default: m.SplashScreen })));
const NewOnboardingScreen = lazy(() => import("@/pages/auth/NewOnboardingScreen").then(m => ({ default: m.NewOnboardingScreen })));
const NewSignUpScreen = lazy(() => import("@/pages/auth/NewSignUpScreen").then(m => ({ default: m.NewSignUpScreen })));
const LoginScreen = lazy(() => import("@/pages/auth/LoginScreen").then(m => ({ default: m.LoginScreen })));
const FindAccountScreen = lazy(() => import("@/pages/auth/FindAccountScreen").then(m => ({ default: m.FindAccountScreen })));

// Home and subscriptions
const HomeScreen = lazy(() => import("@/pages/home/HomeScreen").then(m => ({ default: m.HomeScreen })));
const SearchScreen = lazy(() => import("@/pages/subscriptions/SearchScreen").then(m => ({ default: m.SearchScreen })));
const NewFavoritesScreen = lazy(() => import("@/pages/subscriptions/NewFavoritesScreen").then(m => ({ default: m.NewFavoritesScreen })));
const DetailScreenNew = lazy(() => import("@/pages/subscriptions/DetailScreenNew").then(m => ({ default: m.DetailScreenNew })));

// Profile
const MyPageScreen = lazy(() => import("@/pages/profile/MyPageScreen").then(m => ({ default: m.MyPageScreen })));
const ProfileEditScreen = lazy(() => import("@/pages/profile/ProfileEditScreen").then(m => ({ default: m.ProfileEditScreen })));

// AI
const AIRecommendationScreen = lazy(() => import("@/pages/ai/AIRecommendationScreen").then(m => ({ default: m.AIRecommendationScreen })));
const AIChatScreen = lazy(() => import("@/pages/ai/AIChatScreen").then(m => ({ default: m.AIChatScreen })));
const AIConsultScreen = lazy(() => import("@/pages/ai/AIConsultScreen").then(m => ({ default: m.AIConsultScreen })));
const AIRecommendBestScreen = lazy(() => import("@/pages/ai/AIRecommendBestScreen").then(m => ({ default: m.AIRecommendBestScreen })));

// Settings
const SettingsScreen = lazy(() => import("@/pages/settings/SettingsScreen").then(m => ({ default: m.SettingsScreen })));
const AppearanceScreen = lazy(() => import("@/pages/settings/AppearanceScreen").then(m => ({ default: m.AppearanceScreen })));
const RegionPreferenceScreen = lazy(() => import("@/pages/settings/RegionPreferenceScreen").then(m => ({ default: m.RegionPreferenceScreen })));
const NotificationSettingsScreen = lazy(() => import("@/pages/settings/NotificationSettingsScreen").then(m => ({ default: m.NotificationSettingsScreen })));
const HelpScreen = lazy(() => import("@/pages/settings/HelpScreen").then(m => ({ default: m.HelpScreen })));
const PrivacyPolicyScreen = lazy(() => import("@/pages/settings/PrivacyPolicyScreen").then(m => ({ default: m.PrivacyPolicyScreen })));
const TermsOfServiceScreen = lazy(() => import("@/pages/settings/TermsOfServiceScreen").then(m => ({ default: m.TermsOfServiceScreen })));
const EmailChangeScreen = lazy(() => import("@/pages/settings/EmailChangeScreen").then(m => ({ default: m.EmailChangeScreen })));
const PasswordChangeScreen = lazy(() => import("@/pages/settings/PasswordChangeScreen").then(m => ({ default: m.PasswordChangeScreen })));

// Common
const NotificationScreen = lazy(() => import("@/pages/common/NotificationScreen").then(m => ({ default: m.NotificationScreen })));
const CustomFilterScreen = lazy(() => import("@/pages/common/CustomFilterScreen").then(m => ({ default: m.CustomFilterScreen })));
const RegionMapScreen = lazy(() => import("@/pages/common/RegionMapScreen").then(m => ({ default: m.RegionMapScreen })));
const AnalyticsScreen = lazy(() => import("@/pages/common/AnalyticsScreen").then(m => ({ default: m.AnalyticsScreen })));
const AnnouncementScreen = lazy(() => import("@/pages/common/AnnouncementScreen").then(m => ({ default: m.AnnouncementScreen })));
const DistanceMapScreen = lazy(() => import("@/pages/common/DistanceMapScreen").then(m => ({ default: m.DistanceMapScreen })));
const CalendarScreen = lazy(() => import("@/pages/common/CalendarScreen").then(m => ({ default: m.CalendarScreen })));

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

// Helper function to create detail route with id
export const getDetailRoute = (id: string) => `/detail/${id}`;

// Wrapper components that use useNavigate hook
function SplashScreenWrapper() {
  const navigate = useNavigate();
  return <SplashScreen onComplete={() => navigate(ROUTES.ONBOARDING)} />;
}

function OnboardingScreenWrapper() {
  const navigate = useNavigate();
  return <NewOnboardingScreen onComplete={() => navigate(ROUTES.LOGIN)} />;
}

function LoginScreenWrapper() {
  const navigate = useNavigate();
  return (
    <LoginScreen
      onLogin={() => {
        localStorage.setItem("zipduck-auth-token", "demo-token");
        navigate(ROUTES.HOME);
      }}
      onNavigateToSignUp={() => navigate(ROUTES.SIGNUP)}
      onNavigateToFindAccount={() => navigate(ROUTES.FIND_ACCOUNT)}
    />
  );
}

function SignUpScreenWrapper() {
  const navigate = useNavigate();
  return (
    <NewSignUpScreen
      onBack={() => navigate(ROUTES.LOGIN)}
      onSignUp={() => navigate(ROUTES.HOME)}
      onNavigateToLogin={() => navigate(ROUTES.LOGIN)}
    />
  );
}

function FindAccountScreenWrapper() {
  const navigate = useNavigate();
  return <FindAccountScreen onBack={() => navigate(ROUTES.LOGIN)} />;
}

function HomeScreenWrapper() {
  const navigate = useNavigate();
  return (
    <HomeScreen
      onNavigateToDetail={() => navigate(getDetailRoute("1"))}
      onNavigateToAI={() => navigate(ROUTES.AI_RECOMMENDATION)}
      onNavigateToChat={() => navigate(ROUTES.AI_CHAT)}
    />
  );
}

function SearchScreenWrapper() {
  const navigate = useNavigate();
  return <SearchScreen onNavigateToDetail={() => navigate(getDetailRoute("1"))} />;
}

function FavoritesScreenWrapper() {
  const navigate = useNavigate();
  return <NewFavoritesScreen onNavigateToDetail={() => navigate(getDetailRoute("1"))} />;
}

function MyPageScreenWrapper() {
  const navigate = useNavigate();
  return <MyPageScreen onNavigateToSettings={() => navigate(ROUTES.SETTINGS)} />;
}

function DetailScreenWrapper() {
  const navigate = useNavigate();
  return <DetailScreenNew onBack={() => navigate(ROUTES.HOME)} />;
}

function AIRecommendationScreenWrapper() {
  const navigate = useNavigate();
  return <AIRecommendationScreen onBack={() => navigate(ROUTES.HOME)} />;
}

function AIChatScreenWrapper() {
  const navigate = useNavigate();
  return <AIChatScreen onBack={() => navigate(ROUTES.HOME)} />;
}

function SettingsScreenWrapper() {
  const navigate = useNavigate();
  return (
    <SettingsScreen
      onBack={() => navigate(ROUTES.MYPAGE)}
      onNavigateToAppearance={() => navigate(ROUTES.APPEARANCE)}
      onNavigateToProfile={() => navigate(ROUTES.PROFILE_EDIT)}
      onNavigateToRegionPreference={() => navigate(ROUTES.REGION_PREFERENCE)}
      onNavigateToNotificationSettings={() => navigate(ROUTES.NOTIFICATION_SETTINGS)}
      onNavigateToHelp={() => navigate(ROUTES.HELP)}
      onNavigateToPrivacyPolicy={() => navigate(ROUTES.PRIVACY_POLICY)}
      onNavigateToTerms={() => navigate(ROUTES.TERMS_OF_SERVICE)}
      onNavigateToEmailChange={() => navigate(ROUTES.EMAIL_CHANGE)}
      onNavigateToPasswordChange={() => navigate(ROUTES.PASSWORD_CHANGE)}
      onLogout={() => {
        localStorage.removeItem("zipduck-auth-token");
        navigate(ROUTES.LOGIN);
      }}
    />
  );
}

function AppearanceScreenWrapper() {
  const navigate = useNavigate();
  return <AppearanceScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

function NotificationScreenWrapper() {
  const navigate = useNavigate();
  return <NotificationScreen onBack={() => navigate(ROUTES.HOME)} />;
}

function CustomFilterScreenWrapper() {
  const navigate = useNavigate();
  return <CustomFilterScreen onBack={() => navigate(ROUTES.HOME)} />;
}

function RegionMapScreenWrapper() {
  const navigate = useNavigate();
  return (
    <RegionMapScreen
      onBack={() => navigate(ROUTES.HOME)}
      onNavigateToDetail={() => navigate(getDetailRoute("1"))}
    />
  );
}

function AnalyticsScreenWrapper() {
  const navigate = useNavigate();
  return <AnalyticsScreen onBack={() => navigate(ROUTES.HOME)} />;
}

function AnnouncementScreenWrapper() {
  const navigate = useNavigate();
  return <AnnouncementScreen onBack={() => navigate(ROUTES.MYPAGE)} />;
}

function DistanceMapScreenWrapper() {
  const navigate = useNavigate();
  return <DistanceMapScreen onBack={() => navigate(ROUTES.HOME)} />;
}

function AIConsultScreenWrapper() {
  const navigate = useNavigate();
  return <AIConsultScreen onBack={() => navigate(ROUTES.HOME)} />;
}

function CalendarScreenWrapper() {
  const navigate = useNavigate();
  return <CalendarScreen onBack={() => navigate(ROUTES.HOME)} />;
}

function AIRecommendBestScreenWrapper() {
  const navigate = useNavigate();
  return (
    <AIRecommendBestScreen
      onBack={() => navigate(ROUTES.HOME)}
      onNavigateToDetail={() => navigate(getDetailRoute("1"))}
    />
  );
}

function RegionPreferenceScreenWrapper() {
  const navigate = useNavigate();
  return <RegionPreferenceScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

function NotificationSettingsScreenWrapper() {
  const navigate = useNavigate();
  return <NotificationSettingsScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

function HelpScreenWrapper() {
  const navigate = useNavigate();
  return <HelpScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

function PrivacyPolicyScreenWrapper() {
  const navigate = useNavigate();
  return <PrivacyPolicyScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

function TermsOfServiceScreenWrapper() {
  const navigate = useNavigate();
  return <TermsOfServiceScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

function ProfileEditScreenWrapper() {
  const navigate = useNavigate();
  return <ProfileEditScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

function EmailChangeScreenWrapper() {
  const navigate = useNavigate();
  return <EmailChangeScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

function PasswordChangeScreenWrapper() {
  const navigate = useNavigate();
  return <PasswordChangeScreen onBack={() => navigate(ROUTES.SETTINGS)} />;
}

// Router configuration
export const router = createBrowserRouter([
  // Public routes
  {
    path: ROUTES.SPLASH,
    element: <LazyWrapper><SplashScreenWrapper /></LazyWrapper>,
  },
  {
    path: ROUTES.ONBOARDING,
    element: <LazyWrapper><OnboardingScreenWrapper /></LazyWrapper>,
  },
  {
    path: ROUTES.LOGIN,
    element: <LazyWrapper><LoginScreenWrapper /></LazyWrapper>,
  },
  {
    path: ROUTES.SIGNUP,
    element: <LazyWrapper><SignUpScreenWrapper /></LazyWrapper>,
  },
  {
    path: ROUTES.FIND_ACCOUNT,
    element: <LazyWrapper><FindAccountScreenWrapper /></LazyWrapper>,
  },

  // Protected routes (require authentication)
  {
    path: ROUTES.HOME,
    element: <RequireAuth><LazyWrapper><HomeScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.SEARCH,
    element: <RequireAuth><LazyWrapper><SearchScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.FAVORITES,
    element: <RequireAuth><LazyWrapper><FavoritesScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.MYPAGE,
    element: <RequireAuth><LazyWrapper><MyPageScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.DETAIL,
    element: <RequireAuth><LazyWrapper><DetailScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.AI_RECOMMENDATION,
    element: <RequireAuth><LazyWrapper><AIRecommendationScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.AI_CHAT,
    element: <RequireAuth><LazyWrapper><AIChatScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.SETTINGS,
    element: <RequireAuth><LazyWrapper><SettingsScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.APPEARANCE,
    element: <RequireAuth><LazyWrapper><AppearanceScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <RequireAuth><LazyWrapper><NotificationScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.FILTER,
    element: <RequireAuth><LazyWrapper><CustomFilterScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.REGION_MAP,
    element: <RequireAuth><LazyWrapper><RegionMapScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.ANALYTICS,
    element: <RequireAuth><LazyWrapper><AnalyticsScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.ANNOUNCEMENT,
    element: <RequireAuth><LazyWrapper><AnnouncementScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.DISTANCE_MAP,
    element: <RequireAuth><LazyWrapper><DistanceMapScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.AI_CONSULT,
    element: <RequireAuth><LazyWrapper><AIConsultScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.CALENDAR,
    element: <RequireAuth><LazyWrapper><CalendarScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.AI_BEST,
    element: <RequireAuth><LazyWrapper><AIRecommendBestScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.REGION_PREFERENCE,
    element: <RequireAuth><LazyWrapper><RegionPreferenceScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.NOTIFICATION_SETTINGS,
    element: <RequireAuth><LazyWrapper><NotificationSettingsScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.HELP,
    element: <RequireAuth><LazyWrapper><HelpScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.PRIVACY_POLICY,
    element: <RequireAuth><LazyWrapper><PrivacyPolicyScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.TERMS_OF_SERVICE,
    element: <RequireAuth><LazyWrapper><TermsOfServiceScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.PROFILE_EDIT,
    element: <RequireAuth><LazyWrapper><ProfileEditScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.EMAIL_CHANGE,
    element: <RequireAuth><LazyWrapper><EmailChangeScreenWrapper /></LazyWrapper></RequireAuth>,
  },
  {
    path: ROUTES.PASSWORD_CHANGE,
    element: <RequireAuth><LazyWrapper><PasswordChangeScreenWrapper /></LazyWrapper></RequireAuth>,
  },

  // Fallback route
  {
    path: "*",
    element: <Navigate to={ROUTES.SPLASH} replace />,
  },
]);
