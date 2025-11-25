import { useState } from "react";
import { ChevronLeft, Heart, Share2, MapPin, Calendar, Home, TrendingUp, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DetailScreenNewProps {
  onBack: () => void;
}

type TabType = "overview" | "schedule" | "location" | "analysis";

export function DetailScreenNew({ onBack }: DetailScreenNewProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const competitionData = [
    { month: "1월", rate: 3.2 },
    { month: "2월", rate: 4.1 },
    { month: "3월", rate: 5.3 },
    { month: "4월", rate: 4.8 },
    { month: "5월", rate: 6.2 },
    { month: "6월", rate: 7.5 }
  ];

  const priceData = [
    { type: "59㎡", price: 530 },
    { type: "74㎡", price: 680 },
    { type: "84㎡", price: 790 }
  ];

  const scoreData = [
    { category: "입지", score: 85 },
    { category: "교통", score: 92 },
    { category: "학군", score: 78 },
    { category: "인프라", score: 88 },
    { category: "가격", score: 75 }
  ];

  const unitTypes = [
    { type: "59A", area: "59㎡", rooms: "3", units: 284, price: "5억 3천" },
    { type: "59B", area: "59㎡", rooms: "3", units: 312, price: "5억 5천" },
    { type: "74A", area: "74㎡", rooms: "4", units: 425, price: "6억 8천" },
    { type: "84A", area: "84㎡", rooms: "4", units: 227, price: "7억 9천" }
  ];

  const tabs = [
    { id: "overview" as TabType, label: "개요", icon: Home },
    { id: "schedule" as TabType, label: "일정", icon: Calendar },
    { id: "location" as TabType, label: "위치", icon: MapPin },
    { id: "analysis" as TabType, label: "AI분석", icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-muted rounded-xl transition-colors">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <Heart 
                size={20} 
                className={isFavorite ? "fill-destructive text-destructive" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjMyOTUxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="힐스테이트 송파 헬리오시티"
          className="w-full h-64 object-cover"
        />
        <span className="bg-blue-soft-bg dark:bg-card text-primary text-sm px-3 py-1.5 rounded-2xl font-bold shadow-lg absolute top-4 left-4">
          D-3
        </span>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Title Section */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-semibold">마감임박</span>
            <span className="text-xs bg-mint/10 text-mint px-2.5 py-1 rounded-lg font-semibold">관심지역</span>
          </div>
          <h2 className="mb-2 font-bold text-foreground">힐스테이트 송파 헬리오시티</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin size={16} />
            서울특별시 송파구 문정동 123-45
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">총 세대수</p>
                <p className="font-bold text-primary">1,248세대</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">전용면적</p>
                <p className="font-bold text-primary">59~84㎡</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">입주시기</p>
                <p className="font-bold text-primary">2027.03</p>
              </div>
            </div>

            {/* Unit Types */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">타입별 정보</h3>
              <div className="space-y-3">
                {unitTypes.map((unit) => (
                  <div key={unit.type} className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-sm">
                          {unit.type}
                        </span>
                        <span className="font-semibold text-foreground">{unit.area}</span>
                      </div>
                      <span className="font-bold text-primary">{unit.price}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>방 {unit.rooms}개</span>
                      <span>•</span>
                      <span>{unit.units}세대</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competition Trend */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                최근 경쟁률 추이
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={competitionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📅</span>
                <h3 className="font-semibold text-foreground">청약 일정</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">청약 접수</span>
                  <span className="text-sm font-semibold text-foreground">2025.11.20 (목) ~ 11.21 (금)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">당첨자 발표</span>
                  <span className="text-sm font-semibold text-foreground">2025.11.28 (목)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">계약 체결</span>
                  <span className="text-sm font-semibold text-foreground">2025.12.05 (목) ~ 12.10 (화)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">입주 예정</span>
                  <span className="text-sm font-semibold text-foreground">2027.03</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">공급 일정</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium mb-1 text-foreground">1순위 청약 (��주택자)</p>
                    <p className="text-sm text-muted-foreground">2025.11.20 (목)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-mint rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium mb-1 text-foreground">2순위 청약</p>
                    <p className="text-sm text-muted-foreground">2025.11.21 (금)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-4">
            {/* Map Placeholder */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="h-64 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">지도 영역</p>
                </div>
              </div>
            </div>

            {/* Transportation */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">교통 정보</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">🚇</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">지하철 8호선 문정역</p>
                    <p className="text-sm text-muted-foreground">도보 5분 (350m)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">🚌</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">버스 정류장 5개소</p>
                    <p className="text-sm text-muted-foreground">도보 3분 이내</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Facilities */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">주변 시설</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-xl">
                  <p className="text-sm font-semibold mb-1">🏫 초등학교</p>
                  <p className="text-xs text-muted-foreground">도보 10분</p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <p className="text-sm font-semibold mb-1">🏥 종합병원</p>
                  <p className="text-xs text-muted-foreground">차량 5분</p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <p className="text-sm font-semibold mb-1">🛒 대형마트</p>
                  <p className="text-xs text-muted-foreground">도보 7분</p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <p className="text-sm font-semibold mb-1">🏞️ 공원</p>
                  <p className="text-xs text-muted-foreground">도보 5분</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            {/* AI Insight */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/10 dark:to-blue-900/30 border border-primary/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={24} className="text-primary" />
                <h3 className="font-bold text-foreground">AI 종합 분석</h3>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                이 단지는 <span className="font-bold text-primary">높은 입지 가치</span>와 우수한 교통 접근성을 갖춘 프리미엄 단지입니다. 
                최근 6개월간 경쟁률이 상승 추세이며, <span className="font-bold text-mint">당첨 가능성이 높은 타입</span>은 59A, 74A입니다.
              </p>
              <div className="flex items-center gap-2 p-3 bg-card rounded-xl border border-border">
                <TrendingUp size={16} className="text-mint" />
                <p className="text-sm font-semibold text-foreground">종합 평가: 매우 우수</p>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">타입별 분양가 비교</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="type" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px' 
                    }} 
                  />
                  <Bar dataKey="price" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area Score Radar */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">지역 종합 점수</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={scoreData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="category" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--muted-foreground)" style={{ fontSize: '10px' }} />
                  <Radar name="Score" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px' 
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Success Probability */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-mint/10 border border-mint/30 rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">예상 경쟁률</p>
                <p className="font-bold text-mint">7.5:1</p>
              </div>
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">당첨 확률</p>
                <p className="font-bold text-primary">높음</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 max-w-md mx-auto">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-14 rounded-2xl border-primary text-primary hover:bg-primary/10 font-bold">
            관심 등록
          </Button>
          <Button className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
            청약 신청하기
          </Button>
        </div>
      </div>
    </div>
  );
}