import {useNavigate} from 'react-router-dom'

import {ProblemType, Tag, UserRating} from '@/rest/types'

import Card from './Card'

export interface Props extends Omit<ProblemType, 'tags'> {
  tags?: Tag[]
  content: string
  userRating: UserRating
  perspective?: string
}

const ProblemCard = ({
  title,
  status,
  tags = [],
  publicId,
  content,
  userRating,
  preferredVariantId,
  perspective,
}: Props) => {
  const navigate = useNavigate()
  const {favorite, passion, importance} = userRating as UserRating

  return (
    <Card>
      <Card.Header
        title={title}
        onTitleClick={() => navigate(`/problem-details/${publicId}`)}
        description={content}
        passion={passion}
        importance={importance}
        favorite={favorite}
        preferredVariantId={preferredVariantId}
        problemPublicId={publicId}
        perspective={perspective}
      />
      {status || publicId || tags?.length ? (
        <Card.Footer status={status} publicId={publicId} tags={tags} />
      ) : null}
    </Card>
  )
}

export default ProblemCard
