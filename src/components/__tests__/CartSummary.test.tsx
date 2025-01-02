import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../store/slices/cartSlice';
import CartSummary from '../CartSummary';

const mockCartItems = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 100,
    image: 'test1.jpg',
    description: 'Test Description 1',
    category: 'Category 1',
    brand: 'Brand 1',
    model: 'Model 1',
    quantity: 2,
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
    quantity: 1,
  },
];

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState,
  });
};

describe('CartSummary', () => {
  it('renders empty cart message when no items', () => {
    const store = createTestStore({
      cart: {
        items: [],
        total: 0,
      },
    });

    render(
      <Provider store={store}>
        <CartSummary />
      </Provider>
    );

    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('renders cart items correctly', () => {
    const store = createTestStore({
      cart: {
        items: mockCartItems,
        total: 400,
      },
    });

    render(
      <Provider store={store}>
        <CartSummary />
      </Provider>
    );

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('100₺')).toBeInTheDocument();
    expect(screen.getByText('200₺')).toBeInTheDocument();
    expect(screen.getByText('400₺')).toBeInTheDocument();
  });

  it('handles quantity increase', () => {
    const store = createTestStore({
      cart: {
        items: [mockCartItems[0]],
        total: 200,
      },
    });

    render(
      <Provider store={store}>
        <CartSummary />
      </Provider>
    );

    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(3);
    expect(state.cart.total).toBe(300);
  });

  it('handles quantity decrease', () => {
    const store = createTestStore({
      cart: {
        items: [mockCartItems[0]],
        total: 200,
      },
    });

    render(
      <Provider store={store}>
        <CartSummary />
      </Provider>
    );

    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(1);
    expect(state.cart.total).toBe(100);
  });

  it('removes item when quantity becomes 0', () => {
    const store = createTestStore({
      cart: {
        items: [{ ...mockCartItems[0], quantity: 1 }],
        total: 100,
      },
    });

    render(
      <Provider store={store}>
        <CartSummary />
      </Provider>
    );

    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(0);
    expect(state.cart.total).toBe(0);
  });

  it('displays correct total price', () => {
    const store = createTestStore({
      cart: {
        items: mockCartItems,
        total: 400,
      },
    });

    render(
      <Provider store={store}>
        <CartSummary />
      </Provider>
    );

    expect(screen.getByText('Total Price:')).toBeInTheDocument();
    expect(screen.getByText('400₺')).toBeInTheDocument();
  });
}); 