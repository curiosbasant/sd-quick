import { Pressable, ScrollView, Text, View } from 'react-native'
import { Route, router } from 'expo-router'

export default function HomeScreen() {
  return (
    <ScrollView className='gap-3 px-5 py-6' contentInsetAdjustmentBehavior='automatic'>
      <View className='-m-2 flex-row flex-wrap content-start'>
        <Item href='/students/marks' label='Student Marks Entry' />
        <Item href='/students/attendance' label='Student Monthly Attendance' />
      </View>
    </ScrollView>
  )
}

function Item(props: { href: Route; label: string }) {
  return (
    <View className='basis-1/2 p-2'>
      <Pressable
        className='items-center gap-4 rounded-md border border-border bg-background p-4'
        onPress={() => router.navigate(props.href)}
        android_ripple={{ color: 'rgba(0,0,0,0.05)', foreground: true }}>
        <View className='size-24 rounded-full bg-secondary' />
        <Text className='text-center text-base leading-none'>{props.label}</Text>
      </Pressable>
    </View>
  )
}
