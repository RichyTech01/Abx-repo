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
  public async getSessions(page?: number) {
    const res = await this.client.get("/api/support/admin/sessions", {
      params: { page },
    });
    return res.data;
  }

   //  Start a new chat session
  public async startChatSession() {
    const res = await this.client.post("/support/chat-session/start");
    return res.data;
  }

  //  Get a single session by ID
  public async getSessionById(sessionId: string) {
    const res = await this.client.get(`/api/support/admin/sessions/${sessionId}`);
    return res.data;
  }

  //  Close a session (PUT full update)
  public async closeSession(sessionId: string, data: ChatSession) {
    const res = await this.client.put(
      `/api/support/admin/session/${sessionId}/close`,
      data
    );
    return res.data;
  }

  //  Partially close a session (PATCH)
  public async patchCloseSession(sessionId: string, data: ChatSession) {
    const res = await this.client.patch(
      `/api/support/admin/session/${sessionId}/close`,
      data
    );
    return res.data;
  }

  // Get active chat messages in a session (paginated)
  public async getActiveChatMessages(sessionId: string, page?: number) {
    const res = await this.client.get(
      `/api/support/chat-session/${sessionId}/active`,
      { params: { page } }
    );
    return res.data;
  }

 
}

export default new SupportApi();
