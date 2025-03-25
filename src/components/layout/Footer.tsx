
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 pt-16 pb-8 mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products/men" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Men</Link></li>
              <li><Link to="/products/women" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Women</Link></li>
              <li><Link to="/products/accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Accessories</Link></li>
              <li><Link to="/products/new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/customer-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Customer Service</Link></li>
              <li><Link to="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping Information</Link></li>
              <li><Link to="/returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Size Guide</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link to="/sustainability" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sustainability</Link></li>
              <li><Link to="/stores" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stores</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-3 mb-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-muted-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-muted-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-muted-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="mailto:contact@sheera.com" className="text-foreground hover:text-muted-foreground transition-colors">
                <Mail size={18} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for updates on new products and exclusive offers.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 text-sm px-3 py-2 border border-r-0 border-border focus:outline-none" 
              />
              <button 
                type="submit" 
                className="bg-foreground text-white px-3 py-2 text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {currentYear} SHEERA. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
