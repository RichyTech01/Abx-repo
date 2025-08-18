import { View, Text, Pressable,  } from 'react-native'
import React from 'react'
import AppIcon from '@/assets/svgs/AppIcon';
import GoogleIcon from '@/assets/svgs/GoogleIcon';


export default function Authheader() {
  return (
    <View>
        <View className='mx-auto items-center justify-center mt-[5%]'>
            <AppIcon/>
            <Text className='text-[24px] leading-[32px] font-orelega text-[#2D2220] mt-[10px]  '>Welcome back to ABX!</Text>
            <Text className='font-urbanist-semibold text-[16px] leading-[22px] mt-[8px]  '>Don&apos;t have an account? Create one</Text>
        </View>
    
        <Pressable className='border border-[#F1EAE7] rounded-[8px] h-[42px] mx-auto flex-row items-center justify-between px-[10px] mt-[32px] '>
            <GoogleIcon />
            <Text className='text-[#344054] text-[16px] leading-[22px] font-urbanist ml-[8px]  '>Log in with Google</Text>
        </Pressable>
    </View>
  )
}