export interface ImagePreset {
  label: string;
  url: string;
  category: 'logo' | 'apparel' | 'footwear' | 'outerwear' | 'bags' | 'hero';
}

export const IMAGE_PRESETS: ImagePreset[] = [
  // Logos
  {
    label: 'Modern Blue Monogram',
    category: 'logo',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'
  },
  {
    label: 'Minimalist Luxury Lettermark',
    category: 'logo',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=200&q=80'
  },
  {
    label: 'Golden Crest Emblem',
    category: 'logo',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=200&q=80'
  },
  {
    label: 'Streetwear Geometric',
    category: 'logo',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80'
  },

  // Apparel & Dresses
  {
    label: 'Floral Chiffon Midi Dress',
    category: 'apparel',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Satin Silk Evening Slip Dress',
    category: 'apparel',
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Casual Striped Knit Sweater',
    category: 'apparel',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Emerald Pleated Maxi Skirt',
    category: 'apparel',
    url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Minimalist Cotton Casual Tee',
    category: 'apparel',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
  },

  // Outerwear & Jackets
  {
    label: 'Oversized Denim Trucker Jacket',
    category: 'outerwear',
    url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Classic Neutral Trench Coat',
    category: 'outerwear',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Black Leather Biker Jacket',
    category: 'outerwear',
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Wool Blend Winter Camel Coat',
    category: 'outerwear',
    url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80'
  },

  // Footwear
  {
    label: 'Crimson Leather Low Sneakers',
    category: 'footwear',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Urban Leather Ankle Boots',
    category: 'footwear',
    url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Casual Unisex Canvas Runners',
    category: 'footwear',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'White Minimalist Platform Sneakers',
    category: 'footwear',
    url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80'
  },

  // Bags & Accessories
  {
    label: 'Structured Leather Shoulder Tote',
    category: 'bags',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Retro UV400 Cat-Eye Sunglasses',
    category: 'bags',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Minimalist Rose Gold Watch',
    category: 'bags',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Woven Straw Summer Crossbody',
    category: 'bags',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
  },

  // Hero Banners
  {
    label: 'Editorial Fashion Shoot Model',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Streetwear Sneaker Edition',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Autumn Fashion Campaign',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
  }
];
