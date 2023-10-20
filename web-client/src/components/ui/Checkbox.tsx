import {noop} from 'ramda-adjunct'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  className?: string
  label: string
  value: any
  checked: boolean
  onChange: () => void
  disabled: boolean
}
const defaultProps = {
  label: '',
  checked: false,
  disabled: false,
  onChange: noop,
}
//*****************************************************************************
// Components
//*****************************************************************************
const Checkbox = ({label, checked, disabled, onChange}: Props) => {
  const cn = {
    input: 'm-2',
  }
  return (
    <div>
      <label>
        <input
          className={cn.input}
          style={{accentColor: 'gray', transform: 'scale(1.2)'}}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <span className="text-gray-300 opacity-50">{label}</span>
      </label>
    </div>
  )
}

Checkbox.defaultProps = defaultProps
export default Checkbox
