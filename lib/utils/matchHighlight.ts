export const parseHungarianDottedDate = (dateString: string): Date | null => {
  // Accepts "YYYY. MM. DD." and "YYYY.MM.DD." (with optional spaces)
  const m = dateString
    .trim()
    .match(/^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.\s*$/);
  if (!m) return null;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const d = new Date(year, month - 1, day);
  // Validate we didn't overflow (e.g., 2026. 02. 31.)
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
};

export const isOnOrAfterToday = (dateString: string): boolean => {
  const d = parseHungarianDottedDate(dateString);
  if (!d) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  d.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
};

export const isInCurrentWeek = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  const day = weekStart.getDay() || 7;
  weekStart.setDate(weekStart.getDate() - (day - 1));
  weekStart.setHours(0, 0, 0, 0);

  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);

  const target = parseHungarianDottedDate(dateString);
  if (!target) return false;
  target.setHours(0, 0, 0, 0);

  return target >= weekStart && target < nextWeekStart;
};

