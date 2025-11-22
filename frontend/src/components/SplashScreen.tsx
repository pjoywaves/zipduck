import logo from "@/assets/img/logo.svg";
import { useEffect } from "react";
import { Home } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col items-center justify-center max-w-md mx-auto relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-40 h-40 bg-mint/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Logo Container */}
      <div className="relative z-10 animate-[fadeInScale_1s_ease-out]">
        <div className="mb-8 relative flex items-center justify-center">
          <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
            <img src={logo} alt="ZipDuck Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        
        {/* App Name */}
        <div className="text-center">
          <h1 className="font-bold text-foreground mb-2">집덕</h1>
          <p className="text-muted-foreground">청약을 쉽고 빠르게</p>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
