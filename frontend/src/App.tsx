import { useState } from "react";
// Auth pages
import { SplashScreen } from "./pages/auth/SplashScreen";
import { NewOnboardingScreen } from "./pages/auth/NewOnboardingScreen";
import { NewSignUpScreen } from "./pages/auth/NewSignUpScreen";
import { LoginScreen } from "./pages/auth/LoginScreen";
import { FindAccountScreen } from "./pages/auth/FindAccountScreen";
// Home and subscription pages
import { HomeScreen } from "./pages/home/HomeScreen";
import { SearchScreen } from "./pages/subscriptions/SearchScreen";
import { DetailScreenNew } from "./pages/subscriptions/DetailScreenNew";
import { NewFavoritesScreen } from "./pages/subscriptions/NewFavoritesScreen";
// Profile pages
import { MyPageScreen } from "./pages/profile/MyPageScreen";
import { ProfileEditScreen } from "./pages/profile/ProfileEditScreen";
// AI pages
import { AIChatScreen } from "./pages/ai/AIChatScreen";
import { AIRecommendationScreen } from "./pages/ai/AIRecommendationScreen";
import { AIConsultScreen } from "./pages/ai/AIConsultScreen";
import { AIRecommendBestScreen } from "./pages/ai/AIRecommendBestScreen";
// Settings pages
import { SettingsScreen } from "./pages/settings/SettingsScreen";
import { AppearanceScreen } from "./pages/settings/AppearanceScreen";
import { RegionPreferenceScreen } from "./pages/settings/RegionPreferenceScreen";
import { NotificationSettingsScreen } from "./pages/settings/NotificationSettingsScreen";
import { HelpScreen } from "./pages/settings/HelpScreen";
import { PrivacyPolicyScreen } from "./pages/settings/PrivacyPolicyScreen";
import { TermsOfServiceScreen } from "./pages/settings/TermsOfServiceScreen";
import { EmailChangeScreen } from "./pages/settings/EmailChangeScreen";
import { PasswordChangeScreen } from "./pages/settings/PasswordChangeScreen";
// Common pages
import { NotificationScreen } from "./pages/common/NotificationScreen";
import { CustomFilterScreen } from "./pages/common/CustomFilterScreen";
import { RegionMapScreen } from "./pages/common/RegionMapScreen";
import { AnalyticsScreen } from "./pages/common/AnalyticsScreen";
import { AnnouncementScreen } from "./pages/common/AnnouncementScreen";
import { DistanceMapScreen } from "./pages/common/DistanceMapScreen";
import { CalendarScreen } from "./pages/common/CalendarScreen";
// Components
import { SettingsDetailScreen } from "./components/SettingsDetailScreen";
import { ProfileFormDemo } from "./components/ProfileFormDemo";
import { TabBar } from "./components/TabBar";
import { X } from "lucide-react";

type Screen =
  | "splash"
  | "onboarding"
  | "signup"
  | "login"
  | "find-account"
  | "home"
  | "search"
  | "favorites"
  | "mypage"
  | "detail"
  | "ai-recommendation"
  | "ai-chat"
  | "settings"
  | "appearance"
  | "notifications"
  | "filter"
  | "region-map"
  | "analytics"
  | "announcement"
  | "distance-map"
  | "ai-consult"
  | "calendar"
  | "ai-best"
  | "region-preference"
  | "notification-settings"
  | "settings-detail"
  | "help"
  | "privacy-policy"
  | "terms-of-service"
  | "profile-edit"
  | "email-change"
  | "password-change"
  | "profile-demo";

