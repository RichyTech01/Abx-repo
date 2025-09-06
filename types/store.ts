// --- Location ---
export interface GeoLocation {
  type: "Point";
  coordinates: [number, number];
}

// --- Store Address ---
export interface StoreAddress {
  id: number;
  addr: string;
  city: string;
  post_code: string;
  location: GeoLocation;
}

// --- Store reference inside Product ---
export interface StoreRef {
  id: number;
  business_name: string;
  open_time: string;
  close_time: string;
  store_code?: string;
  store_address?: StoreAddress;
}

// --- Category ---
export interface CategoryType {
  id: number;
  name: string;
  description?: string;
  img?: string;
  [key: string]: any;
}

// --- Product Variation ---
export interface ProductVariation {
  id: number;
  weight: string;
  price: string;
  display_price: string;
  discount_price: string | null;
  discount_per: string | null;
  stock: number;
  pd_image_url: string;
}

// --- Shop Product ---
export interface ShopProductType {
  id: number;
  item_name: string;
  item_description: string;
  store: StoreRef;
  category: CategoryType;
  max_price: string;
  min_price: string;
  expiration_date: string;
  prod_image_url: string;
  rescue_n_save: boolean;
  variations: ProductVariation[];
  published: boolean;
}

// --- Store with products ---
export interface StoreProductProps {
  id: number;
  business_name: string;
  open_time: string;
  close_time: string;
  products: ShopProductType[];
}

// --- Customer Feedback ---
export interface CustomerFeedback {
  store: number;
  username: string;
  rating: number;
  message: string;
}

// --- Detailed Store (StoreDetails) ---
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
  address: StoreAddress;
  distance_km: number | null;
  store_rating: number;
  payout_enabled: boolean;
  customer_feedback: CustomerFeedback[];
}

// --- Top Rated Store ---
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

// --- Paginated Top Rated Stores Response ---
export interface TopRatedStoresResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TopRatedStore[];
}


// --- User Address ---
export interface UserAddress {
  id: number;
  addr: string;
  post_code: string;
  city: string;
  location: GeoLocation | null; // because some addresses have null location
  default_addr: boolean;
}

// --- User ---
export interface AppUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: UserAddress[];
  is_verified: boolean;
  is_vendor: boolean;
}
