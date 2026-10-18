import { SiteSettings, CustomerOrder } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  storeName: 'EshaBuy',
  storeTagline: 'Modern Fashion & Style Destination',
  logoType: 'badge',
  logoBadgeInitial: 'E',
  logoImageUrl: '',
  logoHeight: 36,
  announcementText: 'Free Express Shipping on Orders Over $75',
  promoCode: 'ESHABUY20',
  promoDiscountPercent: 20,
  freeShippingThreshold: 75,
  heroBadge: 'New Season 2026 Collection Dropped',
  heroHeadline: 'Elevate Your Everyday',
  heroHighlight: 'Wardrobe Essentials',
  heroDescription: 'Discover modern streetwear, elegant dresses, premium accessories, and footwear crafted for effortless daily style.',
  heroImage1: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  heroImage2: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  heroStatSold: '12k+',
  heroStatRating: '4.9 ★',
  heroStatDispatch: '24h',
  flashSaleTitle: 'Save Up To',
  flashSaleDiscount: '60% OFF',
  flashSaleSubtitle: 'Limited stock left for top trending summer products. Deal expires soon!',
  supportEmail: 'support@eshabuy.com',
  supportPhone: '1-800-ESHA-BUY',
  address: '123 Fashion Ave, New York, NY 10001'
};

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'EB-84192',
    date: 'Today, 2:45 PM',
    customerName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    address: '742 Evergreen Terrace',
    city: 'Springfield, OR',
    paymentMethod: 'Credit Card',
    items: [
      {
        id: 'p1',
        name: 'Floral Chiffon Midi Dress',
        category: 'Tops & Dresses',
        price: 54.99,
        oldPrice: 79.99,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        selectedSize: 'M'
      },
      {
        id: 'p4',
        name: 'Structured Leather Shoulder Tote',
        category: 'Bags & Accessories',
        price: 68.50,
        oldPrice: 89.99,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        selectedSize: 'One Size'
      }
    ],
    subtotal: 123.49,
    discount: 24.70,
    shipping: 0,
    grandTotal: 98.79,
    status: 'In Transit'
  },
  {
    id: 'EB-62041',
    date: 'Yesterday, 11:20 AM',
    customerName: 'Michael Chang',
    email: 'm.chang@example.com',
    address: '450 West 33rd St',
    city: 'New York, NY',
    paymentMethod: 'Apple Pay',
    items: [
      {
        id: 'p2',
        name: 'Crimson Leather Low Sneakers',
        category: 'Footwear',
        price: 74.99,
        oldPrice: 99.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        selectedSize: '10'
      }
    ],
    subtotal: 74.99,
    discount: 0,
    shipping: 9.99,
    grandTotal: 84.98,
    status: 'Out for Delivery'
  }
];
