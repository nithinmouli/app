import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#000', // Black header background
          },
          headerTintColor: '#fff', // White header text
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="fav" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background for the entire app
    color: '#fff', // White text color
  },
});