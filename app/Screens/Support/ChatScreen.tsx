import { View } from 'react-native';
import React, { useState, useCallback } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import ScreenWrapper from '@/common/ScreenWrapper';
import OreAppText from '@/common/OreApptext';
import ChatHeader from '@/components/Support/ChatHeader';

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback((newMessages = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
  }, []);


  return (
    <ScreenWrapper >
      <View>
        <OreAppText className='mx-auto text-[20px] leading-[28px] text-[#2D2220] '>Customer support</OreAppText>
        <ChatHeader />
      </View>
      <GiftedChat
        messages={messages}
        // onSend={onSend}
        user={{ _id: 1 }}
      />
    </ScreenWrapper>
  );
}
