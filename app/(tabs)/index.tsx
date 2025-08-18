import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';


export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <Pressable onPress={() => router.push('/(screen)/(dashboard)/cart')}>
        <Text>Go to Cart</Text>
      </Pressable>
       <Text>welcome to abx app</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 
});
