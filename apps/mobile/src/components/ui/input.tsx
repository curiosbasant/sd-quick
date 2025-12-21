import { forwardRef } from 'react'
import { Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native'

import { useToggle } from '@my/core/hooks'

import { Icon, type IconName } from './icon'

type InputProps = TextInputProps & {
  label: string
  icon?: IconName
  optional?: boolean
  errorMessage?: string | null
  style?: ViewStyle
}

export function Input(props: InputProps) {
  return (
    <View className='gap-2' style={props.style}>
      <Text className='font-bold text-foreground'>
        {props.label}
        {props.optional && <Text className='text-sm text-muted-foreground'> (Optional)</Text>}
      </Text>
      <View className='h-10 flex-row items-center rounded-md border border-input'>
        {props.icon && (
          <Icon name={props.icon} className='pl-2.5 text-foreground opacity-75' size={20} />
        )}
        {props.children}
      </View>
      {!props.errorMessage || (
        <Text className='text-sm text-destructive'>{props.errorMessage}</Text>
      )}
    </View>
  )
}
Input.displayName = 'ui/Input'

Input.Text = forwardRef<TextInput, Partial<InputProps>>((props, ref) => {
  const { label = 'Text', icon, optional = false, errorMessage, style, ...restProps } = props

  return (
    <Input label={label} icon={icon} optional={optional} errorMessage={errorMessage} style={style}>
      <TextInput
        ref={ref}
        className='flex-1 p-2 text-foreground caret-primary selection:text-primary placeholder:text-muted-foreground'
        keyboardType='default'
        {...restProps}
      />
    </Input>
  )
})

Input.Email = forwardRef<TextInput, Partial<InputProps>>((props, ref) => {
  const {
    label = 'Email',
    icon = 'email',
    optional = false,
    errorMessage,
    style,
    ...restProps
  } = props
  return (
    <Input label={label} icon={icon} optional={optional} errorMessage={errorMessage} style={style}>
      <TextInput
        ref={ref}
        className='flex-1 p-2 text-foreground caret-primary selection:text-primary placeholder:text-muted-foreground'
        keyboardType='email-address'
        autoCapitalize='none'
        autoComplete='email'
        {...restProps}
      />
    </Input>
  )
})

Input.Secure = forwardRef<TextInput, Partial<InputProps>>((props, ref) => {
  const {
    label = 'Secure',
    icon = 'form-textbox-password',
    optional = false,
    errorMessage,
    style,
    ...restProps
  } = props

  const [isVisible, toggleIsVisible] = useToggle()

  return (
    <Input label={label} icon={icon} optional={optional} errorMessage={errorMessage} style={style}>
      <View className='flex-1 justify-center p-2'>
        <TextInput
          ref={ref}
          className='text-foreground caret-primary selection:text-primary placeholder:text-muted-foreground'
          keyboardType={isVisible ? 'visible-password' : 'ascii-capable'}
          secureTextEntry
          autoComplete='password'
          autoCapitalize='none'
          // placeholderTextColor={colors.slate[400]}
          {...restProps}
          // fix for `keyboardType` not changing back once set to 'visible-password'
          key={isVisible ? 'visible-password' : 'ascii-capable'}
        />
      </View>
      <Icon
        name={isVisible ? 'eye-off-outline' : 'eye'}
        className='p-2 text-foreground opacity-75'
        size={20}
        onPress={toggleIsVisible}
      />
    </Input>
  )
})
