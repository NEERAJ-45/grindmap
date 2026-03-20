import {
  startOfDay,
  differenceInCalendarDays,
  subDays,
  format,
} from "date-fns";

export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
}

export function calculateStreak(solvedDates: Date[]): StreakResult {
  if (solvedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Get unique days sorted descending
  const uniqueDays = Array.from(
    new Set(solvedDates.map((d) => format(startOfDay(d), "yyyy-MM-dd")))
  ).sort((a, b) => b.localeCompare(a));

  const today = format(startOfDay(new Date()), "yyyy-MM-dd");
  const yesterday = format(startOfDay(subDays(new Date(), 1)), "yyyy-MM-dd");

  // Calculate current streak
  let currentStreak = 0;
  if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prevDate = new Date(uniqueDays[i - 1]);
      const currDate = new Date(uniqueDays[i]);
      if (differenceInCalendarDays(prevDate, currDate) === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate best streak
  let bestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prevDate = new Date(uniqueDays[i - 1]);
    const currDate = new Date(uniqueDays[i]);
    if (differenceInCalendarDays(prevDate, currDate) === 1) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  return { currentStreak, bestStreak };
}
