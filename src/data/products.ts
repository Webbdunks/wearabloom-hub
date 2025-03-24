
import { Product, Category } from "../types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Men",
    description: "Men's clothing collection"
  },
  {
    id: "2",
    name: "Women",
    description: "Women's clothing collection"
  },
  {
    id: "3",
    name: "Accessories",
    description: "Accessories collection"
  }
];

export const products: Product[] = [
  {
    id: "1",
    name: "Minimal Wool Coat",
    price: 289.99,
    description: "A premium wool coat with a minimal design. Perfect for layering in colder weather while maintaining a sophisticated look.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80",
    category: "Men",
    featured: true,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "2",
    name: "Relaxed Linen Shirt",
    price: 89.99,
    description: "A lightweight, breathable linen shirt with a relaxed fit. Ideal for warm days and casual occasions.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80",
    category: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "3",
    name: "Structured Blazer",
    price: 199.99,
    description: "A tailored blazer with structured shoulders and a sleek fit. Versatile enough for both formal and smart-casual settings.",
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=969&q=80",
    category: "Women",
    featured: true,
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "4",
    name: "Cashmere Sweater",
    price: 149.99,
    description: "A luxurious cashmere sweater with a soft, comfortable feel. Provides warmth without bulk.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
    category: "Women",
    new: true,
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "5",
    name: "Slim Fit Jeans",
    price: 79.99,
    description: "Modern slim fit jeans with a slight stretch for comfort. A versatile addition to any wardrobe.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    category: "Men",
    sizes: ["30", "32", "34", "36", "38"]
  },
  {
    id: "6",
    name: "Silk Scarf",
    price: 59.99,
    description: "A luxurious silk scarf with a beautiful print. Adds elegance to any outfit.",
    image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
    category: "Accessories",
    featured: true,
    sizes: ["One Size"]
  },
  {
    id: "7",
    name: "Leather Tote Bag",
    price: 129.99,
    description: "A high-quality leather tote bag with ample space for everyday essentials. Designed to be both functional and stylish.",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1057&q=80",
    category: "Accessories",
    sizes: ["One Size"]
  },
  {
    id: "8",
    name: "Pleated Midi Skirt",
    price: 89.99,
    description: "An elegant pleated midi skirt with a fluid, flattering silhouette. A versatile piece for any wardrobe.",
    image: "https://images.unsplash.com/photo-1573908763425-ff9dd1f69ca3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80",
    category: "Women",
    new: true,
    sizes: ["XS", "S", "M", "L"]
  }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.new);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
