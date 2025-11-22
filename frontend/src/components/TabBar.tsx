import { Home, Search, Heart, User } from "lucide-react";

interface TabBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function TabBar({ currentTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'search', label: '검색', icon: Search },
    { id: 'favorites', label: '관심', icon: Heart },
    { id: 'mypage', label: '마이', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card dark:bg-[#0F172A] border-t border-border pb-safe rounded-t-2xl shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${
                isActive ? 'scale-105' : ''
              }`}
            >
              <Icon 
                size={24} 
                className={`transition-colors ${
                  isActive ? 'text-primary' : 'text-[#94A3B8]'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
                fill={tab.id === 'favorites' && isActive ? 'currentColor' : 'none'}
              />
              <span className={`text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-[#94A3B8]'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}