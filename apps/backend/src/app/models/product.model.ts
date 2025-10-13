import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from '@eclair_commerce/core';
import { CategoryModel } from './category.model';
import { Sequelize } from 'sequelize';

@Table({
  tableName: 'products',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class ProductModel extends Model<Product, Partial<Product>> implements Product {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  sku: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  discount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  originalPrice: number;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.STRING)
  shortDescription: string;

  @Column(DataType.STRING)
  imageUrl: string;

  @Column(DataType.ARRAY(DataType.STRING))
  gallery: string[];

  @ForeignKey(() => CategoryModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  categoryId: string;

  @BelongsTo(() => CategoryModel)
  category: CategoryModel;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  stock: number;

  @Column(DataType.FLOAT)
  weight: number;

  @Column(DataType.STRING)
  dimensions: string;

  @Column(DataType.FLOAT)
  rating: number;

  @Column(DataType.INTEGER)
  reviewCount: number;

  @Column(DataType.ARRAY(DataType.STRING))
  tags: string[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isFeatured: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

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
