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
  HasMany,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'

import { User } from './user'
import { Problem } from './problem'
import { SubProblem } from './subProblem'
import { ProblemVariantRating } from './problemVariantRating'
import { ProblemSurveyVote } from './problemSurveyVote'

export enum ProblemVariantType {
  SUB_PROBLEM = 'SUB',
  NARROWER = 'NARROWER',
  BROADER = 'BROADER',
  ROOT = 'ROOT',
}

@Table({ tableName: 'problem_variants', underscored: true })
export class ProblemVariant extends Model<
  InferAttributes<ProblemVariant>,
  InferCreationAttributes<ProblemVariant>
> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @ForeignKey(() => Problem)
  @AllowNull(false)
  @Column({
    type: DataType.UUIDV4,
  })
  declare problemId

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare type: ProblemVariantType

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare createdBy

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order: number

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  declare content: string

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare isPreferred: boolean

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

  @BelongsTo(() => Problem, {
    foreignKey: 'problem_id',
  })
  declare problem?: Problem

  @HasMany(() => SubProblem)
  declare subProblems?: SubProblem[]

  @HasMany(() => ProblemVariantRating)
  declare ratings?: ProblemVariantRating[]

  @BelongsTo(() => ProblemSurveyVote, {
    foreignKey: 'id',
  })
  declare problemSurveyVote?: ProblemSurveyVote
}
