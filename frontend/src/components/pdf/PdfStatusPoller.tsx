import { useEffect } from "react";
import { usePdfStatusPolling } from "@/hooks/usePdfStatus";
import type { PdfProcessingStatus, PdfAnalysisResult } from "@/types/Pdf";

interface PdfStatusPollerProps {
  pdfId: string | null;
  onComplete?: (result: PdfAnalysisResult) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
  className?: string;
}

/**
 * PDF 처리 상태 폴링 컴포넌트
 *
 * 2초 간격으로 상태 조회, 진행률 표시
 */
export function PdfStatusPoller({
  pdfId,
  onComplete,
  onError,
  autoStart = true,
  className = "",
}: PdfStatusPollerProps) {
  const {
    status,
    isLoading,
    isPolling,
    isComplete,
    isFailed,
    getStepLabel,
    getProgressColor,
    startPolling,
    stopPolling,
  } = usePdfStatusPolling(pdfId, {
    onComplete,
    onError,
    autoStart,
  });

  // 처리 단계 정의
  const steps: { status: PdfProcessingStatus; label: string }[] = [
    { status: "UPLOADING", label: "업로드" },
    { status: "PROCESSING", label: "처리" },
    { status: "OCR_IN_PROGRESS", label: "OCR" },
    { status: "ANALYZING", label: "분석" },
    { status: "COMPLETED", label: "완료" },
  ];

  // 현재 단계 인덱스
  const getCurrentStepIndex = (currentStatus: PdfProcessingStatus | undefined): number => {
    if (!currentStatus) return 0;
    const index = steps.findIndex((s) => s.status === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex(status?.status);

  if (!pdfId) {
    return null;
  }

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">PDF 분석 중</h3>
        {isPolling && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            처리 중
          </span>
        )}
      </div>

      {/* 로딩 상태 */}
      {isLoading && !status && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 진행 상태 표시 */}
      {status && (
        <>
          {/* 스텝 인디케이터 */}
          <div className="relative mb-8">
            {/* 배경 라인 */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted-foreground/20" />

            {/* 진행 라인 */}
            <div
              className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />

            {/* 스텝 아이콘 */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex || status.status === "COMPLETED";
                const isCurrent = index === currentStepIndex && status.status !== "COMPLETED";

                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        transition-all duration-300 z-10
                        ${isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                          ? "bg-primary/20 border-2 border-primary text-primary"
                          : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : isCurrent ? (
                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`
                        text-xs mt-2 transition-colors
                        ${isActive || isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 현재 상태 정보 */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                {status.currentStep || getStepLabel(status.status)}
              </span>
              <span className="text-sm text-muted-foreground">
                {status.progress}%
              </span>
            </div>

            {/* 진행률 바 */}
            <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${getProgressColor(status.status)}`}
                style={{ width: `${status.progress}%` }}
              />
            </div>

            {/* 예상 시간 */}
            {status.estimatedTimeRemaining !== undefined && status.estimatedTimeRemaining > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                예상 남은 시간: 약 {Math.ceil(status.estimatedTimeRemaining)}초
              </p>
            )}

            {/* OCR 정보 */}
            {status.hasOcr && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                  OCR 처리됨
                </span>
                {status.ocrQuality && (
                  <span className="text-xs text-muted-foreground">
                    품질: {status.ocrQuality === "HIGH" ? "높음" : status.ocrQuality === "MEDIUM" ? "보통" : "낮음"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 완료 상태 */}
          {isComplete && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="font-medium">분석이 완료되었습니다</span>
              </div>
            </div>
          )}

          {/* 실패 상태 */}
          {isFailed && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span className="font-medium">
                  {status.errorMessage || "처리 중 오류가 발생했습니다"}
                </span>
              </div>
              <button
                onClick={startPolling}
                className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
              >
                다시 시도
              </button>
            </div>
          )}
        </>
      )}

      {/* 제어 버튼 */}
      {!isComplete && !isFailed && status && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={stopPolling}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}

export default PdfStatusPoller;
