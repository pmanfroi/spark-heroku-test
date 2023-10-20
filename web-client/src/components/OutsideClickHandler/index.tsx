import React, {useRef} from 'react'

import useOutsideClick from '@/components/OutsideClickHandler/useOutsideClickHook'

interface Props {
  className?: string
  onClickOutside: () => void
  children: React.ReactNode
}

export default function OutsideClickHandler(props: Props) {
  const wrapperRef = useRef(null)
  useOutsideClick(wrapperRef, props.onClickOutside)

  return (
    <div className={props.className} ref={wrapperRef}>
      {props.children}
    </div>
  )
}
