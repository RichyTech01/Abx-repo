import { View, Text } from 'react-native';

interface NotificationBadgeProps {
  count: number;
  children: React.ReactNode;
}

export default function NotificationBadge({ count, children }: NotificationBadgeProps) {
  return (
    <View className="relative">
      {children}
      {count > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          <Text className="text-white text-[10px] font-bold leading-none">
            {count > 99 ? '99+' : count.toString()}
          </Text>
        </View>
      )}
    </View>
  );
}