import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  label?: string
  name?: string
  value?: boolean
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const ToggleSwitch = ({name, className}: Props) => {
  const cn = {
    checkBox: 'h-1 w-0 hidden checked:translate-x-full',
    label:
      'flex items-center justify-between w-24 h-12 bg-zinc-500 rounded-full relative transition background-color duration-1000 active:w-16 ',
    button:
      'absolute top-2 left-2 w-10 h-10 rounded-full transition duration-1000 bg-green active:w-16 ',
  }
  return (
    <div className={className}>
      <input className={cn.checkBox} id={name} type="checkbox" />
      <label className={cns(cn.label, cn.button)} htmlFor={name}>
        <span className={cn.button} />
      </label>
    </div>
  )
}
export default ToggleSwitch
