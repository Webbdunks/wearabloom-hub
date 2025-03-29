
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistTotalItems } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .rpc('is_admin', { user_id: user.id });
            
          if (!error && data) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight"
          >
            SHEERA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products/men" 
              className="text-sm font-medium hover:opacity-70 btn-hover-effect"
            >
              Men
            </Link>
            <Link 
              to="/products/women" 
              className="text-sm font-medium hover:opacity-70 btn-hover-effect"
            >
              Women
            </Link>
            <Link 
              to="/products/accessories" 
              className="text-sm font-medium hover:opacity-70 btn-hover-effect"
            >
              Accessories
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/search" className="p-1">
              <Search className="h-5 w-5" />
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="w-full cursor-pointer">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="w-full cursor-pointer">Orders</Link>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="w-full cursor-pointer flex items-center">
                          <ShieldAlert className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative p-1">
              <Heart className="h-5 w-5" />
              {wishlistTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center rounded-full bg-black text-white">
                  {wishlistTotalItems}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative p-1">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center rounded-full bg-black text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 animate-fade-in">
          <div className="container h-full flex flex-col">
            <div className="flex justify-between items-center py-4">
              <Link 
                to="/" 
                className="text-xl font-semibold tracking-tight"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SHEERA
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex flex-col items-center justify-center flex-1 space-y-8">
              <Link 
                to="/products/men" 
                className="text-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link 
                to="/products/women" 
                className="text-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link 
                to="/products/accessories" 
                className="text-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link 
                to="/wishlist" 
                className="text-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="text-xl font-medium flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShieldAlert className="h-5 w-5 mr-2" />
                  Admin Dashboard
                </Link>
              )}
              
              {!user && (
                <>
                  <Link 
                    to="/login" 
                    className="text-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="text-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
