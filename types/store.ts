// --- Product ---
export type Product = {
  id: number;
  item_name: string;
  min_price: string;
  max_price: string;
  prod_image_url: string;
  variations?: { stock: number }[];
  store: {
    open_time: string;
    close_time: string;
    business_name: string;
    store_code: string;
  };
  item_description?: string;
  expiration_date: string;
};
export interface TopRatedStore {
  id: number;
  business_name: string;
  open_time: string;
  close_time: string;
  store_img: string | null;
  is_approved: boolean;
  is_active: boolean;
  is_favorited: boolean;
  distance_km: number | null;
  store_rating: number;
}

export interface StoreDetails {
  id: number;
  business_name: string;
  store_description: string;
  store_code: string;
  open_time: string;
  close_time: string;
  store_img: string | null;
  is_approved: boolean;
  is_active: boolean;
  is_favorited: boolean;
  address: string;
  distance_km: string | null;
  store_rating: string;
  payout_enabled: boolean;
  customer_feedback: string;
}
export interface TopRatedStoresResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TopRatedStore[];
}

export interface ProductDetailsType {
  id: number;
  item_name: string;
  item_description: string;
  store: Store;
  category: Category;
  max_price: string;
  min_price: string;
  expiration_date: string;
  prod_image_url: string;
  rescue_n_save: boolean;
  variations: ProductVariation[];
  published: boolean;
}
export interface Category {
  id: number;
  name: string;
  description: string;
  img: string;
}

export interface ProductVariation {
  id: number;
  weight: string;
  price: string;
  display_price: string;
  discount_price: string | null;
  discount_per: number | null;
  stock: number;
  pd_image_url: string;
}

export interface Store {
  id: number;
  business_name: string;
  open_time: string;
  close_time: string;
  store_code: string;
  products: any;
}

// types/store.ts
export interface ShopProductType {
  id: number;
  item_name: string;
  item_description: string;
  prod_image_url: string;
  min_price: string;
  max_price: string;
  expiration_date: string;
  rescue_n_save: boolean;
  published: boolean;
  variations: {
    id: number;
    weight: string;
    price: string;
    display_price: string;
    discount_price: string | null;
    discount_per: string | null;
    stock: number;
    pd_image_url: string;
  }[];
}

export interface StoreProductProps {
  id: number;
  business_name: string;
  open_time: string;
  close_time: string;
  products: ShopProductType[]; 
}


export interface StoreAddress {
  id: number;
  addr: string;
  city: string;
  post_code: string;
  location: Location;
}

export interface Address {
  id: number;
  addr: string;
  city: string;
  post_code: string;
  default_addr: boolean;
  location: [number, number];
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_vendor: boolean;
  is_verified: boolean;
  address: Address[];
}

// Category type (expand as needed)
export interface CategoryType {
  id?: number;
  name?: string;
  [key: string]: any;
}

// Store reference type
interface StoreRef {
  id?: number;
  name?: string;
  [key: string]: any;
}

// Variation type
export interface Variation {
  id: number;
  price: string;
  stock: number;
  [key: string]: any;
}

// Product type
export interface ShopProductType {
  id: number;
  item_name: string;
  item_description: string;
  min_price: string;  
  max_price: string;
  prod_image_url: string;
  expiration_date: string;
  published: boolean;
  rescue_n_save: boolean;
  category: CategoryType;
  store: StoreRef;
  // variations: Variation[];
}

// Shop (with many products)
export interface ShopWithProducts {
  id: number;
  business_name: string;
  open_time: string;  // "HH:mm:ss"
  close_time: string; // "HH:mm:ss"
  products: ShopProductType[];
}

// Shop type
export interface Shop {
  id: number;
  business_name: string;
  open_time: string; // "HH:mm:ss"
  close_time: string; // "HH:mm:ss"
  products: Product[];
}
