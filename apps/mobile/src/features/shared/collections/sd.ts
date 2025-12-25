import { createCollection } from '@tanstack/react-db'
import z from 'zod'
import { ShaladarpanStudent } from '~/features/marks-entry/types'

const schema = z.object({
  stdClass: z.string(),
  section: z.string(),
  srNo: z.string(),
  admissionDate: z.string(),
  name: z.string(),
  lateStatus: z.string(),
  fatherName: z.string(),
  motherName: z.string(),
  gender: z.string(),
  dob: z.string(),
  rollNo: z.string(),
  examRollNo: z.string(),
  totalWorkingDays: z.string(),
  totalAttendance: z.string(),
  category: z.string(),
  religion: z.string(),
  previousYearMarks: z.string(),
  nameOfSchool: z.string(),
  schoolUdiseCode: z.string(),
  aadharNo: z.string(),
  bhamashahCard: z.string(),
  mobileNo: z.string(),
  address: z.string(),
  annualParentalIncome: z.string(),
  cwsnStatus: z.string(),
  bplStatus: z.string(),
  minorityStatus: z.string(),
  ageOnPresent: z.string(),
  coCurricularActivity: z.string(),
  distanceFromSchool: z.string(),
  marks: z.string().default(''),
})

export const sdCollection = createCollection<ShaladarpanStudent>({
  // id: 'sd',
  // schema,
  getKey: (item) => item.srNo,
  onInsert: async ({ transaction, collection }) => {
    // Send to API
    // await api.createTodo(transaction.mutations[0].modified)
  },
  sync: { sync: () => {} },
})

// export type ShaladarpanStudent = z.infer<typeof schema>
sdCollection
