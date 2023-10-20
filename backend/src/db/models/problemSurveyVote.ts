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
  Unique,
  BelongsTo,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { User } from './user'
import { ProblemSurvey } from './problemSurvey'
import { Problem } from './problem'
import { ProblemVariant } from './problemVariant'

@Table({ tableName: 'problem_survey_votes', underscored: true })
export class ProblemSurveyVote extends Model<
  InferAttributes<ProblemSurveyVote>,
  InferCreationAttributes<ProblemSurveyVote>
> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare vote: number

  @AllowNull(false)
  @ForeignKey(() => ProblemSurvey)
  @Column(DataType.UUIDV4)
  declare problemSurveyId

  @AllowNull(false)
  @ForeignKey(() => Problem)
  @Column(DataType.UUIDV4)
  declare problemId

  @AllowNull(false)
  @ForeignKey(() => ProblemVariant)
  @Unique('problemVariantId-createdBy')
  @Column(DataType.UUIDV4)
  declare problemVariantId

  @AllowNull(false)
  @ForeignKey(() => User)
  @Unique('problemVariantId-createdBy')
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

  @BelongsTo(() => User)
  declare user?: User

  @BelongsTo(() => ProblemSurvey)
  declare problemSurvey?: ProblemSurvey

  @BelongsTo(() => ProblemVariant)
  declare problemVariant?: ProblemVariant

  @BelongsTo(() => Problem)
  declare problem?: Problem
}
