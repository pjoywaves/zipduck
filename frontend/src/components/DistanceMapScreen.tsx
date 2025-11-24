import { ChevronLeft, MapPin, Navigation, Car, Train, Footprints, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface DistanceMapScreenProps {
  onBack: () => void;
}

export function DistanceMapScreen({ onBack }: DistanceMapScreenProps) {
  const routes = [
    {
      id: 1,
      type: "transit",
      icon: Train,
      name: "대중교통",
      distance: "8.2km",
      time: "35분",
      details: "지하철 2호선 → 버스 340",
      cost: "1,450원",
      recommended: true
    },
    {
      id: 2,
      type: "car",
      icon: Car,
      name: "자동차",
      distance: "7.5km",
      time: "18분",
      details: "강남대로 경유",
      cost: "주차비 별도",
      recommended: false
    },
    {
      id: 3,
      type: "walk",
      icon: Footprints,
      name: "도보",
      distance: "6.8km",
      time: "1시간 25분",
      details: "한강변 산책로 경유",
      cost: "무료",
      recommended: false
    }
  ];

  const nearbyPlaces = [
    { name: "회사", distance: "7.2km", score: 95 },
    { name: "학교", distance: "2.3km", score: 88 },
    { name: "병원", distance: "1.5km", score: 92 },
    { name: "대형마트", distance: "0.8km", score: 90 },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <div className="ml-4">
            <h2 className="font-bold text-foreground">거리 및 경로</h2>
            <p className="text-xs text-muted-foreground">선호지역 ↔ 청약단지</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Map Visualization */}
        <div className="mx-6 mt-6">
          <div className="bg-gradient-to-br from-primary/20 via-blue-100 to-green-100 dark:from-primary/10 dark:via-blue-900/20 dark:to-green-900/20 rounded-3xl p-8 relative overflow-hidden h-64">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>

            {/* Route Visualization */}
            <div className="relative h-full flex items-center justify-between px-4">
              {/* Point A */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg mb-2">
                  <MapPin size={28} className="text-white" />
                </div>
                <div className="bg-background dark:bg-card px-3 py-2 rounded-xl shadow-md">
                  <p className="text-xs font-semibold text-foreground">내 선호지역</p>
                  <p className="text-xs text-muted-foreground">서울 강남구</p>
                </div>
              </div>

              {/* Distance Line */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full border-t-2 border-dashed border-primary mb-2"></div>
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  8.2km
                </div>
              </div>

              {/* Point B */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg mb-2">
                  <span className="text-3xl">🏢</span>
                </div>
                <div className="bg-background dark:bg-card px-3 py-2 rounded-xl shadow-md">
                  <p className="text-xs font-semibold text-foreground">청약 단지</p>
                  <p className="text-xs text-muted-foreground">서울 송파구</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Routes */}
        <div className="px-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Navigation size={20} className="text-primary" />
            추천 경로
          </h3>
          <div className="space-y-3">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <button
                  key={route.id}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${
                    route.recommended
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      route.recommended ? "bg-primary" : "bg-muted"
                    }`}>
                      <Icon size={24} className={route.recommended ? "text-primary-foreground" : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{route.name}</p>
                        {route.recommended && (
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded">
                            추천
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{route.details}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock size={12} />
                          {route.time}
                        </span>
                        <span>·</span>
                        <span>{route.distance}</span>
                        <span>·</span>
                        <span>{route.cost}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nearby Places */}
        <div className="px-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-xl">📍</span>
            주요 시설과의 거리
          </h3>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            {nearbyPlaces.map((place) => (
              <div key={place.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{place.name}</p>
                    <p className="text-xs text-muted-foreground">{place.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{place.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Score */}
        <div className="px-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-xl">🔥</span>
            지역 매력도
          </h3>
          <div className="bg-gradient-to-r from-blue-500 via-primary to-red-500 rounded-2xl p-0.5">
            <div className="bg-background rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">낮음</span>
                <span className="text-sm font-medium text-muted-foreground">높음</span>
              </div>
              <div className="relative h-3 bg-gradient-to-r from-blue-500 via-primary to-red-500 rounded-full">
                <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-6 h-6 bg-background dark:bg-card border-2 border-primary rounded-full shadow-lg"></div>
              </div>
              <div className="text-center mt-4">
                <p className="font-bold text-foreground">종합 점수: 89점</p>
                <p className="text-sm text-muted-foreground mt-1">매우 우수한 입지 조건</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6">
          <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
            <Navigation size={20} className="mr-2" />
            네비게이션으로 안내받기
          </Button>
        </div>
      </div>
    </div>
  );
}
