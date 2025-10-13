import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryModel } from '../models/category.model';
import { Category } from '@eclair_commerce/core';
import { Op } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel)
    private categoryRepository: typeof CategoryModel
  ) {}

  async create(category: Category): Promise<Category> {
    // Remove ID to prevent client from setting it
    const { id, ...createData } = category;
    const created = await this.categoryRepository.create(createData);
    return created.get({ plain: true }); // Convert to plain object
  }

  async findAll(): Promise<Category[]> {
    try {
      console.log('Fetching all categories...');
      const categories = await this.categoryRepository.findAll({
        order: [['name', 'ASC']] // Order by name for consistency
      });

      console.log(`Found ${categories.length} categories`);
      return categories.map(p => p.get({ plain: true }));
    } catch (error) {
      console.error('Error in findAll categories:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.findByPk(id);
    return category?.get({ plain: true }) || null;
  }

  async update(id: string, category: Category): Promise<[number, CategoryModel[]]> {
    return this.categoryRepository.update(category, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: string): Promise<number> {
    return this.categoryRepository.destroy({ where: { id } });
  }

  async searchCategories(query: string): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { slug: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    return categories.map(p => p.get({ plain: true }));
  }

  async findFeatured(): Promise<Category[]> {
    try {
      console.log('Fetching featured categories...');
      const categories = await this.categoryRepository.findAll({
        where: {
          isFeatured: true
        },
        order: [['sortOrder', 'ASC'], ['name', 'ASC']],
        limit: 10
      });

      console.log(`Found ${categories.length} featured categories`);
      return categories.map(p => p.get({ plain: true }));
    } catch (error) {
      console.error('Error in findFeatured categories:', error);
      throw error;
    }
  }
}
