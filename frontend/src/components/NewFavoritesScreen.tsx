import { useState } from "react";
import { Heart, TrendingUp, TrendingDown, MapPin, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NewFavoritesScreenProps {
  onNavigateToDetail: () => void;
}

export function NewFavoritesScreen({ onNavigateToDetail }: NewFavoritesScreenProps) {
  const [favorites] = useState([
    {
      id: 1,
      name: "힐스테이트 송파 헬리오시티",
      location: "서울 송파구",
      image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400",
      price: "5억 3천만원~",
      types: "59㎡~84㎡",
      dday: 3,
      competitionChange: "+2.1",
      deadline: "2025.11.21",
      trending: "up"
    },
    {
      id: 2,
      name: "래미안 강남 포레스티지",
      location: "서울 강남구",
      image: "https://images.unsplash.com/photo-1676680071181-0a0b45968d23?w=400",
      price: "8억 2천만원~",
      types: "84㎡~114㎡",
      dday: 7,
      competitionChange: "-0.8",
      deadline: "2025.11.25",
      trending: "down"
    },
    {
      id: 3,
      name: "e편한세상 용산 센트럴",
      location: "서울 용산구",
      image: "https://images.unsplash.com/photo-1623051786509-57224cdc43e1?w=400",
      price: "7억 1천만원~",
      types: "74㎡~101㎡",
      dday: 12,
      competitionChange: "+1.5",
      deadline: "2025.11.30",
      trending: "up"
    },
  ]);

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-background px-6 pt-6 pb-4">
        <h2 className="font-bold mb-2">관심 단지</h2>
        <p className="text-sm text-muted-foreground">
          등록한 {favorites.length}개의 단지를 관리하세요
        </p>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart size={40} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold mb-2">아직 관심 단지가 없어요</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            마음에 드는 단지를 찾아<br />관심 단지로 등록해보세요
          </p>
        </div>
      ) : (
        <div className="px-6 space-y-4">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="w-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all group cursor-pointer"
            >
              {/* Image & Badge */}
              <div className="relative" onClick={onNavigateToDetail}>
                <ImageWithFallback
                  src={favorite.image}
                  alt={favorite.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Heart size={20} className="fill-red-500 text-red-500" />
                </button>
                {favorite.dday <= 7 && (
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-xl font-bold shadow-lg">
                    D-{favorite.dday}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3" onClick={onNavigateToDetail}>
                <div>
                  <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                    {favorite.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>{favorite.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">분양가</p>
                    <p className="font-semibold text-primary">{favorite.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">공급 타입</p>
                    <p className="font-medium">{favorite.types}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Competition Change */}
                  <div className="flex-1 bg-muted rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">경쟁률 변화</p>
                      {favorite.trending === "up" ? (
                        <TrendingUp size={14} className="text-red-500" />
                      ) : (
                        <TrendingDown size={14} className="text-blue-500" />
                      )}
                    </div>
                    <p className={`font-bold ${
                      favorite.trending === "up" ? "text-red-500" : "text-blue-500"
                    }`}>
                      {favorite.competitionChange}
                    </p>
                  </div>

                  {/* Deadline */}
                  <div className="flex-1 bg-muted rounded-xl p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock size={12} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">마감일</p>
                    </div>
                    <p className="font-semibold text-sm">{favorite.deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}