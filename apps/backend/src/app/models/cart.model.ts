import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { Cart } from '@eclair_commerce/core';
import { CartItemModel } from './cart-item.model';
import { Sequelize } from 'sequelize';

@Table({
  tableName: 'carts',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class CartModel extends Model<Cart, Partial<Cart>> implements Cart {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @HasMany(() => CartItemModel)
  items: CartItemModel[];

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  total: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  subtotal: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  discount: number;

  @Column(DataType.STRING)
  couponCode: string;

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
