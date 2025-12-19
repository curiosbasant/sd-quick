import { Picker, PickerProps } from '@react-native-picker/picker'
import { View } from 'react-native'

export {
  PickerItemProps as SelectItemProps,
  PickerProps as SelectProps,
} from '@react-native-picker/picker'

export function Select<T>(props: PickerProps<T>) {
  return (
    <View className='rounded-md border border-gray-300'>
      <Picker mode='dropdown' {...props} />
    </View>
  )
}

Select.Item = Picker.Item
