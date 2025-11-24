import { useState } from "react";
import { ChevronLeft, Bell, User, Lock, Mail, LogOut, Palette, ChevronRight, MapPin, HelpCircle, Shield, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateToAppearance?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToRegionPreference?: () => void;
  onNavigateToNotificationSettings?: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToPrivacyPolicy?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToEmailChange?: () => void;
  onNavigateToPasswordChange?: () => void;
  onLogout?: () => void;
}

export function SettingsScreen({
  onBack,
  onNavigateToAppearance,
  onNavigateToProfile,
  onNavigateToRegionPreference,
  onNavigateToNotificationSettings,
  onNavigateToHelp,
  onNavigateToPrivacyPolicy,
  onNavigateToTerms,
  onNavigateToEmailChange,
  onNavigateToPasswordChange,
  onLogout
}: SettingsScreenProps) {
  const [pushNotifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold ml-4 text-foreground">설정</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Appearance Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">화면 설정</h3>
          
          {/* Theme Button */}
          <button 
            onClick={onNavigateToAppearance}
            className="w-full bg-card border border-border rounded-2xl p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette size={20} className="text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">테마 설정</p>
                  <p className="text-xs text-muted-foreground">Blue Theme · Light/Dark 모드</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Account Management */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">계정 관리</h3>
          
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            <button 
              onClick={onNavigateToEmailChange}
              className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-2xl"
            >
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">이메일 변경</p>
                  <p className="text-xs text-muted-foreground">zipduck@example.com</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>

            <button 
              onClick={onNavigateToPasswordChange}
              className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">비밀번호 변경</p>
                  <p className="text-xs text-muted-foreground">마지막 변경: 2025.10.15</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>

            <button 
              onClick={onNavigateToProfile}
              className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-b-2xl"
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">프로필 관리</p>
                  <p className="text-xs text-muted-foreground">개인정보 수정</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Region Preference */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">지역 설정</h3>
          
          <button 
            onClick={onNavigateToRegionPreference}
            className="w-full bg-card border border-border rounded-2xl p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">관심 지역 설정</p>
                  <p className="text-xs text-muted-foreground">선호 지역 관리</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">알림 관리</h3>
          
          <button 
            onClick={onNavigateToNotificationSettings}
            className="w-full bg-card border border-border rounded-2xl p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">알림 설정</p>
                  <p className="text-xs text-muted-foreground">알림 유형별 관리</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Help and Support */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">도움말 및 지원</h3>
          
          <button 
            onClick={onNavigateToHelp}
            className="w-full bg-card border border-border rounded-2xl p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">도움말</p>
                  <p className="text-xs text-muted-foreground">자주 묻는 질문</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">약관 및 정책</h3>
          
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            <button 
              onClick={onNavigateToPrivacyPolicy}
              className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-2xl"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">개인정보 처리방침</p>
                  <p className="text-xs text-muted-foreground">개인정보 보호 정책</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>

            <button 
              onClick={onNavigateToTerms}
              className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-b-2xl"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">서비스 이용약관</p>
                  <p className="text-xs text-muted-foreground">서비스 약관 및 정책</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full h-14 rounded-2xl border-border hover:bg-muted font-semibold"
          >
            <LogOut size={20} className="mr-2" />
            로그아웃
          </Button>

          <button className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors">
            회원 탈퇴
          </button>
        </div>

        {/* App Info */}
        <div className="pt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">집덕 v1.0.0</p>
          <p className="text-xs text-muted-foreground">© 2025 집덕. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
