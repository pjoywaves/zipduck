import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewOnboardingScreenProps {
  onComplete: () => void;
}

export function NewOnboardingScreen({ onComplete }: NewOnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "집덕과 함께\n청약을 쉽고 빠르게",
      description: "복잡한 청약 정보를\n한눈에 확인하고 이해하세요",
      emoji: "🏢",
      gradient: "from-primary/20 to-blue-100/50 dark:from-primary/20 dark:to-blue-900/30"
    },
    {
      title: "나에게 딱 맞는\n청약 조건 설정",
      description: "지역, 가족 구성, 소득 기준까지\n맞춤형 필터로 원하는 단지만 모아보세요",
      emoji: "🎯",
      gradient: "from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
    },
    {
      title: "AI 기반\n스마트 분석",
      description: "실시간 경쟁률 예측부터 합격 확률까지\n집덕 AI가 도와드려요",
      emoji: "✨",
      gradient: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Skip Button */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground font-semibold hover:text-foreground transition-colors"
        >
          건너뛰기
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        {/* 3D Illustration Circle */}
        <div className={`w-56 h-56 rounded-full bg-gradient-to-br ${currentStepData.gradient} flex items-center justify-center mb-12 shadow-2xl relative overflow-hidden`}>
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full border-4 border-white/10"></div>

          {/* 3D-style emoji illustration */}
          <div className="text-8xl transform hover:scale-110 transition-transform duration-300" style={{
            textShadow: '0 8px 16px rgba(0,0,0,0.2)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
          }}>
            {currentStepData.emoji}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center mb-4 whitespace-pre-line font-bold">
          {currentStepData.title}
        </h1>

        {/* Description */}
        <p className="text-center text-muted-foreground whitespace-pre-line leading-relaxed">
          {currentStepData.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="px-8 pb-12 space-y-6">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-primary/50"
              }`}
            ></div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg"
        >
          {currentStep < steps.length - 1 ? (
            <>
              다음
              <ChevronRight size={20} className="ml-2" />
            </>
          ) : (
            "시작하기"
          )}
        </Button>
      </div>
    </div>
  );
}
