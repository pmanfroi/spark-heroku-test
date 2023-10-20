import {cva, type VariantProps} from 'class-variance-authority'

import cns from '@/utils/classnames'

const containerVariants = cva(
  'flex h-5 w-12 items-center justify-center rounded-md py-2 transition-[background] duration-300',
  {
    variants: {
      off: {
        default: 'bg-neutral-700',
        neutral800: 'bg-neutral-800',
      },
      on: {
        default: 'bg-neutral-600',
        yellow: 'bg-app-yellow',
      },
    },
  }
)

const labelVariants = cva('text-center text-xs transition-[color] duration-300', {
  variants: {
    off: {
      default: 'text-neutral-400',
      neutral800: 'text-white',
    },
    on: {
      default: 'text-white',
      yellow: 'text-black',
    },
  },
})

export type VariantsProps = VariantProps<typeof containerVariants>

interface Props extends VariantsProps {
  className?: string
  labelClassName?: string
  children: string
  isOn?: boolean
  onClick?: () => void
}

const Toggle = ({
  children,
  isOn,
  onClick,
  className,
  labelClassName,
  on = 'default',
  off = 'default',
}: Props) => {
  return (
    <div
      className={cns(
        containerVariants({
          on: isOn ? on : undefined,
          off: !isOn ? off : undefined,
          className,
        })
      )}
      onClick={onClick}
    >
      <label
        className={cns(
          labelVariants({
            on: isOn ? on : undefined,
            off: !isOn ? off : undefined,
            className: labelClassName,
          })
        )}
      >
        {children}
      </label>
    </div>
  )
}

export default Toggle
