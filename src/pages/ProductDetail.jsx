import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { api } from '../api/axiosInstance';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const isWishlisted = product ? wishlist.some(item => item.id === product.id) : false;

  useEffect(() => {
    // Fetch product details
    setLoading(true);
    api.getProductById(id)
      .then(res => {
        const productData = res.data;
        setProduct(productData);
        setLoading(false);
        
        // Fetch related products from same category
        if (productData.category) {
          api.getProductsByCategory(productData.category, { limit: 4 })
            .then(categoryRes => {
              const related = categoryRes.data.products
                .filter(p => p.id !== productData.id)
                .slice(0, 3);
              setRelatedProducts(related);
            });
        }
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link 
          to="/products" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4">
                <img 
                  src={product.images?.[selectedImage] || product.thumbnail} 
                  alt={product.title}
                  className="w-full h-96 object-contain rounded-lg"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category and Brand */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                      {product.brand}
                    </span>
                  )}
                </div>
                
                {/* Wishlist Button */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-full ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{product.rating.toFixed(1)}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-gray-600">{product.reviews?.length || 0} reviews</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                  {product.discountPercentage && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-bold px-2 py-1 rounded">
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center border-t border-b border-gray-300"
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate('/cart');
                  }}
                  disabled={product.stock === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex">
                  <span className="w-32 font-medium">SKU:</span>
                  <span>{product.id}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-medium">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-medium">Brand:</span>
                  <span>{product.brand || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium ${activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-3 font-medium ${activeTab === 'specifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Reviews
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  {/* Additional description content if available */}
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-medium">{product.brand || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Stock</span>
                      <span className="font-medium">{product.stock} units</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium">{product.rating.toFixed(1)}/5</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium">{product.discountPercentage ? `${product.discountPercentage}%` : 'None'}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{review.reviewerName || 'Anonymous'}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          <span className="text-sm text-gray-400">{review.date || 'Recently'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(product => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">{product.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">${product.price}</span>
                    <span className="text-sm text-gray-600">⭐ {product.rating.toFixed(1)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;