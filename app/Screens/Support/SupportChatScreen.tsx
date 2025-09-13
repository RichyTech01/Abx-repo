import { View, Text } from 'react-native'
import ScreenWrapper from '@/common/ScreenWrapper'
import OreAppText from '@/common/OreApptext'
import ChatHeader from '@/components/Support/ChatHeader'

export default function SupportChatScreen() {
  return (
    <ScreenWrapper> 
        <View className='mx-auto '>
             <OreAppText className='text-[#2D2220] text-[20px]   '>Customer support</OreAppText>
        </View>
       <ChatHeader /> 

       <View>
           
       </View>
    </ScreenWrapper>
  )
}