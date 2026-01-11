import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    'beauty',
    'fragrances', 
    'furniture',
    'groceries',
    'home-decoration',
    'kitchen-accessories',
    'laptops',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'mobile-accessories',
    'motorcycle',
    'skin-care',
    'smartphones',
    'sports-accessories',
    'sunglasses',
    'tablets',
    'tops',
    'vehicle',
    'womens-bags',
    'womens-dresses',
    'womens-jewellery',
    'womens-shoes',
    'womens-watches'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Categories</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category}`}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all text-center"
            >
              <h3 className="font-bold text-gray-900 capitalize">
                {category.replace('-', ' ')}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;