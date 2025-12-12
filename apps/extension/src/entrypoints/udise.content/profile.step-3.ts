import { handleResult, UdiseClassStudent, udisePost } from './profile.utils'

export type Step3 = 'schoolDistance' | 'age' | 'gender'

export async function completeStudentFacilityProfile(
  profile: UdiseClassStudent,
  payload: Record<Step3, string>,
) {
  const { heightCm, weightKg } = getRandomHeightWeight(
    +payload.age,
    payload.gender === 'M' ? 'male' : 'female',
  )

  const result = await udisePost(
    `https://sdms.udiseplus.gov.in/p2/api/v2/AY/students/facility/${profile.studentId}`,
    {
      schoolId: profile.schoolId,
      facilityYn: '1',
      facProvided: calculateFacilitiesProvided(
        profile.classId,
        +payload.schoolDistance,
        payload.gender === 'F',
      ),
      facProvidedCwsnYn: 9, // disabled
      facProvidedCwsn: null,
      screenedForSld: 2,
      sldType: 9,
      screenedForAsd: 2,
      screenedForAdhd: 2,
      giftedChildrenYn: '2',
      olympdsNlc: 2,
      nccNssYn: 2,
      digitalCapableYn: +payload.age > 12 ? 1 : 2,
      weightInKg: weightKg,
      heightInCm: heightCm,
      distanceFrmSchool: sdToUdiseDistance(+payload.schoolDistance),
      parentEducation: getRandomParentEducation(),
      motherUuid: '',
      guardianUuid: '',
      stateSpecificUuidType: 2,
      motherUuidUpdateYN: 9,
      guardianUuidUpdateYN: 9,
      fatherUuid: '',
      fatherUuidUpdateYN: 9,
    },
  )
  return handleResult(result, '☑️ Facility Profile Completed!')
}
function calculateFacilitiesProvided(cls: number, schoolDistance: number, isGirl: boolean) {
  // Free Textbooks for all classes
  const facilities = [1]

  // Free Uniform
  if (cls <= 8) facilities.push(2)

  // Free Transport Facility
  if (
    (cls <= 5 && schoolDistance > 1)
    || (6 <= cls && cls <= 8 && schoolDistance > 2)
    || (9 <= cls && cls <= 10 && schoolDistance > 5 && isGirl)
  )
    facilities.push(3)

  // Free Bi-Cycle
  if (cls === 9 && schoolDistance <= 5 && isGirl) facilities.push(4)

  return facilities
}
function sdToUdiseDistance(distance: number) {
  if (distance < 1) return 1
  if (distance < 3) return 2
  if (distance < 5) return 3
  return 4
}
function getRandomParentEducation() {
  const random = Math.random()

  // Cumulative probability thresholds
  if (random < 0.3) return 1 // 0.00 - 0.30 (30%) Primary
  if (random < 0.5) return 2 // 0.30 - 0.50 (20%) Upper Primary
  if (random < 0.65) return 3 // 0.65 - 0.65 (15%) Secondary
  if (random < 0.75) return 4 // 0.65 - 0.75 (10%) Higher Secondary
  if (random < 0.8) return 5 // 0.75 - 0.80 (5%) More than Higher Secondary
  return 6 // 0.80 - 1.00 (20%) No Schooling
}

// Growth data by age and gender (cm and kg)
const data: Record<
  number,
  Record<'male' | 'female', Record<'height' | 'weight', [number, number]>>
