
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useProducts } from '@/context/ProductContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductManagementPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, isLoading } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({ 
        name: '', 
        price: 0, 
        description: '', 
        image: '', 
        category: '', 
        sizes: [], 
        featured: false, 
        new: false,
        colors: [] 
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: name === 'price' ? parseFloat(value) || 0 : value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentProduct({ ...currentProduct, [name]: checked });
  };

  const handleSizesChange = (value: string) => {
    const sizeArray = value.split(',').map(size => size.trim()).filter(Boolean);
    setCurrentProduct({ ...currentProduct, sizes: sizeArray });
  };

  const handleCategoryChange = (category: string) => {
    setCurrentProduct({ ...currentProduct, category });
  };

  const saveProduct = async () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && currentProduct.id) {
        await updateProduct(currentProduct as Product);
        toast.success("Product updated successfully");
      } else {
        await addProduct(currentProduct as Omit<Product, 'id'>);
        toast.success("Product added successfully");
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProductId) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProductId);
      toast.success("Product deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout title="Product Management">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">Manage your store products</p>
        <Button onClick={() => handleOpenDialog()}> <Plus size={16} className="mr-2" /> Add Product</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading products...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>New</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell><img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" /></TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>र {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.featured ? "Yes" : "No"}</TableCell>
                <TableCell>{product.new ? "Yes" : "No"}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpenDialog(product)}><Edit size={16} /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteDialog(product.id)}><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{isEditing ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={currentProduct.name || ''} 
                onChange={handleInputChange} 
                placeholder="Product Name" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={currentProduct.price || ''} 
                onChange={handleInputChange} 
                placeholder="Price" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={currentProduct.category || ''} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={currentProduct.description || ''} 
                onChange={handleInputChange} 
                placeholder="Description" 
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input 
                id="image" 
                name="image" 
                value={currentProduct.image || ''} 
                onChange={handleInputChange} 
                placeholder="Image URL" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sizes">Sizes (comma separated)</Label>
              <Input 
                id="sizes" 
                name="sizes" 
                value={currentProduct.sizes?.join(', ') || ''} 
                onChange={(e) => handleSizesChange(e.target.value)} 
                placeholder="S, M, L, XL" 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={currentProduct.featured || false} 
                onCheckedChange={(checked) => handleCheckboxChange('featured', checked as boolean)} 
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="new" 
                checked={currentProduct.new || false} 
                onCheckedChange={(checked) => handleCheckboxChange('new', checked as boolean)} 
              />
              <Label htmlFor="new">New Arrival</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={saveProduct} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Add'} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProductManagementPage;
