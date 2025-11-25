import { useState } from "react";
import type { EligibilityResult, RequirementGroup, EligibilityRequirement } from "@/types/Eligibility";
import { groupRequirementsByCategory, getMatchScoreColor, getMatchScoreLabel } from "@/api/eligibility";
import { TIER_LABELS } from "@/types/Eligibility";

interface EligibilityBreakdownProps {
  result: EligibilityResult;
  showRecommendations?: boolean;
  expandedByDefault?: boolean;
  className?: string;
}

/**
 * 자격 요건 상세 분석 컴포넌트
 *
 * 카테고리별 요건 충족 현황, 매칭 점수, 추천 사항 표시
 */
export function EligibilityBreakdown({
  result,
  showRecommendations = true,
  expandedByDefault = false,
  className = "",
}: EligibilityBreakdownProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    expandedByDefault ? new Set(["INCOME", "HOUSING", "SUBSCRIPTION"]) : new Set()
  );

  const groups = groupRequirementsByCategory(result);

  // 카테고리 토글
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // 매칭 점수 색상 클래스
  const getScoreColorClass = (score: number): string => {
    const color = getMatchScoreColor(score);
    const colorMap: Record<string, string> = {
      green: "text-green-600 dark:text-green-400",
      blue: "text-blue-600 dark:text-blue-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
      orange: "text-orange-600 dark:text-orange-400",
      red: "text-red-600 dark:text-red-400",
    };
    return colorMap[color] || colorMap.blue;
  };

  const getScoreBgClass = (score: number): string => {
    const color = getMatchScoreColor(score);
    const colorMap: Record<string, string> = {
      green: "bg-green-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
    };
    return colorMap[color] || colorMap.blue;
  };

  // 중요도 배지
  const ImportanceBadge = ({ importance }: { importance: string }) => {
    const colors: Record<string, string> = {
      HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      LOW: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    const labels: Record<string, string> = {
      HIGH: "필수",
      MEDIUM: "중요",
      LOW: "선택",
    };

    return (
      <span className={`text-xs px-1.5 py-0.5 rounded ${colors[importance] || colors.LOW}`}>
        {labels[importance] || importance}
      </span>
    );
  };

  // 요건 항목
  const RequirementItem = ({ requirement }: { requirement: EligibilityRequirement }) => (
    <div
      className={`p-3 rounded-lg border ${
        requirement.isMet
          ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
          : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {requirement.isMet ? (
            <svg className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{requirement.name}</span>
              <ImportanceBadge importance={requirement.importance} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{requirement.description}</p>
          </div>
        </div>
      </div>

      {/* 값 비교 */}
      {(requirement.userValue !== undefined || requirement.requiredValue !== undefined) && (
        <div className="mt-2 pt-2 border-t border-border flex items-center gap-4 text-xs">
          {requirement.userValue !== undefined && (
            <div>
              <span className="text-muted-foreground">내 정보: </span>
              <span className={`font-medium ${requirement.isMet ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {requirement.userValue}
              </span>
            </div>
          )}
          {requirement.requiredValue !== undefined && (
            <div>
              <span className="text-muted-foreground">요건: </span>
              <span className="font-medium text-foreground">{requirement.requiredValue}</span>
            </div>
          )}
        </div>
      )}

      {/* 노트 */}
      {requirement.note && (
        <p className="mt-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          {requirement.note}
        </p>
      )}
    </div>
  );

  // 카테고리 그룹
  const CategoryGroup = ({ group }: { group: RequirementGroup }) => {
    const isExpanded = expandedCategories.has(group.category);

    return (
      <div className="border border-border rounded-lg overflow-hidden">
        {/* 헤더 */}
        <button
          onClick={() => toggleCategory(group.category)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="font-medium text-foreground">{group.categoryLabel}</span>
            <span className="text-sm text-muted-foreground">
              {group.metCount}/{group.totalCount} 충족
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* 점수 */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getScoreBgClass(group.score)}`}
                  style={{ width: `${group.score}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${getScoreColorClass(group.score)}`}>
                {group.score}%
              </span>
            </div>
            {/* 토글 아이콘 */}
            <svg
              className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {/* 요건 목록 */}
        {isExpanded && (
          <div className="p-4 pt-0 space-y-2 border-t border-border">
            {group.requirements.map((req) => (
              <RequirementItem key={req.id} requirement={req} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* 요약 헤더 */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">자격 분석 결과</h3>
            <p className="text-sm text-muted-foreground">
              {result.analyzedAt && new Date(result.analyzedAt).toLocaleDateString("ko-KR")} 분석
            </p>
          </div>
          {/* 순위 배지 */}
          {result.tier && (
            <div className={`px-4 py-2 rounded-lg text-center ${
              result.isEligible
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-gray-100 dark:bg-gray-800"
            }`}>
              <p className={`text-lg font-bold ${
                result.isEligible
                  ? "text-green-700 dark:text-green-400"
                  : "text-gray-700 dark:text-gray-400"
              }`}>
                {TIER_LABELS[result.tier]}
              </p>
              {result.tierDescription && (
                <p className="text-xs text-muted-foreground">{result.tierDescription}</p>
              )}
            </div>
          )}
        </div>

        {/* 매칭 점수 */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">매칭 점수</span>
              <span className={`text-lg font-bold ${getScoreColorClass(result.matchScore)}`}>
                {result.matchScore}점
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreBgClass(result.matchScore)}`}
                style={{ width: `${result.matchScore}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0</span>
              <span>{getMatchScoreLabel(result.matchScore)}</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {result.requirementsMet.length}
            </p>
            <p className="text-xs text-muted-foreground">충족</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {result.requirementsFailed.length}
            </p>
            <p className="text-xs text-muted-foreground">미충족</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {result.requirementsPartial?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground">부분 충족</p>
          </div>
        </div>
      </div>

      {/* 카테고리별 상세 */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">카테고리별 상세</h4>
        {groups.map((group) => (
          <CategoryGroup key={group.category} group={group} />
        ))}
      </div>

      {/* 추천 사항 */}
      {showRecommendations && result.recommendations.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">추천 사항</h4>
          <div className="space-y-4">
            {result.recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border ${
                  rec.type === "ACTION_REQUIRED"
                    ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                    : rec.type === "WARNING"
                    ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10"
                    : "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* 아이콘 */}
                  {rec.type === "ACTION_REQUIRED" ? (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ) : rec.type === "WARNING" ? (
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-foreground">{rec.title}</h5>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        rec.priority === "HIGH"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : rec.priority === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {rec.priority === "HIGH" ? "높음" : rec.priority === "MEDIUM" ? "중간" : "낮음"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>

                    {/* 액션 아이템 */}
                    {rec.actionItems && rec.actionItems.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {rec.actionItems.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* 예상 효과 */}
                    {rec.estimatedImpact && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                        예상 효과: {rec.estimatedImpact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EligibilityBreakdown;
