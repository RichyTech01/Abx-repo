import { View, SafeAreaView} from 'react-native'
import React from 'react'
import Header from '@/common/Header'

export default function Carts() {
  return (
    <SafeAreaView className='bg-[#FFF6F2] flex-1'>
          <View>
              <Header title='Carts'/>  
          </View>
    </SafeAreaView>
  )
}