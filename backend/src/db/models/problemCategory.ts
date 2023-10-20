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
import {InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute} from 'sequelize'
import {User} from './user'
import {Problem} from './problem'
import {ProblemCategoryLink} from './problemCategoryLink'

@Table({tableName: 'problem_categories', underscored: true})
export class ProblemCategory extends Model<
  InferAttributes<ProblemCategory>,
  InferCreationAttributes<ProblemCategory>
> {
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
  declare description: string

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

  @BelongsToMany(() => Problem, () => ProblemCategoryLink)
  declare problems?: NonAttribute<Problem[]>
}
