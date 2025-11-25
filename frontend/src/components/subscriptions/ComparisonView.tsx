import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Check, Minus, AlertCircle } from "lucide-react";
import { getComparisonItems, removeFromComparison, clearComparison } from "@/api/favorites";
import { useSubscriptionDetail } from "@/api/subscription";
import type { Subscription } from "@/types/Subscription";

interface ComparisonViewProps {
  onClose?: () => void;
  onSubscriptionClick?: (subscriptionId: string) => void;
  className?: string;
}

/**
 * 청약 비교 뷰 컴포넌트
 *
 * 최대 4개 청약을 나란히 비교 (테이블 형식)
 */
export function ComparisonView({
  onClose,
  onSubscriptionClick,
  className = "",
}: ComparisonViewProps) {
  const [subscriptionIds, setSubscriptionIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 비교 목록 로드
  useEffect(() => {
    setSubscriptionIds(getComparisonItems());
  }, []);

  // 항목 제거
  const handleRemove = (id: string) => {
    removeFromComparison(id);
    setSubscriptionIds((prev) => prev.filter((i) => i !== id));
  };

  // 전체 초기화
  const handleClearAll = () => {
    clearComparison();
    setSubscriptionIds([]);
    onClose?.();
  };

  // 빈 상태
  if (subscriptionIds.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">비교할 청약이 없어요</h3>
        <p className="text-sm text-muted-foreground text-center">
          청약 카드에서 비교하기를 선택해주세요
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            돌아가기
          </button>
        )}
      </div>
    );
  }

  // 모바일에서는 카드 스와이프, 데스크탑에서는 테이블
  return (
    <div className={`flex flex-col ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">청약 비교</h2>
          <p className="text-sm text-muted-foreground">{subscriptionIds.length}개 비교 중</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearAll}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            전체 삭제
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 모바일: 카드 슬라이더 */}
      <div className="md:hidden">
        <div className="relative">
          {/* 네비게이션 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-muted disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {subscriptionIds.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(subscriptionIds.length - 1, prev + 1))}
              disabled={currentIndex === subscriptionIds.length - 1}
              className="p-2 rounded-full bg-muted disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* 현재 카드 */}
          <ComparisonCard
            subscriptionId={subscriptionIds[currentIndex]}
            onRemove={() => handleRemove(subscriptionIds[currentIndex])}
            onClick={() => onSubscriptionClick?.(subscriptionIds[currentIndex])}
          />
        </div>
      </div>

      {/* 데스크탑: 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <ComparisonTable
          subscriptionIds={subscriptionIds}
          onRemove={handleRemove}
          onClick={onSubscriptionClick}
        />
      </div>
    </div>
  );
}

// 비교 카드 (모바일)
interface ComparisonCardProps {
  subscriptionId: string;
  onRemove: () => void;
  onClick: () => void;
}

function ComparisonCard({ subscriptionId, onRemove, onClick }: ComparisonCardProps) {
  const { data, isLoading } = useSubscriptionDetail(subscriptionId);

  if (isLoading) {
    return <div className="bg-card border border-border rounded-2xl h-80 animate-pulse" />;
  }

  if (!data) {
    return null;
  }

  const subscription = data.subscription;

  const formatPrice = (price?: number) => {
    if (!price) return "-";
    if (price >= 10000) return `${(price / 10000).toFixed(1)}억`;
    return `${price.toLocaleString()}만`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground">{subscription.name}</h3>
          <p className="text-sm text-muted-foreground">{subscription.location}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-full hover:bg-muted transition-colors"
        >
          <X size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* 매칭률 */}
      {subscription.matchScore !== undefined && (
        <div className="mb-4 p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-3xl font-bold text-primary">{subscription.matchScore}%</p>
          <p className="text-sm text-muted-foreground">매칭률</p>
        </div>
      )}

      {/* 정보 */}
      <div className="space-y-3">
        <InfoRow label="시행사" value={subscription.developer} />
        <InfoRow label="총 세대수" value={`${subscription.totalUnits?.toLocaleString()}세대`} />
        <InfoRow label="분양가" value={`${formatPrice(subscription.minPrice)} ~ ${formatPrice(subscription.maxPrice)}`} />
        <InfoRow label="청약 기간" value={`${subscription.applicationStartDate} ~ ${subscription.applicationEndDate}`} />
        <InfoRow
          label="자격"
          value={subscription.isEligible ? subscription.eligibilityTier || "해당" : "미해당"}
          valueColor={subscription.isEligible ? "text-green-600" : "text-red-600"}
        />
      </div>

      {/* 상세 버튼 */}
      <button
        onClick={onClick}
        className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
      >
        상세 보기
      </button>
    </div>
  );
}

// 정보 행
function InfoRow({ label, value, valueColor }: { label: string; value?: string; valueColor?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${valueColor || "text-foreground"}`}>{value || "-"}</span>
    </div>
  );
}

