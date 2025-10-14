//import pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from '../app/models/user.model';
import { ProductModel } from '../app/models/product.model';
import { CartModel } from '../app/models/cart.model';
import { CartItemModel } from '../app/models/cart-item.model';
import { OrderModel } from '../app/models/order.model';
import { OrderItemModel } from '../app/models/order-item.model';
import { CategoryModel } from '../app/models/category.model';
import { Dialect } from 'sequelize';

const getDbConfig = () => {
  let envPrefix;
  if(process.env.NODE_ENV === 'development') {
    envPrefix = 'DEV';
  } else if(process.env.NODE_ENV === 'test') {
    envPrefix = 'TEST';
  } else {
    envPrefix = 'PROD';
  }
  const ret = {
    host: process.env[`DB_HOST_${envPrefix}`] || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env[`DB_USER_${envPrefix}`] || '',
    password: String(process.env[`DB_PASSWORD_${envPrefix}`] || ''),
    database: process.env[`DB_NAME_${envPrefix}`] || '',
    dialect: process.env.DIALECT as Dialect,
  };

  if(process.env.NODE_ENV === 'production') {
    return {
      ...ret,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    };
  } else {
    return ret;
  }
};

export const sequelize = new Sequelize({
  ...getDbConfig(),
  //dialectModule: pg,
  models: [UserModel, CategoryModel, ProductModel, CartModel, CartItemModel, OrderModel, OrderItemModel],
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3,
      timeout: 3000
    }
});

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    /*
    // Test a simple query
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM products');
    const count = (results[0] as { count: string }).count;
    console.log('Total products in database:', count);
    */

    /*
    // Test category queries
    const [results1] = await sequelize.query('SELECT COUNT(*) as count FROM categories');
    const count1 = (results1[0] as { count: string }).count;
    console.log('Total categories in database:', count1);

    const [results2] = await sequelize.query('SELECT COUNT(*) as count FROM categories WHERE "isFeatured" = true');
    const count2 = (results2[0] as { count: string }).count;
    console.log('Featured categories in database:', count2);
    */

    if (process.env.NODE_ENV === 'development') {
      //await sequelize.sync({ alter: true });
    } else if (process.env.NODE_ENV === 'test') {
      //await sequelize.sync({ force: true });
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}
