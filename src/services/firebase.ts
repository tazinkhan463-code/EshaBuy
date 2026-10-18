import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, SiteSettings, CustomerOrder } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/defaultSettings';
import { PRODUCTS } from '../data/products';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with the database ID specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// ==========================================
// 1. PRODUCTS FIRESTORE SYNC
// ==========================================
export function subscribeProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
) {
  const path = 'products';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty on initial setup, seed default products
        seedProductsIfEmpty(PRODUCTS);
      } else {
        const loaded: Product[] = [];
        snapshot.forEach((d) => {
          loaded.push(d.data() as Product);
        });
        onUpdate(loaded);
      }
    },
    (error) => {
      console.warn('Realtime products listener error, falling back to local:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function seedProductsIfEmpty(defaultProducts: Product[]) {
  const path = 'products';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      for (const prod of defaultProducts) {
        await setDoc(doc(db, path, prod.id), prod);
      }
    }
  } catch (error) {
    console.error('Error seeding initial products to Firebase:', error);
  }
}

export async function saveProductToFirestore(product: Product) {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string) {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// 2. SITE SETTINGS & BRANDING FIRESTORE SYNC
// ==========================================
const SETTINGS_DOC_ID = 'general';

export function subscribeSiteSettings(
  onUpdate: (settings: SiteSettings) => void,
  onError?: (err: any) => void
) {
  const path = `settings/${SETTINGS_DOC_ID}`;
  return onSnapshot(
    doc(db, 'settings', SETTINGS_DOC_ID),
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as SiteSettings);
      } else {
        // Seed default site settings if not yet saved in Firebase
        saveSiteSettingsToFirestore(DEFAULT_SITE_SETTINGS);
      }
    },
    (error) => {
      console.warn('Realtime settings listener error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveSiteSettingsToFirestore(settings: SiteSettings) {
  const path = `settings/${SETTINGS_DOC_ID}`;
  try {
    await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==========================================
// 3. CUSTOMER ORDERS FIRESTORE SYNC
// ==========================================
export function subscribeOrders(
  onUpdate: (orders: CustomerOrder[]) => void,
  onError?: (err: any) => void
) {
  const path = 'orders';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const ordersList: CustomerOrder[] = [];
      snapshot.forEach((d) => {
        ordersList.push(d.data() as CustomerOrder);
      });
      // Sort newest orders first
      ordersList.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      onUpdate(ordersList);
    },
    (error) => {
      console.warn('Realtime orders listener error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveOrderToFirestore(order: CustomerOrder) {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: CustomerOrder['status']
) {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await setDoc(docRef, { ...snap.data(), status: newStatus });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
