import { View, Text } from 'react-native'


export default function SpendingBreakDown() {
  return (
    <View className='mt-[32px]  '>
      <Text className='text-[16px] font-urbanist-bold text-[#181818]   '>Spending breakdown</Text>

      <View className='bg-white rounded-[18px] p-[20px] mt-[16px]  shadow-sm ' style={{ shadowColor: "#0000000D", elevation: 2 }}>
        <View className='flex-row items-center justify-between  '>
            <View className='flex-row items-center gap-[12px]  '>
                <View className='bg-[#F3EDFE] rounded-full h-[32px] w-[32px]  '></View>
                <Text className='text-[14px] font-urbanist-bold text-[#181818]  '>Jul 6, 2025</Text>
            </View>
            <View className='bg-[#DAEEE5] rounded-[8px] px-[4px] py-[2px]   '>
                <Text className='text-[12px] leading-[18px] font-urbanist-medium text-[#05A85A]  '>Successful</Text>
            </View>
            <Text className='text-[13px] font-urbanist-bold text-[#181818] '>€600</Text>
        </View>
      </View>
    </View>
  ) 
}          