import {
  Model,
  DataType,
  Column,
  Table,
  ForeignKey,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { User } from './user'
import { SurveyStatus, surveyStatusList } from '../../types'
import { UserSurveyLink } from './userSurveyLink'
import { ProblemSurveyLink } from './problemSurveyLink'
import { ProblemSurveyVote } from './problemSurveyVote'

@Table({ tableName: 'problem_surveys', underscored: true })
export class ProblemSurvey extends Model<
  InferAttributes<ProblemSurvey>,
  InferCreationAttributes<ProblemSurvey>
> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare title: string

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare description: string

  @AllowNull(false)
  @Column(DataType.ENUM(...surveyStatusList))
  declare status: SurveyStatus

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare active

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.UUIDV4)
  declare ownedBy

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.UUIDV4)
  declare createdBy

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
  declare deletedAt: CreationOptional<Date>

  @HasMany(() => UserSurveyLink)
  declare users?: UserSurveyLink[]

  @HasMany(() => ProblemSurveyLink)
  declare problems?: ProblemSurveyLink[]

  @HasMany(() => ProblemSurveyVote)
  declare votes?: ProblemSurveyVote[]
}
