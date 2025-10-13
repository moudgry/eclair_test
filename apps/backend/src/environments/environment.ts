const getDbConfig = (envPrefix: string) => {
  return {
    host: process.env[`DB_HOST_${envPrefix}`] || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env[`DB_USER_${envPrefix}`] || '',
    password: String(process.env[`DB_PASSWORD_${envPrefix}`] || ''),
    database: process.env[`DB_NAME_${envPrefix}`] || '',
  };
};

export const environment = {
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    dev: getDbConfig('DEV'),
    test: getDbConfig('TEST'),
    prod: getDbConfig('PROD'),
  },
  jwtSecret: process.env.JWT_SECRET || '',
  //jwtEpr: process.env.JWT_EPR || '1h',
  jwtEpr: parseInt(process.env.JWT_EPR) || 3600,
  apiPath: process.env.API_PATH || '/api',
  email: {
    service: process.env.EMAIL_SERVICE || '',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  }
};
