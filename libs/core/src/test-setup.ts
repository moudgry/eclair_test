import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
