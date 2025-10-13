import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Address } from '@eclair_commerce/core';
import { Sequelize } from 'sequelize';

@Table({
  tableName: 'address',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class AddressModel extends Model<Address, Partial<Address>> implements Address {
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
