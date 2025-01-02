import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../../store/slices/productsSlice';
import cartReducer from '../../store/slices/cartSlice';
import Layout from '../Layout';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      cart: cartReducer,
    },
    preloadedState,
  });
};

describe('Layout', () => {
  it('renders correctly', () => {
    const store = createTestStore({
      cart: {
        items: [],
        total: 1000,
      },
      products: {
        searchQuery: '',
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Eteration')).toBeInTheDocument();
    expect(screen.getByText('Enes')).toBeInTheDocument();
    expect(screen.getByText('1.000₺')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles search input correctly', () => {
    const store = createTestStore({
      cart: {
        items: [],
        total: 0,
      },
      products: {
        searchQuery: '',
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    const state = store.getState();
    expect(state.products.searchQuery).toBe('test search');
  });

  it('displays formatted total price', () => {
    const store = createTestStore({
      cart: {
        items: [],
        total: 1234567,
      },
      products: {
        searchQuery: '',
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );

    const priceElement = screen.getByText((_content: string, element: Element | null): boolean => {
      if (!element) return false;
      const hasText = (text: string): boolean => element.textContent?.includes(text) ?? false;
      const isInHeaderCart = Boolean(
        element.parentElement?.classList.contains('flex') && 
        element.parentElement?.classList.contains('items-center') && 
        element.parentElement?.classList.contains('gap-2') &&
        element.parentElement?.querySelector('svg')
      );
      return hasText('1.234.567') && hasText('₺') && isInHeaderCart;
    });
    expect(priceElement).toBeInTheDocument();
  });
}); 