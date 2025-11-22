import { ChevronLeft, Shield } from "lucide-react";

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center font-bold pr-10">개인정보 처리방침</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/10 dark:to-blue-900/30 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">집덕 개인정보 처리방침</h3>
              <p className="text-sm text-muted-foreground">시행일: 2024년 1월 1일</p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section>
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제1조 (개인정보의 처리 목적)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              집덕(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 
              별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">1. 회원 가입 및 관리</p>
              <p>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적으로 개인정보를 처리합니다.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">2. 청약 서비스 제공</p>
              <p>청약 정보 제공, 맞춤형 청약 추천, 청약 알림 서비스, AI 분석 서비스 제공을 목적으로 개인정보를 처리합니다.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">3. 마케팅 및 광고 활용</p>
              <p>신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공을 목적으로 개인정보를 처리합니다.</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제2조 (개인정보의 처리 및 보유 기간)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 
              수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div>
                <p className="font-semibold text-foreground">• 회원 가입 정보</p>
                <p className="text-xs">보유기간: 회원 탈퇴 시까지</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">• 서비스 이용 기록</p>
                <p className="text-xs">보유기간: 3년 (통신비밀보호법)</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">• 결제 정보</p>
                <p className="text-xs">보유기간: 5년 (전자상거래법)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제3조 (처리하는 개인정보 항목)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">필수 항목</p>
              <p>이름, 이메일 주소, 휴대전화번호, 비밀번호</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">선택 항목</p>
              <p>생년월일, 성별, 관심지역, 청약통장 정보, 가구원 수</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">자동 수집 항목</p>
              <p>IP주소, 쿠키, 서비스 이용 기록, 기기 정보</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제4조 (개인정보의 제3자 제공)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed px-1">
            <p>
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 
              처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 
              제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제5조 (정보주체의 권리·의무 및 행사방법)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <p>1. 개인정보 열람 요구</p>
              <p>2. 개인정보에 오류 등이 있을 경우 정정 요구</p>
              <p>3. 개인정보 삭제 요구</p>
              <p>4. 개인정보 처리정지 요구</p>
            </div>
            <p className="text-xs">
              권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며 
              회사는 이에 대해 지체없이 조치하겠습니다.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section>
          <div className="bg-[#EFF6FF] dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-3">
            <h3 className="font-bold text-foreground">제6조 (개인정보 보호책임자)</h3>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 px-1">
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 
              정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">개인정보 보호책임자</p>
              <p>• 이름: 홍길동</p>
              <p>• 직책: CTO</p>
              <p>• 이메일: privacy@zipduck.com</p>
              <p>• 전화: 02-1234-5678</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">
            본 개인정보 처리방침은 2024년 1월 1일부터 적용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
