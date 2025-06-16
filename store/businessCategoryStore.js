// store/businessCategoryStore.js
import { create } from "zustand";

export const useBusinessCategoryStore = create((set) => ({
  filters: {
    itemsPerPage: 10,
    currentPage: 1,
    keyWord: null,
    sortOrder: -1,
    sortingKey: "_id",
    onChangeSearch: false,
    advance: null,
  },
  setFilters: (data) => set((state) => ({
    filters: { ...state.filters, ...data }
  })),
}));
