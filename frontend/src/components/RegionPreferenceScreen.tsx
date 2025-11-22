import { useState } from "react";
import { ChevronLeft, Search, X, MapPin, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface RegionPreferenceScreenProps {
  onBack: () => void;
}

export function RegionPreferenceScreen({ onBack }: RegionPreferenceScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    "서울 강남구",
    "서울 서초구",
    "경기 성남시 분당구"
  ]);

  const allRegions = [
    "서울 강남구", "서울 서초구", "서울 송파구", "서울 강동구",
    "서울 마포구", "서울 용산구", "서울 영등포구", "서울 구로구",
    "경기 성남시 분당구", "경기 성남시 수정구", "경기 용인시 수지구",
    "경기 화성시", "경기 수원시 영통구", "경기 고양시 일산동구",
    "인천 연수구", "인천 남동구", "인천 서구"
  ];

  const filteredRegions = searchQuery
    ? allRegions.filter(region => region.includes(searchQuery))
    : allRegions;

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center font-bold pr-10">관심 지역 설정</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Selected Regions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">선택한 지역</h3>
            <span className="text-sm text-primary font-semibold">{selectedRegions.length}개</span>
          </div>
          {selectedRegions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedRegions.map((region) => (
                <div
                  key={region}
                  className="bg-primary text-white px-4 py-2 rounded-2xl flex items-center gap-2 group hover:bg-primary/90 transition-colors"
                >
                  <MapPin size={14} />
                  <span className="text-sm font-medium">{region}</span>
                  <button
                    onClick={() => toggleRegion(region)}
                    className="hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground">선택한 지역이 없습니다</p>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지역 검색 (예: 강남구)"
              className="pl-12 h-12 rounded-xl border-border"
            />
          </div>
        </div>

        {/* Region List */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">전체 지역</h3>
          <div className="grid grid-cols-2 gap-2">
            {filteredRegions.map((region) => {
              const isSelected = selectedRegions.includes(region);
              return (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                    isSelected
                      ? "bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-primary border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{region}</span>
                    {isSelected && <Plus size={16} className="rotate-45 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            💡 <span className="font-semibold text-foreground">관심 지역</span>을 설정하면 해당 지역의 새로운 청약 정보를 
            빠르게 받아볼 수 있습니다.
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 max-w-md mx-auto">
        <Button
          onClick={onBack}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
        >
          설정 완료
        </Button>
      </div>

      {/* Bottom padding for fixed button */}
      <div className="h-20"></div>
    </div>
  );
}
