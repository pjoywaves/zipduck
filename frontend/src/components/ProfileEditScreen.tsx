import { useState, useRef } from "react";
import { ChevronLeft, Camera, Upload, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface ProfileEditScreenProps {
  onBack: () => void;
}

export function ProfileEditScreen({ onBack }: ProfileEditScreenProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (previewImage) {
      setProfileImage(previewImage);
      setPreviewImage(null);
    }
    // Show success message
    alert("프로필 사진이 저장되었습니다.");
  };

  const handleDelete = () => {
    setProfileImage(null);
    setPreviewImage(null);
  };

  const currentImage = previewImage || profileImage;

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="flex-1 text-center font-bold pr-10">프로필 편집</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Image Preview */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {/* Image Circle */}
            <div className="w-32 h-32 rounded-full bg-muted border-4 border-border overflow-hidden flex items-center justify-center shadow-lg">
              {currentImage ? (
                <img 
                  src={currentImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">👤</span>
              )}
            </div>
            
            {/* Camera Icon Overlay */}
            <button
              onClick={handleUploadClick}
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-card"
            >
              <Camera size={20} className="text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h3 className="font-bold text-foreground mb-1">김청약님</h3>
            <p className="text-sm text-muted-foreground">zipduck@example.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={handleUploadClick}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            {currentImage ? "사진 변경" : "프로필 사진 업로드"}
          </Button>

          {currentImage && (
            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full h-12 border-2 border-border hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-foreground hover:text-red-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={20} />
              사진 삭제
            </Button>
          )}
        </div>

        {/* Preview Notice */}
        {previewImage && (
          <div className="bg-blue-soft-bg dark:bg-card rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              💡 변경사항을 저장하려면 아래 <span className="font-semibold text-primary">"저장하기"</span> 버튼을 눌러주세요.
            </p>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h4 className="font-semibold text-foreground">프로필 사진 가이드</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>권장 크기: 500 x 500px 이상</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>지원 형식: JPG, PNG, GIF (최대 5MB)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>얼굴이 선명하게 보이는 사진을 사용해주세요</span>
            </li>
          </ul>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/10 dark:to-blue-900/30 rounded-xl p-4 text-center border border-primary/20">
            <p className="text-2xl font-bold text-primary mb-1">12</p>
            <p className="text-xs text-muted-foreground">관심 청약</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-50 dark:from-green-500/10 dark:to-green-900/30 rounded-xl p-4 text-center border border-green-500/20">
            <p className="text-2xl font-bold text-green-600 dark:text-green-500 mb-1">2</p>
            <p className="text-xs text-muted-foreground">관심 지역</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-50 dark:from-yellow-500/10 dark:to-yellow-900/30 rounded-xl p-4 text-center border border-yellow-500/20">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mb-1">8</p>
            <p className="text-xs text-muted-foreground">AI 추천</p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      {previewImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 max-w-md mx-auto">
          <Button
            onClick={handleSave}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
          >
            저장하기
          </Button>
        </div>
      )}

      {/* Bottom padding for fixed button */}
      {previewImage && <div className="h-20"></div>}
    </div>
  );
}
