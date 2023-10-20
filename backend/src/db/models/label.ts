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
  BelongsToMany,
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from 'sequelize'
import { User } from './user'
import { Problem } from './problem'
import { ProblemLabelLink } from './problemLabelLink'

@Table({ tableName: 'labels', underscored: true })
export class Label extends Model<InferAttributes<Label>, InferCreationAttributes<Label>> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare name: string

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare bgColor: string

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare textColor: string

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

  @BelongsToMany(() => Problem, () => ProblemLabelLink)
  declare problems?: NonAttribute<Problem[]>
}
