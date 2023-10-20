import {isNotNilOrEmpty} from 'ramda-adjunct'

import NavButton from '@/components/buttons/NavButton'
import Form, {FieldSet, TextInput, SelectMenuInput, SubmitButton} from '@/components/forms/Form'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface FormFields {
  id?: string
  fieldRequired: string
  fieldOptional?: string
  fieldSelection: string
}

interface Props {
  initialData?: FormFields // provide in case of update
  onSubmit?: (data: FormFields, event?: any) => void // called on form submission (passed form data)
  onDirtyChange?: () => void // called when ever form dirty state changes
  title: string // form title if desired
  navToOnCancel: string // route to navigate if form processing is cancelled
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const SampleForm = ({
  initialData,
  title,
  navToOnCancel,
  onDirtyChange,
  onSubmit,
  className,
}: Props) => {
  const {fieldRequired, fieldOptional} = initialData || {}

  const dropdownOptions = [
    {label: 'Option1', value: 'Option1'},
    {label: 'Option2', value: 'Option2'},
    {label: 'Option3', value: 'Option3'},
  ]

  const defaultValues = isNotNilOrEmpty(initialData)
    ? initialData
    : {
        fieldSelection: dropdownOptions[0],
      }

  const cn = {
    buttonsContainer: 'flex flex-row gap-4 mt-6',
    section: 'mt-8',
  }

  return (
    <div className={className}>
      <Form {...{title, defaultValues, onDirtyChange, onSubmit}}>
        <FieldSet label="General">
          <TextInput
            required
            label="Some Required Field"
            name="fieldRequired"
            value={fieldRequired}
          />
          <TextInput label="Some Optional Field" name="fieldOptional" value={fieldOptional} />
          <SelectMenuInput name="fieldSelection" label="A Dropdown" options={dropdownOptions} />
        </FieldSet>
        <div className={cn.buttonsContainer}>
          <SubmitButton />
          <NavButton className="flex-initial" text="Cancel" linkto={navToOnCancel} />
        </div>
      </Form>
    </div>
  )
}

export default SampleForm
