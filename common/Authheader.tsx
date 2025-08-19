import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import AppIcon from '@/assets/svgs/AppIcon';
import GoogleIcon from '@/assets/svgs/GoogleIcon';

export default function Authheader({name = 'Create account', Subtext = "Don't have an account?", HeaderText = 'Welcome back to ABX!'}) {
  const MianImg = require('../assets/Images/Main logo.png');
  return (
    <View>
      <View className="mx-auto items-center justify-center mt-[5%]">
        <Image source={MianImg} alt='main-imgg'/>
        <Text className="text-[24px] leading-[32px] font-orelega text-[#2D2220] mt-[10px]">
          {HeaderText}
        </Text>

        <View className="flex-row mt-[8px] items-center">
          <Text className="font-urbanist-semibold text-[16px] leading-[22px]">
            {Subtext}
          </Text>
          <Pressable onPress={() => console.log('Create account pressed')}>
            <Text className="text-[#0C513F] text-[16px] font-urbanist-semibold ml-[4px]">
              {name}
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable className="border border-[#F1EAE7] rounded-[8px] h-[42px] mx-auto flex-row items-center justify-between px-[10px] mt-[32px]">
        <GoogleIcon />
        <Text className="text-[#344054] text-[16px] leading-[22px] font-urbanist ml-[8px]">
          Log in with Google
        </Text>
      </Pressable>
    </View>
  );
}
