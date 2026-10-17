export interface Product {
  id: string;
  name: string;
  category: 'Tops & Dresses' | 'Outerwear' | 'Footwear' | 'Bags & Accessories';
  price: number;
  oldPrice: number;
  badge: 'NEW' | 'HOT' | 'SALE' | 'BEST' | 'LIMITED' | 'TRENDING';
  rating: string;
  image: string;
  description: string;
  sizes?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  quantity: number;
  selectedSize?: string;
}

export interface FlashDeal {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  leftCount: number;
  stockRatio: string;
  image: string;
}
