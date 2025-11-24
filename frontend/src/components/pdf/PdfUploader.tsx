import { useRef, useCallback } from "react";
import { usePdfUpload, useDragDrop } from "@/hooks/usePdfUpload";
import type { PdfUploadResponse } from "@/types/Pdf";

interface PdfUploaderProps {
  onUploadStart?: () => void;
  onUploadComplete?: (result: PdfUploadResponse) => void;
  onUploadError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * PDF 파일 업로드 컴포넌트
 *
 * 드래그 앤 드롭, 파일 선택, 검증, 업로드 진행률 표시
 */
export function PdfUploader({
  onUploadStart,
  onUploadComplete,
  onUploadError,
  disabled = false,
  className = "",
}: PdfUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    selectFile,
    validationResult,
    upload,
    uploadProgress,
    isUploading,
    uploadError,
    reset,
    formatFileSize,
    maxFileSize,
  } = usePdfUpload();

  // 파일 드롭 핸들러
  const handleFileDrop = useCallback(
    (file: File) => {
      if (!disabled) {
        selectFile(file);
      }
    },
    [disabled, selectFile]
  );

  const { isDragging, dragHandlers } = useDragDrop(handleFileDrop);

  // 파일 선택 핸들러
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        selectFile(file);
      }
      // 같은 파일 재선택 가능하도록 초기화
      e.target.value = "";
    },
    [selectFile]
  );

  // 업로드 실행
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    onUploadStart?.();

    try {
      const result = await upload();
      onUploadComplete?.(result);
      reset();
    } catch (error) {
      onUploadError?.(error instanceof Error ? error : new Error("업로드 실패"));
    }
  }, [selectedFile, upload, reset, onUploadStart, onUploadComplete, onUploadError]);

  // 파일 선택 영역 클릭
  const handleAreaClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  // 취소
  const handleCancel = useCallback(() => {
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [reset]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* 드래그 앤 드롭 영역 */}
      <div
        {...dragHandlers}
        onClick={handleAreaClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center gap-4
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
          }
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* 아이콘 */}
        <div className={`text-4xl ${isDragging ? "text-primary" : "text-muted-foreground"}`}>
          {isUploading ? (
            <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="12" y2="12" />
              <line x1="15" y1="15" x2="12" y2="12" />
            </svg>
          )}
        </div>

        {/* 안내 텍스트 */}
        <div className="text-center">
          <p className="text-foreground font-medium">
            {isDragging
              ? "여기에 파일을 놓으세요"
              : isUploading
              ? "업로드 중..."
              : "PDF 파일을 드래그하거나 클릭하여 선택"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            최대 {formatFileSize(maxFileSize)}까지 업로드 가능
          </p>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </div>

      {/* 검증 오류 */}
      {validationResult && !validationResult.isValid && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3">
          <ul className="list-disc list-inside text-sm space-y-1">
            {validationResult.errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 선택된 파일 정보 */}
      {selectedFile && validationResult?.isValid && (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* PDF 아이콘 */}
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xs font-bold">PDF</span>
              </div>
              <div>
                <p className="font-medium text-foreground truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {/* 액션 버튼 */}
            {!isUploading && (
              <button
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* 업로드 진행률 */}
          {uploadProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>업로드 중...</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 업로드 버튼 */}
      {selectedFile && validationResult?.isValid && !isUploading && (
        <button
          onClick={handleUpload}
          disabled={disabled}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium
                     hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          분석 시작
        </button>
      )}

      {/* 업로드 오류 */}
      {uploadError && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
          {uploadError.message}
        </div>
      )}
    </div>
  );
}

export default PdfUploader;
