import {capitalCase} from 'change-case'
import {toPairs} from 'ramda'
import {isBoolean} from 'ramda-adjunct'

import {boolToYesNo} from '@/utils/generalUtils'

import ValueDisplay from './ValueDisplay'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  object: {[key: string]: any}
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const ObjectValuesDisplay = ({object = {}, className}: Props) => {
  return (
    <div className={className}>
      {toPairs(object).map(function (props: any) {
        const key = props[0],
          value = props[1]
        return (
          <ValueDisplay
            key={key}
            label={capitalCase(key)}
            value={isBoolean(value) ? boolToYesNo(value) : value}
          />
        )
      })}
    </div>
  )
}
export default ObjectValuesDisplay
