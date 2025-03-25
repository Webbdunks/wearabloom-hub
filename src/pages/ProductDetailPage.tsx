
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getProductById } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductGrid from '@/components/products/ProductGrid';
import { getProductsByCategory } from '@/data/products';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(id ? getProductById(id) : undefined);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (!product) {
      // Product not found
      if (id) {
        const foundProduct = getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.sizes.length > 0) {
            setSelectedSize(foundProduct.sizes[0]);
          }
          
          // Get related products (same category)
          const related = getProductsByCategory(foundProduct.category)
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          // Product not found, redirect to products page
          navigate('/products');
        }
      } else {
        navigate('/products');
      }
    }
  }, [id, product, navigate]);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addItem(product, quantity, selectedSize);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (!product) {
    return null; // Or a loading spinner
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-8 pb-16">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product image */}
          <div className="bg-secondary/10 aspect-[3/4] overflow-hidden relative">
            <div 
              className={`absolute inset-0 bg-secondary/20 ${isImageLoaded ? 'hidden' : 'flex'} items-center justify-center`}
            ></div>
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-opacity ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
            {(product.new || product.featured) && (
              <div className="absolute top-4 left-4">
                {product.new && (
                  <span className="bg-foreground text-background text-xs font-medium px-2 py-1 inline-block mr-2">
                    New
                  </span>
                )}
                {product.featured && !product.new && (
                  <span className="bg-muted-foreground text-background text-xs font-medium px-2 py-1 inline-block">
                    Featured
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Product details */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-light mb-2">
              {product.name}
            </h1>
            <p className="text-xl mb-6">
              ₹{product.price.toFixed(2)}
            </p>
            
            <p className="text-muted-foreground mb-8">
              {product.description}
            </p>
            
            {/* Size selection */}
            <div className="mb-6">
              <label className="block text-sm mb-2">
                Size
              </label>
              <Select 
                value={selectedSize} 
                onValueChange={setSelectedSize}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map(size => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            
            {/* Add to cart and wishlist */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button 
                className="flex-1 flex items-center justify-center gap-2" 
                size="lg" 
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                <ShoppingBag size={18} /> Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className={inWishlist ? "text-red-500" : ""}
                onClick={handleWishlistToggle}
              >
                <Heart className={`mr-2 ${inWishlist ? "fill-current" : ""}`} size={18} />
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
            
            {/* Additional information */}
            <Separator className="my-6" />
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Free shipping on orders over $100</p>
              <p className="mb-2">Easy 30-day returns</p>
              <p>Made with premium quality materials</p>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-light mb-8">You May Also Like</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
