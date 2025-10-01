import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "@/common/ScreenWrapper";
import OreAppText from "@/common/OreApptext";
import ChatHeader from "@/components/Support/ChatHeader";
import SupportImg from "@/assets/svgs/SupportImg.svg";
import UrbanistText from "@/common/UrbanistText";
import ChatSendIcon from "@/assets/svgs/ChatSendIcon.svg";
import PickImageIcon from "@/assets/svgs/PickImageIcon.svg";
import { useUserStore } from "@/store/useUserStore";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import SupportApi from "@/api/SupportApi";
import showToast from "@/utils/showToast";
import { useRouter } from "expo-router";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { formatMessageDate } from "@/utils/groupchatByDate";

interface Message {
  id: string;
  text?: string;
  image?: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: (string | { file_url?: string; url?: string })[];
}

export default function ChatScreen() {
  const { user } = useUserStore();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [InitImage, setInitImage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedSession = useRef(false);
  const isMounted = useRef(true);

  // Load session ID and chat history on mount FIRST
  useEffect(() => {
    isMounted.current = true;

    if (!hasLoadedSession.current) {
      hasLoadedSession.current = true;
      loadChatSession();
    }

    return () => {
      isMounted.current = false;
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

  // Auto-scroll when new messages arrive
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
      console.log("Chat history loaded:", history);

      // Handle paginated response
      const messagesArray = history?.results || history?.messages || [];

      if (Array.isArray(messagesArray) && messagesArray.length > 0) {
        const formattedMessages = messagesArray.map((msg: any) => ({
          id: msg.id?.toString() || Date.now().toString(),
          text: msg.message,
          isUser: msg.sender_id === user?.id?.toString(),
          timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
          // Convert all attachments to string URLs
          attachments:
            msg.attachments && msg.attachments.length > 0
              ? msg.attachments.map((att: any) =>
                  typeof att === "string"
                    ? att
                    : att?.file_url || att?.url || ""
                )
              : [],
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

  const handleSendMessage = () => {
    if (!inputText.trim() || !isConnected) {
      if (!isConnected) {
        showToast("error", "Not connected to chat");
      }
      return;
    }

    const messageText = inputText.trim();
    setInputText(""); // Clear input immediately

    // Create local message
    const newMessage: Message = {
      id: Date.now().toString(), // temporary ID
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      attachments: [],
    };

    // Optimistically add to UI (normalize attachments to string[])
    setMessages((prev) => [
      ...prev,
      {
        ...newMessage,
        attachments: (newMessage.attachments || []).map((att) =>
          typeof att === "string" ? att : att?.file_url || att?.url || ""
        ),
      },
    ]);

    // Actually send via WebSocket
    const success = wsSendMessage(messageText);

    if (success) {
      sendTypingIndicator(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

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
      console.error("Error uploading image:", error);
      console.error("Error details:", error.response?.data);
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

    const imageUrl = await uploadImageToS3(imageUri);
    if (!imageUrl) return;

    // Optimistic update
    const newMessage: Message = {
      id: Date.now().toString(),
      text: caption,
      isUser: true,
      timestamp: new Date(),
      attachments: [imageUrl],
    };

    setMessages((prev) => [
      ...prev,
      {
        ...newMessage,
        attachments: (newMessage.attachments || []).map((att) =>
          typeof att === "string" ? att : att?.file_url || att?.url || ""
        ),
      },
    ]);

    const success = wsSendMessage(caption || "", [imageUrl]);
    if (!success) {
      showToast("error", "Failed to send image");
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need gallery permissions to show your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setShowImagePicker(false);
      await handleImageSend(result.assets[0].uri);
      setInitImage(result.assets[0].uri);
    }
  };

  console.log("3e", InitImage);
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera permissions to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
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

  const renderMessage = (message: Message) => {
    // Extract attachment URL - handle both string and object formats
    let attachmentUrl = null;
    if (message.attachments && message.attachments.length > 0) {
      const firstAttachment = message.attachments[0];
      // Check if it's an object with file_url or a direct string
      attachmentUrl =
        typeof firstAttachment === "string"
          ? firstAttachment
          : firstAttachment?.file_url;
    }

    if (message.isUser) {
      return (
        <View key={message.id} className="mb-4">
          <View className="flex-row justify-end items-end">
            <View
              className={`bg-[#0C513F] mr-2 ${
                attachmentUrl
                  ? "w-[70%] p-[3px] rounded-[8px] rounded-br-none"
                  : "max-w-[90%] px-4 py-2 rounded-[16px] rounded-br-[8px]"
              }`}
            >
              {attachmentUrl ? (
                <View className="relative mb-1">
                  <Image
                    source={{ uri: attachmentUrl || InitImage }}
                    className="h-[200px] w-full rounded-[12px]"
                    resizeMode="cover"
                  />
                </View>
              ) : null}
              {message.text ? (
                <Text className="text-white text-[14px] leading-[20px] font-urbanist mb-1 px-2">
                  {message.text}
                </Text>
              ) : null}
              <Text
                className={`${
                  attachmentUrl
                    ? "absolute bottom-2 right-2 px-2 py-1 rounded"
                    : "px-2"
                } text-white text-[12px] leading-[16px] font-urbanist-medium self-end`}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
            <View className="bg-[#AEC5BF] w-[30px] h-[30px] rounded-full items-center justify-center mb-1">
              <Text className="text-[#2D2220] text-[10px] font-urbanist-medium">
                {user?.first_name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View key={message.id} className="mb-4">
          <View className="flex-row items-end">
            <View className="w-[30px] h-[30px] rounded-full mr-2 mb-1 items-center justify-center">
              <SupportImg />
            </View>
            <View className="max-w-[90%] rounded-[20px] rounded-bl-none px-4 py-2 border border-[#0C513F]">
              {attachmentUrl ? (
                <Image
                  source={{ uri: attachmentUrl }}
                  className="h-[200px] w-full rounded-[12px] mb-2"
                  resizeMode="cover"
                />
              ) : null}
              {message.text ? (
                <Text className="text-[#2D2220] text-[14px] leading-[22px] font-urbanist mb-1">
                  {message.text}
                </Text>
              ) : null}
              <Text className="text-[#2D2220] text-[12px] font-urbanist self-end">
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {/* Header */}
        <View>
          <OreAppText className="mx-auto text-[20px] leading-[28px] text-[#2D2220] font-semibold">
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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          className="flex-1 bg-white"
        >
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
          >
            {isLoadingHistory ? (
              <LoadingSpinner />
            ) : (
              <View>
                {messages.map((msg, index) => {
                  const prevMsg = messages[index - 1];
                  const showDate =
                    !prevMsg ||
                    new Date(prevMsg.timestamp).toDateString() !==
                      new Date(msg.timestamp).toDateString();

                  return (
                    <View key={msg.id}>
                      {showDate && (
                        <View className="items-center py-4">
                          <UrbanistText className="text-[#000000] text-[16px]">
                            {formatMessageDate(msg.timestamp)}
                          </UrbanistText>
                        </View>
                      )}
                      {renderMessage(msg)}
                    </View>
                  );
                })}
              </View>
            )}
            {/* Typing Indicator */}
            {isAgentTyping && (
              <View className="mb-4">
                <View className="flex-row items-end">
                  <View className="w-[30px] h-[30px] rounded-full mr-2 mb-1 items-center justify-center">
                    <SupportImg />
                  </View>
                  <View className="bg-[rgb(245,245,245)] rounded-[20px] rounded-bl-none px-4 py-3">
                    <Text className="text-[#666] text-[14px] italic">
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
          <View className="px-4 pb-2 pt-2 bg-[#FAF8F7]">
            <View className="bg-transparent rounded-[8px] border border-[#0C513F] flex-row items-center px-[31px] py-[16px]">
              <TextInput
                value={inputText}
                onChangeText={handleTextChange}
                placeholder="Send a message"
                placeholderTextColor="#929292"
                className="flex-1 text-[16px] py-2 font-urbanist"
                multiline
                maxLength={100}
                numberOfLines={4}
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
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
}
