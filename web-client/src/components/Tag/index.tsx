import {VariantProps, cva} from 'class-variance-authority'

import CheckIcon from '@/components/icons/CheckIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import {ColorValueHex} from '@/rest/types'
import cns from '@/utils/classnames'

const tagVariants = cva('flex justify-between items-center rounded-md p-2 gap-2 group', {
  variants: {
    selectedColor: {
      default: '',
      purple: 'bg-purple-600',
      violet: 'bg-violet-600',
      indigo: 'bg-indigo-600',
      cyan: 'bg-cyan-600',
      blue: 'bg-blue-600',
      slate: 'bg-slate-600',
    },
    color: {
      neutral400: 'bg-neutral-400',
      neutral500: 'bg-neutral-500',
      neutral600: 'bg-neutral-600',
    },
    size: {
      sm: 'h-4',
      md: 'h-7',
      lg: 'h-9',
    },
    hover: {
      default: '',
      yellow: 'hover:bg-app-yellow hover:text-black',
      green: 'hover:bg-app-green hover:text-black',
      red: 'hover:bg-app-red hover:text-black',
      orange: 'hover:bg-app-orange hover:text-black',
    },
    fit: {
      auto: 'w-auto',
      full: 'w-full',
    },
  },
})

const iconVariants = cva(
  'h-5 w-5 cursor-pointer group-hover:fill-slate-900 group-hover:text-slate-900',
  {
    variants: {
      selectedColor: {
        default: 'fill-neutral-300 text-neutral-300',
        purple: 'fill-purple-900 text-purple-900',
        violet: 'fill-violet-900 text-violet-900',
        indigo: 'fill-indigo-900 text-indigo-900',
        cyan: 'fill-cyan-900 text-cyan-900',
        blue: 'fill-blue-900 text-blue-900',
        slate: 'fill-slate-900 text-slate-900',
        light: 'fill-slate-50 text-slate-50',
      },
    },
  }
)

export type TagVariantsType = VariantProps<typeof tagVariants>

export type IconType = 'close' | 'check'

interface Props extends Omit<TagVariantsType, 'selectedColor'> {
  label?: string
  onClick?: () => void
  isHighlighted?: boolean
  icon?: IconType
  showIcon?: boolean
  className?: string
  bgColor?: TagVariantsType['selectedColor'] | ColorValueHex
  textColor?: TagVariantsType['selectedColor'] | ColorValueHex
}

const Tag = ({
  icon,
  showIcon,
  label,
  isHighlighted,
  bgColor = 'indigo',
  textColor,
  color = 'neutral600',
  hover = 'yellow',
  size = 'md',
  fit,
  className,
  onClick,
}: Props) => {
  const isHexBgColor = bgColor && bgColor[0] === '#'
  const variant = isHexBgColor ? undefined : (bgColor as TagVariantsType['selectedColor'])
  const backgroundColor = isHexBgColor ? bgColor : undefined
  const isHexTextColor = textColor && textColor[0] === '#'
  const textHexColor = isHexTextColor ? (textColor as ColorValueHex) : undefined

  const renderIcon = () => {
    if (icon === 'check') {
      return (
        <CheckIcon
          className={iconVariants({selectedColor: isHexBgColor ? 'light' : 'default'})}
          style={{fill: textHexColor}}
        />
      )
    }
    if (icon === 'close') {
      return (
        <CloseIcon
          className={iconVariants({selectedColor: isHexBgColor ? 'light' : variant})}
          style={{color: textHexColor}}
        />
      )
    }
    return null
  }

  return (
    <div
      onClick={onClick}
      className={cns(
        tagVariants({size, fit, hover}),
        isHighlighted ? tagVariants({selectedColor: variant}) : tagVariants({color}),
        className
      )}
      style={{backgroundColor, color: textHexColor}}
    >
      {label ? <span className="text-xs">{label}</span> : null}
      {showIcon && icon ? renderIcon() : null}
    </div>
  )
}

export default Tag
