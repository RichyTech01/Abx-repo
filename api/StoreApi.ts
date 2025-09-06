import ApiService from "./apiService";
import {
  ShopProductType,
  TopRatedStoresResponse,
  StoreDetails,
  StoreProductProps,
} from "@/types/store";

class StoreApi {
  private client = ApiService.getClient();

  public async getStoreWithProducts(id: number): Promise<StoreProductProps> {
    const res = await this.client.get<StoreProductProps>(`/store/${id}/products`);
    return res.data;
  }

  public async getStoreById(id: number): Promise<StoreDetails> {
    const res = await this.client.get<StoreDetails>(`/store/stores/${id}`);
    return res.data;
  }

  //  Favorite / Unfavorite a store
  public async toggleFavorite(storeId: number): Promise<void> {
    await this.client.post(`/store/${storeId}/favorite-a-store`);
  }

  // Top rated
  public async getTopRatedStores(
    page?: number
  ): Promise<TopRatedStoresResponse> {
    const res = await this.client.get<TopRatedStoresResponse>(
      "/store/top-rated-stores",
      {
        params: { page },
      }
    );
    return res.data;
  }
  //  Get all favorite stores of the current user
  public async getFavoriteStores(page?: number): Promise<any> {
    const res = await this.client.get<any>("/store/favorite-stores", {
      params: { page },
    });
    return res.data;
  }

  //  List reviews of a store
  public async getStoreReviews(storeId: number, page?: number): Promise<any> {
    const res = await this.client.get<any>(`/store/${storeId}/store-reviews`, {
      params: { page },
    });
    return res.data;
  }

  //  Create a store review
  public async createStoreReview(data: {
    store_id: number;
    rating: number;
    comment: string;
  }): Promise<any> {
    const res = await this.client.post<any>("/store/create-store-review", data);
    return res.data;
  }

  // Get all approved stores
  public async getAllStores(page?: number): Promise<any> {
    const res = await this.client.get<any>("/store/all", {
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
  }): Promise<any> {
    const res = await this.client.get<any>("/store/all-products", {
      params: filters,
    });
    return res.data;
  }

  //  Get single product by ID
  public async getProduct(id: number): Promise<ShopProductType> {
    const res = await this.client.get<ShopProductType>(`/store/products/${id}`);
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
  }): Promise<any> {
    const res = await this.client.get<any>("/store/products", {
      params: filters,
    });
    return res.data;
  }

  //  Product categories with counts
  public async getProductCategories(page?: number): Promise<any> {
    const res = await this.client.get<any>("/store/product-category-count", {
      params: { page },
    });
    return res.data;
  }

  //  Marketplace search (stores + products)
  public async searchMarketplace(query: string): Promise<any> {
    const res = await this.client.get("/store/marketplace", {
      params: { search: query },
    });
    return res.data;
  }

  //  Nearest stores (based on lat & lon)
  public async getNearestStores(lat: number, lon: number): Promise<any> {
    const res = await this.client.get("/store/nearest", {
      params: { lat, lon },
    });
    return res.data;
  }

  //  Popular products
  public async getPopularProducts(): Promise<ShopProductType[]> {
    const res = await this.client.get<ShopProductType[]>("/store/popular-products");
    return res.data;
  }
}

export default new StoreApi();
