import { Suspense, use, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { router, Stack, useLocalSearchParams } from 'expo-router'

import { Button } from '~/components/ui'
import {
  addMarks,
  classesMap,
  getShaladarpanClassStudents,
  Params,
  ShaladarpanStudent,
  subjectsMap,
  useStudent,
} from '~/features/marks-entry'

export default function StudentMarkEntryScreen() {
  const params = useLocalSearchParams<Params>()
  const studentsPromise = getShaladarpanClassStudents(params)

  return (
    <View className='h-full px-6 py-8'>
      <Stack.Screen options={{ title: `${classesMap[params.class]} Marks Entry` }} />
      <Text className='mb-4 text-xl font-bold'>
        Enter '{subjectsMap[params.subject]}' Subject Marks
      </Text>
      <Suspense fallback={<Text>Loading students...</Text>}>
        <StudentMarksEntry studentsPromise={studentsPromise} />
      </Suspense>
    </View>
  )
}

function StudentMarksEntry(props: { studentsPromise: Promise<ShaladarpanStudent[]> }) {
  const { index = '0', ...params } = useLocalSearchParams<Params & { index?: string }>()
  const originalStudents = use(props.studentsPromise)
  const [students, setStudents] = useState(originalStudents)

  const currentIndex = +index,
    student = students[currentIndex],
    studentPosition = currentIndex + 1,
    progressCount = students.reduce((acc, s) => (s.marks ? acc + 1 : acc), 0)

  const updateMarks = (text: string) => {
    if (isNaN(+text)) return
    setStudents((prev) => {
      const markUpdate = { ...prev[currentIndex], marks: text }
      return prev.with(currentIndex, markUpdate)
    })
  }
  const gotoPreviousStudent = () => {
    if (currentIndex === 0) return
    router.setParams({ index: currentIndex - 1 })
  }
  const saveAndGotoNextStudent = () => {
    const { srNo, marks = '' } = student
    addMarks({ ...params, srNo, marks })

    const nextIndex = currentIndex + 1
    if (nextIndex === students.length) return
    router.setParams({ index: nextIndex })
  }

  return (
    <View className='flex-1 justify-between'>
      <View className='gap-6'>
        <View className='flex-row justify-between gap-2'>
          <Text className='text-muted-foreground'>
            Student {studentPosition} of {students.length}
          </Text>
          <View className='flex-row items-center gap-1'>
            <Text className='text-muted-foreground'>Progress</Text>
            <Text className='font-bold'>
              {Math.floor((progressCount * 10000) / students.length) / 100}%
            </Text>
          </View>
        </View>
        <View className='gap-4 rounded-xl border border-border bg-background p-4'>
          <View>
            <View className='flex-row justify-between'>
              <Text className='text-xl font-bold' numberOfLines={1}>
                {student.name}
              </Text>
              <Text className='text-muted-foreground' numberOfLines={1}>
                {student.srNo} / {student.rollNo}
              </Text>
            </View>
            <Text className='text-muted-foreground' numberOfLines={1}>
              {student.fatherName} • {student.motherName}
            </Text>
          </View>
          <View>
            <TextInput
              className='h-20 rounded-md border border-border p-2 text-4xl font-bold text-foreground caret-primary selection:text-primary/25 placeholder:text-muted-foreground/25'
              value={student.marks ?? ''}
              onChangeText={updateMarks}
              placeholder='Enter Marks'
              textAlign='center'
              keyboardType='number-pad'
              maxLength={2}
              autoCapitalize='none'
              autoComplete='off'
              autoCorrect={false}
              submitBehavior='submit'
              returnKeyType={studentPosition < students.length ? 'next' : 'done'}
              onSubmitEditing={saveAndGotoNextStudent}
            />
          </View>
        </View>
      </View>
      <KeyboardStickyView>
        <View className='flex-row gap-4'>
          <Button
            className='flex-1'
            outline
            disabled={currentIndex === 0}
            onPress={gotoPreviousStudent}>
            Previous
          </Button>
          <Button className='flex-1' disabled={!student.marks} onPress={saveAndGotoNextStudent}>
            {studentPosition < students.length ? 'Next' : 'Finish'}
          </Button>
        </View>
      </KeyboardStickyView>
    </View>
  )
}
