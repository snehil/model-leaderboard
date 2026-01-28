import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "@/stores/filter-store";

describe("FilterStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useFilterStore.setState({
      selectedCategories: [],
      selectedOrganizations: [],
      selectedModelTypes: [],
      selectedLicenseTypes: [],
      showInactive: false,
      searchQuery: "",
      sortBy: "score",
      sortOrder: "desc",
    });
  });

  describe("setCategories", () => {
    it("updates selected categories", () => {
      const store = useFilterStore.getState();
      store.setCategories(["llm", "code"]);

      expect(useFilterStore.getState().selectedCategories).toEqual([
        "llm",
        "code",
      ]);
    });
  });

  describe("setOrganizations", () => {
    it("updates selected organizations", () => {
      const store = useFilterStore.getState();
      store.setOrganizations(["openai", "anthropic"]);

      expect(useFilterStore.getState().selectedOrganizations).toEqual([
        "openai",
        "anthropic",
      ]);
    });
  });

  describe("setModelTypes", () => {
    it("updates selected model types", () => {
      const store = useFilterStore.getState();
      store.setModelTypes(["llm", "multimodal"]);

      expect(useFilterStore.getState().selectedModelTypes).toEqual([
        "llm",
        "multimodal",
      ]);
    });
  });

  describe("setLicenseTypes", () => {
    it("updates selected license types", () => {
      const store = useFilterStore.getState();
      store.setLicenseTypes(["open_source", "open_weights"]);

      expect(useFilterStore.getState().selectedLicenseTypes).toEqual([
        "open_source",
        "open_weights",
      ]);
    });
  });

  describe("toggleShowInactive", () => {
    it("toggles showInactive from false to true", () => {
      expect(useFilterStore.getState().showInactive).toBe(false);

      const store = useFilterStore.getState();
      store.toggleShowInactive();

      expect(useFilterStore.getState().showInactive).toBe(true);
    });

    it("toggles showInactive from true to false", () => {
      useFilterStore.setState({ showInactive: true });

      const store = useFilterStore.getState();
      store.toggleShowInactive();

      expect(useFilterStore.getState().showInactive).toBe(false);
    });
  });

  describe("setSearchQuery", () => {
    it("updates search query", () => {
      const store = useFilterStore.getState();
      store.setSearchQuery("gpt");

      expect(useFilterStore.getState().searchQuery).toBe("gpt");
    });
  });

  describe("setSort", () => {
    it("updates sort by and order", () => {
      const store = useFilterStore.getState();
      store.setSort("name", "asc");

      expect(useFilterStore.getState().sortBy).toBe("name");
      expect(useFilterStore.getState().sortOrder).toBe("asc");
    });
  });

  describe("resetFilters", () => {
    it("resets all filters to initial state", () => {
      // Set some filters
      useFilterStore.setState({
        selectedCategories: ["llm"],
        selectedOrganizations: ["openai"],
        selectedModelTypes: ["llm"],
        selectedLicenseTypes: ["proprietary"],
        showInactive: true,
        searchQuery: "test",
        sortBy: "name",
        sortOrder: "asc",
      });

      // Reset
      const store = useFilterStore.getState();
      store.resetFilters();

      // Check all values are reset
      const state = useFilterStore.getState();
      expect(state.selectedCategories).toEqual([]);
      expect(state.selectedOrganizations).toEqual([]);
      expect(state.selectedModelTypes).toEqual([]);
      expect(state.selectedLicenseTypes).toEqual([]);
      expect(state.showInactive).toBe(false);
      expect(state.searchQuery).toBe("");
      expect(state.sortBy).toBe("score");
      expect(state.sortOrder).toBe("desc");
    });
  });
});
