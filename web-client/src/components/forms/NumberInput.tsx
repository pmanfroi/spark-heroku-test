import FormInput, {
  FormInputPropTypes,
  formInputDefaultProps,
  pickFormProps,
  FieldType,
} from './FormInput'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props extends FormInputPropTypes {}
//*****************************************************************************
// Components
//*****************************************************************************
const valueAsNumber = true
const NumberInput = function (props: Props) {
  const formInputProps = {
    type: FieldType.NUMBER,
    valueAsNumber: valueAsNumber,
    ...pickFormProps(props),
  }
  return <FormInput {...formInputProps} />
}
NumberInput.defaultProps = formInputDefaultProps
export default NumberInput
