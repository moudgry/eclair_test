import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';

@Controller()
@ApiTags('Root')
export class AppController {
  @Get()
  @Public() // Mark as public route
  @ApiOperation({ summary: 'API Root Endpoint' })
  getRoot() {
    return {
      message: 'Welcome to Eclair Commerce API',
      documentation: '/api-docs',
      endpoints: {
        auth: '/auth',
        categories: '/api/categories',
        products: '/api/products'
      },
      status: 'running',
      timestamp: new Date().toISOString()
    };
  }

  /*
  @Get('api')
  @Redirect('/api-docs', 302)
  @ApiExcludeEndpoint()
  redirectToDocs() {
    // Redirects to Swagger UI
  }
  */


  @Get('api') // Specifically for /api
  @Public() // Also mark this as public
  getApiRoot() {
    return this.getRoot();
  }


  /*
  @Get('api')
  redirectToDocs(@Res() res: Response) {
    res.redirect('/api-docs');
  }
  */


}
