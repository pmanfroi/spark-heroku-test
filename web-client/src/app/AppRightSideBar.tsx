import ProblemDetailsRightSideBar from '@/components/rightSideBar/ProblemDetailsRightSideBar'
import ProblemRightSideBar from '@/components/rightSideBar/ProblemsRightSideBar'
import {useBasePath} from '@/utils/hooks/useBasePath'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************
const AppRightSideBar = ({className}: Props) => {
  const basePath = useBasePath()

  if (basePath === 'problems') {
    return <ProblemRightSideBar className={className} />
  }

  if (basePath === 'problem-details') {
    return <ProblemDetailsRightSideBar className={className} />
  }

  return null
}

export default AppRightSideBar
