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
  AutoIncrement,
  HasMany,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { User } from './user'
import { ProblemVariant } from './problemVariant'
import { ProblemStatus, statusTypeList } from '../../types'
import { ProblemCategoryLink } from './problemCategoryLink'
import { ProblemCategory } from './problemCategory'
import { ProblemLabelLink } from './problemLabelLink'
import { Label } from './label'
import { ProblemSurvey } from './problemSurvey'
import { ProblemSurveyLink } from './problemSurveyLink'
import { ProblemSurveyVote } from './problemSurveyVote'

@Table({ tableName: 'problems', underscored: true })
export class Problem extends Model<InferAttributes<Problem>, InferCreationAttributes<Problem>> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare publicId: CreationOptional<number>

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare title: string

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare createdBy

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare ownedBy

  @AllowNull(false)
  @Column(DataType.ENUM(...statusTypeList))
  declare status: ProblemStatus

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

  @HasMany(() => ProblemVariant)
  declare problemVariants?: ProblemVariant[]

  @BelongsTo(() => User)
  declare user?: User

  @BelongsToMany(() => ProblemCategory, () => ProblemCategoryLink, 'problem_id')
  declare categories?: ProblemCategory[]

  @BelongsToMany(() => Label, () => ProblemLabelLink, 'problem_id')
  declare labels?: Label[]

  @BelongsToMany(() => ProblemSurvey, () => ProblemSurveyLink, 'problem_id')
  declare problemSurveys?: ProblemSurvey[]

  @BelongsTo(() => ProblemSurveyVote, {
    foreignKey: 'id',
  })
  declare problemSurveyVote?: ProblemSurveyVote
}
