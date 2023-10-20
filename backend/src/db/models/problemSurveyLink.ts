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
  BelongsTo,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { Problem } from './problem'
import { ProblemSurvey } from './problemSurvey'

@Table({ tableName: 'problem_survey_links', underscored: true })
export class ProblemSurveyLink extends Model<
  InferAttributes<ProblemSurveyLink>,
  InferCreationAttributes<ProblemSurveyLink>
> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @ForeignKey(() => Problem)
  @Column(DataType.UUIDV4)
  declare problemId

  @AllowNull(false)
  @ForeignKey(() => ProblemSurvey)
  @Column(DataType.UUIDV4)
  declare problemSurveyId

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

  @BelongsTo(() => Problem)
  declare problem?: Problem

  @BelongsTo(() => ProblemSurvey)
  declare problemSurvey?: ProblemSurvey
}
