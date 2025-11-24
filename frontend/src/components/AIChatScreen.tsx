import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AIChatScreenProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIChatScreen({ onBack }: AIChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const frequentQuestions = [
    {
      emoji: "🏠",
      question: "생애최초 특별공급이 뭔가요?",
    },
    {
      emoji: "💰",
      question: "청약통장은 어떻게 만드나요?",
    },
    {
      emoji: "📋",
      question: "청약 자격 조건이 궁금해요",
    },
    {
      emoji: "⏰",
      question: "청약 일정은 어떻게 되나요?",
    },
    {
      emoji: "👨‍👩‍👧",
      question: "신혼부부 특별공급 조건은?",
    },
    {
      emoji: "📊",
      question: "경쟁률은 어떻게 확인하나요?",
    }
  ];

  const aiResponses: { [key: string]: string } = {
    "생애최초 특별공급이 뭔가요?": "생애최초 특별공급은 한 번도 주택을 소유한 적이 없는 무주택 세대구성원을 대상으로 하는 특별공급 제도입니다.\n\n📌 주요 조건:\n• 생애 최초 주택 구입\n• 5년 이상 소득세 납부\n• 소득 기준 충족\n• 청약통장 가입 기간 충족\n\n더 자세한 내용이 필요하시면 말씀해주세요! 😊",
    "청약통장은 어떻게 만드나요?": "청약통장은 은행 방문 또는 모바일 앱으로 간편하게 개설할 수 있습니다! 💳\n\n✅ 필요 서류:\n• 신분증\n• 주민등록등본 (일부 은행)\n\n✅ 개설 가능 은행:\n국민, 신한, 우리, 하나, 농협 등 주요 시중은행\n\n✅ 월 납입금:\n최소 2만원부터 가능합니다.\n\n청약 점수를 높이려면 꾸준히 납입하는 것이 중요해요!",
    "청약 자격 조건이 궁금해요": "청약 자격은 청약 유형에 따라 다릅니다! 🏢\n\n📍 일반공급:\n• 청약통장 가입 필수\n• 지역별 거주 요건\n• 1순위/2순위 조건 충족\n\n📍 특별공급:\n• 신혼부부: 혼인 기간 7년 이내\n• 생애최초: 무주택 + 소득요건\n• 다자녀: 미성년 자녀 2명 이상\n\n어떤 유형이 궁금하신가요?",
    "청약 일정은 어떻게 되나요?": "청약 일정은 단지마다 다르지만 일반적인 절차는 비슷합니다! 📅\n\n1️⃣ 모집공고 (약 2주 전)\n2️⃣ 청약 접수 (2-3일)\n3️⃣ 당첨자 발표 (약 1주 후)\n4️⃣ 계약 체결 (약 1-2주 후)\n5️⃣ 입주 (통상 2-3년 후)\n\n관심 단지의 정확한 일정은 홈 화면에서 확인하실 수 있어요!",
    "신혼부부 특별공급 조건은?": "신혼부부 특별공급 조건을 알려드릴게요! 💑\n\n✅ 기본 요건:\n• 혼인 기간 7년 이내\n• 무주택 세대구성원\n• 월평균 소득 기준 충족\n\n✅ 우선순위:\n1순위 - 자녀 있거나 임신 중\n2순위 - 자녀 없는 신혼부부\n\n✅ 가점:\n• 자녀 수\n• 청약통장 가입기간\n• 해당 지역 거주기간\n\n소득 기준이 궁금하시면 말씀해주세요!",
    "경쟁률은 어떻게 확인하나요?": "경쟁률은 여러 방법으로 확인할 수 있어요! 📊\n\n🔍 확인 방법:\n• 한국부동산원 청약홈 (applyhome.co.kr)\n• 집덕 앱 내 단지 상세정보\n• 각 시공사 홈페이지\n\n💡 TIP:\n실시간 경쟁률은 청약 접수 기간 중에 확인 가능하며, 최종 경쟁률은 접수 마감 후 공개됩니다.\n\n관심 단지가 있으시면 알려주세요!"
  };

  const handleQuestionClick = (question: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    
    setMessages([userMessage]);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses[question] || "죄송합니다. 해당 질문에 대한 답변을 준비중입니다. 다른 질문을 해주시겠어요?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "죄송합니다. 현재는 자주 묻는 질문에 대한 답변만 제공하고 있습니다. 위의 질문 중 하나를 선택해주세요! 😊",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 flex items-center justify-center gap-2 pr-10">
            <Sparkles size={20} className="text-primary" />
            <h2 className="font-bold text-foreground">AI 청약 상담</h2>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="space-y-6">
            {/* Welcome Message with 3D Duck */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/10 dark:to-blue-900/30 rounded-2xl p-6 border border-primary/20">
              {/* 3D Baby Duck Illustration */}
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-2xl flex items-center justify-center overflow-hidden p-2">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1705142297499-d605f964adde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYmFieSUyMGR1Y2slMjB0b3l8ZW58MXx8fHwxNzYzNDI0NDExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="집덕 AI 상담원 - 아기오리"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-foreground mb-2 font-bold">안녕하세요! 👋</h3>
                <p className="text-sm text-muted-foreground">
                  청약에 대해 궁금한 점이 있으신가요?<br />
                  아래 자주 묻는 질문을 선택하시거나<br />
                  직접 질문해주세요!
                </p>
              </div>
            </div>

            {/* Frequent Questions */}
            <div>
              <p className="text-sm text-muted-foreground mb-3 px-1 font-semibold">💬 자주 묻는 질문</p>
              <div className="grid grid-cols-2 gap-3">
                {frequentQuestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(item.question)}
                    className="bg-card rounded-xl p-4 border border-border hover:border-primary hover:shadow-md transition-all text-left"
                  >
                    <span className="text-2xl mb-2 block">{item.emoji}</span>
                    <p className="text-sm text-foreground leading-snug font-medium">{item.question}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-md">
                    <Sparkles size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-card text-foreground border border-border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4 sticky bottom-0">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="청약에 대해 궁금한 점을 물어보세요..."
            className="flex-1 h-12 rounded-xl border-border"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-white p-0 disabled:opacity-50"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
