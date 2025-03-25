
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  products, 
  getProductsByCategory, 
  getNewProducts 
} from '@/data/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const ProductsPage = () => {
  const { category } = useParams<{ category?: string }>();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // All possible sizes from products
  const allSizes = Array.from(
    new Set(products.flatMap(product => product.sizes))
  ).sort();

  useEffect(() => {
    let filteredProducts: Product[];
    
    // Filter by category or show new arrivals
    if (category === 'new') {
      filteredProducts = getNewProducts();
    } else if (category) {
      filteredProducts = getProductsByCategory(category);
    } else {
      filteredProducts = [...products];
    }
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => {
        const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return searchableText.includes(searchTerm.toLowerCase());
      });
    }
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by selected sizes
    if (selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.sizes.some(size => selectedSizes.includes(size))
      );
    }
    
    // Sort products
    switch (sortOption) {
      case "price-low-high":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Sort by new flag first, then by id (as a proxy for date)
        filteredProducts.sort((a, b) => {
          if (a.new && !b.new) return -1;
          if (!a.new && b.new) return 1;
          return Number(b.id) - Number(a.id);
        });
        break;
      case "featured":
      default:
        // Sort by featured flag first
        filteredProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
    
    setDisplayProducts(filteredProducts);
  }, [category, sortOption, priceRange, selectedSizes, searchTerm]);

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const categoryTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) 
    : "All Products";
    
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-8 pb-16">
        <h1 className="text-3xl font-light mb-2">{categoryTitle}</h1>
        <p className="text-muted-foreground mb-8">
          {displayProducts.length} products
        </p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="font-medium mb-4">Filters</h2>
              
              {/* Quick Search */}
              <div className="mb-6">
                <h3 className="text-sm mb-3">Quick Search</h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    type="text"
                    placeholder="Search within results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-8"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </button>
                </form>
              </div>
              
              <Separator className="my-6" />
              
              {/* Price range filter */}
              <div className="mb-6">
                <h3 className="text-sm mb-3">Price Range</h3>
                <Slider
                  min={0}
                  max={300}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Size filter */}
              <div>
                <h3 className="text-sm mb-3">Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {allSizes.map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`size-${size}`} 
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleSizeChange(size)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Products */}
          <div className="flex-1">
            {/* Sort options */}
            <div className="flex justify-end mb-6">
              <Select 
                value={sortOption} 
                onValueChange={setSortOption}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {displayProducts.length > 0 ? (
              <ProductGrid products={displayProducts} columns={3} />
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No products match your current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
