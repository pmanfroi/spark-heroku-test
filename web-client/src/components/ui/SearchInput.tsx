import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import React from 'react'

import CloseIcon from '@/components/icons/CloseIcon.js'
import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  value?: string
  className?: string
  placeholder?: string
}

//*****************************************************************************
// Components
//*****************************************************************************
const SearchInput = ({className, onChange, onCancel, value = '', placeholder}: Props) => {
  const cn = {
    root: cns('flex items-center justify-between', className),
    searchIcon: 'w-6 h-6',
    searchBar: 'flex border items-center border-zinc-600 py-1 px-1 w-full rounded-md bg-white/5',
    text: 'flex-1 pl-3 bg-white/0 focus:outline-none',
    resetIcon: ' mx-1 w-6 h-6',
  }
  return (
    <div className={cn.root}>
      <div className={cn.searchBar}>
        <MagnifyingGlassIcon className={cn.searchIcon} />
        <input
          value={value}
          placeholder={placeholder || 'Search'}
          onChange={onChange}
          className={cn.text}
        />
        <CloseIcon onClick={onCancel} className={cn.resetIcon} />
      </div>
    </div>
  )
}
export default SearchInput
