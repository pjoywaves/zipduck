import { useState } from "react";
import { ChevronLeft, Search, Heart, MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RegionMapScreenProps {
  onBack: () => void;
  onNavigateToDetail: () => void;
}

export function RegionMapScreen({ onBack, onNavigateToDetail }: RegionMapScreenProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = [
    { name: "서울", count: 24, color: "#F8E99A" },
    { name: "경기", count: 42, color: "#A8E6CF" },
    { name: "인천", count: 12, color: "#FFD3B6" },
    { name: "부산", count: 18, color: "#FFAAA5" },
    { name: "대구", count: 9, color: "#DDE87A" },
    { name: "광주", count: 6, color: "#B4A7D6" },
  ];

  const apartments = [
    {
      id: 1,
      name: "힐스테이트 송파 헬리오시티",
      location: "서울 송파구",
      price: "5억 3천만원~",
      types: "59㎡~84㎡",
      schedule: "청약 접수: 11.20~11.21",
      image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400",
      dday: 3
    },
    {
      id: 2,
      name: "래미안 강남 포레스티지",
      location: "서울 강남구",
      price: "8억 2천만원~",
      types: "84㎡~114㎡",
      schedule: "청약 접수: 11.24~11.25",
      image: "https://images.unsplash.com/photo-1676680071181-0a0b45968d23?w=400",
      dday: 7
    },
    {
      id: 3,
      name: "e편한세상 용산 센트럴",
      location: "서울 용산구",
      price: "7억 1천만원~",
      types: "74㎡~101㎡",
      schedule: "청약 접수: 11.29~11.30",
      image: "https://images.unsplash.com/photo-1623051786509-57224cdc43e1?w=400",
      dday: 12
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold ml-4 text-foreground">지역별 청약</h2>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="지역명 또는 단지명 검색"
              className="pl-12 h-12 rounded-2xl bg-muted border-border"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Map Placeholder */}
        <div className="mx-6 mt-6">
          <div className="bg-gradient-to-br from-primary/20 to-blue-100 dark:from-primary/10 dark:to-blue-900/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            <div className="relative text-center">
              <span className="text-6xl mb-4 block">🗺️</span>
              <h3 className="font-bold text-foreground mb-2">대한민국 청약 지도</h3>
              <p className="text-sm text-muted-foreground">지역을 선택하여 청약 정보를 확인하세요</p>
            </div>
          </div>
        </div>

        {/* Region Cards */}
        <div className="px-6">
          <h3 className="font-semibold text-foreground mb-4">지역 선택</h3>
          <div className="grid grid-cols-2 gap-3">
            {regions.map((region) => (
              <button
                key={region.name}
                onClick={() => setSelectedRegion(region.name)}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  selectedRegion === region.name
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-foreground">{region.name}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: region.color }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  진행중 <span className="font-bold text-primary">{region.count}</span>건
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Apartment List */}
        {selectedRegion && (
          <div className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{selectedRegion} 진행 중 청약</h3>
              <p className="text-sm text-muted-foreground">{apartments.length}건</p>
            </div>
            <div className="space-y-3">
              {apartments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={onNavigateToDetail}
                  className="w-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all group"
                >
                  <div className="flex gap-4 p-4">
                    <ImageWithFallback
                      src={apt.image}
                      alt={apt.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {apt.name}
                        </h4>
                        {apt.dday <= 7 && (
                          <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-lg whitespace-nowrap">
                            D-{apt.dday}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{apt.location}</p>
                      </div>
                      <p className="text-sm font-semibold text-primary mb-1">{apt.price}</p>
                      <p className="text-xs text-muted-foreground">{apt.types} · {apt.schedule}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedRegion && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">지역을 선택하세요</h3>
            <p className="text-sm text-muted-foreground">
              위에서 관심 지역을 선택하면<br />해당 지역의 청약 정보를 확인할 수 있습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
