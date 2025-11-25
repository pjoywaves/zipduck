import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./client";
import { queryKeys } from "@/lib/queryClient";
import type {
  PdfDocument,
  PdfUploadRequest,
  PdfUploadResponse,
  PdfStatusResponse,
  PdfAnalysisResult,
  PdfListResponse,
  PdfProcessingStatus,
  UploadProgress,
} from "@/types/Pdf";

// ===== 더미 데이터 =====

const DUMMY_PDF_DOCUMENTS: PdfDocument[] = [
  {
    id: "pdf-001",
    userId: "user-001",
    fileName: "래미안원베일리_모집공고.pdf",
    originalFileName: "래미안원베일리_모집공고.pdf",
    fileSize: 2500000,
    mimeType: "application/pdf",
    status: "COMPLETED",
    hasOcr: false,
    pageCount: 45,
    uploadedAt: "2025-01-20T10:00:00Z",
    processedAt: "2025-01-20T10:02:30Z",
  },
  {
    id: "pdf-002",
    userId: "user-001",
    fileName: "힐스테이트판교_공고문.pdf",
    originalFileName: "힐스테이트판교_공고문.pdf",
    fileSize: 3200000,
    mimeType: "application/pdf",
    status: "COMPLETED",
    hasOcr: true,
    ocrQuality: "HIGH",
    pageCount: 62,
    uploadedAt: "2025-01-18T14:30:00Z",
    processedAt: "2025-01-18T14:35:00Z",
  },
];

const DUMMY_ANALYSIS_RESULT: PdfAnalysisResult = {
  pdfId: "pdf-001",
  status: "SUCCESS",
  extractedText: "래미안 원베일리 입주자 모집공고...",
  textConfidence: 95,
  hasOcr: false,
  extractedSubscription: {
    name: "래미안 원베일리",
    location: "서울특별시 서초구 반포동",
    developer: "삼성물산",
    supplyType: "민간분양",
    totalUnits: 2990,
    applicationStartDate: "2025-02-01",
    applicationEndDate: "2025-02-07",
    minPrice: 150000,
    maxPrice: 450000,
    confidence: 92,
  },
  eligibilityAnalysis: {
    isEligible: true,
    matchScore: 85,
    tier: "1순위",
    summary: "대부분의 자격 요건을 충족합니다.",
    requirements: [
      { name: "소득요건", description: "도시근로자 평균소득 130% 이하", category: "INCOME", isMet: true, importance: "HIGH" },
      { name: "무주택요건", description: "무주택세대구성원", category: "HOUSING", isMet: true, importance: "HIGH" },
      { name: "청약통장", description: "24개월 이상 납입", category: "SUBSCRIPTION", isMet: false, userValue: "18개월", requiredValue: "24개월", importance: "MEDIUM" },
    ],
    recommendations: [
      "청약통장 6개월 추가 납입 시 1순위 자격 획득 가능",
      "생애최초 특별공급 자격도 검토해보세요",
    ],
  },
  processingTimeMs: 15000,
  analyzedAt: "2025-01-20T10:02:30Z",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== API 함수 =====

/** PDF 업로드 */
async function uploadPdf(
  request: PdfUploadRequest,
  onProgress?: (progress: UploadProgress) => void
): Promise<PdfUploadResponse> {
  // TODO: 실제 API 연동
  // const formData = new FormData();
  // formData.append("file", request.file);
  // const response = await api.post<ApiResponse<PdfUploadResponse>>("/pdf/upload", formData, {
  //   headers: { "Content-Type": "multipart/form-data" },
  //   onUploadProgress: (event) => {
  //     if (onProgress && event.total) {
  //       onProgress({
  //         loaded: event.loaded,
  //         total: event.total,
  //         percentage: Math.round((event.loaded / event.total) * 100),
  //       });
  //     }
  //   },
  // });
  // return response.data.data;

  // 업로드 시뮬레이션
  const totalSize = request.file.size;
  let loaded = 0;
  const chunkSize = totalSize / 10;

  for (let i = 0; i < 10; i++) {
    await delay(200);
    loaded = Math.min(loaded + chunkSize, totalSize);
    onProgress?.({
      loaded,
      total: totalSize,
      percentage: Math.round((loaded / totalSize) * 100),
    });
  }

  const pdfId = `pdf-${Date.now()}`;
  return {
    pdfId,
    fileName: request.file.name,
    status: "PROCESSING",
    uploadedAt: new Date().toISOString(),
  };
}

/** PDF 상태 조회 */
async function fetchPdfStatus(pdfId: string): Promise<PdfStatusResponse> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<PdfStatusResponse>>(`/pdf/${pdfId}/status`);
  // return response.data.data;

  await delay(500);

  // 시뮬레이션: 상태 진행
  const storedStatus = sessionStorage.getItem(`pdf-status-${pdfId}`);
  let progress = storedStatus ? parseInt(storedStatus) : 0;

  progress = Math.min(progress + 20, 100);
  sessionStorage.setItem(`pdf-status-${pdfId}`, progress.toString());

  const steps = [
    { progress: 0, status: "PROCESSING" as PdfProcessingStatus, step: "파일 처리 중" },
    { progress: 20, status: "OCR_IN_PROGRESS" as PdfProcessingStatus, step: "텍스트 추출 중" },
    { progress: 40, status: "OCR_IN_PROGRESS" as PdfProcessingStatus, step: "OCR 처리 중" },
    { progress: 60, status: "ANALYZING" as PdfProcessingStatus, step: "AI 분석 중" },
    { progress: 80, status: "ANALYZING" as PdfProcessingStatus, step: "자격 요건 분석 중" },
    { progress: 100, status: "COMPLETED" as PdfProcessingStatus, step: "분석 완료" },
  ];

  const currentStep = steps.find((s) => s.progress >= progress) || steps[steps.length - 1];

  return {
    pdfId,
    status: currentStep.status,
    progress,
    currentStep: currentStep.step,
    estimatedTimeRemaining: Math.max(0, (100 - progress) / 10),
    hasOcr: progress >= 40,
    ocrQuality: progress >= 40 ? "HIGH" : undefined,
  };
}

