import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  category: string;
  brand: string;
  model: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'name' | 'price' | 'none';
  sortOrder: 'asc' | 'desc';
}

const initialState: FilterState = {
  category: '',
  brand: '',
  model: '',
  priceRange: {
    min: 0,
    max: Infinity,
  },
  sortBy: 'none',
  sortOrder: 'asc',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setBrand: (state, action: PayloadAction<string>) => {
      state.brand = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.priceRange = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<FilterState['sortOrder']>) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      console.log("resetFilters", state);
      return initialState;
    },
  },
});

export const {
  setCategory,
  setBrand,
  setModel,
  setPriceRange,
  setSortBy,
  setSortOrder,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer; 