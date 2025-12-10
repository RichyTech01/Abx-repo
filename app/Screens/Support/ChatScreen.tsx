import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SupportApi from "@/api/SupportApi";
import ChatSendIcon from "@/assets/svgs/ChatSendIcon.svg";
import PickImageIcon from "@/assets/svgs/PickImageIcon.svg";
import SupportImg from "@/assets/svgs/SupportImg.svg";
import OreAppText from "@/common/OreApptext";
import ScreenWrapper from "@/common/ScreenWrapper";
import UrbanistText from "@/common/UrbanistText";
import ChatHeader from "@/components/Support/ChatHeader";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useUserStore } from "@/store/useUserStore";
import showToast from "@/utils/showToast";
import Storage from "@/utils/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { LoadingSpinner } from "@/common/LoadingSpinner";

interface Message {
  id: string;
  text?: string;
  image?: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: Array<string | { file_url: string; id: number }>;
}

export default function ChatScreen() {
  const { user } = useUserStore();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedSession = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const setSessionIdd = await Storage.get("ChatSessionId");

        if (!cancelled && !hasLoadedSession.current && setSessionIdd) {
          hasLoadedSession.current = true;
          await loadChatSession();
        }
      } catch (err) {
        console.error("Failed to init chat session:", err);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const {
    messages,
    setMessages,
    isConnected,
    isAgentTyping,
    isReconnecting,
    sendMessage: wsSendMessage,
    sendTypingIndicator,
    disconnect,
  } = useChatWebSocket({
    sessionId: sessionId || "",
    userId: user?.id?.toString() || "",
    onSessionClosed: handleSessionClosed,
  });

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const loadChatSession = async () => {
    try {
      const storedSessionId = await AsyncStorage.getItem("ChatSessionId");

      if (!storedSessionId) {
        showToast("error", "No active session found");
        router.back();
        return;
      }

      setSessionId(storedSessionId);

      // Load chat history
      const history = await SupportApi.getActiveChatMessages(storedSessionId);

      // Handle paginated response
      const messagesArray = history?.results || history?.messages || [];

      if (Array.isArray(messagesArray) && messagesArray.length > 0) {
        const formattedMessages = messagesArray.map((msg: any) => ({
          id: msg.id?.toString() || Date.now().toString(),
          text: msg.message,
          isUser: msg.sender_id === user?.id?.toString(),
          timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
          // Normalize attachments to string[]
          attachments:
            msg.attachments && msg.attachments.length > 0
              ? msg.attachments.map((att: any) =>
                  typeof att === "string" ? att : att.file_url
                )
              : undefined,
        }));

        // Sort by timestamp (oldest first) since API returns newest first
        formattedMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );

        setMessages(formattedMessages);
      }
    } catch (error: any) {
      console.error("Error loading chat session:", error);
      showToast("error", "Failed to load chat history");
    } finally {
      if (isMounted.current) {
        setIsLoadingHistory(false);
      }
    }
  };

  function handleSessionClosed() {
    // Clear session data
    AsyncStorage.removeItem("ChatSessionId");
    setMessages([]);
    disconnect();

    // Navigate back to support screen
    setTimeout(() => {
      router.back();
    }, 2000);
  }

  const checkSessionActive = async (): Promise<boolean> => {
    try {
      if (!sessionId) return false;

      await SupportApi.getActiveChatMessages(sessionId);
      return true;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "";

      if (
        errorMessage.includes("Active chat session not found") ||
        errorMessage.includes("have ended")
      ) {
        showToast("error", "Session has ended. Please create a new session.");
        handleSessionClosed();
        return false;
      }

      // For other errors, allow the message to be sent (could be network issues)
      return true;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !isConnected) {
      if (!isConnected) {
        showToast("error", "Not connected to chat");
      }
      return;
    }

    // Check if session is still active before sending
    const isActive = await checkSessionActive();
    if (!isActive) {
      return;
    }

    const messageText = inputText.trim();
    setInputText(""); // Clear input immediately

    const success = wsSendMessage(messageText);

    if (success) {
      // Stop typing indicator
      sendTypingIndicator(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Force scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleTextChange = (text: string) => {
    setInputText(text);

    // Send typing indicator
    if (isConnected && text.trim()) {
      sendTypingIndicator(true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(false);
      }, 2000);
    } else if (isConnected) {
      sendTypingIndicator(false);
    }
  };

  const uploadImageToS3 = async (imageUri: string): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      console.log("Uploading image:", imageUri);

      const response = await SupportApi.uploadImage(imageUri);
      console.log("Image uploaded successfully, URL:", response?.url);

      if (response?.url) {
        return response.url;
      }

      throw new Error("No URL returned from upload");
    } catch (error: any) {
      // console.error("Error uploading image:", error);
      // console.error("Error details:", error.response?.data);
      showToast("error", "Failed to upload image");
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageSend = async (imageUri: string, caption?: string) => {
    if (!isConnected) {
      showToast("error", "Not connected to chat");
      return;
    }

    // Check if session is still active before sending
    const isActive = await checkSessionActive();
    if (!isActive) {
      return;
    }

    // Upload image first
    const imageUrl = await uploadImageToS3(imageUri);

    if (!imageUrl) {
      return;
    }

    // Send message with attachment
    const success = wsSendMessage(caption || "", [imageUrl]);

    if (!success) {
      showToast("error", "Failed to send image");
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setShowImagePicker(false);
      await handleImageSend(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setShowImagePicker(false);
      await handleImageSend(result.assets[0].uri);
    }
  };

  const toggleImagePicker = () => {
    setShowImagePicker(!showImagePicker);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getAttachmentUrl = (attachments: any[] | undefined): string | null => {
    if (!attachments || attachments.length === 0) return null;

    const first = attachments[0];
    let url = first?.file_url || (typeof first === "string" ? first : null);

    if (!url) return null;

    // If it's a stringified object, parse it safely
    if (
      typeof url === "string" &&
      url.includes("{") &&
      url.includes("file_url")
    ) {
      try {
        const parsed = JSON.parse(url.replace(/'/g, '"')); // fix single quotes
        url = parsed.file_url;
      } catch (e) {
        console.warn("Failed to parse attachment url:", url);
      }
    }

    return url;
  };

  const renderMessage = (message: Message) => {
    if (!message) return null;

    const attachmentUrl = getAttachmentUrl(message.attachments);

    // Safe text
    const msgText = typeof message.text === "string" ? message.text : "";

    // Safe timestamp
    const timeLabel = message.timestamp
      ? formatTime(message.timestamp).toLocaleLowerCase()
      : "";

    // Safe id
    const key = message.id || Math.random().toString();

    if (message.isUser) {
      return (
        <View key={key} className="mb-4">
          <View className="flex-row justify-end items-end">
            <View
              className={`bg-[#0C513F] mr-2 ${
                attachmentUrl
                  ? "w-[70%] p-[3px] rounded-[8px] rounded-br-none"
                  : "max-w-[90%] px-4 py-2 rounded-[16px] rounded-br-[8px]"
              }`}
            >
              {attachmentUrl && (
                <View className="relative mb-1">
                  <Image
                    source={{ uri: attachmentUrl }}
                    className="h-[200px] w-full rounded-[12px]"
                    resizeMode="cover"
                  />
                </View>
              )}

              {msgText ? (
                <Text className="text-white text-[14px] leading-[20px] font-urbanist mb-1 px-2">
                  {msgText}
                </Text>
              ) : null}

              <Text
                className={`${
                  attachmentUrl
                    ? "absolute bottom-2 right-2 px-2 py-1 rounded"
                    : "px-2"
                } text-white text-[12px] leading-[16px] font-urbanist-medium self-end`}
              >
                {timeLabel}
              </Text>
            </View>

            <View className="bg-[#AEC5BF] w-[30px] h-[30px] rounded-full items-center justify-center mb-1">
              <Text className="text-[#2D2220] text-[10px] font-urbanist-medium">
                {user?.first_name?.[0]?.toUpperCase() ?? "U"}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Agent message
    return (
      <View key={key} className="mb-4">
        <View className="flex-row items-end">
          <View className="w-[30px] h-[30px] rounded-full mr-2 mb-1 items-center justify-center">
            <Image
              source={require("../../../assets/Images/abx-icon.png")}
              style={{ width: 30, height: 30, resizeMode: "contain" }}
              alt="Support-img"
              className="rounded-full "
            />
          </View>

          {/* Bubble with border & overflow-hidden */}
          <View
            className={` border-[#0C513F] rounded-[20px] rounded-bl-none overflow-hidden z-50 ${
              attachmentUrl ? "w-[70%]" : "px-4 py-2 border"
            }`}
          >
            {attachmentUrl && (
              <Image
                source={{ uri: attachmentUrl }}
                className="h-[200px] w-full overflow-hidden -z-0"
                resizeMode="cover"
              />
            )}

            {msgText ? (
              <Text className="text-[#2D2220] text-[14px] leading-[22px] font-urbanist mb-1 px-2">
                {msgText}
              </Text>
            ) : null}

            <Text
              className={`${
                attachmentUrl ? "absolute bottom-2 right-2 px-2 py-1 " : "pr-2"
              } text-[#2D2220] bg-white/50 rounded text-[14px] leading-[20px] font-urbanist self-end`}
            >
              {timeLabel}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  useEffect(() => {
    if (isAgentTyping) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isAgentTyping]);

  if (isLoadingHistory) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner />
          <Text className="mt-4 text-[#2D2220]">Loading chat...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View>
          <OreAppText className="mx-auto text-[20px] leading-[28px] text-[#2D2220] font-semibold ">
            Customer support
          </OreAppText>
          <ChatHeader />
        </View>

        {/* Connection Status */}
        {!isConnected && (
          <View className="bg-[#FFF3CD] px-4 py-2">
            <Text className="text-[#856404] text-center text-[12px]">
              {isReconnecting ? "Reconnecting..." : "Disconnected"}
            </Text>
          </View>
        )}

        <View className="flex-1 bg-white">
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 "
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center py-4">
              <UrbanistText className="text-[#000000] text-[16px]">
                Today
              </UrbanistText>
            </View>

            {messages.length === 0 && !isAgentTyping && (
              <View className="items-center justify-center py-8 px-5">
                <View className="mb-4">
                  <Image
                    source={require("../../../assets/Images/abx-icon.png")}
                    style={{ width: 80, height: 80, resizeMode: "contain" }}
                    alt="Support-img"
                    className="rounded-[16px] "
                  />
                </View>
                <OreAppText className="text-[#2D2220] text-[18px]  font-semibold mb-2 text-center">
                  Welcome to ABX Support
                </OreAppText>
                <UrbanistText className="text-[#929292] text-[14px] text-center leading-[20px]">
                  How can we help you today? Send us a message and we'll get
                  back to you shortly.
                </UrbanistText>
              </View>
            )}

            {messages.map(renderMessage)}

            {isAgentTyping && (
              <View className="mb-4">
                <View className="flex-row items-center justify-center">
                  <View className="w-[30px] h-[30px] rounded-full mr-2 items-center justify-center">
                    <SupportImg />
                  </View>
                  <View>
                    <Text className="text-[#2D2220] text-[16px] font-Urbanist-Light">
                      Typing...
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Image Picker */}
          {showImagePicker && (
            <View className="bg-white border-t border-x border-[#F1EAE7] items-center pt-[16px] pb-[5%] rounded-t-[16px]">
              <View className="flex-row overflow-hidden w-[60%] max-w-[250px]">
                <TouchableOpacity
                  className="flex-1 items-center border-b border-[#1B5E20] py-[8px] px-[10px]"
                  onPress={pickImageFromGallery}
                  disabled={isUploadingImage}
                >
                  <UrbanistText className="text-[#1B5E20] text-[16px] leading-[22px]">
                    Gallery
                  </UrbanistText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takePhoto}
                  className="flex-1 items-center py-3"
                  disabled={isUploadingImage}
                >
                  <Text className="text-[#929292]">Take a picture</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Input Area */}
          <View className="px-4 pt-2 bg-[#FAF8F7] mb-1">
            <View className="bg-transparent rounded-[8px] border border-[#0C513F] flex-row items-center px-[31px] py-[16px]">
              <TextInput
                value={inputText}
                onChangeText={handleTextChange}
                placeholder="Send a message"
                placeholderTextColor="#929292"
                className="flex-1 text-[16px] py-2 font-urbanist"
                multiline
                maxLength={500}
                returnKeyType="done"
                editable={isConnected && !isUploadingImage}
              />
              <TouchableOpacity
                onPress={toggleImagePicker}
                className="ml-2 p-2"
                disabled={!isConnected || isUploadingImage}
              >
                <PickImageIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSendMessage}
                className="ml-4 w-[19px] h-[19px] items-center justify-center"
                disabled={!inputText.trim() || !isConnected || isUploadingImage}
              >
                <ChatSendIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
