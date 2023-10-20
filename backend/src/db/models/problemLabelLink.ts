import {
    Model,
    DataType,
    Column,
    Table,
    ForeignKey,
    AllowNull,
    CreatedAt,
    UpdatedAt,
  } from 'sequelize-typescript'
  import {InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize'
  import {User} from './user'
  import {Problem} from './problem'
  import {Label} from './label'
  
  @Table({tableName: 'problem_label_links', underscored: true})
  export class ProblemLabelLink extends Model<
    InferAttributes<ProblemLabelLink>,
    InferCreationAttributes<ProblemLabelLink>
  > {
    @Column({
      type: DataType.UUIDV4,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    declare id
  
    @AllowNull(false)
    @ForeignKey(() => Label)
    @Column(DataType.UUIDV4)
    declare labelId
  
    @AllowNull(false)
    @ForeignKey(() => Problem)
    @Column(DataType.UUIDV4)
    declare problemId
  
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
  }
  