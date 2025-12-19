import { useState } from 'react'
import { Text, View } from 'react-native'
import { Button, Select, SelectItemProps } from '~/components/ui'

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState()

  return (
    <View className='px-6 py-8'>
      <Form />
    </View>
  )
}

function Form() {
  const [fields, setFields] = useState<Record<string, any>>({})

  const handleFieldChange =
    (field: string) =>
    <T,>(value: T) => {
      setFields((prev) => ({ ...prev, [field]: value }))
    }

  return (
    <View className='gap-6'>
      <FieldSelect
        label='Class'
        value={fields.class}
        options={[
          { label: 'Class 6', value: 6 },
          { label: 'Class 7', value: 7 },
          { label: 'Class 8', value: 8 },
          { label: 'Class 9', value: 9 },
          { label: 'Class 10', value: 10 },
          { label: 'Class 11', value: 11 },
          { label: 'Class 12', value: 12 },
        ]}
        onChange={handleFieldChange('class')}
      />
      <FieldSelect
        label='Subject'
        value={fields.subject}
        options={[
          { label: 'Maths', value: 'maths' },
          { label: 'English', value: 'english' },
          { label: 'Sanskrit', value: 'sanskrit' },
          { label: 'Science', value: 'science' },
          { label: 'Social Science', value: 'sst' },
          { label: 'Hindi', value: 'hindi' },
          { label: 'Hindi Literature', value: 'hindi-literature' },
          { label: 'Political Science', value: 'political' },
          { label: 'History', value: 'history' },
        ]}
        onChange={handleFieldChange('subject')}
      />
      <FieldSelect
        label='Exam'
        value={fields.exam}
        options={[
          { label: 'Ist Term', value: 'term-1' },
          { label: '2nd Term', value: 'term-2' },
          { label: 'Half Yearly', value: 'half-yearly' },
        ]}
        onChange={handleFieldChange('exam')}
      />
      <Button
        onPress={() => {
          console.log(fields)
        }}>
        Submit
      </Button>
    </View>
  )
}

function FieldSelect<T>(props: {
  label: string
  name?: string
  value: NoInfer<T>
  options: SelectItemProps<T>[]
  onChange: (value: T) => void
}) {
  return (
    <View className='gap-2'>
      <Text className='font-bold'>{props.label}</Text>
      <Select selectedValue={props.value} onValueChange={props.onChange}>
        {props.options.map((option) => (
          <Select.Item {...option} />
        ))}
      </Select>
    </View>
  )
}
