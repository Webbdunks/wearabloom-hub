
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { getFeaturedProducts, getNewProducts } from '@/data/products';

const HomePage = () => {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="h-screen relative flex items-center">
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg text-white animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4">
              Elevate Your Style
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/80">
              Discover timeless pieces designed with precision and purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link to="/products/women">Shop Women</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link to="/products/men">Shop Men</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Curated Selection
            </h2>
            <h3 className="text-2xl md:text-3xl font-light">
              Featured Products
            </h3>
          </div>
          <Link 
            to="/products" 
            className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <ProductGrid products={featuredProducts} columns={3} />
      </section>

      {/* Categories Banner */}
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/products/men"
              className="group relative h-80 overflow-hidden bg-secondary/20"
            >
              <img 
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                alt="Men's Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">Men</h3>
                  <p className="text-sm text-white/80">
                    Shop Collection
                  </p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/products/women"
              className="group relative h-80 overflow-hidden bg-secondary/20"
            >
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Women's Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">Women</h3>
                  <p className="text-sm text-white/80">
                    Shop Collection
                  </p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/products/accessories"
              className="group relative h-80 overflow-hidden bg-secondary/20"
            >
              <img 
                src="https://images.unsplash.com/photo-1509631179865-bde2c2the-20fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80" 
                alt="Accessories Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">Accessories</h3>
                  <p className="text-sm text-white/80">
                    Shop Collection
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Latest Additions
            </h2>
            <h3 className="text-2xl md:text-3xl font-light">
              New Arrivals
            </h3>
          </div>
          <Link 
            to="/products/new" 
            className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <ProductGrid products={newProducts} columns={3} />
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Be the first to know about new collections, special offers, and exclusive content.
          </p>
          <form className="flex flex-col sm:flex-row max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 border border-border focus:outline-none sm:rounded-l-md"
              required
            />
            <Button 
              type="submit" 
              className="mt-2 sm:mt-0 sm:rounded-l-none"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
