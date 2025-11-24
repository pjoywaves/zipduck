import logo from "@/assets/img/logo.svg";
import { useState } from "react";
import { ChevronLeft, Mail, Lock, User, MapPin, Baby, Home } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface NewSignUpScreenProps {
  onBack: () => void;
  onSignUp: () => void;
  onNavigateToLogin?: () => void;
}

export function NewSignUpScreen({ onBack, onSignUp, onNavigateToLogin }: NewSignUpScreenProps) {
  const [isNewlywed, setIsNewlywed] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold ml-4 text-foreground">회원가입</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Logo & Welcome */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="ZipDuck Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-bold text-foreground mb-2 text-foreground">집덕과 함께</h1>
          <p className="text-muted-foreground">청약을 더 쉽고 빠르게 시작하세요</p>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">이름</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="이름을 입력하세요"
                className="pl-12 h-14 rounded-2xl bg-muted border-border"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">이메일</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="email"
                placeholder="email@example.com"
                className="pl-12 h-14 rounded-2xl bg-muted border-border"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="password"
                placeholder="8자 이상 입력하세요"
                className="pl-12 h-14 rounded-2xl bg-muted border-border"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">비밀번호 확인</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                className="pl-12 h-14 rounded-2xl bg-muted border-border"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">추가 정보 (맞춤 추천용)</h3>

          {/* Newlywed Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💑</span>
              <div>
                <p className="font-medium text-foreground">신혼부부</p>
                <p className="text-xs text-muted-foreground">신혼부부 특별공급 대상</p>
              </div>
            </div>
            <Switch checked={isNewlywed} onCheckedChange={setIsNewlywed} />
          </div>

          {/* Children Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👶</span>
              <div>
                <p className="font-medium text-foreground">자녀 수</p>
                <p className="text-xs text-muted-foreground">가점 계산에 반영</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center font-semibold"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{childrenCount}</span>
              <button
                onClick={() => setChildrenCount(childrenCount + 1)}
                className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-semibold text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Preferred Region */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <MapPin size={16} />
              선호 지역
            </label>
            <Select>
              <SelectTrigger className="h-12 rounded-xl bg-muted border-border">
                <SelectValue placeholder="지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seoul">서울특별시</SelectItem>
                <SelectItem value="gyeonggi">경기도</SelectItem>
                <SelectItem value="incheon">인천광역시</SelectItem>
                <SelectItem value="busan">부산광역시</SelectItem>
                <SelectItem value="daegu">대구광역시</SelectItem>
                <SelectItem value="gwangju">광주광역시</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm leading-relaxed">
              <span className="font-medium text-foreground">(필수)</span> 서비스 이용약관에 동의합니다
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="privacy"
              checked={agreedToPrivacy}
              onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="privacy" className="text-sm leading-relaxed">
              <span className="font-medium text-foreground">(필수)</span> 개인정보 처리방침에 동의합니다
            </label>
          </div>
        </div>

        {/* Sign Up Button */}
        <Button
          onClick={onSignUp}
          disabled={!agreedToTerms || !agreedToPrivacy}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg"
        >
          회원가입
        </Button>

        {/* Social Login */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-background text-muted-foreground text-sm">또는</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl border-border hover:bg-muted"
          >
            <span className="text-2xl mr-3">🌐</span>
            <span className="font-semibold text-foreground">Google로 시작하기</span>
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl border-border hover:bg-muted"
            style={{ backgroundColor: "#FEE500", borderColor: "#FEE500" }}
          >
            <span className="text-2xl mr-3">💬</span>
            <span className="font-semibold text-foreground">카카오로 시작하기</span>
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center pt-4">
          <button
            onClick={onNavigateToLogin}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            이미 계정이 있으신가요? <span className="text-primary font-semibold hover:text-primary/80">로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}
