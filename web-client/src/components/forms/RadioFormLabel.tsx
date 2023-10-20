//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  labelText: string
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const RadioFormLabel = function (props: Props) {
  return <label>{props.labelText}</label>
}
export default RadioFormLabel
