import '~/styles.css'

import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <>
      <StatusBar style='auto' />
      <Stack>
        <Stack.Screen name='index' options={{ title: 'Home' }} />
      </Stack>
    </>
  )
}
