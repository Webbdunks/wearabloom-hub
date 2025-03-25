
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    // If product has sizes, use the first size as default
    const defaultSize = product.sizes.length > 0 ? product.sizes[0] : "";
    addToCart(product, 1, defaultSize);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <Link to={`/product/${product.id}`} className={cn("group block relative", className)}>
      <div className="product-card aspect-[3/4] overflow-hidden bg-secondary/20 mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover animate-image-fade"
          loading="lazy"
        />
        {(product.new || product.featured) && (
          <div className="absolute top-3 left-3">
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
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "bg-background/80 hover:bg-background transition-all",
              inWishlist ? "text-red-500" : "text-muted-foreground"
            )}
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background transition-all text-muted-foreground"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <h3 className="text-sm font-medium group-hover:underline mb-1 transition-all">
        {product.name}
      </h3>
      <p className="text-sm text-muted-foreground">
        र{product.price.toFixed(2)}
      </p>
    </Link>
  );
};

export default ProductCard;
