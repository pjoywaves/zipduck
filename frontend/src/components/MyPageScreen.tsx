import logo from "@/assets/img/logo.svg";
import { ChevronRight, User, MapPin, Bell, Settings, HelpCircle, LogOut, Home } from "lucide-react";

interface MyPageScreenProps {
  onNavigateToSettings: () => void;
}

export function MyPageScreen({ onNavigateToSettings }: MyPageScreenProps) {
  const menuItems = [
    {
      icon: MapPin,
      label: "관심 지역 설정",
      badge: "2개",
      emoji: "📍",
      action: () => {}
    },
    {
      icon: Bell,
      label: "알림 설정",
      badge: null,
      emoji: "🔔",
      action: () => {}
    },
    {
      icon: Settings,
      label: "설정",
      badge: null,
      emoji: "⚙️",
      action: onNavigateToSettings
    },
    {
      icon: HelpCircle,
      label: "도움말",
      badge: null,
      emoji: "❓",
      action: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-6 pb-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <img src={logo} alt="ZipDuck Logo" className="w-8 h-8 object-contain" />
          <h2 className="font-bold text-foreground">마이페이지</h2>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-primary to-blue-400 dark:from-primary dark:to-blue-600 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-md">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h3 className="text-white mb-1 font-bold">김청약님</h3>
              <p className="text-sm text-white/80">zipduck@example.com</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
            <div>
              <p className="text-xs text-white/70 mb-1">신혼부부</p>
              <p className="text-sm text-white font-semibold">해당</p>
            </div>
            <div>
              <p className="text-xs text-white/70 mb-1">자녀수</p>
              <p className="text-sm text-white font-semibold">1명</p>
            </div>
            <div>
              <p className="text-xs text-white/70 mb-1">관심지역</p>
              <p className="text-sm text-white font-semibold">2곳</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
                onClick={item.action}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-primary" />
                  <span className="text-foreground font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-sm text-primary font-semibold">{item.badge}</span>
                  )}
                  <ChevronRight size={20} className="text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-muted-foreground font-medium">버전 정보</span>
            <span className="text-sm text-foreground font-semibold">1.0.0</span>
          </div>
          <button className="w-full flex items-center justify-between px-6 py-4 border-t border-border hover:bg-muted transition-colors">
            <span className="text-sm text-muted-foreground font-medium">개인정보 처리방침</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between px-6 py-4 border-t border-border hover:bg-muted transition-colors">
            <span className="text-sm text-muted-foreground font-medium">서비스 이용약관</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 py-4 text-muted-foreground hover:text-destructive transition-colors font-medium">
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
}