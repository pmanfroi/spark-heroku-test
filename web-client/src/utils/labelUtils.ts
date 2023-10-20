import {Option} from '@/components/select/FilterSelect'
import {Entry} from '@/components/select/MainSelect'
import {Label, ProblemType, Tag} from '@/rest/types'

export const getLabelOptions = (labels: Label[]): Option[] => {
  return labels.map((label) => ({
    label: label.name,
    value: label.id,
    bgColor: label.bgColor,
    textColor: label.textColor,
  }))
}

export const getTags = (problem: ProblemType): Tag[] => {
  return (
    problem.labels?.map((l) => {
      return {
        bgColor: l.bgColor,
        textColor: l.textColor,
        id: l.id,
        label: l.name,
      }
    }) || []
  )
}

export const getLabelEntries = (labels: Label[]): Entry[] => {
  return labels.map((label) => ({
    label: label.name,
    value: label.id,
  }))
}
