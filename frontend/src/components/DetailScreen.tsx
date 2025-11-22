import { ChevronLeft, Heart, Share2, MapPin, Calendar, Home } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface DetailScreenProps {
  onBack: () => void;
}

export function DetailScreen({ onBack }: DetailScreenProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const unitTypes = [
    { type: "59A", area: "59㎡", rooms: "3", units: 284, price: "5억 3천" },
    { type: "59B", area: "59㎡", rooms: "3", units: 312, price: "5억 5천" },
    { type: "74A", area: "74㎡", rooms: "4", units: 425, price: "6억 8천" },
    { type: "84A", area: "84㎡", rooms: "4", units: 227, price: "7억 9천" },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button className="p-2">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2"
            >
              <Heart 
                size={20} 
                className={isFavorite ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjMyOTUxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="힐스테이트 송파 헬리오시티"
          className="w-full h-64 object-cover"
        />
        <span className="absolute top-4 left-4 bg-[#FCD34D] text-gray-900 text-sm px-3 py-1 rounded-lg font-semibold">
          D-3
        </span>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Title Section */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">마감임박</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">관심지역</span>
          </div>
          <h2 className="mb-2 font-bold">힐스테이트 송파 헬리오시티</h2>
          <p className="text-gray-600">서울특별시 송파구 문정동 123-45</p>
        </div>

        {/* Schedule Section */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📅</span>
            <h3 className="text-gray-900 font-semibold">청약 일정</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">청약 접수</span>
              <span className="text-sm text-gray-900 font-medium">2025.11.20 (목) ~ 11.21 (금)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">당첨자 발표</span>
              <span className="text-sm text-gray-900 font-medium">2025.11.28 (목)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">계약일</span>
              <span className="text-sm text-gray-900 font-medium">2025.12.10 (화) ~ 12.12 (목)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">입주 예정</span>
              <span className="text-sm text-gray-900 font-medium">2027년 9월</span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <Home size={20} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-600 mb-1">총 세대수</p>
            <p className="text-gray-900">1,248세대</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <MapPin size={20} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-600 mb-1">최고층</p>
            <p className="text-gray-900">35층</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <Calendar size={20} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-600 mb-1">주차대수</p>
            <p className="text-gray-900">1,560대</p>
          </div>
        </div>

        {/* Unit Types */}
        <div>
          <h3 className="mb-4 text-gray-900 font-semibold">공급 타입</h3>
          <div className="space-y-2">
            {unitTypes.map((unit) => (
              <div key={unit.type} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900 font-semibold">{unit.type}</span>
                    <span className="text-sm text-gray-600">{unit.area}</span>
                  </div>
                  <span className="text-sm text-gray-900 font-semibold">{unit.price}만원</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{unit.rooms}방</span>
                  <span>·</span>
                  <span>{unit.units}세대</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div>
          <h3 className="mb-4 text-gray-900 font-semibold">위치</h3>
          <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin size={32} className="mx-auto mb-2" />
              <p className="text-sm">지도 영역</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <Button className="w-full bg-[#FCD34D] hover:bg-[#fcd34d]/90 text-gray-900 h-14 rounded-xl">
          관심 단지 등록
        </Button>
      </div>
    </div>
  );
}