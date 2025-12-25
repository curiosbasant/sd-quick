import { Suspense, use } from 'react'
import { ListRenderItemInfo, Pressable, Text, View, VirtualizedList } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'

import {
  classesMap,
  getShaladarpanClassStudents,
  Params,
  ShaladarpanStudent,
} from '~/features/marks-entry'

export default function StudentsMarkListScreen() {
  const params = useLocalSearchParams<Params>()
  const studentsPromise = getShaladarpanClassStudents(params)

  return (
    <View className='h-full px-5 py-6'>
      <Stack.Screen options={{ title: `${classesMap[params.class]} Marks List` }} />

      <Suspense fallback={<Text className='p-4'>Loading students...</Text>}>
        <StudentsList studentsPromise={studentsPromise} />
      </Suspense>
    </View>
  )
}

function StudentsList(props: { studentsPromise: Promise<ShaladarpanStudent[]> }) {
  const students = use(props.studentsPromise)
  const params = useLocalSearchParams<Params>()
  // console.log(students)

  const renderListItem = ({ item: student, index }: ListRenderItemInfo<ShaladarpanStudent>) => (
    <View className='pb-3'>
      <Pressable
        className={`flex-row items-center justify-between rounded-lg border ${student.marks ? 'border-emerald-300 bg-emerald-50' : 'border-border bg-background'} px-4 py-2`}
        onPress={() => {
          router.navigate({
            pathname: '/students/marks/entry',
            params: { ...params, index },
          })
        }}>
        <View className='gap-1'>
          <View className='flex-row items-end gap-1'>
            <Text className='text-lg leading-none font-bold' numberOfLines={1}>
              {student.rollNo} | {student.name}
            </Text>
            <Text className='text-muted-foreground' numberOfLines={1}>
              ({student.srNo})
            </Text>
          </View>
          <Text className='text-muted-foreground' numberOfLines={1}>
            {student.fatherName} • {student.motherName}
          </Text>
        </View>
        <View className='w-14 items-center rounded-md border border-foreground/50 bg-secondary/75 py-1'>
          {student.marks ?
            <Text className='text-2xl'>{student.marks}</Text>
          : <Text className='text-2xl text-muted-foreground/50'>0</Text>}
        </View>
      </Pressable>
    </View>
  )

  return (
    <VirtualizedList<ShaladarpanStudent>
      data={students}
      getItemCount={(data) => data.length}
      getItem={(data, index) => data[index]}
      keyExtractor={(item) => item.srNo}
      renderItem={renderListItem}
    />
  )
}
