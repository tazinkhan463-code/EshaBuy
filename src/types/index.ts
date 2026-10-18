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

export interface SiteSettings {
  storeName: string;
  storeTagline: string;
  logoType: 'badge' | 'image';
  logoBadgeInitial: string;
  logoImageUrl: string;
  logoHeight?: number;
  announcementText: string;
  promoCode: string;
  promoDiscountPercent: number;
  freeShippingThreshold: number;
  heroBadge: string;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage1: string;
  heroImage2: string;
  heroStatSold: string;
  heroStatRating: string;
  heroStatDispatch: string;
  flashSaleTitle: string;
  flashSaleSubtitle: string;
  flashSaleDiscount: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
}

export interface CustomerOrder {
  id: string;
  date: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  status: 'In Transit' | 'Out for Delivery' | 'Packed & Inspected' | 'Delivered';
}
