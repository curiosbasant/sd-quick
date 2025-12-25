import { ShaladarpanStudent } from '~/features/marks-entry/types'
import { initializeGoogle, sheets } from '~/lib/google-sheet'

export async function GET(request: Request) {
  await initializeGoogle()

  return Response.json(await getData())
  return getData().then(Response.json)
}

async function getData() {
  const { data } = await sheets.values.batchGet({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    ranges: ['sd!A2:AD', 'marks!A2:E'],
  })
  if (!data.valueRanges) return { students: [], marks: [] }

  const [{ values: studentsRows }, { values: marksRows }] = data.valueRanges
  return { students: processStudents(studentsRows), marks: processMarks(marksRows) }
}

function processStudents(rows?: string[][] | null) {
  if (!rows) return []
  const students: ShaladarpanStudent[] = []
  for (const row of rows) {
    const [
      stdClass,
      section,
      srNo,
      admissionDate,
      name,
      lateStatus,
      fatherName,
      motherName,
      gender,
      dob,
      rollNo,
      examRollNo,
      totalWorkingDays,
      totalAttendance,
      category,
      religion,
      previousYearMarks,
      nameOfSchool,
      schoolUdiseCode,
      aadharNo,
      bhamashahCard,
      mobileNo,
      address,
      annualParentalIncome,
      cwsnStatus,
      bplStatus,
      minorityStatus,
      ageOnPresent,
      coCurricularActivity,
      distanceFromSchool,
    ] = row

    students.push({
      stdClass,
      section,
      srNo,
      admissionDate,
      name,
      lateStatus,
      fatherName,
      motherName,
      gender,
      dob,
      rollNo,
      examRollNo,
      totalWorkingDays,
      totalAttendance,
      category,
      religion,
      previousYearMarks,
      nameOfSchool,
      schoolUdiseCode,
      aadharNo,
      bhamashahCard,
      mobileNo,
      address,
      annualParentalIncome,
      cwsnStatus,
      bplStatus,
      minorityStatus,
      ageOnPresent,
      coCurricularActivity,
      distanceFromSchool,
      // marks: marksMap.get(srNo) || '',
    })
  }
  return students
}

function processMarks(rows?: string[][] | null) {
  return (
    rows?.map(([exam, subject, stdClass, srNo, mark]) => ({ exam, subject, stdClass, srNo, mark }))
    ?? []
  )
}
