import { useState } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { NewOnboardingScreen } from "./components/NewOnboardingScreen";
import { NewSignUpScreen } from "./components/NewSignUpScreen";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen } from "./components/HomeScreen";
import { SearchScreen } from "./components/SearchScreen";
import { DetailScreenNew } from "./components/DetailScreenNew";
import { MyPageScreen } from "./components/MyPageScreen";
import { AIChatScreen } from "./components/AIChatScreen";
import { AIRecommendationScreen } from "./components/AIRecommendationScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { AppearanceScreen } from "./components/AppearanceScreen";
import { NotificationScreen } from "./components/NotificationScreen";
import { CustomFilterScreen } from "./components/CustomFilterScreen";
import { RegionMapScreen } from "./components/RegionMapScreen";
import { AnalyticsScreen } from "./components/AnalyticsScreen";
import { AnnouncementScreen } from "./components/AnnouncementScreen";
import { DistanceMapScreen } from "./components/DistanceMapScreen";
import { AIConsultScreen } from "./components/AIConsultScreen";
import { NewFavoritesScreen } from "./components/NewFavoritesScreen";
import { CalendarScreen } from "./components/CalendarScreen";
import { AIRecommendBestScreen } from "./components/AIRecommendBestScreen";
import { RegionPreferenceScreen } from "./components/RegionPreferenceScreen";
import { NotificationSettingsScreen } from "./components/NotificationSettingsScreen";
import { SettingsDetailScreen } from "./components/SettingsDetailScreen";
import { HelpScreen } from "./components/HelpScreen";
import { PrivacyPolicyScreen } from "./components/PrivacyPolicyScreen";
import { TermsOfServiceScreen } from "./components/TermsOfServiceScreen";
import { ProfileEditScreen } from "./components/ProfileEditScreen";
import { EmailChangeScreen } from "./components/EmailChangeScreen";
import { PasswordChangeScreen } from "./components/PasswordChangeScreen";
import { TabBar } from "./components/TabBar";

type Screen =
  | "splash"
  | "onboarding"
  | "signup"
  | "login"
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
  | "password-change";

type Tab = "home" | "search" | "favorites" | "mypage";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [currentTab, setCurrentTab] = useState<Tab>("home");

  const handleSplashComplete = () => {
    setCurrentScreen("onboarding");
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen("signup");
  };

  const handleSignUp = () => {
    setCurrentScreen("home");
  };

  const handleLogin = () => {
    setCurrentScreen("home");
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
  };

  const handleNavigateToFilter = () => {
    setCurrentScreen("filter");
  };

  const handleNavigateToRegionMap = () => {
    setCurrentScreen("region-map");
  };

  const handleNavigateToAnalytics = () => {
    setCurrentScreen("analytics");
  };

  const handleNavigateToAnnouncement = () => {
    setCurrentScreen("announcement");
  };

  const handleNavigateToDistanceMap = () => {
    setCurrentScreen("distance-map");
  };

  const handleNavigateToAIConsult = () => {
    setCurrentScreen("ai-consult");
  };

  const handleNavigateToCalendar = () => {
    setCurrentScreen("calendar");
  };

  const handleNavigateToAIBest = () => {
    setCurrentScreen("ai-best");
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

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onComplete={handleSplashComplete} />;
      case "onboarding":
        return <NewOnboardingScreen onComplete={handleOnboardingComplete} />;
      case "signup":
        return <NewSignUpScreen onBack={() => setCurrentScreen("login")} onSignUp={handleSignUp} />;
      case "login":
        return <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setCurrentScreen("signup")} />;
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
        return <SettingsScreen 
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
        />;
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
      default:
        return <HomeScreen onNavigateToDetail={handleNavigateToDetail} onNavigateToAI={handleNavigateToAI} onNavigateToChat={handleNavigateToChat} />;
    }
  };

  const showTabBar = ["home", "search", "favorites", "mypage"].includes(currentScreen);

  return (
    <div className="relative">
      {renderScreen()}
      {showTabBar && <TabBar currentTab={currentTab} onTabChange={handleTabChange} />}

      {/* Quick Access FAB for Demo Navigation */}
      {showTabBar && (
        <div className="fixed bottom-24 right-6 z-50 max-w-md mx-auto">
          <div className="relative group">
            <button className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg flex items-center justify-center transition-all">
              <span className="text-2xl">🎯</span>
            </button>
            
            {/* Demo Menu */}
            <div className="absolute bottom-16 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-card border border-border rounded-2xl shadow-xl p-3 w-64 space-y-1 max-h-[70vh] overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground px-3 py-1 sticky top-0 bg-card">🚀 Demo Screens</p>
              <button onClick={handleNavigateToNotifications} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                📬 알림함
              </button>
              <button onClick={handleNavigateToFilter} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                🎚️ 맞춤 필터
              </button>
              <button onClick={handleNavigateToRegionMap} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                🗺️ 지역별 청약
              </button>
              <button onClick={handleNavigateToAnalytics} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                📊 데이터 분석
              </button>
              <button onClick={handleNavigateToAnnouncement} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                📢 공지사항
              </button>
              <button onClick={handleNavigateToDistanceMap} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                📍 거리 분석
              </button>
              <button onClick={handleNavigateToAIConsult} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                ✨ AI 상담 (고급)
              </button>
              <button onClick={handleNavigateToCalendar} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                📅 청약 캘린더
              </button>
              <button onClick={handleNavigateToAIBest} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                🏆 AI BEST 3
              </button>
              <button onClick={handleNavigateToSettings} className="w-full text-left px-3 py-2 hover:bg-muted rounded-xl text-sm">
                ⚙️ 설정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}