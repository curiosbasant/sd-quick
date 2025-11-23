import { Step1 } from './profile.step-1'
import { Step2 } from './profile.step-2'
import { Step3 } from './profile.step-3'

declare global {
  interface Window {
    __sd_profiles_cache?: Map<string, Record<Step1 | Step2 | Step3 | 'studentName', string>>
    __udise_class_cache?: Set<string>
    __udise_student_cache?: Map<string, UdiseClassStudent>
  }
}
