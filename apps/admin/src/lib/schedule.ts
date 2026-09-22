import { eachDayOfInterval, format, setHours, setMinutes } from 'date-fns';

const WEEKDAY_CODES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export interface WeeklySchedule {
  id: string;
  name: string;
  days: string[];
  startDate: string;
  endDate?: string | null;
  startTime: string;
  endTime: string;
  status?: string;
}

function atTime(day: Date, time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return setMinutes(setHours(day, hours), minutes);
}

/** Expands recurring weekly schedules (batches, classes) into dated occurrences within [from, to]. */
export function expandWeeklySchedules<T extends WeeklySchedule>(items: T[], from: Date, to: Date) {
  return eachDayOfInterval({ start: from, end: to }).flatMap((day) => {
    const iso = format(day, 'yyyy-MM-dd');
    const code = WEEKDAY_CODES[day.getDay()];

    return items
      .filter(
        (item) =>
          item.status !== 'CANCELLED' &&
          item.days.includes(code) &&
          iso >= item.startDate.slice(0, 10) &&
          (!item.endDate || iso <= item.endDate.slice(0, 10)),
      )
      .map((item) => ({
        id: `${item.id}:${iso}`,
        title: item.name,
        start: atTime(day, item.startTime),
        end: atTime(day, item.endTime),
        source: item,
      }));
  });
}
