import { useState, useCallback } from "react";
import { usePdfUpload as usePdfUploadMutation } from "@/services/pdfService";
import type { UploadProgress, FileValidationResult, FileValidationError } from "@/types/Pdf";

// 파일 제한 상수
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["application/pdf"];
const ALLOWED_EXTENSIONS = [".pdf"];

/**
 * PDF 업로드 관리 커스텀 훅
 *
 * 파일 선택, 검증, 업로드, 진행률 추적 통합 관리
 */
export function usePdfUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);

  const uploadMutation = usePdfUploadMutation();

  // 파일 검증
  const validateFile = useCallback((file: File): FileValidationResult => {
    const errors: FileValidationError[] = [];

    // 파일 타입 검증
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (
      !ALLOWED_MIME_TYPES.includes(file.type) &&
      !ALLOWED_EXTENSIONS.includes(extension)
    ) {
      errors.push({
        code: "INVALID_TYPE",
        message: "PDF 파일만 업로드할 수 있습니다.",
      });
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      errors.push({
        code: "TOO_LARGE",
        message: `파일 크기는 ${MAX_FILE_SIZE / (1024 * 1024)}MB를 초과할 수 없습니다.`,
      });
    }

    if (file.size === 0) {
      errors.push({
        code: "EMPTY",
        message: "빈 파일은 업로드할 수 없습니다.",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  // 파일 선택
  const selectFile = useCallback(
    (file: File | null) => {
      if (!file) {
        setSelectedFile(null);
        setValidationResult(null);
        return;
      }

      const validation = validateFile(file);
      setValidationResult(validation);

      if (validation.isValid) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    },
    [validateFile]
  );

  // 업로드 실행
  const upload = useCallback(async () => {
    if (!selectedFile) {
      throw new Error("파일을 선택해주세요.");
    }

    setUploadProgress({ loaded: 0, total: selectedFile.size, percentage: 0 });

    try {
      const result = await uploadMutation.mutateAsync({
        request: { file: selectedFile },
        onProgress: setUploadProgress,
      });

      return result;
    } finally {
      // 업로드 완료 후 정리
      setUploadProgress(null);
    }
  }, [selectedFile, uploadMutation]);

  // 초기화
  const reset = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(null);
    setValidationResult(null);
    uploadMutation.reset();
  }, [uploadMutation]);

  // 파일 크기 포맷
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  return {
    // 파일 상태
    selectedFile,
    selectFile,
    validationResult,
    validateFile,

    // 업로드 상태
    upload,
    uploadProgress,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    uploadResult: uploadMutation.data,
    isUploadSuccess: uploadMutation.isSuccess,

    // 유틸리티
    reset,
    formatFileSize,

    // 상수
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_MIME_TYPES,
  };
}

/**
 * 드래그 앤 드롭 관련 훅
 */
export function useDragDrop(onFileDrop: (file: File) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileDrop(files[0]);
      }
    },
    [onFileDrop]
  );

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}
