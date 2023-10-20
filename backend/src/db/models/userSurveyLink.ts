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
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { User } from './user'
import { ProblemSurvey } from './problemSurvey'

@Table({ tableName: 'user_survey_links', underscored: true })
export class UserSurveyLink extends Model<
  InferAttributes<UserSurveyLink>,
  InferCreationAttributes<UserSurveyLink>
> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.UUIDV4)
  declare userId

  @AllowNull(false)
  @ForeignKey(() => ProblemSurvey)
  @Column(DataType.UUIDV4)
  declare surveyId

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
}
