import {
  Model,
  DataType,
  Column,
  Table,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { Problem } from './problem'
import { ProblemVariantRating } from './problemVariantRating'
import { ProblemSurvey } from './problemSurvey'
import { ProblemSurveyVote } from './problemSurveyVote'
import { UserSurveyLink } from './userSurveyLink'

@Table({ tableName: 'users', underscored: true })
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @Column(DataType.STRING)
  declare cognitoId

  @AllowNull(false)
  @Column(DataType.STRING)
  declare firstName: string

  @AllowNull(false)
  @Column(DataType.STRING)
  declare lastName: string

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare createdAt: CreationOptional<Date>

  @UpdatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare updatedAt: CreationOptional<Date>

  @DeletedAt
  @Column(DataType.DATE)
  declare deletedAt: CreationOptional<Date | null>

  @HasMany(() => Problem)
  declare problems: Problem[]

  @HasMany(() => ProblemVariantRating)
  declare problemVariantRatings?: ProblemVariantRating[]

  @HasMany(() => ProblemSurvey)
  declare problemSurveys?: ProblemSurvey[]

  @HasMany(() => ProblemSurveyVote)
  declare problemSurveysVotes?: ProblemSurveyVote[]

  @BelongsToMany(() => ProblemSurvey, () => UserSurveyLink, 'user_id')
  declare userSurveys?: ProblemSurvey[]
}
