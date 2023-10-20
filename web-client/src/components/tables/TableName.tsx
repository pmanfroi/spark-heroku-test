import cns from '@/utils/classnames'
import {flatArrayify} from '@/utils/generalUtils'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  name: string
  subText: string | Array<string>
  onClick?: () => void
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const TableName = ({name, subText, onClick, className}: Props) => {
  const cn = {
    name: cns(
      'mb-1 text-base font-semibold leading-[1.25] text-zinc-400',
      onClick && 'underline hover:cursor-pointer hover:text-zinc-300'
    ),
    subText: 'italic text-zinc-600 text-xs italic',
  }
  const subTextList = flatArrayify(subText)
  return (
    <div className={className} onClick={onClick}>
      <div className={cn.name}>{name}</div>
      {subTextList.map(function (subText, key) {
        return (
          <div className={cn.subText} {...{key: key}}>
            {subText}
          </div>
        )
      })}
    </div>
  )
}
export default TableName
