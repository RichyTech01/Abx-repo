import { View } from 'react-native';
import React, { useState, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import ScreenWrapper from '@/common/ScreenWrapper';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  const onSend = useCallback((newMessages = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
  }, []);


  return (
    <View style={{ flex: 1 }}>
      {/* <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
      /> */}
    </View>
  );
}
