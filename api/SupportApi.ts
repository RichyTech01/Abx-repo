import ApiService from "./apiService";

export interface ChatSession {
  id: string;
  userId: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface PatchedChatSession {
  status?: "open" | "closed";
}

class SupportApi {
  private client = ApiService.getClient();

  //  Get all sessions (paginated)

  //  Start a new chat session
  public async startChatSession() {
    const res = await this.client.post("/support/chat-session/start");
    return res.data;
  }

  public async uploadImage(imageUri: string) {
    try {
      const formData = new FormData();
      
      // Extract filename from URI
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // The field name should match what backend expects (usually 'image' or 'file')
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const res = await this.client.post('/vendor/v1/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', res.data.img_url);

      return { url: res.data.img_url };
    } catch (error: any) {
      console.error('Upload error:', error.response?.data || error.message);
      throw error;
    }
  }

 public getWebSocketUrl(sessionId: string, userId: string): string {
    return `wss://chat.afrobasketxpress.uk/ws/support/${sessionId}/${userId}/`;
  }

  // Get active chat messages in a session (paginated)
  public async getActiveChatMessages(sessionId: string, page: number = 1) {
    const res = await this.client.get(
      `/support/chat-session/${sessionId}/active`,
      { params: { page } }
    );
    return res.data;
  }
}

export default new SupportApi();
