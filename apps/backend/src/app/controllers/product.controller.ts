import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '@eclair_commerce/core';
import { Public } from '../decorators/public.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() product: Product): Promise<Product | null> {
    return this.productService.create(product);
  }

  @Get()
  @Public()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // Specific routes should come first
  @Get('search')
  async search(@Query('q') query: string): Promise<Product[]> {
    console.log('Product search endpoint called with query:', query);
    //return await this.productService.searchProducts(query);

    if (!query || query.trim().length === 0) {
      console.log('Empty query, returning all products');
      return this.productService.findAll();
    }

    try {
      const results = await this.productService.searchProducts(query);
      console.log('Search results count:', results.length);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw new HttpException('Search failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('featured')
  @Public()
  async findFeatured(): Promise<Product[]> {
    return this.productService.findFeatured();
  }

  @Get('new')
  @Public()
  async findNewArrivals(): Promise<Product[]> {
    return this.productService.findNewArrivals();
  }

  // Parameterized routes should come after specific routes
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    console.log('FindOne endpoint called with ID:', id);
    return this.productService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() product: Product
  ): Promise<[number, Product[]]> {
    return this.productService.update(id, product);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const count = await this.productService.remove(id);
    return { deleted: count > 0 };
  }
  /*
  @Get('debug/search-test')
  @Public()
  async debugSearchTest(): Promise<any> {
    // Test with a known product name
    const testQuery = 'name2'; // Replace with a product name that exists in your DB
    const results = await this.productService.searchProducts(testQuery);

    // Also get all products for comparison
    const allProducts = await this.productService.findAll();

    return {
      testQuery,
      resultsCount: results.length,
      allProductsCount: allProducts.length,
      results: results,
      allProducts: allProducts
    };
  }

  @Get('debug/search-test2')
  @Public()
  async debugSearchTest2(@Query('q') query: string): Promise<Product[]> {
    console.log('Product search endpoint called with query:', query);

    if (!query) {
      console.log('Empty query, returning all products');
      return this.productService.findAll();
    }

    // Test with a known product name
    const results = await this.productService.searchProducts(query);

    return results;
  }
  */
}
