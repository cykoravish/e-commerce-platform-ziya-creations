import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number; // percentage (e.g., 20 for 20%)
  discountType: 'percentage' | 'fixed'; // percentage or fixed amount
  badge?: string; // e.g., "HOT DEAL", "FLASH SALE"
  badgeColor?: string; // primary, secondary, success, warning, danger
  image?: string; // Image URL or base64
  expiryDate?: string; // ISO date string
  isActive: boolean;
  order: number; // For sorting
  createdAt: string;
  updatedAt: string;
}

export interface OfferInput {
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  badge?: string;
  badgeColor?: string;
  image?: string;
  expiryDate?: string;
  isActive: boolean;
}

// Get the offers data file path
const getOffersFilePath = () => {
  const dataDir = path.join(process.cwd(), 'data');
  const offersFile = path.join(dataDir, 'offers.json');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      // Directory might already exist or be created by another process
    }
  }
  
  return offersFile;
};

// Initialize with sample data if file doesn't exist
const initializeOffersFile = () => {
  const filePath = getOffersFilePath();
  
  if (!fs.existsSync(filePath)) {
    const sampleOffers: Offer[] = [
      {
        id: '1',
        title: '🔥 Summer Collection - 30% Off',
        description: 'Get ready for summer with our exclusive 30% discount on all summer wear',
        discount: 30,
        discountType: 'percentage',
        badge: 'SUMMER SALE',
        badgeColor: 'primary',
        isActive: true,
        order: 0,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: '⚡ Flash Deal - 20% Off',
        description: 'Limited time offer: Up to 20% extra discount on selected items',
        discount: 20,
        discountType: 'percentage',
        badge: 'FLASH SALE',
        badgeColor: 'danger',
        isActive: true,
        order: 1,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: '💰 Buy More, Save More',
        description: 'Save $50 on purchases over $200. Valid on selected categories',
        discount: 50,
        discountType: 'fixed',
        badge: 'HOT DEAL',
        badgeColor: 'secondary',
        isActive: true,
        order: 2,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: '🎉 Weekend Special',
        description: 'Enjoy 25% discount on all categories this weekend only!',
        discount: 25,
        discountType: 'percentage',
        badge: 'WEEKEND ONLY',
        badgeColor: 'success',
        isActive: true,
        order: 3,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(sampleOffers, null, 2));
    } catch (e) {
      console.error('Failed to initialize offers file:', e);
    }
  }
};

// Read offers from file
const readOffers = (): Offer[] => {
  try {
    initializeOffersFile();
    const filePath = getOffersFilePath();
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading offers:', e);
    return [];
  }
};

// Write offers to file
const writeOffers = (offers: Offer[]): void => {
  try {
    const filePath = getOffersFilePath();
    fs.writeFileSync(filePath, JSON.stringify(offers, null, 2));
  } catch (e) {
    console.error('Error writing offers:', e);
  }
};

export const OfferService = {
  // Get all offers
  getAllOffers: (): Offer[] => {
    return readOffers();
  },

  // Get active offers only
  getActiveOffers: (): Offer[] => {
    const offers = readOffers();
    return offers
      .filter(
        (offer) =>
          offer.isActive &&
          (!offer.expiryDate || new Date(offer.expiryDate) > new Date())
      )
      .sort((a, b) => a.order - b.order);
  },

  // Create new offer
  createOffer: (data: OfferInput): Offer => {
    const newOffer: Offer = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const offers = readOffers();
    offers.push(newOffer);
    writeOffers(offers);
    return newOffer;
  },

  // Update offer
  updateOffer: (id: string, data: Partial<OfferInput>): Offer | null => {
    const offers = readOffers();
    const index = offers.findIndex((o) => o.id === id);
    if (index === -1) return null;

    offers[index] = {
      ...offers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    writeOffers(offers);
    return offers[index];
  },

  // Delete offer
  deleteOffer: (id: string): boolean => {
    const offers = readOffers();
    const filtered = offers.filter((o) => o.id !== id);
    if (filtered.length === offers.length) return false;

    writeOffers(filtered);
    return true;
  },

  // Reorder offers
  reorderOffers: (offersWithNewOrder: Array<{ id: string; order: number }>) => {
    const offers = readOffers();
    offersWithNewOrder.forEach(({ id, order }) => {
      const offer = offers.find((o) => o.id === id);
      if (offer) offer.order = order;
    });
    writeOffers(offers);
  },
};
