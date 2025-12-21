import { Suspense, use } from 'react'
import { ListRenderItemInfo, Pressable, Text, View, VirtualizedList } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'

import {
  classesMap,
  getShaladarpanClassStudents,
  Params,
  ShaladarpanStudent,
} from '~/features/marks-entry'

export default function StudentsMarkListScreen() {
  const params = useLocalSearchParams<Params>()
  // const studentsPromise = getShaladarpanClassStudents(params)

  return (
    <View className='h-full px-6 py-8'>
      <Stack.Screen options={{ title: `${classesMap[params.class]} Marks List` }} />

      <Suspense fallback={<Text className='p-4'>Loading students...</Text>}>
        <StudentsList
          studentsPromise={Promise.resolve([
            { srNo: '1', name: 'John Doe' },
            { srNo: '145', name: 'John Doe' },
            { srNo: '1345', name: 'John Doe' },
            { srNo: '341', name: 'John Doe' },
            { srNo: '541', name: 'John Doe' },
          ])}
        />
      </Suspense>
    </View>
  )
}

function StudentsList(props: { studentsPromise: Promise<ShaladarpanStudent[]> }) {
  const students = use(props.studentsPromise)
  console.log(students)

  return (
    <VirtualizedList<ShaladarpanStudent>
      data={students}
      getItemCount={(data) => data.length}
      getItem={(data, index) => data[index]}
      keyExtractor={(item) => item.srNo}
      renderItem={({ item: student }) => (
        <View className='pb-2'>
          <Pressable className='rounded-md border border-border bg-background px-4 py-2'>
            <Text className='font-bold' numberOfLines={1}>
              {student.name}
            </Text>
          </Pressable>
        </View>
      )}
    />
  )
}

function StudentsListItem({ item: student }: ListRenderItemInfo<ShaladarpanStudent>) {
  return (
    <View className='rounded-md border border-border bg-background px-4 py-2'>
      <Text className='font-bold' numberOfLines={1}>
        {student.name}
      </Text>
    </View>
  )
}
