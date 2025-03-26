
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { products as initialProducts } from '@/data/products';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured?: boolean;
  new?: boolean;
  sizes: string[];
};

const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const handleOpenAddDialog = () => {
    setCurrentProduct({
      id: crypto.randomUUID(),
      name: '',
      price: 0,
      description: '',
      image: '',
      category: '',
      sizes: []
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
  
  const handleAddProduct = () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setProducts([...products, currentProduct as Product]);
    setIsAddDialogOpen(false);
    toast.success('Product added successfully');
  };
  
  const handleEditProduct = () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setProducts(products.map(product => 
      product.id === currentProduct.id ? currentProduct as Product : product
    ));
    setIsEditDialogOpen(false);
    toast.success('Product updated successfully');
  };
  
  const handleDeleteProduct = () => {
    if (!selectedProductId) return;
    
    setProducts(products.filter(product => product.id !== selectedProductId));
    setIsDeleteDialogOpen(false);
    toast.success('Product deleted successfully');
  };
  
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
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">र {product.price.toFixed(2)}</td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <Input
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
              <Input
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
