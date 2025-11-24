import { useState } from "react";
import { ChevronLeft, Search, ChevronRight, FileText, Paperclip } from "lucide-react";
import { Input } from "./ui/input";

interface AnnouncementScreenProps {
  onBack: () => void;
}

interface Announcement {
  id: number;
  title: string;
  date: string;
  category: "공지" | "업데이트" | "이벤트";
  important: boolean;
}

export function AnnouncementScreen({ onBack }: AnnouncementScreenProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<number | null>(null);

  const announcements: Announcement[] = [
    {
      id: 1,
      title: "집덕 AI 상담 기능 업데이트 안내",
      date: "2025.11.15",
      category: "업데이트",
      important: true
    },
    {
      id: 2,
      title: "[중요] 청약 일정 변경 사항 안내",
      date: "2025.11.12",
      category: "공지",
      important: true
    },
    {
      id: 3,
      title: "신규 회원 가입 이벤트 진행 중",
      date: "2025.11.10",
      category: "이벤트",
      important: false
    },
    {
      id: 4,
      title: "서비스 점검 안내 (11/20 02:00-06:00)",
      date: "2025.11.08",
      category: "공지",
      important: false
    },
    {
      id: 5,
      title: "데이터 분석 기능 개선 안내",
      date: "2025.11.05",
      category: "업데이트",
      important: false
    },
    {
      id: 6,
      title: "개인정보 처리방침 개정 안내",
      date: "2025.11.01",
      category: "공지",
      important: false
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "공지":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "업데이트":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "이벤트":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (selectedAnnouncement) {
    const announcement = announcements.find(a => a.id === selectedAnnouncement);

    return (
      <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
          <div className="flex items-center px-6 py-4">
            <button onClick={() => setSelectedAnnouncement(null)} className="p-2 -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold ml-4 text-muted-foreground">공지사항</h2>
          </div>
        </div>

        {/* Detail Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(announcement!.category)}`}>
              {announcement!.category}
            </span>
            {announcement!.important && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                중요
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="font-bold text-foreground mb-3">{announcement!.title}</h1>
            <p className="text-sm text-muted-foreground">{announcement!.date}</p>
          </div>

          {/* Content */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground leading-relaxed mb-4">
                안녕하세요, 집덕 입니다.
              </p>
              <p className="text-foreground leading-relaxed mb-4">
                사용자분들께 더 나은 서비스를 제공하기 위해 AI 상담 기능을 대폭 업데이트하였습니다.
              </p>
              <h3 className="font-semibold text-foreground text-foreground mt-6 mb-3">주요 업데이트 내용</h3>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>더욱 정확해진 청약 정보 분석</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>개인 맞춤형 추천 알고리즘 개선</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>실시간 경쟁률 예측 기능 추가</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>파일 업로드 기능 지원</span>
                </li>
              </ul>
              <p className="text-foreground leading-relaxed mt-6">
                앞으로도 더 나은 서비스를 제공할 수 있도록 최선을 다하겠습니다.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                감사합니다.
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Paperclip size={18} className="text-primary" />
              첨부파일
            </h3>
            <div className="space-y-2">
              <button className="w-full p-3 bg-muted rounded-xl flex items-center gap-3 hover:bg-muted/80 transition-colors">
                <FileText size={20} className="text-muted-foreground" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-muted-foreground">업데이트_상세_안내.pdf</p>
                  <p className="text-xs text-muted-foreground">2.4 MB</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold ml-4 text-muted-foreground">공지사항</h2>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="공지사항 검색"
              className="pl-12 h-12 rounded-2xl bg-muted border-border"
            />
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="divide-y divide-border">
        {announcements.map((announcement) => (
          <button
            key={announcement.id}
            onClick={() => setSelectedAnnouncement(announcement.id)}
            className="w-full p-5 flex items-start gap-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getCategoryColor(announcement.category)}`}>
                  {announcement.category}
                </span>
                {announcement.important && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    중요
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground">{announcement.date}</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground flex-shrink-0 mt-1" />
          </button>
        ))}
      </div>
    </div>
  );
}
