export class ValidationUtils {
  static isEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static isStrongPassword(password: string): boolean {
    return password.length >= 8;
  }
}
