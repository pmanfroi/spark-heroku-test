import {useState} from 'react'

import Icon from '@/components/icons/Icon'
import Section from '@/components/rightSideBar/RightSideSection'
import {ImportanceLevel, PassionLevel, RatingType} from '@/rest/types'
import {useProblemFilters} from '@/state/appState'

const ReactionsFilter = () => {
  const [passionReactions, setPassionReactions] = useState<PassionLevel[]>([])
  const [importanceReactions, setImportanceReactions] = useState<ImportanceLevel[]>([])
  const {problemFilters, setProblemFilters} = useProblemFilters()

  const onPassionChange = (reactionLevel: PassionLevel) => {
    const found = passionReactions.includes(reactionLevel)
    if (found) {
      const newReactions = passionReactions.filter((r) => r !== reactionLevel)
      setPassionReactions(newReactions)
      setProblemFilters({
        ...problemFilters,
        passionReactions: newReactions,
      })
    } else {
      setPassionReactions([...passionReactions, reactionLevel])
      setProblemFilters({
        ...problemFilters,
        passionReactions: [...problemFilters.passionReactions, reactionLevel],
      })
    }
  }

  const onImportanceChange = (reactionLevel: ImportanceLevel) => {
    const found = importanceReactions.includes(reactionLevel)
    if (found) {
      const newReactions = importanceReactions.filter((r) => r !== reactionLevel)
      setImportanceReactions(newReactions)
      setProblemFilters({
        ...problemFilters,
        importanceReactions: newReactions,
      })
    } else {
      setImportanceReactions([...importanceReactions, reactionLevel])
      setProblemFilters({
        ...problemFilters,
        importanceReactions: [...problemFilters.importanceReactions, reactionLevel],
      })
    }
  }

  return (
    <div className="mt-6 flex">
      <Section className={'flex-1'} title={<Section.Title>Passion Levels</Section.Title>}>
        <div className="flex flex-col gap-3">
          <div className={'flex'}>
            <Section.ReactionItem
              icon={
                <Icon.Rating
                  type={RatingType.passion}
                  level={2}
                  onClick={() => onPassionChange(PassionLevel.TOTALLY_JAZZED)}
                />
              }
              label="Totally Jazzed"
            />
            {passionReactions.includes(PassionLevel.TOTALLY_JAZZED) && (
              <Icon.CheckedIcon className={'ms-1'} />
            )}
          </div>
          <div className={'flex'}>
            <Section.ReactionItem
              icon={
                <Icon.Rating
                  type={RatingType.passion}
                  level={1}
                  onClick={() => onPassionChange(PassionLevel.INTERESTING)}
                />
              }
              label="Interesting"
            />
            {passionReactions.includes(PassionLevel.INTERESTING) && (
              <Icon.CheckedIcon className={'ms-1'} />
            )}
          </div>

          <div className={'flex'}>
            <Section.ReactionItem
              icon={
                <Icon.Rating
                  type={RatingType.passion}
                  level={0}
                  onClick={() => onPassionChange(PassionLevel.NOT_FOR_ME)}
                />
              }
              label="Not For Me"
            />
            {passionReactions.includes(PassionLevel.NOT_FOR_ME) && (
              <Icon.CheckedIcon className={'ms-1'} />
            )}
          </div>
        </div>
      </Section>
      <Section className={'flex-1 ps-2'} title={<Section.Title>Importance</Section.Title>}>
        <div className="flex flex-col gap-3">
          <div className={'flex'}>
            <Section.ReactionItem
              icon={
                <Icon.Rating
                  type={RatingType.importance}
                  level={2}
                  onClick={() => onImportanceChange(ImportanceLevel.SUPER_HIGH)}
                />
              }
              label="Super High"
            />
            {importanceReactions.includes(ImportanceLevel.SUPER_HIGH) && (
              <Icon.CheckedIcon className={'ms-1'} />
            )}
          </div>
          <div className={'flex'}>
            <Section.ReactionItem
              icon={
                <Icon.Rating
                  type={RatingType.importance}
                  level={1}
                  onClick={() => onImportanceChange(ImportanceLevel.HAS_POTENTIAL)}
                />
              }
              label="Has Potential"
            />
            {importanceReactions.includes(ImportanceLevel.HAS_POTENTIAL) && (
              <Icon.CheckedIcon className={'ms-1'} />
            )}
          </div>
          <div className={'flex'}>
            <Section.ReactionItem
              icon={
                <Icon.Rating
                  level={0}
                  type={RatingType.importance}
                  onClick={() => onImportanceChange(ImportanceLevel.LOW)}
                />
              }
              label="Low"
            />
            {importanceReactions.includes(ImportanceLevel.LOW) && (
              <Icon.CheckedIcon className={'ms-1'} />
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}

export default ReactionsFilter
