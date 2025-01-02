import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  brand: string;
  model: string;
}

interface ProductsState {
  items: Product[];
  brands: string[];
  models: string[];
  filteredBrands: string[];
  filteredModels: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  brandSearchQuery: string;
  modelSearchQuery: string;
}

const initialState: ProductsState = {
  items: [],
  brands: [],
  models: [],
  filteredBrands: [],
  filteredModels: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  itemsPerPage: 12,
  searchQuery: '',
  brandSearchQuery: '',
  modelSearchQuery: '',
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('https://5fc9346b2af77700165ae514.mockapi.io/products');
  console.log(response.data);
  return response.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setBrandSearchQuery: (state, action: PayloadAction<string>) => {
      state.brandSearchQuery = action.payload;
      state.filteredBrands = state.brands.filter(brand => 
        brand.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setModelSearchQuery: (state, action: PayloadAction<string>) => {
      state.modelSearchQuery = action.payload;
      state.filteredModels = state.models.filter(model => 
        model.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;

        // brands
        state.brands = Array.from(new Set(action.payload.map(item => item.brand))).sort();

        // models
        state.models = Array.from(new Set(action.payload.map(item => item.model))).sort();

        state.filteredBrands = state.brands;
        state.filteredModels = state.models;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { setCurrentPage, setSearchQuery, setBrandSearchQuery, setModelSearchQuery } = productsSlice.actions;
export default productsSlice.reducer; 