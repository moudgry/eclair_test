import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from '@eclair_commerce/core';
import { UserModel } from './user.model';
import { Sequelize } from 'sequelize';

@Table({
  tableName: 'orders',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class OrderModel extends Model<Order, Partial<Order>> implements Order {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  orderNumber: string;

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
  tax: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  shipping: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  discount: number;

  @Column(DataType.STRING)
  couponCode: string;

  @Column({
    type: DataType.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending',
  })
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  paymentMethod: string;

  @Column({
    type: DataType.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  })
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';

  @Column(DataType.TEXT)
  shippingAddress: string;

  @Column(DataType.TEXT)
  billingAddress: string;

  @Column(DataType.STRING)
  trackingNumber: string;

  @Column(DataType.DATE)
  estimatedDelivery: Date;

  @Column(DataType.TEXT)
  notes: string;

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
