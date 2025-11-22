import { useState } from "react";
import { ChevronLeft, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface EmailChangeScreenProps {
  onBack: () => void;
}

export function EmailChangeScreen({ onBack }: EmailChangeScreenProps) {
  const [currentEmail] = useState("zipduck@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errors, setErrors] = useState<{ newEmail?: string; confirmEmail?: string }>({});
  const [touched, setTouched] = useState<{ newEmail?: boolean; confirmEmail?: boolean }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewEmailBlur = () => {
    setTouched({ ...touched, newEmail: true });
    if (!newEmail) {
      setErrors({ ...errors, newEmail: "새 이메일을 입력해주세요" });
    } else if (!validateEmail(newEmail)) {
      setErrors({ ...errors, newEmail: "올바른 이메일 형식이 아닙니다" });
    } else if (newEmail === currentEmail) {
      setErrors({ ...errors, newEmail: "현재 이메일과 동일합니다" });
    } else {
      const { newEmail: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleConfirmEmailBlur = () => {
    setTouched({ ...touched, confirmEmail: true });
    if (!confirmEmail) {
      setErrors({ ...errors, confirmEmail: "이메일 확인을 입력해주세요" });
    } else if (newEmail !== confirmEmail) {
      setErrors({ ...errors, confirmEmail: "이메일이 일치하지 않습니다" });
    } else {
      const { confirmEmail: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length === 0 && newEmail && confirmEmail) {
      alert("이메일이 성공적으로 변경되었습니다.");
      onBack();
    }
  };

  const isValid = newEmail && confirmEmail && Object.keys(errors).length === 0;
  const isEmailMatch = newEmail && confirmEmail && newEmail === confirmEmail;

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center font-bold pr-10">이메일 변경</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Info Notice */}
        <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl p-4 border border-primary/20">
          <div className="flex gap-3">
            <Mail size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">이메일 변경 안내</h4>
              <p className="text-sm text-muted-foreground">
                이메일 변경 후 새로운 이메일로 인증 메일이 발송됩니다. 인증을 완료해야 변경이 적용됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Current Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">현재 이메일</label>
          <div className="bg-muted border border-border rounded-xl p-4">
            <p className="text-foreground font-medium">{currentEmail}</p>
          </div>
        </div>

        {/* New Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            새 이메일 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onBlur={handleNewEmailBlur}
              placeholder="새로운 이메일을 입력하세요"
              className={`w-full h-12 px-4 pr-12 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none ${
                touched.newEmail && errors.newEmail
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : touched.newEmail && newEmail && !errors.newEmail
                  ? "border-[#34D399] focus:border-[#34D399]"
                  : "border-border focus:border-primary"
              }`}
            />
            {touched.newEmail && newEmail && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {errors.newEmail ? (
                  <AlertCircle size={20} className="text-[#EF4444]" />
                ) : (
                  <CheckCircle2 size={20} className="text-[#34D399]" />
                )}
              </div>
            )}
          </div>
          {touched.newEmail && errors.newEmail && (
            <p className="text-sm text-[#EF4444] flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.newEmail}
            </p>
          )}
        </div>

        {/* Confirm Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            새 이메일 확인 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              onBlur={handleConfirmEmailBlur}
              placeholder="이메일을 다시 입력하세요"
              className={`w-full h-12 px-4 pr-12 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none ${
                touched.confirmEmail && errors.confirmEmail
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : touched.confirmEmail && isEmailMatch
                  ? "border-[#34D399] focus:border-[#34D399]"
                  : "border-border focus:border-primary"
              }`}
            />
            {touched.confirmEmail && confirmEmail && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {errors.confirmEmail ? (
                  <AlertCircle size={20} className="text-[#EF4444]" />
                ) : isEmailMatch ? (
                  <CheckCircle2 size={20} className="text-[#34D399]" />
                ) : null}
              </div>
            )}
          </div>
          {touched.confirmEmail && errors.confirmEmail && (
            <p className="text-sm text-[#EF4444] flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.confirmEmail}
            </p>
          )}
          {touched.confirmEmail && isEmailMatch && !errors.confirmEmail && (
            <p className="text-sm text-[#34D399] flex items-center gap-1">
              <CheckCircle2 size={14} />
              이메일이 일치합니다
            </p>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h4 className="font-semibold text-foreground">이메일 변경 시 유의사항</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>변경 후 새 이메일로 인증 메일이 발송됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>인증 메일의 링크를 클릭하여 변경을 완료하세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>인증 완료 전까지는 기존 이메일이 유지됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>인증 메일은 24시간 동안 유효합니다</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full h-12 bg-primary hover:bg-primary/90 dark:bg-[#2563EB] dark:hover:bg-[#2563EB]/90 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이메일 변경하기
        </Button>
      </div>
    </div>
  );
}
