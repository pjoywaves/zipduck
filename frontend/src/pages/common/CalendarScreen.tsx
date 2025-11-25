import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarScreenProps {
  onBack: () => void;
}

export function CalendarScreen({ onBack }: CalendarScreenProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10)); // November 2025

  const events = [
    { date: "2025-11-20", title: "힐스테이트 송파 청약 접수", type: "application", color: "bg-primary" },
    { date: "2025-11-21", title: "힐스테이트 송파 청약 마감", type: "deadline", color: "bg-red-500" },
    { date: "2025-11-24", title: "래미안 강남 청약 접수", type: "application", color: "bg-primary" },
    { date: "2025-11-28", title: "힐스테이트 송파 당첨 발표", type: "announcement", color: "bg-blue-500" },
    { date: "2025-12-10", title: "힐스테이트 송파 계약", type: "contract", color: "bg-green-500" },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(event => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center px-6 py-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold ml-4 text-muted-foreground">청약 캘린더</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Calendar Header */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <button onClick={previousMonth} className="p-2 hover:bg-muted rounded-xl transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-bold text-foreground">{monthName}</h3>
            <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-xl transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center text-sm font-semibold py-2 ${
                  index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-muted-foreground"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = day === 17; // Mock today as 17th

              return (
                <button
                  key={day}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    isToday
                      ? "bg-primary text-primary-foreground font-bold"
                      : dayEvents.length > 0
                      ? "bg-muted hover:bg-muted/80"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-sm text-muted-foreground">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${event.color}`}
                        ></div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">일정 구분</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">청약 접수</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">마감일</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">당첨 발표</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">계약 체결</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">다가오는 일정</h3>
          <div className="space-y-3">
            {events.slice(0, 4).map((event, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-1 h-full ${event.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon size={14} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <p className="font-medium text-foreground">{event.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-border font-semibold">
            <CalendarIcon size={18} className="mr-2" />
            일정 추가
          </Button>
          <Button className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            전체 일정
          </Button>
        </div>
      </div>
    </div>
  );
}
