import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
// import React, { useState, useEffect, useCallback } from "react";
import OreAppText from "@/common/OreApptext";
import ChatHeader from "@/components/Support/ChatHeader";
// import { GiftedChat, Bubble, InputToolbar, Send, Actions } from 'react-native-gifted-chat';
// import * as ImagePicker from 'expo-image-picker';
// import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  // const [messages, setMessages] = useState([]);
  // const [showImageOptions, setShowImageOptions] = useState(false);

  // useEffect(() => {
  //   // Request permissions on component mount
  //   requestPermissions();
    
  //   // Initialize with sample messages to match your design
  //   setMessages([
  //     {
  //       _id: 2,
  //       text: 'Hi there! I\'m Henry Osas from the support team. I saw your message about ABX and I\'m here to help. Could you let me know what part you\'d like some clarity on? Happy to explain!',
  //       createdAt: new Date(Date.now() - 60000), // 1 minute ago
  //       user: {
  //         _id: 2,
  //         name: 'Henry Osas',
  //       //   avatar: require('@/assets/support-avatar.png'), // Add your support avatar image
  //       },
  //     },
  //     {
  //       _id: 3,
  //       text: 'Hi there! I\'m Henry Osas from the support team. I saw your message about ABX and I\'m here to help. Could you let me know what part you\'d like some clarity on? Happy to explain!',
  //       createdAt: new Date(Date.now() - 30000), // 30 seconds ago
  //       user: {
  //         _id: 2,
  //         name: 'Henry Osas',
  //       //   avatar: require('@/assets/support-avatar.png'),
  //       },
  //     },
  //     {
  //       _id: 1,
  //       text: 'Hi there, I am a new customer on ABX and I do not know how to carry out a transaction properly',
  //       createdAt: new Date(Date.now() - 120000), // 2 minutes ago
  //       user: {
  //         _id: 1,
  //         name: 'You',
  //       },
  //     },
  //   ]);
  // }, []);

  // const requestPermissions = async () => {
  //   try {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('Permission needed', 'We need gallery permissions to share images.');
  //     }
      
  //     const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
  //     if (cameraStatus.status !== 'granted') {
  //       Alert.alert('Permission needed', 'We need camera permissions to take photos.');
  //     }
  //   } catch (error) {
  //     console.log('Permission request error:', error);
  //   }
  // };

  // const onSend = useCallback((messages = []) => {
  //   setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  // }, []);

  // const handleImagePicker = () => {
  //   setShowImageOptions(true);
  // };

  // const pickImageFromGallery = async () => {
  //   setShowImageOptions(false);
    
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 0.8,
  //     });

  //     if (!result.canceled && result.assets[0]) {
  //       const imageMessage = {
  //         _id: Math.random().toString(36).substring(7),
  //         text: '',
  //         createdAt: new Date(),
  //         user: {
  //           _id: 1,
  //           name: 'You',
  //         },
  //         image: result.assets[0].uri,
  //       };
  //       onSend([imageMessage]);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to pick image from gallery');
  //   }
  // };

  // const takePhoto = async () => {
  //   setShowImageOptions(false);
    
  //   try {
  //     const result = await ImagePicker.launchCameraAsync({
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 0.8,
  //     });

  //     if (!result.canceled && result.assets[0]) {
  //       const imageMessage = {
  //         _id: Math.random().toString(36).substring(7),
  //         text: '',
  //         createdAt: new Date(),
  //         user: {
  //           _id: 1,
  //           name: 'You',
  //         },
  //         image: result.assets[0].uri,
  //       };
  //       onSend([imageMessage]);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to take photo');
  //   }
  // };

  // const renderBubble = (props) => {
  //   return (
  //     <Bubble
  //       {...props}
  //       wrapperStyle={{
  //         left: {
  //           backgroundColor: '#F5F5F5',
  //           marginLeft: 8,
  //           marginRight: 50,
  //           borderRadius: 16,
  //           borderBottomLeftRadius: 4,
  //         },
  //         right: {
  //           backgroundColor: '#1B5E20', // Dark green matching your design
  //           marginLeft: 50,
  //           marginRight: 8,
  //           borderRadius: 16,
  //           borderBottomRightRadius: 4,
  //         },
  //       }}
  //       textStyle={{
  //         left: {
  //           color: '#000',
  //           fontSize: 16,
  //           lineHeight: 20,
  //         },
  //         right: {
  //           color: '#fff',
  //           fontSize: 16,
  //           lineHeight: 20,
  //         },
  //       }}
  //       timeTextStyle={{
  //         left: {
  //           color: '#666',
  //           fontSize: 12,
  //         },
  //         right: {
  //           color: 'rgba(255,255,255,0.7)',
  //           fontSize: 12,
  //         },
  //       }}
  //     />
  //   );
  // };

  // const renderSend = (props) => {
  //   return (
  //     <Send {...props} containerStyle={styles.sendContainer}>
  //       <View style={styles.sendButton}>
  //         <Ionicons name="send" size={20} color="#fff" />
  //       </View>
  //     </Send>
  //   );
  // };

  // const renderActions = (props) => {
  //   return (
  //     <Actions
  //       {...props}
  //       containerStyle={styles.actionsContainer}
  //       onPressActionButton={handleImagePicker}
  //       icon={() => (
  //         <View style={styles.attachButton}>
  //           <Ionicons name="attach" size={22} color="#666" />
  //         </View>
  //       )}
  //     />
  //   );
  // };

  // const renderInputToolbar = (props) => {
  //   return (
  //     <InputToolbar
  //       {...props}
  //       containerStyle={styles.inputContainer}
  //       primaryStyle={styles.primaryStyle}
  //     />
  //   );
  // };

  // const renderAvatar = (props) => {
  //   if (props.currentMessage.user._id === 2) {
  //     return (
  //       <View style={styles.avatar}>
  //         <Text style={styles.avatarText}>H</Text>
  //       </View>
  //     );
  //   }
  //   return null;
  // };

  // const renderDay = (props) => {
  //   return (
  //     <View style={styles.dayContainer}>
  //       <Text style={styles.dayText}>Today</Text>
  //     </View>
  //   );
  // };

  return (
    <ScreenWrapper>
      <OreAppText className="text-[20px] leading-[28px] text-[#2D2220] mx-auto mt-1">
        Customer support
      </OreAppText>
      
      <View>
        <ChatHeader />
      </View>
      
      <View className="bg-white flex-1">
        {/* <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
          }}
          renderBubble={renderBubble}
          renderSend={renderSend}
          renderActions={renderActions}
          renderInputToolbar={renderInputToolbar}
          renderAvatar={renderAvatar}
          renderDay={renderDay}
          placeholder="Send a message"
          alwaysShowSend={true}
          scrollToBottom={true}
          bottomOffset={0}
          minInputToolbarHeight={60}
          showAvatarForEveryMessage={false}
          showUserAvatar={false}
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          isAnimated={true}
        /> */}
      </View>

      {/* Image Selection Modal */}
      {/* <Modal
        visible={showImageOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gallery</Text>
              <Text style={styles.modalSubtitle}>Take a picture</Text>
            </View>
            
            <View style={styles.photoGrid}>
              {[...Array(12)].map((_, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.photoGridItem}
                  onPress={pickImageFromGallery}
                >
                  <View style={[styles.photoPlaceholder, index === 0 && styles.selectedPhoto]}>
                    {index === 0 && (
                      <Ionicons name="checkmark-circle" size={24} color="#1B5E20" style={styles.checkIcon} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.retakeButton} 
                onPress={() => setShowImageOptions(false)}
              >
                <Text style={styles.retakeText}>Retake image</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.useImageButton} 
                onPress={takePhoto}
              >
                <Text style={styles.useImageText}>Use this image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: '#1B5E20',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  actionsContainer: {
    marginLeft: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  primaryStyle: {
    alignItems: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoGridItem: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    position: 'relative',
  },
  selectedPhoto: {
    borderWidth: 2,
    borderColor: '#1B5E20',
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  retakeText: {
    fontSize: 16,
    color: '#666',
  },
  useImageButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    borderRadius: 8,
    marginLeft: 10,
  },
  useImageText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});