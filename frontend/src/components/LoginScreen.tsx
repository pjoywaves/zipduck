import logo from "@/assets/img/logo.svg";
import { useState } from "react";
import { Button } from "./ui/button";
import { Eye, EyeOff, Mail, Lock, Home } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateToSignUp?: () => void;
}

export function LoginScreen({ onLogin, onNavigateToSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full space-y-8">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <img src={logo} alt="ZipDuck Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="mb-2 font-bold text-foreground">집덕</h1>
          <p className="text-muted-foreground">청약을 더 쉽고 빠르게</p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">이메일</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="이메일을 입력하세요"
                className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">비밀번호</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="비밀번호를 입력하세요"
                className="w-full h-12 pl-12 pr-12 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              비밀번호 찾기
            </button>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-primary hover:bg-primary/90 dark:bg-[#2563EB] dark:hover:bg-[#2563EB]/90 text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            로그인하기
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-[#F8FAFC] dark:bg-[#0F172A] text-muted-foreground text-sm">소셜 로그인</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Kakao Login */}
          <button
            className="w-full h-12 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: "#FEE500",
              color: "#000000"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.73 1.779 5.128 4.456 6.583l-1.158 4.25c-.09.33.224.613.532.48l5.058-2.18c.372.03.748.046 1.112.046 5.523 0 10-3.477 10-7.75S17.523 3 12 3z"/>
            </svg>
            카카오로 시작하기
          </button>

          {/* Google Login */}
          <button
            className="w-full h-12 rounded-xl font-semibold transition-all border-2 border-border hover:border-primary bg-card hover:bg-muted flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 시작하기
          </button>

          {/* Apple Login */}
          <button
            className="w-full h-12 rounded-xl font-semibold transition-all border-2 border-border hover:border-primary bg-card hover:bg-muted flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple로 시작하기
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center pt-4">
          <button 
            onClick={onNavigateToSignUp}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            계정이 없으신가요?{" "}
            <span className="text-primary font-semibold hover:text-primary/80">
              회원가입
            </span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            © 2025 집덕. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
