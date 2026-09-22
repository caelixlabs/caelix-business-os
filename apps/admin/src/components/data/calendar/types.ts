export interface CalendarEventItem {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  meta?: string;
}
