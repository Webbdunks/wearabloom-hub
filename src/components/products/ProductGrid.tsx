
import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  columns = 3,
  className 
}) => {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <div className={cn(`grid ${gridClass} gap-4 md:gap-6 lg:gap-8`, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
