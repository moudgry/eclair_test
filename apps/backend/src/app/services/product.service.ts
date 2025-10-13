import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from '../models/product.model';
import { Product } from '@eclair_commerce/core';
import { Op } from 'sequelize';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private productRepository: typeof ProductModel
  ) {}

  async create(product: Product): Promise<Product> {
    // Remove ID to prevent client from setting it
    const { id, ...createData } = product;
    const created = await this.productRepository.create(createData);
    return created.get({ plain: true }); // Convert to plain object
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return products.map(p => {
      const plainProduct = p.get({ plain: true });
      return this.calculateProductDiscount(plainProduct);
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.productRepository.findByPk(id);
    const plainProduct = product?.get({ plain: true }) || null;
    return this.calculateProductDiscount(plainProduct);
  }

  async update(id: string, product: Product): Promise<[number, ProductModel[]]> {
    return this.productRepository.update(product, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: string): Promise<number> {
    return this.productRepository.destroy({ where: { id } });
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      console.log('Searching products with query:', query);

      const products = await this.productRepository.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },
            { shortDescription: { [Op.iLike]: `%${query}%` } },
            { sku: { [Op.iLike]: `%${query}%` } },
            { tags: { [Op.overlap]: [query] } } // Use overlap for array searching
          ]
        }
      });

      console.log('Found products:', products.length);
      return products.map(p => {
        const plainProduct = p.get({ plain: true });
        return this.calculateProductDiscount(plainProduct);
      });
    } catch (error) {
      console.error('Error in product search:', error);
      throw error;
    }
  }

  private calculateProductDiscount(product: any): any {
    /*if (product.salePrice && product.salePrice < product.price) {
      const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
      return {
        ...product,
        discount,
        originalPrice: product.price,
        price: product.salePrice
      };
    }*/
    return product;
  }

  async findFeatured(): Promise<Product[]> {
    const products = await this.productRepository.findAll({
      where: {
        isFeatured: true,
        isActive: true
      },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    return products.map(p => p.get({ plain: true }));
  }

  async findNewArrivals(): Promise<Product[]> {
    const products = await this.productRepository.findAll({
      where: {
        isActive: true
      },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    return products.map(p => p.get({ plain: true }));
  }
}
