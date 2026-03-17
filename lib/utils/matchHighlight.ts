export const isInCurrentWeek = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  const day = weekStart.getDay() || 7;
  weekStart.setDate(weekStart.getDate() - (day - 1));
  weekStart.setHours(0, 0, 0, 0);

  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);

  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);

  return target >= weekStart && target < nextWeekStart;
};

