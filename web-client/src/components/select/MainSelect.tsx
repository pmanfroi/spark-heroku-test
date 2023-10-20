import React from 'react'
import Select from 'react-tailwindcss-select'

import {ParentButtonPropsShape} from '@/components/buttons/Button'
import cns from '@/utils/classnames'

export interface Entry {
  value: string
  label: string
  disabled?: boolean
}

export interface Props {
  label: string
  placeholder: string
  entries: Entry[]
  activeEntryValue: string | number
  activeEntryValues: string[] | undefined
  onChange: (e) => void
  disabled?: boolean
  loading: boolean
  parentButtonProps?: ParentButtonPropsShape
  isMultiple: boolean
  classNames: {
    mainDiv?: string
    menuButton?: string
    label?: string
    list?: string
    menu?: string
  }
}

const defaultProps = {
  label: 'Label',
  placeholder: 'Select Value',
  entries: [],
  activeEntryValue: null,
  activeEntryValues: null,
  disabled: false,
  loading: false,
  parentButtonProps: {},
  isMultiple: false,
  classNames: {
    mainDiv: '',
    menuButton: '',
    label: '',
    list: '',
    menu: '',
  },
}

//*****************************************************************************
// Components
// Component is using svg image from assets folder
//*****************************************************************************
const MainSelect = function (props: Props) {
  const selectedEntry = props.activeEntryValue
    ? props.entries.find((e) => e.value === props.activeEntryValue)
    : null
  const selectedEntries = props.activeEntryValues
    ? props.entries.filter((e) => props.activeEntryValues?.find((a) => a === e.value))
    : null

  const cn = {
    menuButton: cns(
      'flex w-48 rounded border border-neutral-600 bg-neutral-900 text-sm text-neutral-400',
      props.disabled && 'cursor-not-allowed',
      props.classNames.menuButton
    ),
    menu: cns(
      'absolute z-10 mt-1.5 w-48 rounded bg-neutral-800 text-sm text-neutral-400',
      props.classNames.menu
    ),
    list: cns('rounded py-2 [&>*]:px-0', props.classNames.list),
    listItemDefault:
      'py-1 cursor-pointer ps-2 hover:bg-app-yellow hover:text-black marker:text-neutral-800 hover:marker:text-app-yellow',
    listItemSelected:
      'list-image-[url(@/assets/select-checked-icon.svg)] hover:list-image-[url(@/assets/select-checked-icon-black.svg)]',
    label: cns('mb-1 text-xs text-neutral-400', props.classNames.label),
  }

  return (
    <div className={props.classNames?.mainDiv}>
      <div className={cn.label}>{props.label}</div>
      <Select
        isMultiple={props.isMultiple}
        primaryColor={''}
        loading={props.loading}
        placeholder={props.placeholder}
        value={selectedEntry || selectedEntries || null}
        isDisabled={props.disabled}
        onChange={props.onChange}
        options={props.entries}
        classNames={{
          menuButton: () => cn.menuButton,
          menu: cn.menu,
          list: cn.list,
          listItem: (value?: {isSelected?: boolean}) =>
            `${cn.listItemDefault} ${value?.isSelected && cn.listItemSelected}`,
        }}
      />
    </div>
  )
}

MainSelect.defaultProps = defaultProps
export default MainSelect
