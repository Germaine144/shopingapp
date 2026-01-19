import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Wind, 
  Armchair, 
  ShoppingCart, 
  Home, 
  UtensilsCrossed,
  Laptop,
  Shirt,
  ShoppingBag,
  Watch,
  Smartphone,
  Bike,
  Heart,
  Tablet,
  Users,
  Car,
  Sun,
  Gem
} from 'lucide-react';

const Categories = () => {
  const categories = [
    { name: 'beauty', icon: Sparkles, color: 'from-pink-500 to-rose-500' },
    { name: 'fragrances', icon: Wind, color: 'from-purple-500 to-pink-500' },
    { name: 'furniture', icon: Armchair, color: 'from-amber-500 to-orange-500' },
    { name: 'groceries', icon: ShoppingCart, color: 'from-green-500 to-emerald-500' },
    { name: 'home-decoration', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { name: 'kitchen-accessories', icon: UtensilsCrossed, color: 'from-red-500 to-pink-500' },
    { name: 'laptops', icon: Laptop, color: 'from-gray-600 to-gray-800' },
    { name: 'mens-shirts', icon: Shirt, color: 'from-blue-600 to-indigo-600' },
    { name: 'mens-shoes', icon: ShoppingBag, color: 'from-slate-600 to-slate-800' },
    { name: 'mens-watches', icon: Watch, color: 'from-zinc-600 to-zinc-800' },
    { name: 'mobile-accessories', icon: Smartphone, color: 'from-violet-500 to-purple-500' },
    { name: 'motorcycle', icon: Bike, color: 'from-red-600 to-orange-600' },
    { name: 'skin-care', icon: Heart, color: 'from-rose-400 to-pink-400' },
    { name: 'smartphones', icon: Smartphone, color: 'from-indigo-600 to-blue-600' },
    { name: 'sports-accessories', icon: Users, color: 'from-green-600 to-teal-600' },
    { name: 'sunglasses', icon: Sun, color: 'from-yellow-500 to-amber-500' },
    { name: 'tablets', icon: Tablet, color: 'from-sky-500 to-blue-500' },
    { name: 'tops', icon: Shirt, color: 'from-fuchsia-500 to-purple-500' },
    { name: 'vehicle', icon: Car, color: 'from-gray-700 to-slate-700' },
    { name: 'womens-bags', icon: ShoppingBag, color: 'from-pink-600 to-rose-600' },
    { name: 'womens-dresses', icon: Sparkles, color: 'from-purple-400 to-pink-400' },
    { name: 'womens-jewellery', icon: Gem, color: 'from-amber-400 to-yellow-400' },
    { name: 'womens-shoes', icon: ShoppingBag, color: 'from-red-400 to-pink-500' },
    { name: 'womens-watches', icon: Watch, color: 'from-rose-500 to-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-gray-600">
            Explore our wide range of products across {categories.length} categories
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/category/${category.name}`}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-bold text-gray-900 capitalize text-lg">
                    {category.name.replace(/-/g, ' ')}
                  </h3>
                  
                  {/* Hover Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium text-gray-600">
                      Browse →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;