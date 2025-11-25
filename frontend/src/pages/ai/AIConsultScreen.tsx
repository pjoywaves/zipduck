import duckImg from "@/assets/img/duck.png";
import { useState } from "react";
import { ChevronLeft, Send, Upload, Camera, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AIConsultScreenProps {
  onBack: () => void;
}

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function AIConsultScreen({ onBack }: AIConsultScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const presetQuestions = [
    "신혼부부 특별공급 조건 알려줘",
    "내 소득으로 청약 가능할까?",
    "내 주변 진행 중인 청약 알려줘",
    "서울 30평대 분양가 비교해줘",
    "이 단지 청약 경쟁률 분석해줘"
  ];

  const aiResponses: { [key: string]: string } = {
    "신혼부부 특별공급 조건 알려줘": "신혼부부 특별공급 조건을 알려드릴게요! 💑\n\n✅ 기본 요건:\n• 혼인 기간 7년 이내\n• 무주택 세대구성원\n• 소득 기준 충족 (맞벌이 140% 이하)\n\n✅ 우선순위:\n1순위 - 자녀 있거나 임신 중\n2순위 - 자녀 없는 신혼부부\n\n✅ 가점 항목:\n• 자녀 수 (많을수록 유리)\n• 청약통장 가입기간\n• 해당 지역 거주기간\n\n더 자세한 내용이 궁금하시면 말씀해주세요!",
    "내 소득으로 청약 가능할까?": "소득 기준 확인을 도와드릴게요! 💰\n\n현재 회원님의 정보:\n• 가구원 수: 2명\n• 맞벌이 여부: 해당\n\n2025년 도시근로자 월평균 소득 기준:\n• 2인 가구 100%: 약 520만원\n• 맞벌이 140%: 약 728만원\n\n대부분의 특별공급에 지원 가능하시며, 일부 공공분양의 경우 더 폭넓은 기준이 적용됩니다.\n\n구체적인 단지 정보를 알려주시면 더 정확한 분석이 가능합니다!",
    "내 주변 진행 중인 청약 알려줘": "회원님의 관심지역 기준으로 진행 중인 청약을 알려드릴게요! 🏠\n\n📍 서울 강남구 (3건)\n• 래미안 강남 포레스티지 (D-7)\n• 푸르지오 역삼센트럴 (D-12)\n\n📍 서울 송파구 (2건)\n• 힐스테이트 송파 헬리오시티 (D-3)\n• 아크로 문정센트럴파크 (D-15)\n\n마감 임박 순으로 정렬했어요. 자세한 정보는 각 단지를 클릭해서 확인하실 수 있습니다!",
    "서울 30평대 분양가 비교해줘": "서울 지역 30평대(84㎡) 분양가를 비교해드릴게요! 📊\n\n💰 강남권:\n• 강남구: 평균 9.2억\n• 서초구: 평균 8.8억\n• 송파구: 평균 7.5억\n\n💰 강북권:\n• 마포구: 평균 7.1억\n• 용산구: 평균 7.8억\n• 성동구: 평균 6.9억\n\n최근 1년간 평균 12.3% 상승했으며, 강남권이 가장 높은 상승률을 보이고 있습니다.\n\n관심있는 구체적인 지역이 있으시면 더 자세히 분석해드릴게요!",
    "이 단지 청약 경쟁률 분석해줘": "힐스테이트 송파 헬리오시티 경쟁률 분석 결과입니다! 📈\n\n🎯 예상 경쟁률:\n• 일반공급: 약 18:1\n• 특별공급(신혼부부): 약 22:1\n• 특별공급(생애최초): 약 15:1\n\n📊 분석 근거:\n• 최근 3개월 주변 단지 평균: 17.2:1\n• 이 단지 입지 점수: 89/100\n• 교통 호재: 지하철 9호선 연장\n\n💡 AI 추천:\n회원님의 조건(신혼부부, 자녀 1명)으로 지원 시 약 78%의 합격 확률이 예상됩니다. 경쟁률이 높은 편이므로 서류 준비를 철저히 하시는 것을 권장드립니다!"
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponses[inputValue] || "죄송합니다. 해당 질문에 대한 답변을 준비 중입니다. 다른 질문을 해주시거나 아래의 추천 질문을 선택해주세요! 😊",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  const handlePresetQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 flex items-center justify-center gap-2 pr-10">
            <Sparkles size={20} className="text-primary" />
            <h2 className="font-bold text-foreground">집덕 AI 상담</h2>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🦆</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">안녕하세요! 👋</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    저는 집덕 AI 상담원입니다.<br />
                    청약에 대한 궁금한 점을 물어보시거나<br />
                    아래 추천 질문을 선택해주세요!
                  </p>
                </div>
              </div>
            </div>

            {/* Preset Questions */}
            <div>
              <p className="text-sm font-semibold mb-3 px-1 text-muted-foreground">💬 추천 질문</p>
              <div className="space-y-2">
                {presetQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetQuestion(question)}
                    className="w-full p-4 bg-card border border-border rounded-2xl text-left hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <p className="font-medium text-sm text-muted-foreground">{question}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-100/50 dark:from-primary/5 dark:to-blue-900/20 border border-primary/20 rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                AI 상담 기능
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>실시간 청약 정보 분석</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>맞춤형 경쟁률 예측</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>파일 및 이미지 분석 지원</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "ai" && (
                  <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-xl">🦆</span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-4 rounded-2xl ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <button className="p-3 bg-muted rounded-2xl hover:bg-muted/80 transition-colors">
            <Upload size={20} className="text-muted-foreground" />
          </button>
          <button className="p-3 bg-muted rounded-2xl hover:bg-muted/80 transition-colors">
            <Camera size={20} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 h-12 rounded-2xl bg-muted border-border"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="w-12 h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary rounded-2xl flex items-center justify-center transition-colors"
          >
            <Send size={20} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
