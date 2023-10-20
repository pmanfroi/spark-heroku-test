import {append, concat} from 'ramda'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  op: string // operation during which error ocrrued
  error?: any // error object
  extraMessages?: Array<string> // error messages
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************
const Error = ({op, error, extraMessages, className}: Props) => {
  let errorMessages = [`ERROR while ${op}`]

  if (error?.code === 'ERR_NETWORK')
    errorMessages = append('Could not connect to server, make sure it is started', errorMessages)

  if (error?.message) errorMessages = append(error.message, errorMessages)

  if (extraMessages) errorMessages = concat(errorMessages, extraMessages)

  console.error(errorMessages, error)

  return (
    <div className={className}>
      {errorMessages.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </div>
  )
}
export default Error
