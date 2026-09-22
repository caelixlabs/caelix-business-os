import { differenceInMinutes, isAfter, startOfDay } from 'date-fns';

import type { CalendarEventItem } from './types';

export interface PositionedEvent {
  event: CalendarEventItem;
  lane: number;
  lanes: number;
}

/** Side-by-side lane layout so overlapping events in a day column don't cover each other. */
export function layoutDayEvents(events: CalendarEventItem[]): PositionedEvent[] {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const result: PositionedEvent[] = [];
  let cluster: PositionedEvent[] = [];
  let laneEnds: Date[] = [];
  let clusterEnd: Date | null = null;

  const flush = () => {
    cluster.forEach((item) => (item.lanes = laneEnds.length));
    result.push(...cluster);
    cluster = [];
    laneEnds = [];
    clusterEnd = null;
  };

  for (const event of sorted) {
    const end = event.end ?? event.start;
    if (clusterEnd && !isAfter(clusterEnd, event.start)) flush();

    let lane = laneEnds.findIndex((laneEnd) => !isAfter(laneEnd, event.start));
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = end;
    clusterEnd = clusterEnd && isAfter(clusterEnd, end) ? clusterEnd : end;
    cluster.push({ event, lane, lanes: 1 });
  }
  flush();

  return result;
}

export function minutesFromDayStart(date: Date) {
  return differenceInMinutes(date, startOfDay(date));
}
