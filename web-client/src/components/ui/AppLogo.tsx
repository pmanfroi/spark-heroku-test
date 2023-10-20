import {ReactComponent as AppLogoSvg} from '@/assets/app-logo.svg'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  width?: number
  height?: number
  className?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const AppLogo = function ({width = 32, height = 32, className}: Props) {
  return (
    <div className={className}>
      <AppLogoSvg width={width} height={height} />
    </div>
  )
}
export default AppLogo
