import { useState } from "react";
import { ChevronLeft, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordChangeScreenProps {
  onBack: () => void;
}

export function PasswordChangeScreen({ onBack }: PasswordChangeScreenProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [errors, setErrors] = useState<{ 
    current?: string; 
    newPassword?: string; 
    confirmPassword?: string 
  }>({});
  
  const [touched, setTouched] = useState<{ 
    current?: boolean; 
    newPassword?: boolean; 
    confirmPassword?: boolean 
  }>({});

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "비밀번호에 영문자가 포함되어야 합니다";
    }
    if (!/[0-9]/.test(password)) {
      return "비밀번호에 숫자가 포함되어야 합니다";
    }
    return null;
  };

  const handleCurrentPasswordBlur = () => {
    setTouched({ ...touched, current: true });
    if (!currentPassword) {
      setErrors({ ...errors, current: "현재 비밀번호를 입력해주세요" });
    } else {
      const { current: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleNewPasswordBlur = () => {
    setTouched({ ...touched, newPassword: true });
    if (!newPassword) {
      setErrors({ ...errors, newPassword: "새 비밀번호를 입력해주세요" });
    } else {
      const validationError = validatePassword(newPassword);
      if (validationError) {
        setErrors({ ...errors, newPassword: validationError });
      } else if (newPassword === currentPassword) {
        setErrors({ ...errors, newPassword: "현재 비밀번호와 동일합니다" });
      } else {
        const { newPassword: _, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const handleConfirmPasswordBlur = () => {
    setTouched({ ...touched, confirmPassword: true });
    if (!confirmPassword) {
      setErrors({ ...errors, confirmPassword: "비밀번호 확인을 입력해주세요" });
    } else if (newPassword !== confirmPassword) {
      setErrors({ ...errors, confirmPassword: "비밀번호가 일치하지 않습니다" });
    } else {
      const { confirmPassword: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length === 0 && currentPassword && newPassword && confirmPassword) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      onBack();
    }
  };

  const isValid = currentPassword && newPassword && confirmPassword && Object.keys(errors).length === 0;
  const isPasswordMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Za-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: "약함", color: "#EF4444" };
    if (strength <= 3) return { strength: 66, label: "보통", color: "#FACC15" };
    return { strength: 100, label: "강함", color: "#34D399" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center font-bold pr-10">비밀번호 변경</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Info Notice */}
        <div className="bg-blue-soft-bg dark:bg-card rounded-xl p-4 border border-primary/20">
          <div className="flex gap-3">
            <Lock size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">비밀번호 변경 안내</h4>
              <p className="text-sm text-muted-foreground">
                안전한 계정 보호를 위해 주기적으로 비밀번호를 변경해주세요.
              </p>
            </div>
          </div>
        </div>

        {/* Current Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            현재 비밀번호 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onBlur={handleCurrentPasswordBlur}
              placeholder="현재 비밀번호를 입력하세요"
              className={`w-full h-12 px-4 pr-12 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none ${
                touched.current && errors.current
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : touched.current && currentPassword
                  ? "border-[#34D399] focus:border-[#34D399]"
                  : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {touched.current && errors.current && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.current}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            새 비밀번호 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={handleNewPasswordBlur}
              placeholder="새 비밀번호를 입력하세요"
              className={`w-full h-12 px-4 pr-12 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none ${
                touched.newPassword && errors.newPassword
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : touched.newPassword && newPassword && !errors.newPassword
                  ? "border-[#34D399] focus:border-[#34D399]"
                  : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">비밀번호 강도</span>
                <span style={{ color: passwordStrength.color }} className="font-semibold text-foreground">
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${passwordStrength.strength}%`,
                    backgroundColor: passwordStrength.color
                  }}
                />
              </div>
            </div>
          )}
          
          {touched.newPassword && errors.newPassword && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            새 비밀번호 확인 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleConfirmPasswordBlur}
              placeholder="비밀번호를 다시 입력하세요"
              className={`w-full h-12 px-4 pr-12 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none ${
                touched.confirmPassword && errors.confirmPassword
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : touched.confirmPassword && isPasswordMatch
                  ? "border-[#34D399] focus:border-[#34D399]"
                  : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.confirmPassword}
            </p>
          )}
          {touched.confirmPassword && isPasswordMatch && !errors.confirmPassword && (
            <p className="text-sm text-success flex items-center gap-1">
              <CheckCircle2 size={14} />
              비밀번호가 일치합니다
            </p>
          )}
        </div>

        {/* Password Guidelines */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h4 className="font-semibold text-foreground">안전한 비밀번호 규칙</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className={newPassword.length >= 8 ? "text-success" : "text-primary"}>•</span>
              <span className={newPassword.length >= 8 ? "text-success" : ""}>
                8자 이상 입력 (권장: 12자 이상)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className={/[A-Za-z]/.test(newPassword) ? "text-success" : "text-primary"}>•</span>
              <span className={/[A-Za-z]/.test(newPassword) ? "text-success" : ""}>
                영문자 포함
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className={/[0-9]/.test(newPassword) ? "text-success" : "text-primary"}>•</span>
              <span className={/[0-9]/.test(newPassword) ? "text-success" : ""}>
                숫자 포함
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-success" : "text-primary"}>•</span>
              <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-success" : ""}>
                특수문자 포함 (권장)
              </span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full h-12 bg-primary hover:bg-primary/90 dark:bg-primary-hover dark:hover:bg-primary-hover/90 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          비밀번호 변경하기
        </Button>

        {/* Last Changed Info */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            마지막 변경: <span className="font-medium text-foreground">2025.10.15</span>
          </p>
        </div>
      </div>
    </div>
  );
}
