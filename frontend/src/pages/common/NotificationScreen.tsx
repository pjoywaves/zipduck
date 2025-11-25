import { useState } from "react";
import { ChevronLeft, Bell, MapPin, Megaphone, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationScreenProps {
  onBack: () => void;
}

interface Notification {
  id: number;
  type: "announcement" | "region" | "favorite";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationScreen({ onBack }: NotificationScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "announcement",
      title: "새로운 청약 공고",
      message: "힐스테이트 송파 헬리오시티 청약 접수가 3일 후 시작됩니다.",
      time: "10분 전",
      read: false
    },
    {
      id: 2,
      type: "region",
      title: "관심지역 업데이트",
      message: "서울 강남구에 새로운 분양 정보가 등록되었습니다.",
      time: "1시간 전",
      read: false
    },
    {
      id: 3,
      type: "favorite",
      title: "관심 단지 알림",
      message: "래미안 강남 포레스티지 경쟁률이 업데이트되었습니다.",
      time: "3시간 전",
      read: true
    },
    {
      id: 4,
      type: "announcement",
      title: "시스템 공지",
      message: "집덕 AI 상담 기능이 새롭게 추가되었습니다.",
      time: "1일 전",
      read: true
    },
    {
      id: 5,
      type: "region",
      title: "관심지역 업데이트",
      message: "경기 성남시에 3개의 새로운 청약이 등록되었습니다.",
      time: "2일 전",
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Megaphone size={20} className="text-primary" />;
      case "region":
        return <MapPin size={20} className="text-blue-500" />;
      case "favorite":
        return <Bell size={20} className="text-pink-500" />;
      default:
        return <Bell size={20} className="text-muted-foreground" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="font-bold ml-4 text-foreground">알림</h2>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="ghost"
              size="sm"
              className="text-primary font-semibold"
            >
              <CheckCheck size={16} className="mr-1" />
              모두 읽음
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">알림이 없습니다</h3>
            <p className="text-sm text-muted-foreground text-center">
              새로운 청약 소식이 있으면<br />여기에 표시됩니다
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              className={`w-full p-5 flex gap-4 hover:bg-muted/50 transition-colors ${
                !notification.read ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-start justify-between mb-1">
                  <p className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-primary rounded-full ml-2 mt-1.5"></span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
