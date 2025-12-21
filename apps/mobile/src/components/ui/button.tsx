import { Pressable, Text, type PressableProps } from 'react-native'

import { Icon, type IconName } from './icon'
import { Spinner } from './spinner'
import { cn, cx, tv, VariantProps } from '~/lib/tv'

const buttonVariants = tv({
  slots: {
    button: 'items-center justify-center rounded-md',
    label: 'font-bold tracking-wide ',
  },
  variants: {
    variant: {
      primary: {
        button: '',
        label: '',
      },
      destructive: {
        button: '',
        label: '',
      },
    },
    outline: {
      true: {
        button: 'border bg-background',
        label: '',
      },
      false: {
        button: '',
        label: '',
      },
    },
    size: {
      sm: {
        button: 'h-10 px-3',
      },
      md: {
        button: 'h-12 px-4 py-3',
      },
      lg: {
        button: 'h-14 px-8',
      },
      icon: {
        button: 'h-11 w-11',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      outline: true,
      class: {
        button: 'border-primary',
        label: 'text-primary',
      },
    },
    {
      variant: 'destructive',
      outline: true,
      class: {
        button: 'border-destructive',
        label: 'text-destructive',
      },
    },
    {
      variant: 'primary',
      outline: false,
      class: {
        button: 'bg-primary',
        label: 'text-white',
      },
    },
    {
      variant: 'destructive',
      outline: false,
      class: {
        button: 'bg-destructive',
        label: 'text-white',
      },
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    outline: false,
  },
})

export interface ButtonProps extends PressableProps, VariantProps<typeof buttonVariants> {
  loading?: boolean
  children: string
  labelClassName?: string
  icon?: IconName
}

export function Button(props: ButtonProps) {
  const {
    loading,
    icon,
    labelClassName,
    className,
    variant,
    outline,
    size,
    children,
    ...restProps
  } = props
  const v = buttonVariants({ variant, size, outline })
  const labelClassNames = v.label({ className: labelClassName })
  const buttonClassNames = cx(
    icon && 'flex-row gap-2',
    v.button({ className }),
    props.disabled && 'opacity-50',
  )

  return (
    <Pressable
      className={buttonClassNames}
      android_ripple={{ color: 'rgba(0,0,0,0.1)', foreground: true }}
      // Disable while loading spinner, override if explicitly passed
      disabled={loading}
      {...restProps}>
      {loading ?
        <Spinner className={labelClassNames} />
      : <>
          {icon && <Icon name={icon} className={labelClassNames} size={16} />}
          <Text className={labelClassNames}>{children}</Text>
        </>
      }
    </Pressable>
  )
}
Button.displayName = 'ui/Button'