type Tab = "home" | "search" | "favorites" | "mypage";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  const handleSplashComplete = () => {
    setCurrentScreen("onboarding");
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen("login");
  };

  const handleSignUp = () => {
    setCurrentScreen("home");
  };

  const handleLogin = () => {
    // Save auth token to localStorage (simulated)
    localStorage.setItem("zipduck-auth-token", "demo-token");
    setCurrentScreen("home");
  };

  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem("zipduck-auth-token");
    // Reset to login screen
    setCurrentScreen("login");
    setCurrentTab("home");
  };

  const handleNavigateToDetail = () => {
    setCurrentScreen("detail");
  };

  const handleNavigateToAI = () => {
    setCurrentScreen("ai-recommendation");
  };

  const handleNavigateToChat = () => {
    setCurrentScreen("ai-chat");
  };

  const handleNavigateToSettings = () => {
    setCurrentScreen("settings");
  };

  const handleNavigateToAppearance = () => {
    setCurrentScreen("appearance");
  };

  const handleNavigateToNotifications = () => {
    setCurrentScreen("notifications");
    setIsDemoMenuOpen(false);
  };

  const handleNavigateToFilter = () => {
    setCurrentScreen("filter");
    setIsDemoMenuOpen(false);
  };

  const handleNavigateToRegionMap = () => {
    setCurrentScreen("region-map");
    setIsDemoMenuOpen(false);
  };

  const handleNavigateToAnalytics = () => {
    setCurrentScreen("analytics");
    setIsDemoMenuOpen(false);
  };

  const handleNavigateToAnnouncement = () => {
    setCurrentScreen("announcement");
    setIsDemoMenuOpen(false);
  };

  const handleNavigateToDistanceMap = () => {
    setCurrentScreen("distance-map");
    setIsDemoMenuOpen(false);
  };

  const handleNavigateToAIConsult = () => {
    setCurrentScreen("ai-consult");
    setIsDemoMenuOpen(false);
  };

  const handleNavigateToCalendar = () => {
    setCurrentScreen("calendar");
    setIsDemoMenuOpen(false);
  };

  const handleNavigateToAIBest = () => {
    setCurrentScreen("ai-best");
    setIsDemoMenuOpen(false);
  };

  const handleTabChange = (tab: string) => {
    const typedTab = tab as Tab;
    setCurrentTab(typedTab);
    const screenMap: Record<Tab, Screen> = {
      home: "home",
      search: "search",
      favorites: "favorites",
      mypage: "mypage"
    };
    setCurrentScreen(screenMap[typedTab]);
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setCurrentTab("home");
  };

  const handleBackToMyPage = () => {
    setCurrentScreen("mypage");
    setCurrentTab("mypage");
  };

  const handleBackToSettings = () => {
    setCurrentScreen("settings");
  };

  const handleBackToLogin = () => {
    setCurrentScreen("login");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onComplete={handleSplashComplete} />;
      case "onboarding":
        return <NewOnboardingScreen onComplete={handleOnboardingComplete} />;
      case "signup":
        return (
          <NewSignUpScreen
            onBack={() => setCurrentScreen("login")}
            onSignUp={handleSignUp}
            onNavigateToLogin={() => setCurrentScreen("login")}
          />
        );
      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToSignUp={() => setCurrentScreen("signup")}
            onNavigateToFindAccount={() => setCurrentScreen("find-account")}
          />
        );
      case "find-account":
        return <FindAccountScreen onBack={handleBackToLogin} />;
      case "home":
        return (
          <HomeScreen
            onNavigateToDetail={handleNavigateToDetail}
            onNavigateToAI={handleNavigateToAI}
            onNavigateToChat={handleNavigateToChat}
          />
        );
      case "search":
        return <SearchScreen onNavigateToDetail={handleNavigateToDetail} />;
      case "favorites":
        return <NewFavoritesScreen onNavigateToDetail={handleNavigateToDetail} />;
      case "mypage":
        return <MyPageScreen onNavigateToSettings={handleNavigateToSettings} />;
      case "detail":
        return <DetailScreenNew onBack={handleBackToHome} />;
      case "ai-recommendation":
        return <AIRecommendationScreen onBack={handleBackToHome} />;
      case "ai-chat":
        return <AIChatScreen onBack={handleBackToHome} />;
      case "settings":
        return (
          <SettingsScreen
            onBack={handleBackToMyPage}
            onNavigateToAppearance={handleNavigateToAppearance}
            onNavigateToProfile={() => setCurrentScreen("profile-edit")}
            onNavigateToRegionPreference={() => setCurrentScreen("region-preference")}
            onNavigateToNotificationSettings={() => setCurrentScreen("notification-settings")}
            onNavigateToHelp={() => setCurrentScreen("help")}
            onNavigateToPrivacyPolicy={() => setCurrentScreen("privacy-policy")}
            onNavigateToTerms={() => setCurrentScreen("terms-of-service")}
            onNavigateToEmailChange={() => setCurrentScreen("email-change")}
            onNavigateToPasswordChange={() => setCurrentScreen("password-change")}
            onLogout={handleLogout}
          />
        );
      case "appearance":
        return <AppearanceScreen onBack={handleBackToSettings} />;
      case "notifications":
        return <NotificationScreen onBack={handleBackToHome} />;
      case "filter":
        return <CustomFilterScreen onBack={handleBackToHome} />;
      case "region-map":
        return <RegionMapScreen onBack={handleBackToHome} onNavigateToDetail={handleNavigateToDetail} />;
      case "analytics":
        return <AnalyticsScreen onBack={handleBackToHome} />;
      case "announcement":
        return <AnnouncementScreen onBack={handleBackToMyPage} />;
      case "distance-map":
        return <DistanceMapScreen onBack={handleBackToHome} />;
      case "ai-consult":
        return <AIConsultScreen onBack={handleBackToHome} />;
      case "calendar":
        return <CalendarScreen onBack={handleBackToHome} />;
      case "ai-best":
        return <AIRecommendBestScreen onBack={handleBackToHome} onNavigateToDetail={handleNavigateToDetail} />;
      case "region-preference":
        return <RegionPreferenceScreen onBack={handleBackToSettings} />;
      case "notification-settings":
        return <NotificationSettingsScreen onBack={handleBackToSettings} />;
      case "settings-detail":
        return <SettingsDetailScreen onBack={handleBackToSettings} />;
      case "help":
        return <HelpScreen onBack={handleBackToSettings} />;
      case "privacy-policy":
        return <PrivacyPolicyScreen onBack={handleBackToSettings} />;
      case "terms-of-service":
        return <TermsOfServiceScreen onBack={handleBackToSettings} />;
      case "profile-edit":
        return <ProfileEditScreen onBack={handleBackToSettings} />;
      case "email-change":
        return <EmailChangeScreen onBack={handleBackToSettings} />;
      case "password-change":
        return <PasswordChangeScreen onBack={handleBackToSettings} />;
      case "profile-demo":
        return <ProfileFormDemo onBack={handleBackToHome} />;
      default:
        return <HomeScreen onNavigateToDetail={handleNavigateToDetail} onNavigateToAI={handleNavigateToAI} onNavigateToChat={handleNavigateToChat} />;
    }
  };

  const showTabBar = ["home", "search", "favorites", "mypage"].includes(currentScreen);

  return (
    <div className="relative">
      {renderScreen()}
      {showTabBar && <TabBar currentTab={currentTab} onTabChange={handleTabChange} />}

      {/* Quick Access FAB for Demo Navigation - Click to Toggle */}
      {showTabBar && (
        <>
          {/* Overlay */}
          {isDemoMenuOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsDemoMenuOpen(false)}
            />
          )}

          <div className="fixed bottom-24 right-6 z-50 max-w-md mx-auto">
            {/* Demo Menu - Click to Toggle */}
            <div
              className={`absolute bottom-16 right-0 transition-all duration-300 bg-card border border-border rounded-2xl shadow-xl p-3 w-64 space-y-1 max-h-[70vh] overflow-y-auto ${
                isDemoMenuOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-border mb-2">
                <span className="text-sm font-semibold text-foreground">Demo Menu</span>
                <button
                  onClick={() => setIsDemoMenuOpen(false)}
                  className="p-1 hover:bg-muted rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <button onClick={handleNavigateToNotifications} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                📬 알림함
              </button>
              <button onClick={handleNavigateToFilter} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                🎚️ 맞춤 필터
              </button>
              <button onClick={handleNavigateToRegionMap} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                🗺️ 지역별 청약
              </button>
              <button onClick={handleNavigateToAnalytics} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                📊 데이터 분석
              </button>
              <button onClick={handleNavigateToAnnouncement} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                📢 공지사항
              </button>
              <button onClick={handleNavigateToDistanceMap} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                📍 거리 분석
              </button>
              <button onClick={handleNavigateToAIConsult} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                ✨ AI 상담 (고급)
              </button>
              <button onClick={handleNavigateToCalendar} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                📅 청약 캘린더
              </button>
              <button onClick={handleNavigateToAIBest} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground">
                🏆 AI BEST 3
              </button>
              <button
                onClick={() => {
                  setCurrentScreen("profile-demo");
                  setIsDemoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground"
              >
                🧪 프로필 폼 (TanStack Query)
              </button>
              <button
                onClick={() => {
                  handleNavigateToSettings();
                  setIsDemoMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm text-foreground"
              >
                ⚙️ 설정
              </button>
            </div>

            {/* FAB Button */}
            <button
              onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
              className={`w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg flex items-center justify-center transition-all ${
                isDemoMenuOpen ? "rotate-45" : ""
              }`}
            >
              <span className="text-2xl">{isDemoMenuOpen ? "✕" : "🎯"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function App() {
  return <AppContent />;
}
