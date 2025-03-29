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

const ProductManagementPage = () => {
  const { products, setProducts, isLoading } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({ name: '', price: 0, description: '', image: '', category: '', sizes: [], featured: false, new: false });
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

  const saveProduct = async () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.category) return;

    if (isEditing && currentProduct.id) {
      const { data, error } = await supabase.from('products').update(currentProduct).eq('id', currentProduct.id);
      if (error) return console.error(error);
      setProducts((prev) => prev.map((p) => (p.id === data[0].id ? data[0] : p)));
    } else {
      const { data, error } = await supabase.from('products').insert([currentProduct]);
      if (error) return console.error(error);
      setProducts((prev) => [...prev, data[0]]);
    }
    setIsDialogOpen(false);
  };

  const deleteProduct = async () => {
    if (!selectedProductId) return;
    await supabase.from('products').delete().eq('id', selectedProductId);
    setProducts((prev) => prev.filter((p) => p.id !== selectedProductId));
    setIsDeleteDialogOpen(false);
  };

  return (
    <AdminLayout title="Product Management">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">Manage your store products</p>
        <Button onClick={() => handleOpenDialog()}> <Plus size={16} /> Add Product</Button>
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
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => handleOpenDialog(product)}> <Edit size={16} /> </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteDialog(product.id)}> <Trash2 size={16} /> </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEditing ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
          <Input name="name" value={currentProduct.name || ''} onChange={handleInputChange} placeholder="Product Name" />
          <Input name="price" type="number" value={currentProduct.price || ''} onChange={handleInputChange} placeholder="Price" />
          <Input name="category" value={currentProduct.category || ''} onChange={handleInputChange} placeholder="Category" />
          <Textarea name="description" value={currentProduct.description || ''} onChange={handleInputChange} placeholder="Description" />
          <Input name="image" value={currentProduct.image || ''} onChange={handleInputChange} placeholder="Image URL" />
          <Checkbox checked={currentProduct.featured || false} onCheckedChange={(checked) => handleCheckboxChange('featured', checked as boolean)} /> Featured
          <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={saveProduct}>{isEditing ? 'Update' : 'Add'} Product</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button variant="destructive" onClick={deleteProduct}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
export default ProductManagementPage;
