import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setSearchQuery } from '../store/slices/productsSlice';
import type { CartItem } from '../store/slices/cartSlice';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { total } = useSelector((state: RootState) => state.cart as { items: CartItem[], total: number });
  const { searchQuery } = useSelector((state: RootState) => state.products);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#2A59FE] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold">
              Eteration
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-full py-2 px-4 pl-10 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9 6C9 5.44772 9.44772 5 10 5H14C14.5523 5 15 5.44772 15 6H9ZM7 6C7 4.34315 8.34315 3 10 3H14C15.6569 3 17 4.34315 17 6H19C20.6569 6 22 7.34315 22 9V11V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V11V9C2 7.34315 3.34315 6 5 6H7ZM16 8H19C19.5523 8 20 8.44772 20 9V10H4V9C4 8.44772 4.44772 8 5 8H8H16ZM20 18V12H4V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18Z" fill="white"/>
                </svg>

                <span className="font-medium">{total.toLocaleString('tr-TR')}₺</span>
              </div>

              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7ZM16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM7 19C7 16.2386 9.23858 14 12 14C14.7614 14 17 16.2386 17 19C17 19.5523 17.4477 20 18 20C18.5523 20 19 19.5523 19 19C19 15.134 15.866 12 12 12C8.13401 12 5 15.134 5 19C5 19.5523 5.44772 20 6 20C6.55228 20 7 19.5523 7 19Z" fill="white"/>
                </svg>
                <span className="font-medium">Enes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
     
    </div>
  );
};

export default Layout; 