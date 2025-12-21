import '~/styles.css'

import { KeyboardProvider } from 'react-native-keyboard-controller'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <StatusBar style='auto' />
      <Stack>
        <Stack.Screen name='index' options={{ title: 'Home' }} />
        <Stack.Screen name='students/marks/index' options={{ title: 'Select Subject' }} />
        {/* <Stack.Screen name='list' /> */}
      </Stack>
    </KeyboardProvider>
  )
}
