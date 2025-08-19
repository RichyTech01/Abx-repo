import { View, Text } from 'react-native'
import React from 'react'
import CustomTextInput from '@/common/CustomTextInput'
import PhoneNumberInput from '@/common/PhoneNumberInput'

export default function StepOne() {
  return (
    <View className='mt-[7%] '>
        <View className='gap-[32px]  '>
        <CustomTextInput
            label="First Name"
            placeholder="Type your first name"
        />
        
        <CustomTextInput
            label="Last Name"
            placeholder="Type your last name"
        />
        <CustomTextInput
            label="Email Address"
            placeholder="Type your last name"
        />

        <PhoneNumberInput />
         </View>
    </View>
  )
}