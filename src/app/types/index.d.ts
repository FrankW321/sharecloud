import dayjs from "dayjs";

export type Task = {
  id: number;
  name: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
};

export type QuarterData = {
  startOfQuarter: dayjs.Dayjs;
  endOfQuarter: dayjs.Dayjs;
  quarter: number;
  year: number;
};