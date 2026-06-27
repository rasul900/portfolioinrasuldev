import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UIState {
  loadingComplete: boolean;
  commandOpen: boolean;
  pricingYearly: boolean;
  projectFilter: { category: string; tech: string; year: string; search: string };
  setLoadingComplete: (v: boolean) => void;
  setCommandOpen: (v: boolean) => void;
  togglePricing: () => void;
  setProjectFilter: (filter: Partial<UIState["projectFilter"]>) => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    loadingComplete: false,
    commandOpen: false,
    pricingYearly: false,
    projectFilter: { category: "all", tech: "all", year: "all", search: "" },

    setLoadingComplete: (v) => set({ loadingComplete: v }),
    setCommandOpen: (v) => set({ commandOpen: v }),
    togglePricing: () => set((s) => ({ pricingYearly: !s.pricingYearly })),
    setProjectFilter: (filter) =>
      set((s) => {
        s.projectFilter = { ...s.projectFilter, ...filter };
      }),
  }))
);
