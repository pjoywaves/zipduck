import logo from "@/assets/img/logo.svg";
import { Bell, ChevronRight, Home } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomeScreenProps {
  onNavigateToDetail: () => void;
  onNavigateToAI: () => void;
  onNavigateToChat: () => void;
}

export function HomeScreen({ onNavigateToDetail, onNavigateToAI, onNavigateToChat }: HomeScreenProps) {
  const apartments = [
    {
      id: 1,
      name: "힐스테이트 송파 헬리오시티",
      location: "서울 송파구",
      image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rkm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjMyOTUxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      totalUnits: 1248,
      types: "59㎡~84㎡",
      dday: 3,
      tags: ["마감임박", "관심지역"]
    },
    {
      id: 2,
      name: "래미안 강남 포레스티지",
      location: "서울 강남구",
      image: "https://images.unsplash.com/photo-1676680071181-0a0b45968d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBhcGFydG1lbnQlMjBjb21wbGV4fGVufDF8fHx8MTc2MzM4NTY1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      totalUnits: 863,
      types: "84㎡~114㎡",
      dday: 7,
      tags: ["추천"]
    },
    {
      id: 3,
      name: "e편한세상 용산 센트럴",
      location: "서울 용산구",
      image: "https://images.unsplash.com/photo-1623051786509-57224cdc43e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNpZGVudGlhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MzMwNTMzNXww&ixlib=rb-4.1.0&q=80&w=1080",
      totalUnits: 1056,
      types: "74㎡~101㎡",
      dday: 12,
      tags: ["신규"]
    },
    {
      id: 4,
      name: "더샵 성수 레이크",
      location: "서울 성동구",
      image: "https://images.unsplash.com/photo-1760182042697-fd8d2e3139eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGNvbXBsZXglMjBrb3JlYXxlbnwxfHx8fDE3NjMzODQ4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      totalUnits: 742,
      types: "59㎡~84㎡",
      dday: 15,
      tags: ["관심지역"]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ZipDuck Logo" className="w-10 h-10 object-contain" />
            <h2 className="font-bold">집덕</h2>
          </div>
          <button className="relative p-2 hover:bg-muted rounded-xl transition-colors">
            <Bell size={24} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>
          </button>
        </div>

        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-foreground mb-2 font-bold">
            안녕하세요! 👋
          </h1>
          <p className="text-muted-foreground">
            오늘도 최적의 청약 기회를 찾아보세요
          </p>
        </div>
      </div>

      {/* AI 추천 배너 */}
      <div className="px-6 py-6">
        <button 
          onClick={onNavigateToAI}
          className="w-full bg-gradient-to-r from-primary to-blue-400 dark:from-primary dark:to-blue-600 rounded-2xl p-6 text-left relative overflow-hidden shadow-lg"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">✨</span>
              <span className="text-sm text-white/90 font-semibold">AI 맞춤 추천</span>
            </div>
            <p className="text-white mb-1 font-bold">회원님께 딱 맞는 청약</p>
            <p className="text-sm text-white/80">지금 확인해보세요</p>
          </div>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-white" size={24} />
        </button>
      </div>

      {/* 마감 임박 섹션 */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏰</span>
            <h3 className="text-foreground font-semibold">마감 임박</h3>
          </div>
          <button className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors">전체보기 →</button>
        </div>
        <div className="px-6 space-y-3">
          {apartments.slice(0, 2).map((apt) => (
            <button
              key={apt.id}
              onClick={onNavigateToDetail}
              className="w-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex gap-3 p-3">
                <ImageWithFallback
                  src={apt.image}
                  alt={apt.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-foreground line-clamp-1 font-semibold">{apt.name}</p>
                    {apt.dday <= 7 && (
                      <span className="bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-primary text-xs px-3 py-1 rounded-2xl ml-2 whitespace-nowrap font-semibold">
                        D-{apt.dday}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{apt.location}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {apt.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {apt.types} · {apt.totalUnits}세대
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 추천 청약 섹션 */}
      <div>
        <div className="flex items-center justify-between px-6 mb-4">
          <h3 className="text-foreground font-semibold">추천 청약</h3>
          <button className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors">전체보기 →</button>
        </div>
        <div className="px-6 space-y-3">
          {apartments.slice(2).map((apt) => (
            <button
              key={apt.id}
              onClick={onNavigateToDetail}
              className="w-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex gap-3 p-3">
                <ImageWithFallback
                  src={apt.image}
                  alt={apt.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-foreground line-clamp-1 font-semibold">{apt.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{apt.location}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {apt.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-mint/10 text-mint px-2 py-1 rounded-lg font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {apt.types} · {apt.totalUnits}세대
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Fixed AI Chat Button */}
      <button
        onClick={onNavigateToChat}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-20 border-4 border-background"
      >
        <span className="text-2xl">✨</span>
      </button>
    </div>
  );
}
