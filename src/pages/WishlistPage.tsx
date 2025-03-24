
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const WishlistPage = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    // Add to cart with default size and quantity 
    addItem(product, 1, product.sizes[0]);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
            <h1 className="text-2xl font-medium mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">
              Items added to your wishlist will be saved here
            </p>
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-light">My Wishlist</h1>
          <Button 
            variant="outline" 
            onClick={clearWishlist}
            className="text-sm"
          >
            Clear All
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Saved Items ({items.length})</CardTitle>
            <CardDescription>Products you've added to your wishlist</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-16 h-16 bg-secondary/10 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/product/${product.id}`} className="font-medium hover:underline">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:ml-2">Add to Cart</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeItem(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:ml-2">Remove</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button asChild variant="outline">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default WishlistPage;
