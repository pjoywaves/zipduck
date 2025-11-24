// PDF Types for ZipDuck

/** PDF 처리 상태 */
export type PdfProcessingStatus =
  | "PENDING" // 업로드 대기
  | "UPLOADING" // 업로드 중
  | "PROCESSING" // 처리 중
  | "OCR_IN_PROGRESS" // OCR 진행 중
  | "ANALYZING" // AI 분석 중
  | "COMPLETED" // 완료
  | "FAILED"; // 실패

/** OCR 품질 */
export type OcrQuality = "HIGH" | "MEDIUM" | "LOW" | "NONE";

/** PDF 문서 정보 */
export interface PdfDocument {
  id: string;
  userId: string;
  fileName: string;
  originalFileName: string;
  fileSize: number; // bytes
  mimeType: string;
  status: PdfProcessingStatus;
  hasOcr: boolean;
  ocrQuality?: OcrQuality;
  pageCount?: number;
  uploadedAt: string;
  processedAt?: string;
  errorMessage?: string;
}

/** PDF 업로드 요청 */
export interface PdfUploadRequest {
  file: File;
  userId?: string;
}

/** PDF 업로드 응답 */
export interface PdfUploadResponse {
  pdfId: string;
  fileName: string;
  status: PdfProcessingStatus;
  uploadedAt: string;
}

/** PDF 상태 조회 응답 */
export interface PdfStatusResponse {
  pdfId: string;
  status: PdfProcessingStatus;
  progress: number; // 0-100
  currentStep?: string;
  estimatedTimeRemaining?: number; // seconds
  hasOcr?: boolean;
  ocrQuality?: OcrQuality;
  errorMessage?: string;
}

/** PDF 분석 결과 */
export interface PdfAnalysisResult {
  pdfId: string;
  status: "SUCCESS" | "PARTIAL" | "FAILED";

  // 추출된 텍스트
  extractedText?: string;
  textConfidence?: number; // 0-100

  // OCR 정보
  hasOcr: boolean;
  ocrQuality?: OcrQuality;
  ocrWarnings?: string[];

  // 추출된 청약 정보
  extractedSubscription?: ExtractedSubscriptionInfo;

  // 자격 분석 결과
  eligibilityAnalysis?: PdfEligibilityAnalysis;

  // 처리 정보
  processingTimeMs: number;
  analyzedAt: string;
}

/** 추출된 청약 정보 */
export interface ExtractedSubscriptionInfo {
  name?: string;
  location?: string;
  developer?: string;
  supplyType?: string;
  totalUnits?: number;
  applicationStartDate?: string;
  applicationEndDate?: string;
  announcementDate?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: ExtractedSizeInfo[];
  requirements?: ExtractedRequirement[];
  confidence: number; // 추출 신뢰도 0-100
}

/** 추출된 평형 정보 */
export interface ExtractedSizeInfo {
  sizeType: string;
  exclusiveArea?: number;
  supplyUnits?: number;
  price?: number;
}

/** 추출된 자격 요건 */
export interface ExtractedRequirement {
  category: string;
  description: string;
  value?: string;
  confidence: number;
}

/** PDF 자격 분석 결과 */
export interface PdfEligibilityAnalysis {
  isEligible: boolean;
  matchScore: number; // 0-100
  tier?: string; // 1순위, 2순위 등
  summary: string;
  requirements: AnalyzedRequirement[];
  recommendations: string[];
}

/** 분석된 자격 요건 */
export interface AnalyzedRequirement {
  name: string;
  description: string;
  category: RequirementCategory;
  isMet: boolean;
  userValue?: string | number;
  requiredValue?: string | number;
  importance: "HIGH" | "MEDIUM" | "LOW";
  note?: string;
}

/** 요건 카테고리 */
export type RequirementCategory =
  | "INCOME" // 소득
  | "ASSET" // 자산
  | "HOUSING" // 주택소유
  | "REGION" // 지역
  | "AGE" // 나이
  | "HOUSEHOLD" // 가구
  | "SUBSCRIPTION" // 청약통장
  | "SPECIAL"; // 특별공급 자격

/** PDF 목록 조회 요청 */
export interface PdfListRequest {
  userId?: string;
  status?: PdfProcessingStatus;
  page?: number;
  size?: number;
}

/** PDF 목록 조회 응답 */
export interface PdfListResponse {
  content: PdfDocument[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** 파일 검증 결과 */
export interface FileValidationResult {
  isValid: boolean;
  errors: FileValidationError[];
}

/** 파일 검증 에러 */
export interface FileValidationError {
  code: "INVALID_TYPE" | "TOO_LARGE" | "TOO_SMALL" | "CORRUPTED" | "EMPTY";
  message: string;
}

/** 파일 업로드 진행 상태 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
