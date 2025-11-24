import type { PdfAnalysisResult } from "@/types/Pdf";
import { getMatchScoreColor, getMatchScoreLabel } from "@/services/eligibilityService";

interface AnalysisResultDisplayProps {
  result: PdfAnalysisResult;
  onViewDetails?: () => void;
  onSaveSubscription?: () => void;
  className?: string;
}

/**
 * PDF 분석 결과 표시 컴포넌트
 *
 * 추출된 청약 정보, 자격 분석 결과, 추천 사항 표시
 */
export function AnalysisResultDisplay({
  result,
  onViewDetails,
  onSaveSubscription,
  className = "",
}: AnalysisResultDisplayProps) {
  const { extractedSubscription, eligibilityAnalysis } = result;

  // 매칭 점수 색상 클래스
  const getScoreColorClass = (score: number): string => {
    const color = getMatchScoreColor(score);
    const colorMap: Record<string, string> = {
      green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* 헤더 - 분석 성공 */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">분석 완료</h3>
            <p className="text-sm text-muted-foreground">
              처리 시간: {(result.processingTimeMs / 1000).toFixed(1)}초
              {result.hasOcr && " (OCR 포함)"}
            </p>
          </div>
        </div>
      </div>

      {/* 추출된 청약 정보 */}
      {extractedSubscription && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">청약 정보</h4>

          <div className="space-y-4">
            {/* 청약명 */}
            <div>
              <h5 className="text-xl font-bold text-foreground">{extractedSubscription.name}</h5>
              <p className="text-sm text-muted-foreground">{extractedSubscription.location}</p>
            </div>

            {/* 정보 그리드 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">시행사</span>
                <p className="font-medium text-foreground">{extractedSubscription.developer}</p>
              </div>
              <div>
                <span className="text-muted-foreground">공급유형</span>
                <p className="font-medium text-foreground">{extractedSubscription.supplyType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">총 세대수</span>
                <p className="font-medium text-foreground">{extractedSubscription.totalUnits?.toLocaleString()}세대</p>
              </div>
              <div>
                <span className="text-muted-foreground">청약 기간</span>
                <p className="font-medium text-foreground">
                  {extractedSubscription.applicationStartDate} ~ {extractedSubscription.applicationEndDate}
                </p>
              </div>
              {extractedSubscription.minPrice && extractedSubscription.maxPrice && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">분양가</span>
                  <p className="font-medium text-foreground">
                    {extractedSubscription.minPrice.toLocaleString()}만원 ~ {extractedSubscription.maxPrice.toLocaleString()}만원
                  </p>
                </div>
              )}
            </div>

            {/* 신뢰도 */}
            {extractedSubscription.confidence && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">추출 신뢰도</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${extractedSubscription.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {extractedSubscription.confidence}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 자격 분석 결과 */}
      {eligibilityAnalysis && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">자격 분석</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColorClass(eligibilityAnalysis.matchScore)}`}>
              {getMatchScoreLabel(eligibilityAnalysis.matchScore)} ({eligibilityAnalysis.matchScore}점)
            </div>
          </div>

          {/* 자격 여부 */}
          <div className={`p-4 rounded-lg mb-4 ${
            eligibilityAnalysis.isEligible
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-yellow-50 dark:bg-yellow-900/20"
          }`}>
            <div className="flex items-center gap-2">
              {eligibilityAnalysis.isEligible ? (
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              <span className={`font-medium ${
                eligibilityAnalysis.isEligible
                  ? "text-green-700 dark:text-green-400"
                  : "text-yellow-700 dark:text-yellow-400"
              }`}>
                {eligibilityAnalysis.tier} - {eligibilityAnalysis.summary}
              </span>
            </div>
          </div>

          {/* 요건 목록 */}
          {eligibilityAnalysis.requirements && eligibilityAnalysis.requirements.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground mb-2">주요 요건</h5>
              {eligibilityAnalysis.requirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    req.isMet ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {req.isMet ? (
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                    <div>
                      <span className="text-sm font-medium text-foreground">{req.name}</span>
                      <p className="text-xs text-muted-foreground">{req.description}</p>
                    </div>
                  </div>
                  {!req.isMet && req.userValue && req.requiredValue && (
                    <div className="text-xs text-right">
                      <span className="text-red-600 dark:text-red-400">{req.userValue}</span>
                      <span className="text-muted-foreground"> / {req.requiredValue}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 추천 사항 */}
          {eligibilityAnalysis.recommendations && eligibilityAnalysis.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h5 className="text-sm font-medium text-muted-foreground mb-2">추천 사항</h5>
              <ul className="space-y-2">
                {eligibilityAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span className="text-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex-1 py-3 px-4 border border-primary text-primary rounded-lg font-medium
                       hover:bg-primary/5 transition-colors"
          >
            상세 정보 보기
          </button>
        )}
        {onSaveSubscription && (
          <button
            onClick={onSaveSubscription}
            className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium
                       hover:bg-primary/90 transition-colors"
          >
            청약 정보 저장
          </button>
        )}
      </div>
    </div>
  );
}

export default AnalysisResultDisplay;
