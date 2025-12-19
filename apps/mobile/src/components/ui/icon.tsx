import type { TextProps } from 'react-native'
import type MaterialCommunityGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { styled } from 'nativewind'

export type IconName = keyof typeof MaterialCommunityGlyphMap
export type IconProps = TextProps & {
  name: IconName
  color?: string
  size?: number
}

export const Icon = styled(
  (props: IconProps) => <MaterialCommunityIcons {...props} />,
  { className: 'style' },
  { passThrough: true },
)
// Icon.displayName = 'ui/Icon'
