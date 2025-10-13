export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role: 'customer' | 'admin';
  lastLogin?: Date;
  resetOtp?: string;
  resetOtpExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SafeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role: 'customer' | 'admin';
}
