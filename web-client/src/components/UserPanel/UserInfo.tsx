interface Props {
  firstName: string
  lastName: string
  email: string
}

const cn = {
  name: 'text-white text-sm',
  email: 'text-neutral-600 text-xs',
}
const UserInfo = (props: Props) => {
  const {firstName, lastName, email} = props
  return (
    <div>
      <p className={cn.name}>
        {firstName} {lastName}
      </p>
      <p className={cn.email}>{email}</p>
    </div>
  )
}

export default UserInfo
