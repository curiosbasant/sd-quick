import '~/styles.css'

import { KeyboardProvider } from 'react-native-keyboard-controller'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { ReactQueryProvider } from '~/lib/query'

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <ReactQueryProvider>
        <StatusBar style='auto' />
        <Stack>
          <Stack.Screen name='index' options={{ title: 'Home' }} />
          <Stack.Screen name='students/attendance/index' options={{ title: 'Select Month' }} />
          <Stack.Screen name='students/marks/index' options={{ title: 'Select Subject' }} />
        </Stack>
      </ReactQueryProvider>
    </KeyboardProvider>
  )
}
