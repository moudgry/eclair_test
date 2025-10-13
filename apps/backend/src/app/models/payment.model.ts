import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Payment } from '@eclair_commerce/core';
import { Sequelize } from 'sequelize';

@Table({
  tableName: 'payment',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class PaymentModel extends Model<Payment, Partial<Payment>> implements Payment {
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
