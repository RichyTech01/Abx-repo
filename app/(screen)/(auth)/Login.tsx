import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Authheader from '@/common/Authheader';
import CustomTextInput from '@/common/CustomTextInput';
import Button from '@/common/Button';
import { useRouter } from 'expo-router';

export default function Login() {

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Authheader />

          <View className="mx-[20px] mt-[8%] justify-center">
            <CustomTextInput
              label="Email Address"
              placeholder="Type your last name"
            />

            <View className="mt-[24px]">
              <CustomTextInput
                label="Password"
                isPassword
                placeholder="Use a minimum of 7 characters"
              />
            </View>

            <Pressable className="mt-[16px]" onPress={() => router.push('/ForgotPasswordScreen')}>
              <Text className="text-[#0C513F] font-urbanist-semibold text-[14px] leading-[20px]  ">
                Forgot password?
              </Text>
            </Pressable>

            <View className="mt-[8%]">
              <Button title="Login" color="#0C513F" onPress={() => {}} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