> = {
  5: {
    male: {
      height: [102, 115],
      weight: [14, 21],
    },
    female: {
      height: [100, 112],
      weight: [13, 20],
    },
  },
  6: {
    male: {
      height: [107, 121],
      weight: [16, 23],
    },
    female: {
      height: [105, 118],
      weight: [15, 22],
    },
  },
  7: {
    male: {
      height: [112, 127],
      weight: [18, 26],
    },
    female: {
      height: [110, 124],
      weight: [17, 25],
    },
  },
  8: {
    male: {
      height: [117, 132],
      weight: [20, 30],
    },
    female: {
      height: [115, 130],
      weight: [19, 29],
    },
  },
  9: {
    male: {
      height: [122, 138],
      weight: [23, 34],
    },
    female: {
      height: [120, 136],
      weight: [22, 33],
    },
  },
  10: {
    male: {
      height: [127, 145],
      weight: [25, 39],
    },
    female: {
      height: [125, 143],
      weight: [24, 38],
    },
  },
  11: {
    male: {
      height: [133, 152],
      weight: [28, 44],
    },
    female: {
      height: [130, 150],
      weight: [28, 44],
    },
  },
  12: {
    male: {
      height: [138, 158],
      weight: [32, 50],
    },
    female: {
      height: [136, 157],
      weight: [32, 49],
    },
  },
  13: {
    male: {
      height: [144, 165],
      weight: [36, 56],
    },
    female: {
      height: [142, 163],
      weight: [36, 55],
    },
  },
  14: {
    male: {
      height: [150, 171],
      weight: [41, 62],
    },
    female: {
      height: [147, 165],
      weight: [41, 58],
    },
  },
  15: {
    male: {
      height: [157, 175],
      weight: [47, 68],
    },
    female: {
      height: [150, 167],
      weight: [44, 60],
    },
  },
  16: {
    male: {
      height: [163, 178],
      weight: [52, 73],
    },
    female: {
      height: [151, 168],
      weight: [46, 62],
    },
  },
  17: {
    male: {
      height: [166, 180],
      weight: [55, 75],
    },
    female: {
      height: [152, 169],
      weight: [47, 63],
    },
  },
  18: {
    male: {
      height: [168, 182],
      weight: [58, 78],
    },
    female: {
      height: [153, 170],
      weight: [48, 65],
    },
  },
  19: {
    male: {
      height: [169, 183],
      weight: [59, 80],
    },
    female: {
      height: [153, 170],
      weight: [49, 66],
    },
  },
  20: {
    male: {
      height: [170, 184],
      weight: [60, 82],
    },
    female: {
      height: [153, 171],
      weight: [50, 67],
    },
  },
  21: {
    male: {
      height: [170, 185],
      weight: [61, 83],
    },
    female: {
      height: [153, 171],
      weight: [50, 68],
    },
  },
  22: {
    male: {
      height: [171, 186],
      weight: [61, 84],
    },
    female: {
      height: [153, 171],
      weight: [50, 68],
    },
  },
  23: {
    male: {
      height: [171, 187],
      weight: [62, 85],
    },
    female: {
      height: [153, 172],
      weight: [50, 69],
    },
  },
  24: {
    male: {
      height: [171, 188],
      weight: [62, 86],
    },
    female: {
      height: [153, 172],
      weight: [51, 69],
    },
  },
  25: {
    male: {
      height: [171, 188],
      weight: [63, 87],
    },
    female: {
      height: [153, 172],
      weight: [51, 70],
    },
  },
}

function getRandomHeightWeight(age: number, gender?: 'male' | 'female') {
  // Validate inputs
  if (5 > age || age > 25) {
    return {
      error: 'Age must be between 5 and 25 years.',
    }
  }
  if (gender && gender !== 'male' && gender !== 'female') {
    return {
      error: "Gender must be 'male' or 'female'.",
    }
  }

  const entry =
    gender ?
      data[age][gender]
    : ({
        height: [data[age].female.height[0], data[age].male.height[1]],
        weight: [data[age].female.weight[0], data[age].male.weight[1]],
      } as const)

  // Helper to generate a random number within a range
  const randomInRange = (min: number, max: number) => Math.round(Math.random() * (max - min) + min)

  // Generate random height and weight
  return {
    heightCm: randomInRange(...entry.height),
    weightKg: randomInRange(...entry.weight),
  }
}
