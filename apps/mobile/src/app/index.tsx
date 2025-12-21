import { Text, View } from 'react-native'
import { Link } from 'expo-router'

export default function HomeScreen() {
  return (
    <View className='px-6 py-8'>
      <Link href='/students/marks'>
        <Text className='mb-4 text-primary'>Student Marks Entry</Text>
      </Link>
    </View>
  )
}
