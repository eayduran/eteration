import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../../store/slices/productsSlice';
import cartReducer from '../../store/slices/cartSlice';
import filterReducer from '../../store/slices/filterSlice';
import ProductList from '../../pages/ProductList';

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 100,
    image: 'test1.jpg',
    description: 'Test Description 1',
    category: 'Category 1',
    brand: 'Brand 1',
    model: 'Model 1',
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 200,
    image: 'test2.jpg',
    description: 'Test Description 2',
    category: 'Category 2',
    brand: 'Brand 2',
    model: 'Model 2',
  },
];

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      cart: cartReducer,
      filter: filterReducer,
    },
    preloadedState,
  });
};

describe('ProductList', () => {
  it('renders loading state', () => {
    const store = createTestStore({
      products: {
        items: [],
        status: 'loading',
        error: null,
        currentPage: 1,
        itemsPerPage: 12,
        searchQuery: '',
        brands: [],
        models: [],
        filteredBrands: [],
        filteredModels: [],
        brandSearchQuery: '',
        modelSearchQuery: '',
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const store = createTestStore({
      products: {
        items: [],
        status: 'failed',
        error: 'Test error',
        currentPage: 1,
        itemsPerPage: 12,
        searchQuery: '',
        brands: [],
        models: [],
        filteredBrands: [],
        filteredModels: [],
        brandSearchQuery: '',
        modelSearchQuery: '',
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders product list', () => {
    const store = createTestStore({
      products: {
        items: mockProducts,
        status: 'succeeded',
        error: null,
        currentPage: 1,
        itemsPerPage: 12,
        searchQuery: '',
        brands: ['Brand 1', 'Brand 2'],
        models: ['Model 1', 'Model 2'],
        filteredBrands: ['Brand 1', 'Brand 2'],
        filteredModels: ['Model 1', 'Model 2'],
        brandSearchQuery: '',
        modelSearchQuery: '',
      },
      filter: {
        category: '',
        brand: '',
        model: '',
        priceRange: {
          min: 0,
          max: 1000000
        },
        sortBy: 'none',
        sortOrder: 'asc'
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    
    // Check for prices using a more flexible matcher
    const price100Elements = screen.getAllByText((_content: string, element: Element | null) => {
      if (!element) return false;
      const hasText = (text: string): boolean => element.textContent?.includes(text) ?? false;
      // Check if the element is within a product card
      const isInProductCard = element.closest('.bg-white.shadow-detailCard') !== null;
      return hasText('100') && hasText('₺') && isInProductCard;
    });
    const price200Elements = screen.getAllByText((_content: string, element: Element | null) => {
      if (!element) return false;
      const hasText = (text: string): boolean => element.textContent?.includes(text) ?? false;
      // Check if the element is within a product card
      const isInProductCard = element.closest('.bg-white.shadow-detailCard') !== null;
      return hasText('200') && hasText('₺') && isInProductCard;
    });
    
    expect(price100Elements[0]).toBeInTheDocument();
    expect(price200Elements[0]).toBeInTheDocument();
  });
}); 