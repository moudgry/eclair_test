import { UserAttributes } from '../app/models/user.model';
import { Model, WhereOptions } from 'sequelize';

declare module 'sequelize' {
  interface ModelStatic<T extends Model> {
    findOne(options?: {
      where?: WhereOptions<UserAttributes>;
      // Add other options as needed
    }): Promise<T | null>;
  }
}