/** PDF 분석 결과 조회 */
async function fetchPdfAnalysis(pdfId: string): Promise<PdfAnalysisResult> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<PdfAnalysisResult>>(`/pdf/${pdfId}/analysis`);
  // return response.data.data;

  await delay(600);
  return { ...DUMMY_ANALYSIS_RESULT, pdfId };
}

/** PDF 목록 조회 */
async function fetchPdfList(userId: string): Promise<PdfListResponse> {
  // TODO: 실제 API 연동
  // const response = await api.get<ApiResponse<PdfListResponse>>(`/pdf/list`, { params: { userId } });
  // return response.data.data;

  await delay(500);
  return {
    content: DUMMY_PDF_DOCUMENTS,
    page: 0,
    size: 10,
    totalElements: DUMMY_PDF_DOCUMENTS.length,
    totalPages: 1,
  };
}

/** PDF 삭제 */
async function deletePdf(pdfId: string): Promise<void> {
  // TODO: 실제 API 연동
  // await api.delete(`/pdf/${pdfId}`);

  await delay(300);
}

// ===== React Query Hooks =====

/** PDF 업로드 */
export function usePdfUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ request, onProgress }: { request: PdfUploadRequest; onProgress?: (progress: UploadProgress) => void }) =>
      uploadPdf(request, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pdf.all });
    },
  });
}

/** PDF 상태 조회 */
export function usePdfStatus(pdfId: string, options?: { enabled?: boolean; refetchInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.pdf.status(pdfId),
    queryFn: () => fetchPdfStatus(pdfId),
    enabled: options?.enabled !== false && !!pdfId,
    refetchInterval: options?.refetchInterval ?? 2000,
  });
}

/** PDF 분석 결과 조회 */
export function usePdfAnalysis(pdfId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.pdf.analysis(pdfId),
    queryFn: () => fetchPdfAnalysis(pdfId),
    enabled: options?.enabled !== false && !!pdfId,
  });
}

/** PDF 목록 조회 */
export function usePdfList(userId: string) {
  return useQuery({
    queryKey: queryKeys.pdf.list(userId),
    queryFn: () => fetchPdfList(userId),
    enabled: !!userId,
  });
}

/** PDF 삭제 */
export function useDeletePdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePdf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pdf.all });
    },
  });
}
