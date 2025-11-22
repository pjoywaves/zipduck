import { useState } from "react";
import { ChevronLeft, FileText, ChevronRight } from "lucide-react";

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

export function TermsOfServiceScreen({ onBack }: TermsOfServiceScreenProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const tableOfContents = [
    { id: "section1", title: "제1조 목적" },
    { id: "section2", title: "제2조 정의" },
    { id: "section3", title: "제3조 약관의 효력 및 변경" },
    { id: "section4", title: "제4조 회원가입" },
    { id: "section5", title: "제5조 서비스의 제공 및 변경" },
    { id: "section6", title: "제6조 서비스의 중단" },
    { id: "section7", title: "제7조 회원 탈퇴 및 자격 상실" },
    { id: "section8", title: "제8조 회원에 대한 통지" },
    { id: "section9", title: "제9조 책임제한" }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center font-bold pr-10">서비스 이용약관</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/10 dark:to-blue-900/30 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">집덕 서비스 이용약관</h3>
              <p className="text-sm text-muted-foreground">시행일: 2024년 1월 1일</p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 px-1">목차</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {tableOfContents.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center justify-between p-4 hover:bg-muted transition-colors ${
                  index !== tableOfContents.length - 1 ? "border-b border-border" : ""
                } ${activeSection === item.id ? "bg-[#EFF6FF] dark:bg-[#1E293B]" : ""}`}
              >
                <span className={`text-sm font-medium ${
                  activeSection === item.id ? "text-primary" : "text-foreground"
                }`}>
                  {item.title}
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Section 1 */}
        <section id="section1" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제1조 (목적)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed px-1">
            <p>
              본 약관은 집덕(이하 "회사")이 제공하는 청약 정보 서비스 및 관련 제반 서비스의 
              이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="section2" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제2조 (정의)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <p><span className="font-semibold text-foreground">1. "서비스"</span>란 구현되는 단말기(PC, TV, 휴대형단말기 등)와 상관없이 "회원"이 이용할 수 있는 집덕의 청약 정보 제공 서비스를 의미합니다.</p>
              <p><span className="font-semibold text-foreground">2. "회원"</span>이란 회사의 "서비스"에 접속하여 본 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.</p>
              <p><span className="font-semibold text-foreground">3. "아이디(ID)"</span>란 "회원"의 식별과 "서비스" 이용을 위하여 "회원"이 정하고 "회사"가 승인하는 문자와 숫자의 조합을 의미합니다.</p>
              <p><span className="font-semibold text-foreground">4. "비밀번호"</span>란 "회원"이 부여받은 "아이디"와 일치되는 "회원"임을 확인하고 비밀보호를 위해 "회원" 자신이 정한 문자 또는 숫자의 조합을 의미합니다.</p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="section3" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제3조 (약관의 효력 및 변경)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              1. 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
            </p>
            <p>
              2. 본 약관의 내용은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지하고, 
              이에 동의한 회원이 서비스에 가입함으로써 효력이 발생합니다.
            </p>
            <p>
              3. 회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 회사가 약관을 변경할 경우에는 
              적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 
              적용일자 전일까지 공지합니다.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="section4" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제4조 (회원가입)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              1. 회원가입은 이용자가 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고 
              회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
            </p>
            <p>
              2. 회원가입신청서에는 다음 사항을 기재해야 합니다.
            </p>
            <div className="bg-card border border-border rounded-xl p-4 space-y-1">
              <p>• 이름</p>
              <p>• 이메일 주소</p>
              <p>• 비밀번호</p>
              <p>• 휴대전화번호</p>
              <p>• 기타 회사가 필요하다고 인정하는 사항</p>
            </div>
            <p>
              3. 회사는 다음 각 호에 해당하는 회원가입신청에 대하여는 승낙을 하지 않을 수 있습니다.
            </p>
            <div className="bg-card border border-border rounded-xl p-4 space-y-1">
              <p>• 실명이 아니거나 타인의 명의를 이용한 경우</p>
              <p>• 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</p>
              <p>• 부정한 용도 또는 영리를 추구할 목적으로 본 서비스를 이용하고자 하는 경우</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="section5" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제5조 (서비스의 제공 및 변경)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>1. 회사는 회원에게 아래와 같은 서비스를 제공합니다.</p>
            <div className="bg-card border border-border rounded-xl p-4 space-y-1">
              <p>• 청약 정보 제공 서비스</p>
              <p>• AI 맞춤 청약 추천 서비스</p>
              <p>• 청약 일정 알림 서비스</p>
              <p>• 청약 관련 데이터 분석 서비스</p>
              <p>• 기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</p>
            </div>
            <p>
              2. 회사는 서비스의 내용을 변경할 경우에는 변경사유 및 내용을 회원에게 통지합니다.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="section6" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제6조 (서비스의 중단)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 
              발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
            <p>
              2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 회원 또는 
              제3자가 입은 손해에 대하여 배상합니다. 단, 회사에 고의 또는 과실이 없는 경우에는 그러하지 아니합니다.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="section7" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제7조 (회원 탈퇴 및 자격 상실)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              1. 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.
            </p>
            <p>
              2. 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다.
            </p>
            <div className="bg-card border border-border rounded-xl p-4 space-y-1">
              <p>• 가입 신청 시에 허위 내용을 등록한 경우</p>
              <p>• 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</p>
              <p>• 서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</p>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="section8" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제8조 (회원에 대한 통지)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              1. 회사가 회원에 대한 통지를 하는 경우, 회원이 회사와 미리 약정하여 지정한 
              전자우편 주소로 할 수 있습니다.
            </p>
            <p>
              2. 회사는 불특정다수 회원에 대한 통지의 경우 1주일 이상 서비스 공지사항에 
              게시함으로써 개별 통지에 갈음할 수 있습니다.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="section9" className="scroll-mt-20">
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제9조 (책임제한)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 
              서비스 제공에 관한 책임이 면제됩니다.
            </p>
            <p>
              2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </p>
            <p>
              3. 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 
              그 밖에 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
            </p>
            <p>
              4. 회사는 회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-muted rounded-xl p-4 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            본 약관은 2024년 1월 1일부터 적용됩니다.
          </p>
          <p className="text-xs text-muted-foreground">
            문의: service@zipduck.com
          </p>
        </div>
      </div>
    </div>
  );
}
