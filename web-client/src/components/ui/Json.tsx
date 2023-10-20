import {toJson} from '@/utils/generalUtils'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  value: any
  label: string
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const Json = ({label = '', value, className}: Props) => {
  const cn = {
    label: 'text-zinc-500 text-sm',
    jsonBox: 'break-all text-2xs bg-gray-700 rounded p-4 shadow-2xl',
  }
  return (
    <div className={className}>
      {label ? <div className={cn.label}>{label}</div> : null}
      <div className={cn.jsonBox}>
        <pre>{toJson(value)}</pre>
      </div>
    </div>
  )
}
export default Json
