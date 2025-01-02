import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../store/slices/productsSlice';
import CartSummary from '../components/CartSummary';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const product = useSelector((state: RootState) => 
    state.products.items.find((p: Product) => p.id === id)
  );

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Product Details */}
        <div className="col-span-10">
          <div className="grid grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow">
            {/* Product Image */}
            <div className="aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-2">{product.brand}</p>
              <p className="text-2xl font-bold mb-4 text-blue-600">{product.price.toLocaleString('tr-TR')}₺</p>
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="mt-auto">
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-4 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-span-2">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 