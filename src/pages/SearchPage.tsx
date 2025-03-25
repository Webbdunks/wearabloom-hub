
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { products } from '@/data/products';
import { Product } from '@/types';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  // Search logic
  useEffect(() => {
    // Only search if we have a query
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simple search implementation
    // Search product name and description
    const results = products.filter(product => {
      const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
    
    setSearchResults(results);
    setIsSearching(false);
  }, [query]);

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-8 pb-16">
        <h1 className="text-3xl font-light mb-6">Search</h1>
        
        {/* Search Input */}
        <div className="relative mb-8 max-w-lg">
          <Input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={handleSearchChange}
            className="pl-10 h-12"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </div>
        
        {/* Results */}
        {query ? (
          <>
            <h2 className="text-lg mb-4">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{query}"
            </h2>
            
            {isSearching ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <ProductGrid products={searchResults} columns={3} />
            ) : (
              <div className="h-64 flex items-center justify-center flex-col">
                <p className="text-lg mb-2">No products found</p>
                <p className="text-muted-foreground">Try a different search term</p>
              </div>
            )}
          </>
        ) : (
          <div className="h-64 flex items-center justify-center flex-col">
            <p className="text-lg mb-2">Search for products</p>
            <p className="text-muted-foreground">Enter a search term above to find products</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
