import { useState } from "react";
import { ChevronLeft, Mail, Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

interface FindAccountScreenProps {
  onBack: () => void;
}

const emailSchema = z.string().email("올바른 이메일 형식을 입력해주세요");

export function FindAccountScreen({ onBack }: FindAccountScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      const result = emailSchema.safeParse(e.target.value);
      if (result.success) {
        setError("");
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
          <div className="flex items-center px-6 py-4">
            <button onClick={onBack} className="p-2 -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold ml-4 text-foreground">계정 찾기</h2>
          </div>
        </div>

        {/* Success Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-4 text-center">
            이메일을 확인해주세요
          </h2>
          <p className="text-muted-foreground text-center leading-relaxed mb-8">
            <span className="text-primary font-semibold">{email}</span>으로<br />
            계정 복구 링크를 발송했습니다.
          </p>
          <Button
            onClick={onBack}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            로그인으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold ml-4 text-foreground">계정 찾기</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={36} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground text-center mb-2">
            계정을 찾고 계신가요?
          </h1>
          <p className="text-muted-foreground text-center leading-relaxed">
            가입 시 사용한 이메일을 입력하시면<br />
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        {/* Email Input */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="이메일을 입력하세요"
                className={`pl-12 h-14 rounded-2xl ${error ? "border-destructive" : "border-border"}`}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                확인 중...
              </div>
            ) : (
              "계정 찾기"
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-muted/50 rounded-2xl p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            이메일을 받지 못하셨나요?
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• 스팸 폴더를 확인해주세요</li>
            <li>• 입력한 이메일 주소가 정확한지 확인해주세요</li>
            <li>• 몇 분 후 다시 시도해주세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
