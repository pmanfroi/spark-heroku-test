import cns from '@/utils/classnames'

import Toggle, {VariantsProps as ContainerVariantProps} from './ToggleBase'
import {VariantsProps as ItemVariantsProps} from './ToggleItem'

interface Props {
  label: string
  onText?: string
  offText?: string
  isOn: boolean
  onOnClick?: () => void
  onOffClick?: () => void
  className?: string
  labelClassName?: string
  containerVariants?: ContainerVariantProps
  toggleVariants?: ItemVariantsProps
  toggleClassName?: string
}

const ToggleComponent = ({
  label,
  onText = 'ON',
  offText = 'OFF',
  isOn,
  onOnClick,
  onOffClick,
  className,
  labelClassName,
  containerVariants,
  toggleVariants,
  toggleClassName,
}: Props) => {
  const {on, ...variants} = toggleVariants || {}
  return (
    <div className={cns('', className)}>
      <span className={cns('', labelClassName)}>{label}</span>
      <Toggle {...containerVariants} className={toggleClassName}>
        <Toggle.Item isOn={isOn} onClick={onOnClick} {...toggleVariants}>
          {onText}
        </Toggle.Item>
        <Toggle.Item isOn={!isOn} onClick={onOffClick} {...variants}>
          {offText}
        </Toggle.Item>
      </Toggle>
    </div>
  )
}

export default ToggleComponent
