import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchProducts, setCurrentPage, setBrandSearchQuery, setModelSearchQuery } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { setBrand, setModel, setSortBy, setSortOrder } from '../store/slices/filterSlice';
import CartSummary from '../components/CartSummary';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { 
    items, 
    status, 
    error, 
    currentPage, 
    itemsPerPage, 
    searchQuery,
    filteredBrands,
    filteredModels,
    brandSearchQuery,
    modelSearchQuery
  } = useSelector((state: RootState) => state.products);
  const filters = useSelector((state: RootState) => state.filter);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const filteredProducts = items.filter(product => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.model.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);
    const matchesModel = !filters.category || product.category === filters.category;
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesPrice = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
    return matchesSearch && matchesModel && matchesBrand && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'none') return 0;
    const factor = filters.sortOrder === 'asc' ? 1 : -1;
    return filters.sortBy === 'price'
      ? (a.price - b.price) * factor
      : a.name.localeCompare(b.name) * factor;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (status === 'loading') return <div className="text-center py-8">Loading...</div>;
  if (status === 'failed') return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sort By */}
          <p className="text-gray-600 text-xs">Sort By</p>
          <div className="bg-white p-4 shadow-detailCard">
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === 'none' && filters.sortOrder === 'asc'}
                  onChange={() => {
                    dispatch(setSortBy('none'));
                    dispatch(setSortOrder('asc'));
                  }}
                  className="form-radio text-blue-600 mr-2"
                />
                <span className="text-gray-700">Old to new</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === 'none' && filters.sortOrder === 'desc'}
                  onChange={() => {
                    dispatch(setSortBy('none'));
                    dispatch(setSortOrder('desc'));
                  }}
                  className="form-radio text-blue-600 mr-2"
                />
                <span className="text-gray-700">New to old</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === 'price' && filters.sortOrder === 'desc'}
                  onChange={() => {
                    dispatch(setSortBy('price'));
                    dispatch(setSortOrder('desc'));
                  }}
                  className="form-radio text-blue-600 mr-2"
                />
                <span className="text-gray-700">Price high to low</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === 'price' && filters.sortOrder === 'asc'}
                  onChange={() => {
                    dispatch(setSortBy('price'));
                    dispatch(setSortOrder('asc'));
                  }}
                  className="form-radio text-blue-600 mr-2"
                />
                <span className="text-gray-700">Price low to High</span>
              </label>
            </div>
          </div>

          {/* Brands */}
          <p className="text-gray-600 text-xs">Brands</p>
          <div className="bg-white p-4 shadow-detailCard">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search"
                value={brandSearchQuery}
                onChange={(e) => dispatch(setBrandSearchQuery(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border  text-sm"
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredBrands.map((brand, index) => (
                <label key={`brand-${brand}-${index}`} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brand === brand}
                    onChange={() => dispatch(setBrand(filters.brand === brand ? '' : brand))}
                    className="form-checkbox text-blue-600 rounded mr-2"
                  />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Model */}
          <p className="text-gray-600 text-xs">Model</p>
          <div className="bg-white p-4 shadow-detailCard">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search"
                value={modelSearchQuery}
                onChange={(e) => dispatch(setModelSearchQuery(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border  text-sm"
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredModels.map((model, index) => (
                <label key={`model-${model}-${index}`} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.model === model}
                    onChange={() => dispatch(setModel(filters.model === model ? '' : model))}
                    className="form-checkbox text-blue-600 rounded mr-2"
                  />
                  <span className="text-gray-700">{model}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map(product => (
              <div key={product.id} className="bg-white shadow-detailCard overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer p-3"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <div className="p-3">
                  <p className="text-blue-600 font-medium mb-2">{product.price.toLocaleString('tr-TR')} ₺</p>
                  <h3 className="text-lg font-medium mb-4 cursor-pointer truncate" onClick={() => navigate(`/product/${product.id}`)}>
                    {product.name}
                  </h3>
                  <button
                    onClick={() => dispatch(addToCart(product))}
                    className="w-full bg-[#2A59FE] text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-1 flex-wrap">
              <button
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border-none text-sm disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => dispatch(setCurrentPage(page))}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === page ? 'bg-white text-[#2A59FE] shadow-sm' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border-none text-sm disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-2 order-first lg:order-last">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default ProductList; 