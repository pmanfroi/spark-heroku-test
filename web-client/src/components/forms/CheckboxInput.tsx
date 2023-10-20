import FormInput, {
  FormInputPropTypes,
  formInputDefaultProps,
  pickFormProps,
  FieldType,
} from './FormInput'
import FormInputLabel from './FormInputLabel'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props extends FormInputPropTypes {}
//*****************************************************************************
// Components
//*****************************************************************************
const CheckboxInput = function (props: Props) {
  // We will handle the label ourselves, since check box is a visual special case
  const label = props.label
  const {label: formLabel, ...formProps} = pickFormProps(props)
  // custom styuling for checkbox
  const classNames = {
    input: 'scale-250 w-8 ml-[-5px] accent-primary rounded-sm',
  }
  const cn = {
    root: 'flex items-center mt-2 mb-4',
    label: '',
    input: 'ml-8',
  }
  const formInputProps = {
    type: FieldType.CHECKBOX,
    ...formProps,
    classNames,
  }
  return (
    <div className={cn.root}>
      <FormInputLabel className={cn.label} labelText={label} />
      <FormInput {...formInputProps} />
    </div>
  )
}
CheckboxInput.defaultProps = formInputDefaultProps
export default CheckboxInput
