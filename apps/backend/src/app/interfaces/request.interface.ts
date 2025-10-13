import { Request } from 'express';
import { User } from '@eclair_commerce/core';

export interface AuthenticatedRequest extends Request {
  user?: User;
}
