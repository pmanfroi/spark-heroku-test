import {useEffect} from 'react'

import ActionText from '@/components/buttons/ActionText'
import {useGetInsights} from '@/rest/insightsRestHooks'
import {useActiveRootPage} from '@/state/appState'

const GHOST_LENGTH = 7
const CACHE_TIME = 1000 * 60 * 60 // 1 hour
const TIMEOUT = 1000 * 60 * 3 // 3 min

//*****************************************************************************
// Interface
//*****************************************************************************

interface Props {
  className?: string // applied to root container
}

//*****************************************************************************
// Components
//*****************************************************************************

const renderGhost = () => (
  <div className={'flex h-screen w-screen animate-pulse flex-col gap-6'}>
    {Array.from(new Array(GHOST_LENGTH)).map((_, index) => {
      return (
        <div key={index} className={'flex flex-col gap-2'}>
          <div className="h-4 w-1/2 rounded-md bg-zinc-700" />
          <div className="h-4 w-1/2 rounded-md bg-zinc-700" />
          <div className="h-4 w-1/3 rounded-md bg-zinc-700" />
          <div className="h-4 w-1/4 rounded-md bg-zinc-700" />
        </div>
      )
    })}
  </div>
)
const Insights = ({className}: Props) => {
  const {setActiveRootPageId} = useActiveRootPage()
  const {insights, isLoading, isError, error, refetch, isRefetching, isRefetchError} =
    useGetInsights({
      timeout: TIMEOUT,
      retry: false,
      cacheTime: CACHE_TIME,
      refetchOnWindowFocus: false,
    })
  useEffect(() => setActiveRootPageId('insights'), [])

  if (isError || isRefetchError) {
    console.error('fetchError: ', error)
    return (
      <div className="flex w-full justify-center">
        <div className="flex flex-col items-center  gap-4">
          <span className="text-red-600">Something went wrong!</span>
          <ActionText onClick={refetch} text="Try again" />
        </div>
      </div>
    )
  }

  if (isLoading || isRefetching) {
    return renderGhost()
  }

  return (
    <div className={className}>
      <span className="whitespace-pre-line text-neutral-300">{insights.output}</span>
      <span className="whitespace-pre-line text-neutral-300">{insights.topics}</span>
    </div>
  )
}

export default Insights
