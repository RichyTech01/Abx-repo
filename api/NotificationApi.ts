import ApiService from "./apiService";

class NotificationApi {
  private client = ApiService.getClient();

  // Get paginated notifications
  public async getNotifications(page?: number) {
    const res = await this.client.get("/api/notifications/", {
      params: { page },
    });
    return res.data;
  }

  // Get a single notification by ID
  public async getNotification(id: number) {
    const res = await this.client.get(`/api/notifications/${id}`);
    return res.data;
  }

  // Mark a notification as read (PUT)
  public async markAsRead(id: number) {
    const res = await this.client.put(`/api/notifications/${id}/mark-read/`);
    return res.data;
  }

  // Mark a notification as read (PATCH - partial update)
  public async markAsReadPartial(id: number, data: any) {
    const res = await this.client.patch(
      `/api/notifications/${id}/mark-read/`,
      data
    );
    return res.data;
  }
}

export default new NotificationApi();
