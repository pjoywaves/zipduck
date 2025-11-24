import { Database, FileText, GitMerge } from "lucide-react";
import type { SubscriptionSource } from "@/types/Subscription";

type FilterOption = SubscriptionSource | "ALL";

interface SourceFilterProps {
  value: FilterOption;
  onChange: (value: FilterOption) => void;
  counts?: {
    all: number;
    publicDb: number;
    pdfUpload: number;
    merged: number;
  };
  variant?: "chips" | "tabs" | "buttons";
}

const FILTER_OPTIONS: { value: FilterOption; label: string; icon: React.ReactNode }[] = [
  { value: "ALL", label: "전체", icon: null },
  { value: "PUBLIC_DB", label: "공공데이터", icon: <Database size={14} /> },
  { value: "PDF_UPLOAD", label: "PDF 업로드", icon: <FileText size={14} /> },
  { value: "MERGED", label: "통합", icon: <GitMerge size={14} /> },
];

export function SourceFilter({
  value,
  onChange,
  counts,
  variant = "chips",
}: SourceFilterProps) {
  const getCount = (option: FilterOption): number | undefined => {
    if (!counts) return undefined;
    switch (option) {
      case "ALL":
        return counts.all;
      case "PUBLIC_DB":
        return counts.publicDb;
      case "PDF_UPLOAD":
        return counts.pdfUpload;
      case "MERGED":
        return counts.merged;
      default:
        return undefined;
    }
  };

  if (variant === "tabs") {
    return (
      <div className="flex border-b border-border">
        {FILTER_OPTIONS.map((option) => {
          const count = getCount(option.value);
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                {option.icon}
                {option.label}
                {count !== undefined && (
                  <span className={`text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    ({count})
                  </span>
                )}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "buttons") {
    return (
      <div className="flex gap-2">
        {FILTER_OPTIONS.map((option) => {
          const count = getCount(option.value);
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                {option.icon}
                {option.label}
                {count !== undefined && <span className="opacity-70">({count})</span>}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: chips
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {FILTER_OPTIONS.map((option) => {
        const count = getCount(option.value);
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-shrink-0 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              isActive
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {option.icon}
              {option.label}
              {count !== undefined && (
                <span
                  className={`text-xs ${
                    isActive ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** 소스 뱃지 컴포넌트 */
export function SourceBadge({ source }: { source: SubscriptionSource }) {
  const config = {
    PUBLIC_DB: {
      label: "공공",
      icon: <Database size={12} />,
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    PDF_UPLOAD: {
      label: "PDF",
      icon: <FileText size={12} />,
      className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    },
    MERGED: {
      label: "통합",
      icon: <GitMerge size={12} />,
      className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    },
  };

  const { label, icon, className } = config[source];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
