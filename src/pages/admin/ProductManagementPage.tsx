import React, { useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useProducts } from '@/context/ProductContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/types';

const ProductManagementPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, isLoading } = useProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const handleOpenAddDialog = () => {
    setCurrentProduct({
      name: '',
      price: 0,
      description: '',
      image: '',
      category: '',
      sizes: [],
      featured: false,
      new: false
    });
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (id: string) => {
    setSelectedProductId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setCurrentProduct({
        ...currentProduct,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'sizes') {
      setCurrentProduct({
        ...currentProduct,
        [name]: value.split(',').map(size => size.trim())
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentProduct({
      ...currentProduct,
      [name]: checked
    });
  };
  
  const handleAddProduct = () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.category) {
      return;
    }
    
    addProduct(currentProduct as Omit<Product, 'id'>);
    setIsAddDialogOpen(false);
  };
  
  const handleEditProduct = () => {
    if (!currentProduct.id || !currentProduct.name || !currentProduct.price || !currentProduct.category) {
      return;
    }
    
    updateProduct(currentProduct as Product);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteProduct = () => {
    if (!selectedProductId) return;
    
    deleteProduct(selectedProductId);
    setIsDeleteDialogOpen(false);
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Product Management">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading products...</span>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Product Management">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage your store products
        </p>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-1" size={16} />
          Add New Product
        </Button>
      </div>
      
      {/* Products Table */}
      <div className="overflow-x-auto">
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
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>र {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenEditDialog(product)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleOpenDeleteDialog(product.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                value={currentProduct.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                className="col-span-3"
                value={currentProduct.price || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Input
                id="category"
                name="category"
                className="col-span-3"
                value={currentProduct.category || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
                value={currentProduct.description || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                className="col-span-3"
                value={currentProduct.image || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sizes" className="text-right">
                Sizes (comma separated)
              </Label>
              <Input
                id="sizes"
                name="sizes"
                className="col-span-3"
                value={currentProduct.sizes?.join(', ') || ''}
                onChange={handleInputChange}
                placeholder="S, M, L, XL"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Options</div>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={currentProduct.featured || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('featured', checked as boolean)
                    }
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="new" 
                    checked={currentProduct.new || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('new', checked as boolean)
                    }
                  />
                  <Label htmlFor="new">New Arrival</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name *
              </Label>
              <Input
                id="edit-name"
                name="name"
                className="col-span-3"
                value={currentProduct.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price *
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                className="col-span-3"
                value={currentProduct.price || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category *
              </Label>
              <Input
                id="edit-category"
                name="category"
                className="col-span-3"
                value={currentProduct.category || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                className="col-span-3"
                value={currentProduct.description || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">
                Image URL
              </Label>
              <Input
                id="edit-image"
                name="image"
                className="col-span-3"
                value={currentProduct.image || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-sizes" className="text-right">
                Sizes (comma separated)
              </Label>
              <Input
                id="edit-sizes"
                name="sizes"
                className="col-span-3"
                value={currentProduct.sizes?.join(', ') || ''}
                onChange={handleInputChange}
                placeholder="S, M, L, XL"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Options</div>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-featured" 
                    checked={currentProduct.featured || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('featured', checked as boolean)
                    }
                  />
                  <Label htmlFor="edit-featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-new" 
                    checked={currentProduct.new || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('new', checked as boolean)
                    }
                  />
                  <Label htmlFor="edit-new">New Arrival</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProductManagementPage;
