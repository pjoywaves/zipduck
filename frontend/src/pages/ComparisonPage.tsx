import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ComparisonView } from "@/components/subscriptions/ComparisonView";

/**
 * 청약 비교 페이지
 *
 * 선택한 청약들을 나란히 비교하는 전체 화면 뷰
 */
export function ComparisonPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubscriptionClick = (subscriptionId: string) => {
    navigate(`/subscriptions/${subscriptionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-foreground">청약 비교</h1>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <ComparisonView
          onClose={handleClose}
          onSubscriptionClick={handleSubscriptionClick}
        />
      </main>
    </div>
  );
}

export default ComparisonPage;
