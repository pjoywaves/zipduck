import { ChevronLeft, Sparkles, TrendingUp, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AIRecommendationScreenProps {
  onBack: () => void;
  onNavigateToDetail?: () => void;
}

export function AIRecommendationScreen({ onBack, onNavigateToDetail }: AIRecommendationScreenProps) {
  const recommendations = [
    {
      id: 1,
      name: "힐스테이트 송파 헬리오시티",
      location: "서울 송파구",
      image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjMyOTUxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      totalUnits: 1248,
      types: "59㎡~84㎡",
      dday: 3,
      matchScore: 95,
      reasons: ["관심 지역과 일치", "신혼부부 특별공급 가능", "희망 평수 범위"]
    },
    {
      id: 2,
      name: "e편한세상 용산 센트럴",
      location: "서울 용산구",
      image: "https://images.unsplash.com/photo-1623051786509-57224cdc43e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNpZGVudGlhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MzMwNTMzNXww&ixlib=rb-4.1.0&q=80&w=1080",
      totalUnits: 1056,
      types: "74㎡~101㎡",
      dday: 12,
      matchScore: 88,
      reasons: ["교통 접근성 우수", "생활 인프라 양호", "자녀 학군 좋음"]
    },
    {
      id: 3,
      name: "더샵 성수 레이크",
      location: "서울 성동구",
      image: "https://images.unsplash.com/photo-1760182042697-fd8d2e3139eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGNvbXBsZXglMjBrb3JlYXxlbnwxfHx8fDE3NjMzODQ4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      totalUnits: 742,
      types: "59㎡~84㎡",
      dday: 15,
      matchScore: 82,
      reasons: ["가격대 적정", "미래 가치 상승 기대", "신축 단지"]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center pr-10 font-bold">AI 맞춤 추천</h2>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-400 dark:from-primary dark:to-blue-600 px-6 py-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-white mb-2 font-bold">김청약님을 위한 추천</h3>
            <p className="text-sm text-white/90">
              선호 지역, 가족 구성, 청약 이력을 기반으로<br />
              최적의 청약 기회를 찾아드려요
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="px-6 space-y-4">
        {recommendations.map((apt, index) => (
          <button
            key={apt.id}
            onClick={onNavigateToDetail}
            className="w-full bg-card rounded-2xl overflow-hidden border-2 border-primary hover:shadow-xl transition-all relative"
          >
            {/* Premium Rank Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-primary dark:bg-[#2563EB] text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg font-bold">
                {index + 1}
              </div>
            </div>

            {/* Match Score Badge */}
            <div className="bg-gradient-to-r from-primary to-blue-400 px-4 py-2.5 flex items-center justify-end">
              <div className="flex items-center gap-1">
                <TrendingUp size={16} className="text-white" />
                <span className="font-bold text-white">{apt.matchScore}% 일치</span>
              </div>
            </div>

            {/* Image */}
            <ImageWithFallback
              src={apt.image}
              alt={apt.name}
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-foreground mb-1 font-semibold">{apt.name}</p>
                  <p className="text-sm text-muted-foreground">{apt.location}</p>
                </div>
                {apt.dday <= 7 && (
                  <span className="bg-warning text-gray-900 text-xs px-2.5 py-1 rounded-lg ml-2 whitespace-nowrap font-bold">
                    D-{apt.dday}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                {apt.types} · {apt.totalUnits}세대
              </p>

              {/* Reasons */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                <p className="text-xs text-primary font-semibold mb-2">✨ 추천 이유</p>
                <div className="space-y-1.5">
                  {apt.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-mint text-sm mt-0.5">✓</span>
                      <span className="text-xs text-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info Footer */}
      <div className="px-6 mt-6 pb-6">
        <div className="bg-info/10 border border-info/30 rounded-2xl p-4">
          <p className="text-xs text-foreground leading-relaxed">
            💡 <span className="font-semibold">추천 안내:</span> 등록하신 정보를 바탕으로 제공되며, 실제 청약 자격과는 다를 수 있습니다.
            청약 전 반드시 자격 요건을 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}