
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
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
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-3 right-3 bg-background/80 hover:bg-background transition-all",
            inWishlist ? "text-red-500" : "text-muted-foreground"
          )}
          onClick={handleWishlistToggle}
        >
          <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
        </Button>
      </div>
      <h3 className="text-sm font-medium group-hover:underline mb-1 transition-all">
        {product.name}
      </h3>
      <p className="text-sm text-muted-foreground">
        ₹{product.price.toFixed(2)}
      </p>
    </Link>
  );
};

export default ProductCard;
