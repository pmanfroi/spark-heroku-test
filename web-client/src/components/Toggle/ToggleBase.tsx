import {VariantProps, cva} from 'class-variance-authority'

import cns from '@/utils/classnames'

import Item, {VariantsProps as ItemVariantsProps} from './ToggleItem'

const containerVariants = cva(
  'mx-2 flex items-center justify-center gap-0 rounded-md bg-neutral-700',
  {
    variants: {
      border: {
        default: '',
        neutral600: 'border border-neutral-600',
      },
    },
  }
)

export type VariantsProps = VariantProps<typeof containerVariants>

interface Props extends VariantsProps, ItemVariantsProps {
  children: React.ReactNode
  className?: string
}

const ToggleBase = ({children, border = 'default', className}: Props) => {
  return <div className={cns(containerVariants({border, className}))}>{children}</div>
}

export default Object.assign(ToggleBase, {
  Item,
})
