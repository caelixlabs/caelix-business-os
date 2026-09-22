import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CalendarViewMode = 'day' | 'week' | 'month';

export interface CalendarPrefs {
  view: CalendarViewMode;
  weekStartsOn: 0 | 1;
  dayStartHour: number;
  dayEndHour: number;
}

interface UIState {
  calendarPrefs: CalendarPrefs;
  setCalendarPrefs: (prefs: Partial<CalendarPrefs>) => void;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  commandPaletteOpen: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setCommandPaletteOpen: (value: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      calendarPrefs: { view: 'week', weekStartsOn: 1, dayStartHour: 7, dayEndHour: 21 },
      setCalendarPrefs: (prefs) => set((state) => ({ calendarPrefs: { ...state.calendarPrefs, ...prefs } })),
      sidebarCollapsed: false,
      darkMode: false,
      commandPaletteOpen: false,
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),
      setCommandPaletteOpen: (value) => set({ commandPaletteOpen: value }),
    }),
    {
      name: 'caelix-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        darkMode: state.darkMode,
        calendarPrefs: state.calendarPrefs,
      }),
    },
  ),
);
