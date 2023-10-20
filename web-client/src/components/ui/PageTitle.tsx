import cns from '@/utils/classnames'

//*****************************************************************************
// Interface
//*****************************************************************************
// for custom styling of page title
type ClassNamesShape = {
  text: string
  preText: string
  title: string
}
interface Props {
  title: string
  preText: string
  className?: string
  classNames?: ClassNamesShape
}
const defaultProps = {
  preText: '',
}
//*****************************************************************************
// Components
//*****************************************************************************
const PageTitle = ({title, preText, className, classNames}: Props) => {
  const cn = {
    root: cns('mb-6 pb-1 pr-1', className),
    title: cns(
      'text-2xl text-zinc-400',
      classNames === null || classNames === void 0 ? void 0 : classNames.title
    ),
    preText: cns(
      'text-sm text-zinc-500',
      classNames === null || classNames === void 0 ? void 0 : classNames.preText
    ),
  }
  return (
    <div className={cn.root}>
      {preText && <div className={cn.preText}>{preText}</div>}
      <div className={cn.title}>{title}</div>
    </div>
  )
}
PageTitle.defaultProps = defaultProps
export default PageTitle
