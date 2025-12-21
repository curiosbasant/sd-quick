import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native'

/**
 * A simple loading spinner with some default values
 */
export function Spinner(props: ActivityIndicatorProps) {
  return <ActivityIndicator color='white' {...props} size={props.size ?? 'small'} />
}
Spinner.displayName = 'ui/Spinner'
