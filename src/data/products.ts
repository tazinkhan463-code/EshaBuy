import { Product, FlashDeal } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Floral Chiffon Midi Dress',
    category: 'Tops & Dresses',
    price: 54.99,
    oldPrice: 79.99,
    badge: 'NEW',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    description: 'Lightweight floral chiffon dress featuring tiered skirt layers and gentle elastic cuffs. Perfect for weekend brunches and summer garden soirees.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'p2',
    name: 'Crimson Leather Low Sneakers',
    category: 'Footwear',
    price: 74.99,
    oldPrice: 99.99,
    badge: 'HOT',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant red low-top streetwear sneakers with cushioned rubber soles and white accents. Built for all-day comfort and bold urban aesthetics.',
    sizes: ['7', '8', '9', '10', '11']
  },
  {
    id: 'p3',
    name: 'Oversized Denim Trucker Jacket',
    category: 'Outerwear',
    price: 84.99,
    oldPrice: 110.00,
    badge: 'SALE',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
    description: 'Classic vintage wash cotton denim jacket with dual chest flap pockets and relaxed fit. Versatile layer for casual styling across seasons.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'p4',
    name: 'Structured Leather Shoulder Tote',
    category: 'Bags & Accessories',
    price: 68.50,
    oldPrice: 89.99,
    badge: 'BEST',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    description: 'Minimalist yellow leather structured handbag with dual handle straps and magnetic clasp. Roomy interior compartment with phone pocket.',
    sizes: ['One Size']
  },
  {
    id: 'p5',
    name: 'Retro UV400 Cat-Eye Sunglasses',
    category: 'Bags & Accessories',
    price: 24.99,
    oldPrice: 39.99,
    badge: 'NEW',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    description: 'Tinted blue retro acetate cat-eye sunglasses providing 100% UV protection. High-grade polished hinges and lightweight ear stems.',
    sizes: ['One Size']
  },
  {
    id: 'p6',
    name: 'Classic Neutral Trench Coat',
    category: 'Outerwear',
    price: 119.99,
    oldPrice: 159.99,
    badge: 'TRENDING',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    description: 'Double-breasted timeless beige trench coat tailored with storm flaps and waist belt. Water-resistant cotton twill fabric.',
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'p7',
    name: 'Satin Silk Evening Slip Dress',
    category: 'Tops & Dresses',
    price: 62.00,
    oldPrice: 85.00,
    badge: 'NEW',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    description: 'Elegant cowl-neck satin slip dress in golden amber tone with adjustable spaghetti straps. Fluid silhouette that glides with effortless elegance.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p8',
    name: 'Minimalist Minimal Gold Watch',
    category: 'Bags & Accessories',
    price: 89.99,
    oldPrice: 120.00,
    badge: 'LIMITED',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    description: 'Sleek rose gold mesh strap minimalist analog watch with Japanese quartz movement. Water-resistant case with scratch-proof mineral crystal.',
    sizes: ['One Size']
  },
  {
    id: 'p9',
    name: 'Casual Striped Knit Sweater',
    category: 'Tops & Dresses',
    price: 42.50,
    oldPrice: 59.99,
    badge: 'SALE',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    description: 'Soft cotton knit striped crewneck sweater designed for comfortable layerings. Breathable loose weave with rib-knit collar and cuffs.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'p10',
    name: 'Urban Leather Ankle Boots',
    category: 'Footwear',
    price: 98.00,
    oldPrice: 135.00,
    badge: 'HOT',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80',
    description: 'Genuine dark leather lace-up ankle boots equipped with durable rubber lug soles and speed-lacing eyelets.',
    sizes: ['7', '8', '9', '10']
  },
  {
    id: 'p11',
    name: 'Woven Straw Summer Crossbody',
    category: 'Bags & Accessories',
    price: 36.99,
    oldPrice: 48.00,
    badge: 'NEW',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    description: 'Handcrafted natural woven straw round crossbody bag with leather trim strap and secure linen drawstring closure.',
    sizes: ['One Size']
  },
  {
    id: 'p12',
    name: 'Casual Unisex Canvas Runners',
    category: 'Footwear',
    price: 49.99,
    oldPrice: 65.00,
    badge: 'BEST',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
    description: 'Versatile black & white canvas lace-up sneakers designed for daily walking comfort with memory foam insoles.',
    sizes: ['6', '7', '8', '9', '10', '11']
  }
];

export const FLASH_DEALS: FlashDeal[] = [
  {
    id: 'deal-1',
    name: 'Limited Patchwork Tote',
    price: 89.99,
    oldPrice: 149.99,
    leftCount: 4,
    stockRatio: 'w-4/5',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'deal-2',
    name: 'Rose Gold Classic Watch',
    price: 64.99,
    oldPrice: 119.99,
    leftCount: 2,
    stockRatio: 'w-11/12',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80'
  }
];
