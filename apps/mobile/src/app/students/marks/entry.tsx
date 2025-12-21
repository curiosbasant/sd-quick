import { Suspense } from 'react'
import { Text, TextInput, View } from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { Stack, useLocalSearchParams } from 'expo-router'

import { Button } from '~/components/ui'
import {
  addMarks,
  getShaladarpanClassStudents,
  Params,
  ShaladarpanStudent,
  subjectsMap,
  useStudent,
} from '~/features/marks-entry'

export default function StudentMarkEntryScreen() {
  const params = useLocalSearchParams<Params>()
  const studentsPromise = getShaladarpanClassStudents(params)
  Promise.resolve([
    {
      stdClass: '9',
      section: 'A',
      srNo: '2878',
      admissionDate: '08-07-2025',
      name: 'Aasif',
      lateStatus: '',
      fatherName: 'Umaradin',
      motherName: 'Madina Khatu',
      gender: 'M',
      dob: '01-07-2010',
      rollNo: '901',
      examRollNo: '',
      totalWorkingDays: '',
      totalAttendance: '',
      category: 'OBC',
      religion: 'Muslim',
      previousYearMarks: '',
      nameOfSchool: 'GOVT. SENIOR SECONDARY SCHOOL HOPARDI (220180)',
      schoolUdiseCode: '8150207301',
      aadharNo: '',
      bhamashahCard: '',
      mobileNo: '9649403063',
      address: 'umaradin kalran ,phalodi,kalran,342301',
      annualParentalIncome: '0',
      cwsnStatus: 'N',
      bplStatus: 'N',
      minorityStatus: 'Yes',
      ageOnPresent: '15',
      coCurricularActivity: 'None',
      distanceFromSchool: '5.5',
    },
    {
      stdClass: '9',
      section: 'A',
      srNo: '2901',
      admissionDate: '10-07-2025',
      name: 'AFSANA',
      lateStatus: '',
      fatherName: 'NEKU KHAN',
      motherName: 'NAIMU KHATU',
      gender: 'F',
      dob: '10-03-2012',
      rollNo: '902',
      examRollNo: '',
      totalWorkingDays: '',
      totalAttendance: '',
      category: 'OBC',
      religion: 'Muslim',
      previousYearMarks: '',
      nameOfSchool: 'GOVT. SENIOR SECONDARY SCHOOL HOPARDI (220180)',
      schoolUdiseCode: '8150207301',
      aadharNo: 'XXXX2275',
      bhamashahCard: '',
      mobileNo: '9856658965',
      address: 'Hopardi,Phalodi,Hopardi,342301',
      annualParentalIncome: '0',
      cwsnStatus: 'N',
      bplStatus: 'N',
      minorityStatus: 'Yes',
      ageOnPresent: '13',
      coCurricularActivity: 'None',
      distanceFromSchool: '1',
    },
    {
      stdClass: '9',
      section: 'A',
      srNo: '2342',
      admissionDate: '11-10-2021',
      name: 'Aniket Bhatia',
      lateStatus: '',
      fatherName: 'Ramesh Kumar',
      motherName: 'Geeta',
      gender: 'M',
      dob: '17-12-2012',
      rollNo: '903',
      examRollNo: '',
      totalWorkingDays: '',
      totalAttendance: '',
      category: 'SC',
      religion: 'Hindu',
      previousYearMarks: '',
      nameOfSchool: 'GOVT. SENIOR SECONDARY SCHOOL HOPARDI (220180)',
      schoolUdiseCode: '8150207301',
      aadharNo: 'XXXX4162',
      bhamashahCard: 'YDMUWUF',
      mobileNo: '9783600014',
      address: 'UTTARI MEGHWALON KI DHANI,PHALODI,HOPARDI,342301',
      annualParentalIncome: '150000',
      cwsnStatus: 'N',
      bplStatus: 'N',
      minorityStatus: 'No',
      ageOnPresent: '13',
      coCurricularActivity: 'None',
      distanceFromSchool: '6',
    },
  ])

  return (
    <View className='h-full px-6 py-8'>
      <Stack.Screen options={{ title: `Class ${params.class} Marks Entry` }} />
      <Text className='mb-4 text-xl font-bold'>
        Enter '{subjectsMap[params.subject]}' Subject Marks
      </Text>
      <Suspense fallback={<Text>Loading students...</Text>}>
        <StudentsList studentsPromise={studentsPromise} params={params} />
      </Suspense>
    </View>
  )
}

function StudentsList(props: { studentsPromise: Promise<ShaladarpanStudent[]>; params: Params }) {
  const {
    students,
    currentIndex,
    currentStudent,
    updateMarks,
    gotoPreviousStudent,
    gotoNextStudent,
  } = useStudent(props.studentsPromise)

  const saveAndGotoNextStudent = () => {
    const { srNo, marks = '' } = currentStudent
    addMarks({ ...props.params, srNo, marks })
    gotoNextStudent()
  }

  const progressCount = students.reduce((acc, s) => (s.marks ? acc + 1 : acc), 0)

  return (
    <View className='flex-1 justify-between'>
      <View className='gap-6'>
        <View className='flex-row justify-between space-x-2'>
          <Text className='text-muted-foreground'>
            Student {currentIndex + 1} of {students.length}
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
                {currentStudent.name}
              </Text>
              <Text className='text-muted-foreground' numberOfLines={1}>
                {currentStudent.srNo} / {currentStudent.rollNo}
              </Text>
            </View>
            <Text className='text-muted-foreground' numberOfLines={1}>
              {currentStudent.fatherName} • {currentStudent.motherName}
            </Text>
          </View>
          <View>
            <TextInput
              className='h-20 rounded-md border border-border p-2 text-4xl font-bold text-foreground caret-primary selection:text-primary/25 placeholder:text-muted-foreground/25'
              value={currentStudent.marks ?? ''}
              onChangeText={updateMarks}
              placeholder='Enter Marks'
              textAlign='center'
              keyboardType='number-pad'
              maxLength={2}
              autoCapitalize='none'
              autoComplete='off'
              autoCorrect={false}
              submitBehavior='submit'
              returnKeyType={currentIndex < students.length - 1 ? 'next' : 'done'}
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
          <Button
            className='flex-1'
            disabled={!currentStudent.marks}
            onPress={saveAndGotoNextStudent}>
            {currentIndex < students.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </View>
      </KeyboardStickyView>
    </View>
  )
}
