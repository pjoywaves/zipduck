import { useState } from "react";
import { ChevronRight, Home, MapPin, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Home,
      title: "청약을 더 쉽고 빠르게",
      description: "복잡한 청약 정보를\n한눈에 확인하고 이해하세요",
      color: "#FCD34D",
      emoji: "🏡"
    },
    {
      icon: MapPin,
      title: "관심 지역 맞춤 추천",
      description: "원하는 지역의 새로운 청약 소식을\n놓치지 않고 받아보세요",
      color: "#FCD34D",
      emoji: "📍"
    },
    {
      icon: Sparkles,
      title: "AI 기반 스마트 분석",
      description: "나에게 딱 맞는 청약을\nAI가 추천해드려요",
      color: "#FCD34D",
      emoji: "✨"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6 max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-12">
          <div className="w-32 h-32 rounded-full bg-[#FCD34D] bg-opacity-20 flex items-center justify-center mb-8">
            <span className="text-7xl">{currentSlideData.emoji}</span>
          </div>
          <h1 className="text-center mb-4 whitespace-pre-line font-bold">
            {currentSlideData.title}
          </h1>
          <p className="text-center text-gray-600 whitespace-pre-line">
            {currentSlideData.description}
          </p>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-[#FCD34D]' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full bg-[#FCD34D] hover:bg-[#fcd34d]/90 text-gray-900 h-14 rounded-xl"
        >
          {currentSlide < slides.length - 1 ? "다음" : "시작하기"}
          <ChevronRight size={20} className="ml-1" />
        </Button>

        {currentSlide < slides.length - 1 && (
          <button
            onClick={onComplete}
            className="w-full text-gray-500 py-3"
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  );
}