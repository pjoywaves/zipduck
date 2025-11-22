import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SearchScreenProps {
  onNavigateToDetail: () => void;
}

export function SearchScreen({ onNavigateToDetail }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("전체");
  const [sortBy, setSortBy] = useState<string>("마감순");
  const [recentSearches] = useState(["송파 청약", "강남", "래미안"]);
  const [recommendedSearches] = useState(["힐스테이트", "e편한세상", "더샵"]);

  const regions = ["전체", "서울", "경기", "인천", "부산", "대구", "광주"];
  const sortOptions = ["마감순", "인기순", "최신순"];

  const apartments = [
    {
      id: 1,
      name: "힐스테이트 송파 헬리오시티",
      location: "서울 송파구",
      image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjMyOTUxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      totalUnits: 1248,
      types: "59㎡~84㎡",
      dday: 3,
      tags: ["마감임박"]
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
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-6 pb-4">
        <h2 className="mb-4 font-bold">검색</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="단지명, 지역 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-10 h-12 rounded-2xl bg-muted border-border focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Recent & Recommended Searches */}
        {!searchQuery && (
          <div className="space-y-4">
            {/* Recent Searches */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">최근 검색</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Searches */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">추천 검색어</p>
              <div className="flex flex-wrap gap-2">
                {recommendedSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 bg-muted border border-border text-foreground rounded-xl text-sm font-medium hover:border-primary transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort & Filter */}
      <div className="bg-card border-b border-border px-6 py-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`text-sm transition-colors ${
                  sortBy === option
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary">
            <SlidersHorizontal size={16} />
            <span className="font-medium">필터</span>
          </Button>
        </div>
      </div>

      {/* 관심 지역 설정 CTA */}
      <div className="px-6 mb-4">
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-sm text-foreground font-semibold">관심 지역을 설정하세요</p>
                <p className="text-xs text-muted-foreground">새로운 청약 소식을 빠르게 받아보세요</p>
              </div>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold">
              설정
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6">
        <p className="text-sm text-muted-foreground mb-4 font-medium">{apartments.length}개의 청약 정보</p>
        <div className="space-y-3">
          {apartments.map((apt) => (
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
    </div>
  );
}