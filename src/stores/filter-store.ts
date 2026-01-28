import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModelType, LicenseType } from "@/types";

interface FilterState {
  // Leaderboard filters
  selectedCategories: string[];
  selectedOrganizations: string[];
  selectedModelTypes: ModelType[];
  selectedLicenseTypes: LicenseType[];
  showInactive: boolean;
  searchQuery: string;

  // Sort options
  sortBy: string;
  sortOrder: "asc" | "desc";

  // Actions
  setCategories: (categories: string[]) => void;
  setOrganizations: (orgs: string[]) => void;
  setModelTypes: (types: ModelType[]) => void;
  setLicenseTypes: (types: LicenseType[]) => void;
  toggleShowInactive: () => void;
  setSearchQuery: (query: string) => void;
  setSort: (by: string, order: "asc" | "desc") => void;
  resetFilters: () => void;
}

const initialState = {
  selectedCategories: [],
  selectedOrganizations: [],
  selectedModelTypes: [],
  selectedLicenseTypes: [],
  showInactive: false,
  searchQuery: "",
  sortBy: "score",
  sortOrder: "desc" as const,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,

      setCategories: (categories) => set({ selectedCategories: categories }),
      setOrganizations: (orgs) => set({ selectedOrganizations: orgs }),
      setModelTypes: (types) => set({ selectedModelTypes: types }),
      setLicenseTypes: (types) => set({ selectedLicenseTypes: types }),
      toggleShowInactive: () =>
        set((state) => ({ showInactive: !state.showInactive })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSort: (by, order) => set({ sortBy: by, sortOrder: order }),
      resetFilters: () => set(initialState),
    }),
    {
      name: "leaderboard-filters",
      partialize: (state) => ({
        selectedCategories: state.selectedCategories,
        selectedModelTypes: state.selectedModelTypes,
        selectedLicenseTypes: state.selectedLicenseTypes,
        showInactive: state.showInactive,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
