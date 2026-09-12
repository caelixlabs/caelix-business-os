import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
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
      }),
    },
  ),
);
