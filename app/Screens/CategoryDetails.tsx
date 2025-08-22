import { View, SafeAreaView } from 'react-native'
import HeaderWithSearchInput from '@/common/HeaderWithSearchInput'

export default function CategoryDetails() {
  return (
    <SafeAreaView className='flex-1 bg-[#FFF6F2]   '>
       <HeaderWithSearchInput/>
    </SafeAreaView>
  )
}