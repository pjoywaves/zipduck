import { useState } from "react";
import { ChevronLeft, Save, Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CustomFilterScreenProps {
  onBack: () => void;
}

export function CustomFilterScreen({ onBack }: CustomFilterScreenProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["서울", "경기"]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["특별공급"]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["59㎡", "84㎡"]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["모집중"]);

  const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종"];
  const supplyTypes = ["특별공급", "일반공급", "신혼부부", "생애최초", "다자녀"];
  const sizes = ["59㎡", "74㎡", "84㎡", "101㎡", "114㎡"];
  const incomeRanges = ["100% 이하", "120% 이하", "140% 이하", "160% 이하"];
  const statusOptions = ["예정", "모집중", "마감"];

  const toggleSelection = (item: string, array: string[], setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const clearAll = () => {
    setSelectedRegions([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    setSelectedStatus([]);
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold ml-4 text-muted-foreground">맞춤 필터</h2>
          </div>
          <button onClick={clearAll} className="text-sm text-primary font-semibold">
            전체 초기화
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Region Filter */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-xl">📍</span>
            지역
          </h3>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => toggleSelection(region, selectedRegions, setSelectedRegions)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedRegions.includes(region)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Supply Type Filter */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-xl">🏠</span>
            공급 유형
          </h3>
          <div className="flex flex-wrap gap-2">
            {supplyTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedTypes.includes(type)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-xl">📐</span>
            면적
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSelection(size, selectedSizes, setSelectedSizes)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedSizes.includes(size)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Income Range */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-xl">💰</span>
            소득 기준 (도시근로자 월평균 소득)
          </h3>
          <div className="flex flex-wrap gap-2">
            {incomeRanges.map((range) => (
              <button
                key={range}
                className="px-4 py-2 rounded-xl font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-xl">⏰</span>
            청약 단계
          </h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => toggleSelection(status, selectedStatus, setSelectedStatus)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedStatus.includes(status)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Filters */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Upload size={20} className="text-primary" />
            저장된 조건
          </h3>
          <div className="space-y-2">
            <button className="w-full p-3 bg-muted rounded-xl text-left hover:bg-muted/80 transition-colors">
              <p className="font-medium mb-1 text-foreground">나의 신혼부부 조건</p>
              <p className="text-xs text-muted-foreground">서울·경기 / 특별공급 / 59㎡·84㎡</p>
            </button>
            <button className="w-full p-3 bg-muted rounded-xl text-left hover:bg-muted/80 transition-colors">
              <p className="font-medium mb-1 text-foreground">강남 선호 조건</p>
              <p className="text-xs text-muted-foreground">서울 / 일반공급 / 84㎡·101㎡</p>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 max-w-md mx-auto">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-border font-semibold"
          >
            <Save size={20} className="mr-2" />
            조건 저장
          </Button>
          <Button
            className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg"
          >
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
}
