import axios from 'axios';
import productsReducer, { fetchProducts, setSearchQuery } from '../slices/productsSlice';
import cartReducer, { addToCart, updateQuantity, removeFromCart } from '../slices/cartSlice';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Products Slice', () => {
  const initialState = {
    items: [],
    status: 'idle' as const,
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
  };

  it('should handle initial state', () => {
    expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSearchQuery', () => {
    const actual = productsReducer(initialState, setSearchQuery('test'));
    expect(actual.searchQuery).toEqual('test');
  });

  it('should handle fetchProducts.pending', () => {
    const actual = productsReducer(initialState, { type: fetchProducts.pending.type });
    expect(actual.status).toEqual('loading');
  });

  it('should handle fetchProducts.fulfilled', () => {
    const mockProducts = [
      { id: '1', name: 'Test', brand: 'Brand1', model: 'Model1', price: 100, image: '', description: '', category: '' }
    ];
    const actual = productsReducer(
      initialState,
      { type: fetchProducts.fulfilled.type, payload: mockProducts }
    );
    expect(actual.status).toEqual('succeeded');
    expect(actual.items).toEqual(mockProducts);
  });

  it('should fetch products successfully', async () => {
    const mockProducts = [
      { id: '1', name: 'Test', brand: 'Brand1', model: 'Model1', price: 100, image: '', description: '', category: '' }
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

    const dispatch = jest.fn();
    await fetchProducts()(dispatch, () => {}, undefined);

    expect(mockedAxios.get).toHaveBeenCalledWith('https://5fc9346b2af77700165ae514.mockapi.io/products');
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: fetchProducts.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ 
      type: fetchProducts.fulfilled.type,
      payload: mockProducts 
    }));
  });
});

describe('Cart Slice', () => {
  const initialState = {
    items: [],
    total: 0
  };

  const mockProduct = {
    id: '1',
    name: 'Test',
    price: 100,
    image: '',
    description: '',
    category: '',
    brand: '',
    model: ''
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addToCart', () => {
    const actual = cartReducer(initialState, addToCart(mockProduct));
    expect(actual.items).toHaveLength(1);
    expect(actual.total).toEqual(100);
  });

  it('should handle updateQuantity', () => {
    const stateWithItem = cartReducer(initialState, addToCart(mockProduct));
    const actual = cartReducer(stateWithItem, updateQuantity({ id: '1', quantity: 2 }));
    expect(actual.items[0].quantity).toEqual(2);
    expect(actual.total).toEqual(200);
  });

  it('should handle removeFromCart', () => {
    const stateWithItem = cartReducer(initialState, addToCart(mockProduct));
    const actual = cartReducer(stateWithItem, removeFromCart('1'));
    expect(actual.items).toHaveLength(0);
    expect(actual.total).toEqual(0);
  });
}); 