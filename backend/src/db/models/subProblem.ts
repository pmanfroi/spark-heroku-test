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
import {InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize'
import {User} from './user'
import {ProblemVariant} from './problemVariant'

@Table({tableName: 'sub_problems', underscored: true})
export class SubProblem extends Model<
  InferAttributes<SubProblem>,
  InferCreationAttributes<SubProblem>
> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @ForeignKey(() => ProblemVariant)
  @Column(DataType.UUIDV4)
  declare problemVariantId

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.UUIDV4)
  declare createdBy

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare order: number

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare content: string

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

  @BelongsTo(() => ProblemVariant, {
    foreignKey: 'problem_variant_id',
  })
  declare problemVariant?: ProblemVariant
}
