import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AppError } from "../utils";

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private errors = new Subject<AppError>();

  handleError(error: unknown): void {
    const appError = AppError.fromError(error);
    this.errors.next(appError);

    // Log to monitoring service
    this.logError(appError);
  }

  private logError(error: AppError): void {
    console.error('Application Error:', {
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString()
    });
  }

  getErrors(): Observable<AppError> {
    return this.errors.asObservable();
  }
}
