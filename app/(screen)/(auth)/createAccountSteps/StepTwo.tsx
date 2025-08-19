import { View, Text } from 'react-native'
import React from 'react'
import CustomTextInput from '@/common/CustomTextInput'

export default function StepTwo() {
  return (
    <View>
        <View className='gap-[32px] mt-[3%] '>
            <CustomTextInput label='Post code' placeholder='Type your post code' />
             <CustomTextInput label='Home Address' placeholder='Clearly state  your address'/>
             <CustomTextInput label='Password' isPassword placeholder='Use a minimum of 7 characters'/>
        </View>
    </View>
  )
}