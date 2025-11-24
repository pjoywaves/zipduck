import { MapPin, Calendar, Home, TrendingUp, ChevronRight, Heart } from "lucide-react";
import { SourceBadge } from "./SourceFilter";
import type { Subscription } from "@/types/Subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  variant?: "default" | "compact" | "horizontal";
  showMatchScore?: boolean;
}

export function SubscriptionCard({
  subscription,
  onClick,
  onFavorite,
  isFavorite = false,
  variant = "default",
  showMatchScore = true,
}: SubscriptionCardProps) {
  const {
    name,
    location,
    developer,
    supplyType,
    totalUnits,
    applicationStartDate,
    applicationEndDate,
    source,
    status,
    matchScore,
    isEligible,
    eligibilityTier,
    minPrice,
    maxPrice,
    thumbnailUrl,
  } = subscription;

  // 상태 뱃지 스타일
  const statusConfig = {
    ACTIVE: { label: "접수중", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
    UPCOMING: { label: "접수예정", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    CLOSED: { label: "마감", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  };

  // 공급유형 라벨
  const supplyTypeLabels: Record<string, string> = {
    PUBLIC: "공공분양",
    PRIVATE: "민간분양",
    PUBLIC_RENTAL: "공공임대",
    PRIVATE_RENTAL: "민간임대",
    NEWLYWED: "신혼희망타운",
    HAPPY_HOUSE: "행복주택",
  };

  // 가격 포맷
  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}억`;
    }
    return `${price.toLocaleString()}만`;
  };

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };

  // D-Day 계산
  const getDDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(applicationEndDate);
    endDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return null;
    if (diff === 0) return "D-Day";
    if (diff <= 7) return `D-${diff}`;
    return null;
  };

  const dDay = getDDay();

  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        className="w-full bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all text-left"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <SourceBadge source={source} />
              <span className={`text-xs px-2 py-0.5 rounded ${statusConfig[status].className}`}>
                {statusConfig[status].label}
              </span>
            </div>
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">{location}</p>
          </div>
          {showMatchScore && matchScore !== undefined && (
            <div className="text-right flex-shrink-0">
              <p className={`text-lg font-bold ${matchScore >= 80 ? "text-green-600" : matchScore >= 50 ? "text-yellow-600" : "text-gray-500"}`}>
                {matchScore}%
              </p>
              <p className="text-xs text-muted-foreground">매칭률</p>
            </div>
          )}
        </div>
      </button>
    );
  }

  if (variant === "horizontal") {
    return (
      <button
        onClick={onClick}
        className="w-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all text-left"
      >
        <div className="flex">
          {/* 썸네일 */}
          <div className="w-28 h-28 bg-muted flex-shrink-0">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home size={32} className="text-muted-foreground" />
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <SourceBadge source={source} />
                  {dDay && (
                    <span className="text-xs font-bold text-red-500">{dDay}</span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground truncate">{name}</h3>
                <p className="text-sm text-muted-foreground truncate">{location}</p>
              </div>

              {showMatchScore && matchScore !== undefined && (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  matchScore >= 80 ? "bg-green-500" : matchScore >= 50 ? "bg-yellow-500" : "bg-gray-400"
                }`}>
                  {matchScore}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{supplyTypeLabels[supplyType] || supplyType}</span>
              {minPrice && <span>{formatPrice(minPrice)}~</span>}
            </div>
          </div>
        </div>
      </button>
    );
  }

  // Default variant
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
      {/* 썸네일 영역 */}
      <div className="relative h-40 bg-muted">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <Home size={48} className="text-primary/30" />
          </div>
        )}

        {/* 상단 뱃지들 */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            <SourceBadge source={source} />
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusConfig[status].className}`}>
              {statusConfig[status].label}
            </span>
          </div>

          {/* 즐겨찾기 버튼 */}
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {/* D-Day 표시 */}
        {dDay && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {dDay}
          </div>
        )}

        {/* 매칭률 */}
        {showMatchScore && matchScore !== undefined && (
          <div className="absolute bottom-3 right-3">
            <div className={`px-3 py-1.5 rounded-full text-sm font-bold text-white ${
              matchScore >= 80 ? "bg-green-500" : matchScore >= 50 ? "bg-yellow-500" : "bg-gray-500"
            }`}>
              <TrendingUp size={14} className="inline mr-1" />
              {matchScore}%
            </div>
          </div>
        )}
      </div>

      {/* 내용 영역 */}
      <button onClick={onClick} className="w-full p-4 text-left">
        <div className="mb-2">
          <h3 className="font-bold text-foreground text-lg leading-tight">{name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin size={14} />
            {location}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="bg-muted px-2 py-1 rounded">
            {supplyTypeLabels[supplyType] || supplyType}
          </span>
          <span>·</span>
          <span>{totalUnits.toLocaleString()}세대</span>
          {developer && (
            <>
              <span>·</span>
              <span>{developer}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(applicationStartDate)} ~ {formatDate(applicationEndDate)}
            </p>
            {minPrice && (
              <p className="text-sm font-semibold text-foreground mt-1">
                {formatPrice(minPrice)}
                {maxPrice && maxPrice !== minPrice && ` ~ ${formatPrice(maxPrice)}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEligible && eligibilityTier && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {eligibilityTier}
              </span>
            )}
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>
        </div>
      </button>
    </div>
  );
}
