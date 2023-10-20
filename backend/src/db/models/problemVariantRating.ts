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
  Validate,
  Index,
} from 'sequelize-typescript'
import {InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize'
import {User} from './user'
import {ProblemVariant} from './problemVariant'

@Table({tableName: 'problem_variant_ratings', underscored: true})
export class ProblemVariantRating extends Model<
  InferAttributes<ProblemVariantRating>,
  InferCreationAttributes<ProblemVariantRating>
> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id

  @AllowNull(false)
  @ForeignKey(() => ProblemVariant)
  @Index('unique_problem_variant_user_rating')
  @Column(DataType.UUIDV4)
  declare problemVariantId

  @AllowNull(false)
  @ForeignKey(() => User)
  @Index('unique_problem_variant_user_rating')
  @Column(DataType.UUIDV4)
  declare userId

  @AllowNull(false)
  @Column(DataType.TEXT)
  @Index('unique_problem_variant_user_rating')
  declare ratingType: string

  @AllowNull(false)
  @Validate({
    min: -1,
    max: 3,
  })
  @Column(DataType.INTEGER)
  declare rating: number

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare createdAt?: CreationOptional<Date>

  @UpdatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare updatedAt?: CreationOptional<Date>

  @DeletedAt
  @Column(DataType.DATE)
  declare deletedAt?: CreationOptional<Date>

  @BelongsTo(() => ProblemVariant)
  declare problemVariant?: ProblemVariant

  @BelongsTo(() => User)
  declare user?: User
}
