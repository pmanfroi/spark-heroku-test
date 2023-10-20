import {Route, Routes, Navigate} from 'react-router-dom'

import {Problems, Ideas, Insights, ProblemDetail, ProblemSurveys} from '@/pages'
import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************

interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const AppMain = ({className}: Props) => {
  const cn = {
    root: cns('flex flex-grow px-10 py-8', className),
  }

  return (
    <div id="app-main" className={cn.root}>
      <Routes>
        <Route path="/" element={<Navigate to="/problems" replace={true} />} />
        <>
          <Route path="/problems" element={<Problems />} />
          <Route path="/problem-details/:id" element={<ProblemDetail />} />
        </>
        <Route path="/problem-surveys" element={<ProblemSurveys />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="*" element={<Navigate to="/problems" replace={true} />} />
      </Routes>
    </div>
  )
}

export default AppMain
