import { useState } from 'react'
import { Text, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Button, Select, SelectItemProps } from '~/components/ui'
import { classesMap, examsMap, Params, subjectsMap } from '~/features/marks-entry'

export default function SelectSubjectScreen() {
  return (
    <View className='px-6 py-8'>
      <Form />
    </View>
  )
}

function Form() {
  const [fields, setFields] = useState<Params>({
    class: '9',
    subject: 'hindi',
    exam: 'term-2',
  })
  const router = useRouter()

  const handleFieldChange =
    (field: string) =>
    <T,>(value: T) => {
      setFields((prev) => ({ ...prev, [field]: value }))
    }

  const newLocal = ([value, label]: [string, string]) => ({ label, value })

  return (
    <View className='gap-6'>
      <FieldSelect
        label='Exam'
        value={fields.exam}
        options={Object.entries(examsMap).map(newLocal)}
        onChange={handleFieldChange('exam')}
      />
      <FieldSelect
        label='Class'
        value={fields.class}
        options={Object.entries(classesMap).map(newLocal)}
        onChange={handleFieldChange('class')}
      />
      <FieldSelect
        label='Subject'
        value={fields.subject}
        options={Object.entries(subjectsMap).map(newLocal)}
        onChange={handleFieldChange('subject')}
      />
      <Button
        onPress={() => {
          console.log(fields)
          router.navigate({ pathname: '/students/marks/list', params: fields })
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
