import {isEmpty, isNil} from 'ramda'
import {Controller} from 'react-hook-form'
import ReactTailwindSelect from 'react-tailwindcss-select'

import cns from '@/utils/classnames'

import FormInputLabel from './FormInputLabel'

//*****************************************************************************
// Interface
//*****************************************************************************
type Option = {
  value: string
  label: string
}
interface Props {
  name: string
  label: string
  options: Option[]
  onSelectionChange?: (value: string) => void
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
interface FormProps {
  field: {
    value: string
    onChange: (value: string) => void
  }
}

const SelectMenuInput = ({name, label, options, onSelectionChange, className}: Props) => {
  if (isNil(options) || isEmpty(options)) return null
  const cn = {
    root: cns('mb-3', className),
  }

  function renderForm(props: FormProps) {
    const field = props.field
    const value = options.find((option) => option.value === field.value)!
    const handleChange = (option: Option | Option[] | null) => {
      const value = option && 'value' in option ? option.value : option?.map((v) => v).join('')
      if (value) {
        onSelectionChange?.(value)
        field.onChange(value)
      }
    }

    const listItem = (props?: {isSelected?: boolean}) => {
      const selectedStyle = props?.isSelected
        ? 'text-zinc-300 bg-app-green hover:opacity-80'
        : 'text-zinc-400 bg-zinc-700 hover:bg-zinc-600'
      const baseStyle =
        'block transition duration-200 px-2 py-1.5 cursor-pointer select-none truncate rounded'
      return cns(baseStyle, selectedStyle)
    }

    return (
      <ReactTailwindSelect
        options={options}
        value={value}
        onChange={handleChange}
        primaryColor="text-primary"
        classNames={{
          menuButton: function () {
            return 'flex items-center h-7 p-1 w-full text-sm text-zinc-400  border border-zinc-600 rounded-md bg-zinc-925'
          },
          menu: 'p-1 absolute z-10 w-full bg-zinc-700 rounded py-1 mt-1.5 text-base',
          listItem,
        }}
      />
    )
  }

  return (
    <div className={cn.root}>
      <FormInputLabel labelText={label} />
      <Controller name={name} defaultValue={options[0].value} render={renderForm} />
    </div>
  )
}
export default SelectMenuInput
