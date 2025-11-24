import { useState } from "react";
import { ChevronLeft, Bell, MapPin, Sparkles, Settings } from "lucide-react";
import { Switch } from "./ui/switch";

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

export function NotificationSettingsScreen({ onBack }: NotificationSettingsScreenProps) {
  const [settings, setSettings] = useState({
    subscription: true,
    regionUpdate: true,
    recommendation: false,
    system: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const notificationItems = [
    {
      key: "subscription" as const,
      icon: Bell,
      title: "청약 알림",
      description: "새로운 청약 공고 및 마감 임박 알림",
      color: "text-primary"
    },
    {
      key: "regionUpdate" as const,
      icon: MapPin,
      title: "관심지역 업데이트 알림",
      description: "설정한 관심 지역의 청약 소식",
      color: "text-green-500"
    },
    {
      key: "recommendation" as const,
      icon: Sparkles,
      title: "추천 알림",
      description: "AI 맞춤 청약 추천 및 분석 정보",
      color: "text-yellow-500"
    },
    {
      key: "system" as const,
      icon: Settings,
      title: "시스템 알림",
      description: "앱 업데이트 및 중요 공지사항",
      color: "text-muted-foreground"
    }
  ];

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center font-bold pr-10">알림 설정</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header Info */}
        <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/10 dark:to-blue-900/30 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">알림 관리</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                원하는 알림만 받아보세요. 언제든 설정을 변경할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-3">
          {notificationItems.map((item) => {
            const Icon = item.icon;
            const isEnabled = settings[item.key];
            
            return (
              <div
                key={item.key}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isEnabled 
                        ? "bg-primary/10 dark:bg-primary/20" 
                        : "bg-muted"
                    }`}>
                      <Icon size={20} className={isEnabled ? item.color : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleSetting(item.key)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-blue-soft-bg dark:bg-card rounded-xl p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">💡 알림 권한</span>이 꺼져있다면 
            기기 설정에서 집덕 앱의 알림을 허용해주세요.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">
              {Object.values(settings).filter(Boolean).length}
            </p>
            <p className="text-sm text-muted-foreground">활성화된 알림</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground mb-1">24</p>
            <p className="text-sm text-muted-foreground">이번 주 알림</p>
          </div>
        </div>
      </div>
    </div>
  );
}
