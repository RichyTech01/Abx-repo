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
  };
};
  


// --- Store ---
export interface Store {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  address: string;
  is_favorited?: boolean;
  created_at: string;
  updated_at: string;
  products?: Product[];
}

// --- Store Review ---
export interface StoreReview {
  id: number;
  user: number; // could be User type
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// --- Paginated Lists ---
export interface PaginatedProductList {
  results: Product[];
  page: number;
  total_pages: number;
  total: number;
}

export interface PaginatedStoreList {
  results: Store[];
  page: number;
  total_pages: number;
  total: number;
}

export interface PaginatedStoreReviewList {
  results: StoreReview[];
  page: number;
  total_pages: number;
  total: number;
}

export interface PaginatedProductCategoryList {
  results: { category: string; count: number }[];
}
