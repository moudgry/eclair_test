import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../models/user.model';
import { User } from '@eclair_commerce/core';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userRepository: typeof UserModel
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users.map(p => p.get({ plain: true }));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findByPk(id);
    return user?.get({ plain: true }) || null;
  }

  async searchUsers(query: string): Promise<User[]> {
    const users = await this.userRepository.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    return users.map(p => p.get({ plain: true }));
  }
}
