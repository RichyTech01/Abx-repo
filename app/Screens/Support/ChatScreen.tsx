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
  SafeAreaView
} from 'react-native';
import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ScreenWrapper from '@/common/ScreenWrapper';
import OreAppText from '@/common/OreApptext';
import ChatHeader from '@/components/Support/ChatHeader';

interface Message {
  id: string;
  text?: string;
  image?: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there. I am a new customer on ABX and I do not know how to carry out a transaction properly",
      isUser: true,
      timestamp: new Date('2024-01-01T08:20:00')
    },
    {
      id: '2',
      text: "Hi there! I'm Henry Osas from the support team. I saw your message about ABX and I'm here to help. Could you let me know what part you'd like some clarity on? Happy to explain!",
      isUser: false,
      timestamp: new Date('2024-01-01T08:23:00')
    },
    {
      id: '3',
      text: "Hi there! I'm Henry Osas from the support team. I saw your message about ABX and I'm here to help. Could you let me know what part you'd like some clarity on? Happy to explain!",
      isUser: false,
      timestamp: new Date('2024-01-01T08:23:00')
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: Message = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setShowImagePicker(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera permissions to take photos.');
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
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setShowImagePicker(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = (message: Message) => {
    if (message.isUser) {
      return (
        <View key={message.id} className="mb-4">
          <View className="flex-row justify-end">
            <View className="bg-[#1B5E20] max-w-[280px] rounded-[20px] px-4 py-3">
              {message.text && (
                <Text className="text-white text-[16px] leading-[22px]">
                  {message.text}
                </Text>
              )}
              {message.image && (
                <Image 
                  source={{ uri: message.image }} 
                  className="w-[200px] h-[200px] rounded-[12px]"
                  resizeMode="cover"
                />
              )}
            </View>
          </View>
          <View className="flex-row justify-end items-center mt-1 mr-2">
            <Text className="text-[12px] text-[#666] mr-2">
              {formatTime(message.timestamp)}
            </Text>
            <View className="bg-[#1B5E20] w-4 h-4 rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-bold">C</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View key={message.id} className="mb-4">
          <View className="flex-row">
            <View className="w-8 h-8 rounded-full bg-[#E57373] mr-3 mt-1 items-center justify-center">
              <View className="w-6 h-6 rounded-full bg-[#D32F2F]" />
            </View>
            <View className="bg-white max-w-[280px] rounded-[20px] px-4 py-3 border border-[#F1EAE7]">
              <Text className="text-[#2D2220] text-[16px] leading-[22px]">
                {message.text}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center mt-1 ml-11">
            <Text className="text-[12px] text-[#666]">
              {formatTime(message.timestamp)}
            </Text>
          </View>
        </View>
      );
    }
  };

  const ImagePickerModal = () => {
    if (!showImagePicker) return null;

    // Sample food images for the gallery
    const sampleImages = [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=150&h=150&fit=crop',
    ];

    return (
      <View className="absolute inset-0 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[20px] p-4">
          <View className="flex-row justify-center mb-4">
            <TouchableOpacity
              onPress={() => setShowImagePicker(false)}
              className="w-12 h-1 bg-[#E0E0E0] rounded-full"
            />
          </View>
          
          <View className="flex-row mb-4">
            <TouchableOpacity 
              onPress={() => {/* Gallery selected by default */}}
              className="flex-1 items-center border-b-2 border-[#1B5E20] pb-2"
            >
              <Text className="text-[#1B5E20] font-semibold">Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={takePhoto}
              className="flex-1 items-center pb-2"
            >
              <Text className="text-[#666]">Take a picture</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
            className="max-h-[400px]"
          >
            {sampleImages.concat(sampleImages, sampleImages).map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    image: imageUrl,
                    isUser: true,
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, newMessage]);
                  setShowImagePicker(false);
                }}
                className="w-[30%] aspect-square mb-2 rounded-lg overflow-hidden"
              >
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF8F7]">
      <ScreenWrapper>
        <View className="flex-1">
          {/* Header */}
          <View>
            <OreAppText className='mx-auto text-[20px] leading-[28px] text-[#2D2220] font-semibold'>
              Customer support
            </OreAppText>
            <ChatHeader />
          </View>

          {/* Date Header */}
          <View className="items-center py-4">
            <Text className="text-[#666] text-[14px]">Today</Text>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}
              
              {/* Typing Indicator */}
              {isTyping && (
                <View className="mb-4">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-[#E57373] mr-3 items-center justify-center">
                      <View className="w-6 h-6 rounded-full bg-[#D32F2F]" />
                    </View>
                    <Text className="text-[#666] text-[14px] italic">Typing</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View className="px-4 pb-4 pt-2">
              <View className="bg-white rounded-full border border-[#E5E7EB] flex-row items-center px-4 py-2">
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Send a message"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-[16px] py-2"
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  onPress={() => setShowImagePicker(true)}
                  className="ml-2 p-2"
                >
                  <Ionicons name="attach" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={sendMessage}
                  className="ml-2 bg-[#1B5E20] w-8 h-8 rounded-full items-center justify-center"
                  disabled={!inputText.trim()}
                >
                  <Ionicons name="send" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>

        <ImagePickerModal />
      </ScreenWrapper>
    </SafeAreaView>
  );
}