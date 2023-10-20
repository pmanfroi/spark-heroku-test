import {useEffect, useState} from 'react'

import Card from '@/components/Card/Card'
import CardGhost from '@/components/Card/CardGhost'
import AddProblemSurveyModal from '@/components/Modal/AddProblemSurveyModal'
import NotAuthorized from '@/components/NotAuthorized'
import ActionText from '@/components/buttons/ActionText'
import Icon from '@/components/icons/Icon'
import PlusIcon from '@/components/icons/PlusIcon'
import {IconSize} from '@/components/icons/types'
import {useGetProblemSurveys} from '@/rest/problemSurveysRestHooks'
import {ResourceTypes} from '@/rest/types'
import {useActiveUser} from '@/state/activeUserState'
import {useActiveRootPage} from '@/state/appState'
import cns from '@/utils/classnames'

const GHOST_LENGTH = 4

const renderGhost = () =>
  Array.from(new Array(GHOST_LENGTH)).map((_, idx) => <CardGhost key={idx} />)

const ProblemSurveys = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {setActiveRootPageId} = useActiveRootPage()
  const {problemSurveys, isLoading, isError, error, isRefetchError, refetch, isRefetching} =
    useGetProblemSurveys({refetchOnWindowFocus: false})

  const {activeUserPermissions, activeUserCanAccess} = useActiveUser()
  const activeUserProblemAccess = activeUserCanAccess(ResourceTypes.PROBLEM_SURVEY)

  useEffect(() => setActiveRootPageId('problemSurveys'), [setActiveRootPageId])

  // Active User must have permissions to read problems
  if (!activeUserProblemAccess.readAny) {
    return (
      <NotAuthorized
        resourceType={ResourceTypes.PROBLEM_SURVEY}
        message="Requires read.any permissions"
        userPermissions={activeUserPermissions}
      />
    )
  }

  if (isError || isRefetchError) {
    console.error('fetchError: ', error)
    return (
      <div className="flex w-full justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-red-600">Something went wrong!</span>
          <ActionText onClick={refetch} text="Try again" />
        </div>
      </div>
    )
  }

  const cn = {
    root: 'flex flex-1 flex-col gap-10',
    header: 'flex items-center justify-between pr-12',
    h1: 'font-bold text-3xl ms-2',
    problemSurveysSection: 'flex flex-col gap-4',
    h3: 'font-semibold text-2xl ms-2 text-app-gray-400',
    container: 'flex w-full items-center gap-4',
    cardHeader: 'flex flex-col bg-neutral-725 p-3.5',
    title: 'text-sm text-neutral-100 hover:underline cursor-pointer',
    description: 'mt-1 h-10 text-2xs text-app-gray-400 overflow-auto',
    cardFooter: 'grid min-h-[2rem] bg-neutral-800 p-3.5 grid-cols-3 grid-rows-2 gap-y-3',
    colSpan2: 'col-span-2',
    votesContainer: 'flex items-center gap-6 bg-neutral-800',
    votesCounterContainer: 'flex gap-3 items-center',
    footerValue: 'text-neutral-475 text-2xs',
    surveyDetailsContainer: 'flex items-center gap-6 bg-neutral-800 mt-2',
    surveyDetailItem: 'flex flex-col',
    footerLabel: 'text-3xs text-neutral-550',
  }

  return (
    <div className={cn.root}>
      <div className={cn.header}>
        <h1 className={cn.h1}>Surveys</h1>
      </div>
      <div className={cn.problemSurveysSection}>
        <h3 className={cn.h3}>Problems Surveys</h3>
        <div className={cn.container}>
          {!problemSurveys && (isRefetching || isLoading) ? (
            renderGhost()
          ) : !problemSurveys.length ? (
            <div>No Surveys Found.</div>
          ) : (
            problemSurveys.map((survey) => (
              <Card key={survey.id}>
                <div className={cn.cardHeader}>
                  <div
                    className={cn.title}
                    onClick={() => {
                      /** go to survey page */
                    }}>
                    {survey.title}
                  </div>
                  <div className={cn.description}>{survey.description}</div>
                </div>
                <div className={cn.cardFooter}>
                  <div className={cn.votesCounterContainer}>
                    <Icon.Thumbs />
                    <span className={cn.footerValue}>{survey.thumbsUpCount}</span>
                  </div>
                  <div className={cns(cn.votesCounterContainer, cn.colSpan2)}>
                    <Icon.Thumbs direction={'down'} />
                    <span className={cn.footerValue}>{survey.thumbsDownCount}</span>
                  </div>

                  <div className={cn.surveyDetailItem}>
                    <span className={cn.footerLabel}># Problems</span>
                    <span className={cn.footerValue}>{survey.problemsCount}</span>
                  </div>
                  <div className={cn.surveyDetailItem}>
                    <span className={cn.footerLabel}># Users</span>
                    <span className={cn.footerValue}>{survey.usersCount}</span>
                  </div>
                  <div className={cn.surveyDetailItem}>
                    <span className={cn.footerLabel}>Status</span>
                    <span className={cn.footerValue}>{survey.status}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
          <PlusIcon
            size={IconSize.md}
            className={!activeUserProblemAccess.createOwn ? 'cursor-not-allowed' : undefined}
            onClick={() => activeUserProblemAccess.createOwn && setIsModalOpen(true)}
          />
        </div>
      </div>

      <AddProblemSurveyModal modalIsOpen={isModalOpen} onModalClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default ProblemSurveys
