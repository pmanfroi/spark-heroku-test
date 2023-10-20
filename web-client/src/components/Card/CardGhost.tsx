const cn = {
  container:
    'flex h-[12rem] w-60 animate-pulse flex-col justify-between overflow-hidden rounded-md bg-neutral-600',
  header: 'flex justify-between p-4 pb-0',
  title: 'h-6 w-1/2 rounded-md bg-neutral-700',
  reactions: 'h-6 w-1/3 rounded-md bg-neutral-700',
  descriptionContainer: 'flex flex-col gap-2 p-3 mb-1',
  descriptionLong: 'h-2 rounded-md bg-neutral-700',
  descriptionShort: 'h-2 w-1/2 rounded-md bg-neutral-700',
  footer: 'flex h-[4rem] justify-between rounded-md bg-neutral-800 p-4',
  statusContainer: 'flex w-30 flex-col gap-2',
  status: 'h-6 w-20 rounded-md bg-neutral-700',
  tags: 'h-6 rounded-md bg-neutral-700 mt-1',
  id: 'h-6 w-10 rounded-md bg-neutral-700',
}

const CardGhost = () => {
  return (
    <div className={cn.container}>
      <div className={cn.header}>
        <div className={cn.title} />
        <div className={cn.reactions} />
      </div>
      <div className={cn.descriptionContainer}>
        <div className={cn.descriptionLong} />
        <div className={cn.descriptionShort} />
      </div>
      <div className={cn.footer}>
        <div className={cn.statusContainer}>
          <div className={cn.status} />
          <div className={cn.tags} />
        </div>
        <div className={cn.id} />
      </div>
    </div>
  )
}

export default CardGhost
