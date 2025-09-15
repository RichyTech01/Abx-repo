// utils/mqttClient.ts
import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { Notification, MessageCallback } from "@/types/NotificationType";
import { MQTT_USERNAME, MQTT_PASSWORD, MQTT_BROKER } from '@env';


console.log("ka",MQTT_BROKER)

class MQTTClient {
  private client: MqttClient | null = null;
  private isConnected: boolean = false;
  private messageCallback: MessageCallback | null = null;
  private currentUserId: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor() {
    this.client = null;
    this.isConnected = false;
    this.messageCallback = null;
    this.currentUserId = null;
    this.reconnectAttempts = 0;
  }

  public connect(userId: string, onMessageCallback: MessageCallback): void {
    if (!userId) {
      console.error("❌ User ID is required for MQTT connection");
      return;
    }

    // If already connected to the same user, don't reconnect
    if (this.isConnected && this.currentUserId === userId) {
      console.log(" Already connected to MQTT for user:", userId);
      this.messageCallback = onMessageCallback; // Update callback
      return;
    }

    // Disconnect existing connection if connecting to different user
    if (this.client && this.currentUserId !== userId) {
      this.disconnect();
    }

    this.currentUserId = userId;
    const brokerUrl = MQTT_BROKER;
    const options: IClientOptions = {
      username:MQTT_USERNAME, 
      password: MQTT_PASSWORD,  
      clean: true,
      connectTimeout: 30000,
      reconnectPeriod: 5000, 
      keepalive: 60,
      clientId: `mobile_${userId}_${Date.now()}`, 
    };

    try {
      console.log("🔌 Connecting to MQTT broker...", brokerUrl);
      this.client = mqtt.connect(brokerUrl, options);
      this.messageCallback = onMessageCallback;

      this.client.on("connect", () => {
        console.log("✅ MQTT Connected successfully");
        this.isConnected = true;
        this.reconnectAttempts = 0; 

        const topic = `notifications/user/${userId}`;
        this.client?.subscribe(topic, { qos: 1 }, (err) => {
          if (err) {
            console.error("❌ MQTT Subscription error:", err);
          } else {
            console.log(`📡 Successfully subscribed to topic: ${topic}`);
          }
        });
      });

      this.client.on("message", (topic: string, message: Buffer) => {
        try {
          const notificationData = message.toString();
          console.log("📨 Raw message received:", notificationData);
          
          const notification: Notification = JSON.parse(notificationData);
          console.log("📬 Parsed notification:", notification);
          
          // Call the callback with the new notification
          this.messageCallback?.(notification);
        } catch (error) {
          console.error("❌ Error parsing notification:", error);
          console.error("❌ Raw message was:", message.toString());
        }
      });

      this.client.on("error", (error: Error) => {
        console.error("❌ MQTT Error:", error);
        this.isConnected = false;
      });

      this.client.on("close", () => {
        console.log("🔌 MQTT Connection closed");
        this.isConnected = false;
      });

      this.client.on("offline", () => {
        console.log("📴 MQTT Client offline");
        this.isConnected = false;
      });

      this.client.on("reconnect", () => {
        this.reconnectAttempts++;
        console.log(`🔄 MQTT Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log("❌ Max reconnection attempts reached. Stopping reconnection.");
          this.client?.end(true);
        }
      });

    } catch (error) {
      console.error("❌ MQTT Connection failed:", error);
      this.isConnected = false;
    }
  }

  public disconnect(): void {
    if (this.client) {
      console.log("🔌 Disconnecting MQTT client...");
      this.client.end(true); // Force close
      this.isConnected = false;
      this.messageCallback = null;
      this.currentUserId = null;
      this.reconnectAttempts = 0;
      console.log("✅ MQTT Disconnected");
    }
  }

  public isClientConnected(): boolean {
    return this.isConnected && this.client?.connected === true;
  }

  public getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  // Method to manually reconnect
  public reconnect(): void {
    if (this.currentUserId && this.messageCallback) {
      console.log("🔄 Manual reconnect requested");
      this.disconnect();
      setTimeout(() => {
        this.connect(this.currentUserId!, this.messageCallback!);
      }, 1000);
    }
  }
}

// Export singleton instance
export default new MQTTClient();