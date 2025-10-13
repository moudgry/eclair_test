import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Skip auth for public routes
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    //const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const request = context.switchToHttp().getRequest();
    const path = request.path;
    const method = request.method;

    // Define public routes with method-specific access
    const publicRoutes = [
      { path: /^\/?$/, methods: ['GET'] },
      { path: /^\/api\/?$/, methods: ['GET'] },
      { path: /^\/api-docs(\/.*)?$/, methods: ['GET'] },
      { path: /^\/api\/auth\/login$/, methods: ['POST'] },
      { path: /^\/api\/auth\/register$/, methods: ['POST'] },
      { path: /^\/api\/auth\/request-reset$/, methods: ['POST'] },
      { path: /^\/api\/auth\/verify-otp$/, methods: ['POST'] },
      { path: /^\/api\/auth\/reset-password$/, methods: ['POST'] },
      //{ path: /^\/api\/products$/, methods: ['GET'] },
      //{ path: /^\/api\/products\/search$/, methods: ['GET'] },
      //{ path: /^\/api\/products\/[^/]+$/, methods: ['GET'] },
      //{ path: /^\/api\/categories$/, methods: ['GET'] },
      //{ path: /^\/api\/categories\/search$/, methods: ['GET'] },
      //{ path: /^\/api\/categories\/[^/]+$/, methods: ['GET'] }
    ];

    // Check if route matches any public pattern and method
    const isPublicRoute = publicRoutes.some(route =>
      route.path.test(path) && route.methods.includes(method)
    );

    if (isPublicRoute) {
      return true;
    }

    // Extract token from header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header is missing or invalid');
    }

    // Add rate limiting and additional security checks
    /*
    const rateLimiter = new RateLimiterMemory({
      points: 5, // 5 attempts
      duration: 60, // per 60 seconds
    });

    // Add to canActivate method:
    const rateLimitResult = await rateLimiter.get(req.ip);
    if (rateLimitResult !== null && rateLimitResult.consumedPoints > 5) {
      throw new TooManyRequestsException('Too many authentication attempts');
    }
    */

    const token = authHeader.split(' ')[1];
    try {
      // Verify token and attach user to request
      const payload = this.jwtService.verify(token, { secret: environment.jwtSecret });
      console.log('Token payload:', payload);
      // Attach user to request
      request.user = {
        id: payload.userId,  // Match the payload structure
        email: payload.email,
        role: payload.role
        //firstName: '',
        //lastName: '',
        //password: '',
        //role: 'customer',
      };
      return true;
    } catch (error) {
      console.error('JWT verification error:', error);
      console.error('Token content:', this.jwtService.decode(token)); // Log invalid token
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
