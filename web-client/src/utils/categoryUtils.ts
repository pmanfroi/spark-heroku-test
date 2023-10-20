import {Option} from '@/components/select/FilterSelect'
import {Entry} from '@/components/select/MainSelect'
import {Category} from '@/rest/types'

export const getCategoryEntries = (categories: Category[]): Entry[] => {
  return categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))
}

export const getCategoryOptions = (categories: Category[]): Option[] => {
  return categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))
}
