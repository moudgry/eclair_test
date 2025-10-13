import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { Category } from '@eclair_commerce/core';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../decorators/public.decorator';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { UserService } from '../services/user.service';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly userService: UserService) {}

  @Post()
  async create(@Body() category: Category): Promise<Category | null> {
    return this.categoryService.create(category);
  }

  @Get()
  @Public()
  async findAll(@Query('search') search?: string): Promise<Category[]> {
    console.log('Categories endpoint called with search:', search);

    try {
      if (search) {
        return this.categoryService.searchCategories(search);
      }
      return this.categoryService.findAll();
    } catch (error) {
      console.error('Error in categories endpoint:', error);
      throw new HttpException('Failed to fetch categories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Specific routes should come first
  @Get('search')
  async search(@Query('q') query: string): Promise<Category[]> {
    return this.categoryService.searchCategories(query);
  }

  @Get('featured')
  @Public()
  async findFeatured(): Promise<Category[]> {
    console.log('Featured categories endpoint called');

    try {
      return this.categoryService.findFeatured();
    } catch (error) {
      console.error('Error in featured categories endpoint:', error);
      throw new HttpException('Failed to fetch featured categories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('debug')
  //@Public()
  async debug(): Promise<any> {
    try {
      const allCategories = await this.categoryService.findAll();
      const featuredCategories = await this.categoryService.findFeatured();

      return {
        allCategoriesCount: allCategories.length,
        featuredCategoriesCount: featuredCategories.length,
        allCategories: allCategories,
        featuredCategories: featuredCategories
      };
    } catch (error) {
      console.error('Debug endpoint error:', error);
      throw new HttpException('Debug failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Parameterized routes should come after specific routes
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoryService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() category: Category
  ): Promise<[number, Category[]]> {
    return this.categoryService.update(id, category);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const count = await this.categoryService.remove(id);
    return { deleted: count > 0 };
  }
}
