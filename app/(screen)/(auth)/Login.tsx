import { View, Text, SafeAreaView, Pressable} from 'react-native'
import React from 'react'
import Authheader from '@/common/Authheader';
import CustomTextInput from '@/common/CustomTextInput';
import Button from '@/common/Button';

export default function Login() {
  return (
    <SafeAreaView className='flex-1 bg-white '>
        <Authheader />

        <View className='mx-[20px] mt-[8%]  '>
           <CustomTextInput label='Email Address' placeholder='Type your last name'  />
           <View className='mt-[24px]    '>
              <CustomTextInput label='Password' secureTextEntry placeholder='Use a minimum of 7 characters'  />
           </View>

           <Pressable className='mt-[16px]                                            '>
              <Text className='text-[#0C513F] font-urbanist-semibold text-[14px] leading-[20px]  '>Forgot password?</Text>
           </Pressable>

           <View className='mt-[8%]'>
              <Button title='Login' color='#0C513F' onPress={() => {}} />
           </View>
        </View>
    </SafeAreaView>
  )
} 