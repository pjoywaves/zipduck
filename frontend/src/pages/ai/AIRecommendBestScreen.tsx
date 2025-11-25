import duckImg from "@/assets/img/duck.png";
import { ChevronLeft, Sparkles, TrendingUp, MapPin, Home, Award } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";

interface AIRecommendBestScreenProps {
  onBack: () => void;
  onNavigateToDetail: () => void;
}

export function AIRecommendBestScreen({ onBack, onNavigateToDetail }: AIRecommendBestScreenProps) {
  const recommendations = [
    {
      rank: 1,
      name: "힐스테이트 송파 헬리오시티",
      location: "서울 송파구",
      image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400",
      price: "5억 3천만원~",
      matchScore: 95,
      reasons: [
        "신혼부부 특별공급 대상",
        "회원님의 소득 기준 100% 충족",
        "선호 지역 내 위치",
        "합격 확률 78% (높음)"
      ],
      highlights: {
        competition: "17.1:1",
        distance: "직장에서 8.2km",
        facilities: "학군 A등급"
      }
    },
    {
      rank: 2,
      name: "e편한세상 용산 센트럴",
      location: "서울 용산구",
      image: "https://images.unsplash.com/photo-1623051786509-57224cdc43e1?w=400",
      price: "7억 1천만원~",
      matchScore: 88,
      reasons: [
        "교통 접근성 우수 (9호선 연장)",
        "주변 개발 호재 多",
        "선호하는 74㎡ 타입 포함",
        "합격 확률 65% (중상)"
      ],
      highlights: {
        competition: "14.8:1",
        distance: "직장에서 5.5km",
        facilities: "상업시설 다수"
      }
    },
    {
      rank: 3,
      name: "래미안 강남 포레스티지",
      location: "서울 강남구",
      image: "https://images.unsplash.com/photo-1676680071181-0a0b45968d23?w=400",
      price: "8억 2천만원~",
      matchScore: 82,
      reasons: [
        "브랜드 프리미엄 높음",
        "향후 가치 상승 예상",
        "생애최초 특별공급 가능",
        "합격 확률 55% (중)"
      ],
      highlights: {
        competition: "19.2:1",
        distance: "직장에서 12.3km",
        facilities: "강남 핵심 지역"
      }
    }
  ];

  const getRankBadge = (rank: number) => {
    const colors = {
      1: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
      2: "bg-gradient-to-br from-gray-300 to-gray-500 text-white",
      3: "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
    };
    return colors[rank as keyof typeof colors] || "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 flex items-center justify-center gap-2 pr-10">
            <Sparkles size={20} className="text-primary" />
            <h2 className="font-bold text-foreground">AI 맞춤 추천</h2>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* AI Insight Header */}
        <div className="bg-gradient-to-br from-primary/20 to-blue-100/50 dark:from-primary/10 dark:to-blue-900/20 border-2 border-primary/30 rounded-3xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🦆</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">김청약님을 위한 BEST 3</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                회원님의 조건을 분석하여 <span className="font-semibold text-foreground">가장 적합한 3개 단지</span>를 추천해드려요
              </p>
            </div>
          </div>

          {/* User Conditions */}
          <div className="bg-background/60 dark:bg-black/20 rounded-2xl p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">분석된 조건</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                신혼부부
              </span>
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                자녀 1명
              </span>
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                서울·경기 선호
              </span>
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                59㎡~84㎡
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <button
              key={rec.rank}
              onClick={onNavigateToDetail}
              className="w-full bg-card border-2 border-border rounded-3xl overflow-hidden hover:border-primary transition-all group"
            >
              {/* Rank Badge */}
              <div className="relative">
                <ImageWithFallback
                  src={rec.image}
                  alt={rec.name}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-4 left-4 w-12 h-12 ${getRankBadge(rec.rank)} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="font-bold text-xl text-foreground">{rec.rank}</span>
                </div>
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-xl font-bold shadow-lg">
                  매칭도 {rec.matchScore}%
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {rec.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>{rec.location}</span>
                  </div>
                  <p className="text-primary font-bold mt-2">{rec.price}</p>
                </div>

                {/* AI Reasons */}
                <div className="bg-muted rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-primary" />
                    <p className="font-semibold text-sm text-foreground">AI 추천 이유</p>
                  </div>
                  <ul className="space-y-2">
                    {rec.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <TrendingUp size={16} className="text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">경쟁률</p>
                    <p className="font-semibold text-xs text-foreground">{rec.highlights.competition}</p>
                  </div>
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <MapPin size={16} className="text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">거리</p>
                    <p className="font-semibold text-xs text-foreground">{rec.highlights.distance}</p>
                  </div>
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <Home size={16} className="text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground mb-1">주변환경</p>
                    <p className="font-semibold text-xs text-foreground">{rec.highlights.facilities}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Award size={24} className="text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">더 많은 추천이 필요하신가요?</h3>
              <p className="text-xs text-muted-foreground">AI 상담으로 자세히 분석해드려요</p>
            </div>
          </div>
          <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            <Sparkles size={18} className="mr-2" />
            AI 상담 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
