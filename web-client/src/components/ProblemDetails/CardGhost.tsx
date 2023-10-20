interface Props {
  length: number
}

const CardGhost = ({length}: Props) => {
  const cn = {
    container: 'flex w-full animate-pulse flex-col items-center gap-20',
    titleContainer: 'flex flex-col items-center justify-center gap-4',
    title: 'flex h-4 w-40 rounded-md bg-neutral-700',
    subTitle: 'flex h-6 w-96 rounded-md bg-neutral-700',
    itemsContainer: 'flex max-h-full flex-col gap-4 overflow-y-scroll pb-10',
    item: 'flex h-28 gap-2',
    toolsLeft: 'w-10 rounded-md bg-neutral-700',
    card: 'w-96 rounded-md bg-neutral-700',
    toolsRight: 'w-10 rounded-md bg-neutral-700',
  }
  return (
    <div className={cn.container}>
      <div className={cn.titleContainer}>
        <div className={cn.title} />
        <div className={cn.subTitle} />
      </div>
      <div className={cn.itemsContainer}>
        {Array.from(new Array(length)).map((_, index) => (
          <div key={index} className={cn.item}>
            <div className={cn.toolsLeft} />
            <div className={cn.card} />
            {Math.floor(length / 2) === index ? <div className={cn.toolsRight} /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardGhost
