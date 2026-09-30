import '../global.css';
import { Stack } from 'expo-router';
import { Image, View, Text } from 'react-native';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#546c81' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontFamily: 'Roboto', fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View className="flex-row items-center gap-2">
              <Image
                source={require('../assets/tv.png')}
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
              <Text className="text-white font-bold text-xl" style={{ fontFamily: 'Roboto' }}>
                Minhas Séries
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen name="form" options={{ title: 'Série' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhes' }} />
    </Stack>
  );
}
