import { Table, Model, Column, DataType, HasOne } from 'sequelize-typescript';
import { User } from '@eclair_commerce/core';
import { CartModel } from './cart.model';
import { Sequelize } from 'sequelize';

// Declare additional properties not in core interface
export interface UserAttributes extends User {
//  resetOtp?: string | null;
//  resetOtpExpiry?: Date | null;
}

@Table({
  tableName: 'users' ,
  indexes: [
    { fields: ['email'] },
    { fields: ['resetOtp'] },
  ],
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class UserModel extends Model<User, Partial<User>> implements User {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  // Add more detailed validation messages
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "First name is required" },
      notEmpty: { msg: "First name cannot be empty" }
    }
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column(DataType.STRING)
  phone: string;

  @Column(DataType.TEXT)
  address: string;

  @Column(DataType.STRING)
  city: string;

  @Column(DataType.STRING)
  state: string;

  @Column(DataType.STRING)
  zipCode: string;

  @Column(DataType.STRING)
  country: string;

  @Column({
    type: DataType.ENUM('customer', 'admin'),
    defaultValue: 'customer',
  })
  role: 'customer' | 'admin';

  @Column(DataType.DATE)
  lastLogin: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resetOtp: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resetOtpExpiry: Date | null;

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

  @HasOne(() => CartModel)
  cart: CartModel;
}
