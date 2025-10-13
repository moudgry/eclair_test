export abstract class EnvironmentService {

  constructor() {}

  abstract get apiUrl(): string;

  abstract get useExpirationWarning(): boolean;
}
