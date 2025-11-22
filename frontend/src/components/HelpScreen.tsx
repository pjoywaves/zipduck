import { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface HelpScreenProps {
  onBack: () => void;
}

export function HelpScreen({ onBack }: HelpScreenProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "청약통장은 어떻게 만드나요?",
      answer: "청약통장은 주요 시중은행(국민, 신한, 우리, 하나, 농협 등)에서 개설할 수 있습니다.\n\n✅ 필요 서류:\n• 신분증\n• 주민등록등본 (일부 은행)\n\n✅ 월 납입금:\n최소 2만원부터 가능하며, 청약 점수를 높이려면 꾸준한 납입이 중요합니다. 은행 방문 또는 모바일 앱으로 간편하게 개설할 수 있습니다."
    },
    {
      question: "생애최초 특별공급이란?",
      answer: "생애최초 특별공급은 한 번도 주택을 소유한 적이 없는 무주택 세대구성원을 대상으로 하는 특별공급 제도입니다.\n\n📌 주요 조건:\n• 생애 최초 주택 구입\n• 5년 이상 소득세 납부 실적\n• 소득 기준 충족 (도시근로자 월평균 소득의 130% 이하)\n• 청약통장 가입 기간 충족\n\n자세한 소득 기준은 가구원 수에 따라 다르므로, 해당 공고문을 확인하시는 것이 좋습니다."
    },
    {
      question: "청약 자격 조건은 어떻게 되나요?",
      answer: "청약 자격은 청약 유형에 따라 다릅니다.\n\n🏢 일반공급:\n• 청약통장 가입 필수\n• 지역별 거주 요건 충족\n• 1순위: 가입 후 2년 경과, 24회 이상 납입 (지역별 상이)\n• 2순위: 청약통장 가입자\n\n🏢 특별공급:\n• 신혼부부: 혼인 기간 7년 이내, 소득 요건\n• 생애최초: 무주택 + 소득 요건 + 소득세 납부\n• 다자녀: 미성년 자녀 2명 이상\n\n청약하려는 지역과 주택 유형에 따라 조건이 다를 수 있으니 공고문을 꼭 확인하세요."
    },
    {
      question: "청약 일정은 어떻게 확인하나요?",
      answer: "집덕 앱에서 청약 일정을 쉽게 확인할 수 있습니다!\n\n📅 일정 확인 방법:\n1. 홈 화면에서 원하는 청약 단지 선택\n2. 상세 페이지에서 일정 탭 확인\n3. 청약 캘린더에서 전체 일정 한눈에 보기\n\n일반적인 청약 절차:\n• 모집공고 (약 2주 전)\n• 청약 접수 (2-3일)\n• 당첨자 발표 (약 1주 후)\n• 계약 체결 (약 1-2주 후)\n• 입주 (통상 2-3년 후)"
    },
    {
      question: "신혼부부 특별공급 조건은?",
      answer: "신혼부부 특별공급의 주요 조건을 알려드립니다.\n\n💑 기본 요건:\n• 혼인 기간 7년 이내\n• 무주택 세대구성원\n• 월평균 소득 기준 충족 (도시근로자 월평균소득 기준)\n\n💑 우선순위:\n1순위 - 자녀가 있거나 임신 중인 경우\n2순위 - 자녀가 없는 신혼부부\n\n💑 배점 항목:\n• 자녀 수 (최대 40점)\n• 청약통장 가입기간 (최대 15점)\n• 해당 지역 거주기간 (최대 15점)\n\n소득 기준은 가구원 수에 따라 다르므로 해당 공고를 확인하세요."
    },
    {
      question: "경쟁률은 어떻게 확인하나요?",
      answer: "경쟁률은 여러 방법으로 확인할 수 있습니다.\n\n🔍 확인 방법:\n• 한국부동산원 청약홈 (applyhome.co.kr)\n• 집덕 앱 내 단지 상세정보\n• 각 시공사 홈페이지\n\n💡 TIP:\n실시간 경쟁률은 청약 접수 기간 중에 확인 가능하며, 최종 경쟁률은 접수 마감 후 공개됩니다.\n\n높은 경쟁률이 예상되는 단지는 청약 점수를 미리 확인하고 준비하는 것이 좋습니다."
    },
    {
      question: "AI 맞춤 추천은 어떻게 작동하나요?",
      answer: "집덕의 AI 맞춤 추천 기능은 사용자의 선호도와 조건을 분석하여 최적의 청약 단지를 추천합니다.\n\n🤖 분석 요소:\n• 희망 지역 및 가격대\n• 청약 자격 조건\n• 당첨 가능성\n• 교통 및 생활 편의시설\n• 과거 청약 경쟁률 데이터\n\n매칭률이 높을수록 사용자의 조건에 더 적합한 단지입니다!"
    },
    {
      question: "관심 지역 설정은 어디서 하나요?",
      answer: "관심 지역은 설정 메뉴에서 간편하게 설정할 수 있습니다.\n\n⚙️ 설정 방법:\n1. 마이페이지 > 설정\n2. 관심 지역 설정 메뉴 선택\n3. 원하는 지역 검색 및 선택\n4. 최대 10개 지역까지 설정 가능\n\n💡 설정하면 좋은 점:\n• 관심 지역 신규 청약 알림\n• 맞춤 추천 정확도 향상\n• 빠른 청약 정보 확인"
    }
  ];

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center font-bold pr-10">도움말</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header Info */}
        <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/10 dark:to-blue-900/30 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <HelpCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">자주 묻는 질문</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                청약과 관련된 궁금한 사항을 확인해보세요.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className={`bg-card border rounded-2xl overflow-hidden transition-all ${
                  isExpanded ? "border-primary shadow-md" : "border-border"
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full flex items-start justify-between p-5 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 text-left">
                    <span className={`text-sm font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      isExpanded 
                        ? "bg-primary text-white" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      Q
                    </span>
                    <p className={`font-semibold ${isExpanded ? "text-primary" : "text-foreground"}`}>
                      {faq.question}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-primary" />
                    ) : (
                      <ChevronDown size={20} className="text-muted-foreground" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-bold flex-shrink-0 w-6 h-6 rounded-full bg-[#EFF6FF] dark:bg-[#1E293B] text-primary flex items-center justify-center">
                        A
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line flex-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl p-5 border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">추가 문의가 필요하신가요?</h4>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            원하는 답변을 찾지 못하셨다면 고객센터로 문의해주세요.
          </p>
          <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-semibold transition-colors">
            고객센터 문의하기
          </button>
        </div>
      </div>
    </div>
  );
}
