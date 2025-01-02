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
          <div className="grid grid-cols-2 gap-8 bg-white p-4 shadow-detailCard">
            {/* Product Image */}
            <div className="aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover shadow-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h2 className="text-3xl mb-2">{product.name}</h2>
              <h3 className="text-2xl font-semibold mb-8 text-blue-600">{product.price.toLocaleString('tr-TR')}₺</h3>
              
              <button
                onClick={() => dispatch(addToCart(product))}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
              >
                Add to Cart
              </button>

              <p className="text-gray-700">{product.description}</p>
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