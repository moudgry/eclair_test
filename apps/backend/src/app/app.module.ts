import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthGuard } from './guards/auth.guard';
import { AuthController } from './controllers/auth.controller';
import { ProductController } from './controllers/product.controller';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import { UserModel } from './models/user.model';
import { ProductModel } from './models/product.model';
import { CartModel } from './models/cart.model';
import { CartItemModel } from './models/cart-item.model';
import { environment } from '../environments/environment';
import { AppController } from './controllers/app.controller';
import { OrderModel } from './models/order.model';
import { OrderItemModel } from './models/order-item.model';
import { CategoryModel } from './models/category.model';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { UserService } from './services/user.service';
import { ProfileController } from './controllers/profile.controller';
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

@Module({
  imports: [
    ServeStaticModule.forRoot({
          //rootPath: join(__dirname, '..', 'public'), // Path to your public directory
          rootPath: join(__dirname, '..', 'assets'), // Path to your assets directory
    }),
    // Proper Sequelize configuration
    SequelizeModule.forRoot({
      ...getDbConfig(),
      models: [
        UserModel,
        ProductModel,
        CategoryModel,
        CartModel,
        CartItemModel,
        OrderModel,
        OrderItemModel
      ],
      autoLoadModels: true, // Automatically load models
      synchronize: false, // Disable in production, use migrations
    }),
    // Feature module for repositories
    SequelizeModule.forFeature([
      UserModel,
      ProductModel,
      CategoryModel,
      CartModel,
      CartItemModel,
      OrderModel,
      OrderItemModel
    ]),
    JwtModule.register({
      secret: environment.jwtSecret,
      signOptions: { expiresIn: environment.jwtEpr },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    ProductController,
    CategoryController,
    ProfileController
  ],
  providers: [
    AuthService,
    ProductService,
    CategoryService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    Reflector, // Add Reflector service
  ],
})
export class AppModule {}
