import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Category } from '@eclair_commerce/core';
import { Sequelize } from 'sequelize';

@Table({
  tableName: 'categories',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class CategoryModel extends Model<Category, Partial<Category>> implements Category {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  slug: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.STRING)
  imageUrl: string;

  @ForeignKey(() => CategoryModel)
  @Column(DataType.UUID)
  parentId: string;

  @BelongsTo(() => CategoryModel, 'parentId')
  parent: CategoryModel;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isFeatured: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  sortOrder: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  updatedAt: Date | null;
}
