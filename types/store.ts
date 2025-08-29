import ProductDetails from "@/app/Screens/ProductDetails";

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
    store_code: string 
  };
  item_description?: string;
  expiration_date: string
  
};

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
  store_address: StoreAddress;
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



