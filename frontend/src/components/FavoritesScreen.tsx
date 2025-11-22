import { Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface FavoritesScreenProps {
  onNavigateToDetail: () => void;
}

export function FavoritesScreen({ onNavigateToDetail }: FavoritesScreenProps) {
  const [favorites] = useState([
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
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 mb-4">
        <h2 className="mb-2">관심 단지</h2>
        <p className="text-sm text-gray-600">{favorites.length}개의 관심 단지</p>
      </div>

      {favorites.length > 0 ? (
        <div className="px-6 space-y-3">
          {favorites.map((apt) => (
            <button
              key={apt.id}
              onClick={onNavigateToDetail}
              className="w-full bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#FCD34D] transition-colors"
            >
              <div className="flex gap-3 p-3">
                <ImageWithFallback
                  src={apt.image}
                  alt={apt.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-gray-900 line-clamp-1">{apt.name}</p>
                    {apt.dday <= 7 && (
                      <span className="bg-[#FCD34D] text-gray-900 text-xs px-2 py-1 rounded-md ml-2 whitespace-nowrap">
                        D-{apt.dday}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{apt.location}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {apt.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {apt.types} · {apt.totalUnits}세대
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="mb-4">
            <span className="text-5xl">💛</span>
          </div>
          <h3 className="text-gray-900 mb-2 font-semibold">아직 관심 단지가 없어요</h3>
          <p className="text-sm text-gray-600 text-center">
            마음에 드는 단지를 찾아<br />관심 단지로 등록해보세요
          </p>
        </div>
      )}
    </div>
  );
}