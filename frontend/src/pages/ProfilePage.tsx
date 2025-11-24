import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileDisplay } from "@/components/profile/ProfileDisplay";

interface ProfilePageProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
}

export function ProfilePage({ onBack, onNavigateToHome }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-2xl mx-auto flex items-center px-4 sm:px-6 py-4">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-foreground" />
            </button>
          )}
          <h2 className="font-bold ml-4 text-foreground">
            {isEditing ? "프로필 수정" : "내 프로필"}
          </h2>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {isEditing ? (
          <ProfileForm
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileDisplay onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
