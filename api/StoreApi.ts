import ApiService from "./apiService";
import {
  Store,
  Product,
  StoreReview,
  PaginatedProductList,
  PaginatedStoreList,
  PaginatedStoreReviewList,
  PaginatedProductCategoryList,
} from "@/types/store";

class StoreApi {
  private client = ApiService.getClient();

  //  Retrieve a specific store with its published products
  public async getStoreWithProducts(id: number): Promise<Store> {
    const res = await this.client.get<Store>(`/api/store/${id}/products`);
    return res.data;
  }

  //  Favorite / Unfavorite a store
  public async toggleFavorite(storeId: number): Promise<void> {
    await this.client.post(`/api/store/${storeId}/favorite-a-store`);
  }

  //  Get all favorite stores of the current user
  public async getFavoriteStores(page?: number): Promise<PaginatedStoreList> {
    const res = await this.client.get<PaginatedStoreList>(
      "/api/store/favorite-stores",
      { params: { page } }
    );
    return res.data;
  }

  //  List reviews of a store
  public async getStoreReviews(storeId: number, page?: number): Promise<PaginatedStoreReviewList> {
    const res = await this.client.get<PaginatedStoreReviewList>(
      `/api/store/${storeId}/store-reviews`,
      { params: { page } }
    );
    return res.data;
  }

  //  Create a store review
  public async createStoreReview(data: { store_id: number; rating: number; comment: string }): Promise<StoreReview> {
    const res = await this.client.post<StoreReview>("/api/store/create-store-review", data);
    return res.data;
  }

  // Get all approved stores
  public async getAllStores(page?: number): Promise<PaginatedStoreList> {
    const res = await this.client.get<PaginatedStoreList>("/store/all", {
      params: { page },
    });
    return res.data;
  }

  //  Get all products (with filters)
  public async getAllProducts(filters?: {
    category?: string;
    discounted_product?: boolean;
    max_price?: number;
    min_price?: number;
    page?: number;
    published?: boolean;
    search?: string;
  }): Promise<PaginatedProductList> {
    const res = await this.client.get<PaginatedProductList>("/store/all-products", {
      params: filters,
    });
    return res.data;
  }

  //  Get single product by ID
  public async getProduct(id: number): Promise<Product> {
    const res = await this.client.get<Product>(`/api/store/products/${id}`);
    return res.data;
  }

  //  Get published products (with filters)
  public async getPublishedProducts(filters?: {
    category?: string;
    discounted_product?: boolean;
    max_price?: number;
    min_price?: number;
    page?: number;
    published?: boolean;
    search?: string;
  }): Promise<PaginatedProductList> {
    const res = await this.client.get<PaginatedProductList>("/api/store/products", {
      params: filters,
    });
    return res.data;
  }

  //  Product categories with counts
  public async getProductCategories(page?: number): Promise<PaginatedProductCategoryList> {
    const res = await this.client.get<PaginatedProductCategoryList>("/api/store/product-category-count", {
      params: { page },
    });
    return res.data;
  }

  //  Marketplace search (stores + products)
  public async searchMarketplace(query: string): Promise<any> {
    const res = await this.client.get("/api/store/marketplace", { params: { search: query } });
    return res.data;
  }

  //  Nearest stores (based on lat & lon)
  public async getNearestStores(lat: number, lon: number): Promise<any> {
    const res = await this.client.get("/api/store/nearest", { params: { lat, lon } });
    return res.data;
  }

  //  Popular products
  public async getPopularProducts(): Promise<Product> {
    const res = await this.client.get<Product>("/api/store/popular-products");
    return res.data;
  }
}

export default new StoreApi();
