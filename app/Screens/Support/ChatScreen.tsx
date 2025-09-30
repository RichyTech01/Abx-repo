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
import React, { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import ScreenWrapper from "@/common/ScreenWrapper";
import OreAppText from "@/common/OreApptext";
import ChatHeader from "@/components/Support/ChatHeader";
import SupportImg from "@/assets/svgs/SupportImg.svg";
import UrbanistText from "@/common/UrbanistText";
import ChatSendIcon from "@/assets/svgs/ChatSendIcon.svg";
import PickImageIcon from "@/assets/svgs/PickImageIcon.svg";
import { useUserStore } from "@/store/useUserStore";



interface Message {
  id: string;
  text?: string;
  image?: string;
  isUser: boolean;
  timestamp: Date;
}

interface GalleryImage {
  id: string;
  uri: string;
}

export default function ChatScreen() {
  const { user } = useUserStore();
 console.log("userid",user?.id)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there. I am a new customer on ABX and I do not know how to carry out a transaction properly",
      isUser: true,
      timestamp: new Date("2024-01-01T08:20:00"),
    },
    {
      id: "2",
      text: "Hi there! I'm Henry Osas from the support team. I saw your message about ABX and I'm here to help. Could you let me know what part you'd like some clarity on? Happy to explain!",
      isUser: false,
      timestamp: new Date("2024-01-01T08:23:00"),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Open gallery
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
      const newMessage: Message = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

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
      const newMessage: Message = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setShowImagePicker(false);
    }
  };

  const toggleImagePicker = async () => {
    if (!showImagePicker) {
      // await loadGalleryImages();
    }
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
    if (message.isUser) {
      return (
        <View key={message.id} className="mb-4">
          <View className="flex-row justify-end items-end">
            <View
              className={`  bg-[#0C513F] rounded-br-[8px] mr-2 ${
                message.image
                  ? "w-[70%] p-[3px] rounded-[8px] rounded-br-none  "
                  : " max-w-[90%] px-4 py-2 rounded-[16px] "
              } `}
            >
              {message.text && (
                <Text className="text-white text-[14px] leading-[20px] font-urbanist mb-1">
                  {message.text}
                </Text>
              )}
              {message.image && (
                <View className="relative ">
                  <Image
                    source={{ uri: message.image }}
                    className=" h-[200px] rounded-[12px] mb-1"
                    resizeMode="cover"
                  />
                </View>
              )}
              <Text
                className={` ${
                  message.image ? "absolute bottom-0 mb-3 mr-3" : ""
                } text-white text-[14px] leading-[20px] font-urbanist-medium self-end mt-[8px]`}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
            <View className="bg-[#AEC5BF] w-[30px] h-[30px] rounded-full items-center justify-center mb-1">
              <Text className="text-[#2D2220] text-[10px] font-urbanist-medium  ">
                {user?.first_name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      // Support Bubbles

      return (
        <View key={message.id} className="mb-4">
          <View className="flex-row items-end">
            <View className="w-[30px] h-[30px] rounded-full mr-2 mb-1 items-center justify-center">
              <SupportImg />
            </View>
            <View className=" max-w-[90%] rounded-[20px] rounded-bl-none px-4 py-2 border border-[#0C513F]">
              <Text className="text-[#2D2220] text-[14px] leading-[22px] font-urbanist mb-1">
                {message.text}
              </Text>
              <Text className="text-[#2D2220] text-[14px] font-urbanist self-end mt-[8px] ">
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
      <View className="flex-1  ">
        {/* Header */}
        <View>
          <OreAppText className="mx-auto text-[20px] leading-[28px] text-[#2D2220] font-semibold">
            Customer support
          </OreAppText>
          <ChatHeader />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          className="flex-1 bg-white"
        >
          {/* Messages with Today header */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Today Header - scrolls with content */}
            <View className="items-center py-4">
              <UrbanistText className="text-[#000000] text-[16px]   ">
                Today
              </UrbanistText>
            </View>

            {messages.map(renderMessage)}

            {/* Typing Indicator - centered */}
            {isTyping && (
              <View className="mb-4 items-center">
                <View className="flex-row items-center">
                  <View className="w-[30px] h-[30px] rounded-full  mr-2 items-center justify-center">
                    <SupportImg />
                  </View>
                  <Text className="text-[#666] text-[14px] italic">Typing</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Image Gallery - above input */}
          {showImagePicker && (
            <View className="bg-white border-t border-x border-[#F1EAE7] items-center pt-[16px] pb-[5%]  rounded-t-[16px]  ">
              <View className="flex-row b overflow-hidden w-[60% max-w-[250px]">
                <TouchableOpacity
                  className="flex-1 items-center border-b border-[#1B5E20] py-[8px] px-[10px] "
                  onPress={pickImageFromGallery}
                >
                  <UrbanistText className="text-[#1B5E20] text-[16px] leading-[22px]">
                    Gallery
                  </UrbanistText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takePhoto}
                  className="flex-1 items-center py-3"
                >
                  <Text className="text-[#929292]">Take a picture</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Input Area */}
          <View className="px-4 pb- pt-2 bg-[#FAF8F7]">
            <View className="bg-transparent rounded-[8px] border border-[#0C513F] flex-row items-center px-[31px] py-[16px] ">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Send a message"
                placeholderTextColor="#929292"
                className="flex-1 text-[16px] py-2 font-urbanist"
                multiline
                maxLength={500}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={toggleImagePicker}
                className="ml-2 p-2"
              >
                <PickImageIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={sendMessage}
                className="ml-4  w-[19px] h-[19px]  items-center justify-center"
                disabled={!inputText.trim()}
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
