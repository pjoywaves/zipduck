import { ChevronLeft, ChevronRight, User, Palette, Globe, Shield, FileText, LogOut } from "lucide-react";

interface SettingsDetailScreenProps {
  onBack: () => void;
  onNavigateToAppearance?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToTerms?: () => void;
}

export function SettingsDetailScreen({ 
  onBack, 
  onNavigateToAppearance,
  onNavigateToPrivacy,
  onNavigateToTerms 
}: SettingsDetailScreenProps) {
  const settingsSections = [
    {
      title: "계정",
      items: [
        {
          icon: User,
          label: "계정 관리",
          description: "프로필, 비밀번호 변경",
          onClick: () => console.log("Navigate to account"),
          color: "text-primary"
        }
      ]
    },
    {
      title: "앱 설정",
      items: [
        {
          icon: Palette,
          label: "화면 설정",
          description: "다크 모드, 라이트 모드",
          onClick: onNavigateToAppearance,
          color: "text-purple-500"
        },
        {
          icon: Globe,
          label: "언어 설정",
          description: "한국어",
          onClick: () => console.log("Navigate to language"),
          color: "text-blue-500"
        }
      ]
    },
    {
      title: "개인정보 및 약관",
      items: [
        {
          icon: Shield,
          label: "개인정보 보호",
          description: "데이터 관리 및 보안",
          onClick: onNavigateToPrivacy,
          color: "text-green-500"
        },
        {
          icon: FileText,
          label: "약관 및 정책",
          description: "서비스 이용약관, 개인정보 처리방침",
          onClick: onNavigateToTerms,
          color: "text-yellow-600"
        }
      ]
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
          <h2 className="flex-1 text-center font-bold pr-10">설정</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              {section.title}
            </h3>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between p-5 hover:bg-muted transition-colors ${
                      itemIndex !== section.items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className={item.color} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-foreground mb-0.5">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">집덕 (집덕)</p>
            <p className="text-xs text-muted-foreground">버전 1.0.0</p>
            <p className="text-xs text-muted-foreground">© 2024 집덕. All rights reserved.</p>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-card border border-border rounded-2xl p-5 hover:bg-muted transition-colors flex items-center justify-center gap-2">
          <LogOut size={20} className="text-destructive" />
          <span className="font-semibold text-destructive">로그아웃</span>
        </button>
      </div>
    </div>
  );
}