// 비교 테이블 (데스크탑)
interface ComparisonTableProps {
  subscriptionIds: string[];
  onRemove: (id: string) => void;
  onClick?: (id: string) => void;
}

function ComparisonTable({ subscriptionIds, onRemove, onClick }: ComparisonTableProps) {
  // 각 청약 데이터 로드
  const subscriptions: (Subscription | undefined)[] = subscriptionIds.map((id) => {
    const { data } = useSubscriptionDetail(id);
    return data?.subscription;
  });

  const formatPrice = (price?: number) => {
    if (!price) return "-";
    if (price >= 10000) return `${(price / 10000).toFixed(1)}억`;
    return `${price.toLocaleString()}만`;
  };

  const compareFields = [
    { key: "matchScore", label: "매칭률", format: (v?: number) => v !== undefined ? `${v}%` : "-" },
    { key: "location", label: "위치" },
    { key: "developer", label: "시행사" },
    { key: "supplyType", label: "공급유형", format: (v?: string) => {
      const labels: Record<string, string> = {
        PUBLIC: "공공분양",
        PRIVATE: "민간분양",
        NEWLYWED: "신혼희망타운",
      };
      return labels[v || ""] || v || "-";
    }},
    { key: "totalUnits", label: "총 세대수", format: (v?: number) => v ? `${v.toLocaleString()}세대` : "-" },
    { key: "minPrice", label: "최저 분양가", format: formatPrice },
    { key: "maxPrice", label: "최고 분양가", format: formatPrice },
    { key: "applicationStartDate", label: "청약 시작일" },
    { key: "applicationEndDate", label: "청약 마감일" },
    { key: "isEligible", label: "자격 여부", format: (v?: boolean) => v ? "해당" : "미해당" },
    { key: "eligibilityTier", label: "자격 순위" },
  ];

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="text-left p-4 bg-muted font-medium text-muted-foreground w-32">항목</th>
          {subscriptions.map((sub, idx) => (
            <th key={subscriptionIds[idx]} className="p-4 bg-muted min-w-[200px]">
              <div className="flex items-start justify-between gap-2">
                <div className="text-left">
                  <p className="font-semibold text-foreground">{sub?.name || "로딩 중..."}</p>
                  <p className="text-sm text-muted-foreground font-normal">{sub?.location}</p>
                </div>
                <button
                  onClick={() => onRemove(subscriptionIds[idx])}
                  className="p-1 rounded hover:bg-background transition-colors"
                >
                  <X size={14} className="text-muted-foreground" />
                </button>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {compareFields.map((field) => (
          <tr key={field.key} className="border-t border-border">
            <td className="p-4 text-sm text-muted-foreground font-medium">{field.label}</td>
            {subscriptions.map((sub, idx) => {
              const value = sub?.[field.key as keyof Subscription];
              const displayValue = field.format
                ? field.format(value as any)
                : (value as string) || "-";

              // 최고값 하이라이트
              const isHighlight = field.key === "matchScore" && sub?.matchScore !== undefined &&
                sub.matchScore === Math.max(...subscriptions.filter(Boolean).map((s) => s?.matchScore || 0));

              return (
                <td
                  key={subscriptionIds[idx]}
                  className={`p-4 text-sm ${
                    field.key === "isEligible"
                      ? value
                        ? "text-green-600"
                        : "text-red-600"
                      : isHighlight
                      ? "text-primary font-bold"
                      : "text-foreground"
                  }`}
                >
                  {field.key === "isEligible" ? (
                    <span className="flex items-center gap-1">
                      {value ? <Check size={14} /> : <Minus size={14} />}
                      {displayValue}
                    </span>
                  ) : (
                    displayValue
                  )}
                </td>
              );
            })}
          </tr>
        ))}
        {/* 상세 보기 버튼 */}
        <tr className="border-t border-border">
          <td className="p-4"></td>
          {subscriptionIds.map((id) => (
            <td key={id} className="p-4">
              <button
                onClick={() => onClick?.(id)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                상세 보기
              </button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default ComparisonView;
