import { ChevronLeft, TrendingUp, BarChart3, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsScreenProps {
  onBack: () => void;
}

export function AnalyticsScreen({ onBack }: AnalyticsScreenProps) {
  const competitionData = [
    { month: "6월", rate: 12.3 },
    { month: "7월", rate: 15.7 },
    { month: "8월", rate: 18.2 },
    { month: "9월", rate: 14.8 },
    { month: "10월", rate: 19.5 },
    { month: "11월", rate: 22.1 },
  ];

  const priceData = [
    { type: "59㎡", price: 530 },
    { type: "74㎡", price: 680 },
    { type: "84㎡", price: 790 },
    { type: "101㎡", price: 920 },
  ];

  const locationData = [
    { subject: "교통", value: 85 },
    { subject: "학군", value: 78 },
    { subject: "인구밀도", value: 72 },
    { subject: "상업시설", value: 90 },
    { subject: "공원", value: 65 },
    { subject: "안전", value: 88 },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <div className="ml-4">
            <h2 className="font-bold text-foreground">데이터 분석</h2>
            <p className="text-xs text-muted-foreground">힐스테이트 송파 헬리오시티</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 border border-primary/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-primary" />
              <p className="text-sm font-medium text-muted-foreground">평균 경쟁률</p>
            </div>
            <p className="font-bold text-foreground">17.1:1</p>
            <p className="text-xs text-muted-foreground mt-1">최근 1년</p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/5 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-muted-foreground">합격 확률</p>
            </div>
            <p className="font-bold text-blue-600 dark:text-blue-400">78%</p>
            <p className="text-xs text-muted-foreground mt-1">내 조건 기준</p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/5 border border-green-200 dark:border-green-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={18} className="text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-muted-foreground">분양가 상승</p>
            </div>
            <p className="font-bold text-green-600 dark:text-green-400">+12.3%</p>
            <p className="text-xs text-muted-foreground mt-1">전년 대비</p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/5 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏆</span>
              <p className="text-sm font-medium text-muted-foreground">종합 점수</p>
            </div>
            <p className="font-bold text-purple-600 dark:text-purple-400">A+ 등급</p>
            <p className="text-xs text-muted-foreground mt-1">상위 5%</p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-card border-2 border-primary/30 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">집덕 AI 인사이트</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                이 단지는 최근 6개월간 <span className="font-semibold text-primary">경쟁률이 18.5% 상승</span>하는 추세입니다. 
                교통 인프라가 개선되면서 <span className="font-semibold text-foreground">관심도가 급증</span>하고 있어, 
                조기 청약을 권장드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Competition Trend Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            청약 경쟁률 트렌드
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={competitionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.5} />
              <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.5} />
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
                stroke="#F8E99A" 
                strokeWidth={3}
                dot={{ fill: '#F8E99A', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-3">
            최근 6개월 평균 경쟁률: <span className="font-semibold text-foreground">17.1:1</span>
          </p>
        </div>

        {/* Price Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            분양가 변화 (백만원)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="type" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.5} />
              <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.5} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '12px'
                }}
              />
              <Bar dataKey="price" fill="#A8E6CF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-3">
            평균 평당가: <span className="font-semibold text-foreground">2,650만원</span>
          </p>
        </div>

        {/* Location Score Radar */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target size={20} className="text-primary" />
            입지 분석 (100점 만점)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={locationData}>
              <PolarGrid stroke="currentColor" opacity={0.2} />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 12, fill: 'currentColor' }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar 
                name="점수" 
                dataKey="value" 
                stroke="#F8E99A" 
                fill="#F8E99A" 
                fillOpacity={0.5}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {locationData.map((item) => (
              <div key={item.subject} className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{item.subject}</p>
                <p className="font-semibold text-sm text-foreground">{item.value}점</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">비슷한 단지와 비교</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <div>
                <p className="font-medium mb-1 text-foreground">래미안 강남 포레스티지</p>
                <p className="text-xs text-muted-foreground">서울 강남구 · 경쟁률 19.2:1</p>
              </div>
              <span className="text-xs font-semibold text-destructive">+2.1</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <div>
                <p className="font-medium mb-1 text-foreground">e편한세상 용산 센트럴</p>
                <p className="text-xs text-muted-foreground">서울 용산구 · 경쟁률 15.8:1</p>
              </div>
              <span className="text-xs font-semibold text-blue-500">-1.3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
