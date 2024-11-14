import dayjs, { Dayjs } from "dayjs";

export type WeekGroup = {
  monthName: string;
  weeks: number[];
};

export function getQuarterDates(date: dayjs.Dayjs) {
  const quarter = Math.floor((date.month() / 3));
  const startOfQuarter = date.startOf("year").add(quarter * 3, "months");
  const endOfQuarter = startOfQuarter.add(2, "months").endOf("month");
  const year = date.year();
  return { startOfQuarter, endOfQuarter, quarter: quarter + 1, year };
}

export const generateWeeksInQuarter = (start: Dayjs, end: Dayjs): number[] => {
  const weeks: number[] = [];
  let current = start.startOf("isoWeek");
  while (current.isBefore(end) || current.isSame(end, "week")) {
    weeks.push(current.isoWeek());
    current = current.add(1, "week");
  }
  return weeks;
};

export const groupWeeksByMonth = (startOfQuarter: Dayjs, weeks: number[]): WeekGroup[] => {
  const groupedWeeks: WeekGroup[] = [];
  let currentMonth = startOfQuarter.month();
  let currentMonthWeeks: number[] = [];
  let monthCount = 0;
  weeks.forEach((week) => {
    const weekStart = dayjs(startOfQuarter).isoWeek(week).startOf("isoWeek");
    if (weekStart.month() === currentMonth) {
      currentMonthWeeks.push(week);
    } else if (currentMonthWeeks.length > 0) {
      groupedWeeks.push({ monthName: dayjs().month(currentMonth).format("MMM"), weeks: currentMonthWeeks });
      currentMonthWeeks = [week];
      currentMonth = weekStart.month();
      monthCount++;

      if (monthCount === 3) {
        return;
      }
    }
  });
  if (currentMonthWeeks.length > 0 && monthCount < 3) {
    groupedWeeks.push({ monthName: dayjs().month(currentMonth).format("MMM"), weeks: currentMonthWeeks });
  }
  return groupedWeeks;
};
