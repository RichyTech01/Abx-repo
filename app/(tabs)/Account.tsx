import { View, Text, } from 'react-native'
import ScreenWrapper from '@/common/ScreenWrapper'
import ProfileImg from "@/assets/svgs/ProfileImg.svg"

export default function Account() {
  return (
    <ScreenWrapper>
        <View className=' bg-[#346E5F] rounded-[4px] p-[24px]  ' >
            <ProfileImg />
        </View>
    </ScreenWrapper>
  )
}