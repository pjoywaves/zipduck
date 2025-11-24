import { useState, useEffect, useCallback } from "react";
import { usePdfStatus as usePdfStatusQuery, usePdfAnalysis } from "@/services/pdfService";
import type { PdfProcessingStatus, PdfStatusResponse, PdfAnalysisResult } from "@/types/Pdf";

const DEFAULT_POLLING_INTERVAL = 2000; // 2초

/**
 * PDF 처리 상태 폴링 훅
 *
 * 2초 간격으로 상태를 조회하고, 완료/실패 시 자동 중단
 */
export function usePdfStatusPolling(
  pdfId: string | null,
  options?: {
    pollingInterval?: number;
    onComplete?: (result: PdfAnalysisResult) => void;
    onError?: (error: Error) => void;
    autoStart?: boolean;
  }
) {
  const {
    pollingInterval = DEFAULT_POLLING_INTERVAL,
    onComplete,
    onError,
    autoStart = true,
  } = options || {};

  const [isPolling, setIsPolling] = useState(autoStart && !!pdfId);

  // 상태 쿼리
  const statusQuery = usePdfStatusQuery(pdfId || "", {
    enabled: isPolling && !!pdfId,
    refetchInterval: isPolling ? pollingInterval : false,
  });

  // 분석 결과 쿼리
  const analysisQuery = usePdfAnalysis(pdfId || "", {
    enabled: statusQuery.data?.status === "COMPLETED",
  });

  // 완료/실패 시 폴링 중단
  useEffect(() => {
    if (!statusQuery.data) return;

    const { status } = statusQuery.data;

    if (status === "COMPLETED") {
      setIsPolling(false);
    } else if (status === "FAILED") {
      setIsPolling(false);
      onError?.(new Error(statusQuery.data.errorMessage || "처리 중 오류가 발생했습니다."));
    }
  }, [statusQuery.data, onError]);

  // 분석 완료 시 콜백
  useEffect(() => {
    if (analysisQuery.data && statusQuery.data?.status === "COMPLETED") {
      onComplete?.(analysisQuery.data);
    }
  }, [analysisQuery.data, statusQuery.data?.status, onComplete]);

  // 폴링 시작
  const startPolling = useCallback(() => {
    if (pdfId) {
      setIsPolling(true);
    }
  }, [pdfId]);

  // 폴링 중단
  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  // 현재 단계 라벨
  const getStepLabel = useCallback((status: PdfProcessingStatus): string => {
    const labels: Record<PdfProcessingStatus, string> = {
      PENDING: "대기 중",
      UPLOADING: "업로드 중",
      PROCESSING: "파일 처리 중",
      OCR_IN_PROGRESS: "텍스트 추출 중",
      ANALYZING: "AI 분석 중",
      COMPLETED: "분석 완료",
      FAILED: "처리 실패",
    };
    return labels[status] || status;
  }, []);

  // 진행률 색상
  const getProgressColor = useCallback((status: PdfProcessingStatus): string => {
    if (status === "COMPLETED") return "bg-green-500";
    if (status === "FAILED") return "bg-red-500";
    return "bg-primary";
  }, []);

  return {
    // 상태 데이터
    status: statusQuery.data,
    analysis: analysisQuery.data,

    // 로딩/에러
    isLoading: statusQuery.isLoading,
    isAnalysisLoading: analysisQuery.isLoading,
    error: statusQuery.error,
    analysisError: analysisQuery.error,

    // 폴링 제어
    isPolling,
    startPolling,
    stopPolling,

    // 유틸리티
    getStepLabel,
    getProgressColor,

    // 상태 플래그
    isProcessing: statusQuery.data?.status !== "COMPLETED" && statusQuery.data?.status !== "FAILED",
    isComplete: statusQuery.data?.status === "COMPLETED",
    isFailed: statusQuery.data?.status === "FAILED",
  };
}

/**
 * 여러 PDF 상태를 동시에 추적하는 훅
 */
export function useMultiplePdfStatus(pdfIds: string[]) {
  const [statuses, setStatuses] = useState<Map<string, PdfStatusResponse>>(new Map());

  // 각 PDF ID에 대해 상태 폴링
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    pdfIds.forEach((pdfId) => {
      // 이미 완료된 것은 건너뛰기
      const current = statuses.get(pdfId);
      if (current?.status === "COMPLETED" || current?.status === "FAILED") {
        return;
      }

      // 폴링 시작은 개별 쿼리에서 처리
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [pdfIds, statuses]);

  const allCompleted = pdfIds.every((id) => {
    const status = statuses.get(id);
    return status?.status === "COMPLETED" || status?.status === "FAILED";
  });

  const successCount = pdfIds.filter((id) => statuses.get(id)?.status === "COMPLETED").length;
  const failedCount = pdfIds.filter((id) => statuses.get(id)?.status === "FAILED").length;

  return {
    statuses,
    allCompleted,
    successCount,
    failedCount,
    totalCount: pdfIds.length,
  };
}
