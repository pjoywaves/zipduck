import { ChevronLeft, Sun, Moon, Monitor, Smartphone } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface AppearanceScreenProps {
  onBack: () => void;
}

export function AppearanceScreen({ onBack }: AppearanceScreenProps) {
  const { themeMode, setThemeMode, currentTheme } = useTheme();

  const handleThemeChange = (mode: "light" | "dark" | "system") => {
    setThemeMode(mode);
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold ml-4 text-foreground">화면 설정</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Description */}
        <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/5 dark:to-slate-800 border border-primary/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Smartphone size={24} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Blue Theme 인터페이스</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                눈에 편안한 Blue Theme 기반 인터페이스를 제공합니다.
                밝은 화면과 어두운 화면 중 선호하는 테마를 선택하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Current Theme Indicator */}
        <div className="bg-muted/50 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">현재 적용된 테마</span>
          <span className="text-sm font-semibold text-primary">
            {currentTheme === "light" ? "라이트 모드" : "다크 모드"}
          </span>
        </div>

        {/* Theme Options */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">테마 선택</h3>
          <div className="space-y-3">
            {/* Light Mode */}
            <button
              onClick={() => handleThemeChange("light")}
              className={`w-full p-5 rounded-2xl border-2 transition-all ${
                themeMode === "light"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    themeMode === "light" ? "bg-primary" : "bg-muted"
                  }`}>
                    <Sun size={24} className={themeMode === "light" ? "text-white" : "text-muted-foreground"} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">라이트 모드</p>
                    <p className="text-sm text-muted-foreground">밝은 화면</p>
                  </div>
                </div>
                {themeMode === "light" && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13 4L6 11L3 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => handleThemeChange("dark")}
              className={`w-full p-5 rounded-2xl border-2 transition-all ${
                themeMode === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    themeMode === "dark" ? "bg-primary" : "bg-muted"
                  }`}>
                    <Moon size={24} className={themeMode === "dark" ? "text-white" : "text-muted-foreground"} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">다크 모드</p>
                    <p className="text-sm text-muted-foreground">어두운 화면</p>
                  </div>
                </div>
                {themeMode === "dark" && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13 4L6 11L3 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Auto Mode */}
            <button
              onClick={() => handleThemeChange("system")}
              className={`w-full p-5 rounded-2xl border-2 transition-all ${
                themeMode === "system"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    themeMode === "system" ? "bg-primary" : "bg-muted"
                  }`}>
                    <Monitor size={24} className={themeMode === "system" ? "text-white" : "text-muted-foreground"} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">자동</p>
                    <p className="text-sm text-muted-foreground">시스템 설정 따르기</p>
                  </div>
                </div>
                {themeMode === "system" && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13 4L6 11L3 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Preview Samples */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">미리보기</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Light Preview */}
            <div className={`rounded-2xl overflow-hidden border-2 ${currentTheme === "light" ? "border-primary" : "border-border"}`}>
              <div className="bg-white p-4 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-blue-500 rounded-lg mt-3"></div>
              </div>
              <div className="bg-slate-50 px-3 py-2 border-t border-slate-200">
                <p className="text-xs text-center text-slate-600">라이트</p>
              </div>
            </div>

            {/* Dark Preview */}
            <div className={`rounded-2xl overflow-hidden border-2 ${currentTheme === "dark" ? "border-primary" : "border-border"}`}>
              <div className="bg-slate-900 p-4 space-y-2">
                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                <div className="h-8 bg-blue-500 rounded-lg mt-3"></div>
              </div>
              <div className="bg-slate-800 px-3 py-2 border-t border-slate-700">
                <p className="text-xs text-center text-slate-300">다크</p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette Info */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">컬러 시스템</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Primary Blue</p>
                <p className="text-xs text-muted-foreground">#3B82F6</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#34D399' }}></div>
              <div>
                <p className="text-sm font-medium text-foreground">Mint Harmony</p>
                <p className="text-xs text-muted-foreground">#34D399</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#FACC15' }}></div>
              <div>
                <p className="text-sm font-medium text-foreground">Yellow Accent</p>
                <p className="text-xs text-muted-foreground">#FACC15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info about localStorage */}
        <div className="bg-blue-soft-bg dark:bg-card rounded-xl p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            선택한 테마는 자동으로 저장되며, 다음에 앱을 열 때도 유지됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
