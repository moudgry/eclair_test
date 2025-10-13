// This file is used by Sequelize CLI, so we need to load .env here too .
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../../.env') });

const getDbConfig = (envPrefix) => {
  const ret = {
    username: process.env[`DB_USER_${envPrefix}`] || '',
    password: String(process.env[`DB_PASSWORD_${envPrefix}`] || ''),
    database: process.env[`DB_NAME_${envPrefix}`] || '',
    host: process.env[`DB_HOST_${envPrefix}`] || '',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    logging: console.log,
    dialect: process.env.DIALECT,
  };

  if(process.env.NODE_ENV === 'production') {
    return {
      ...ret,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    };
  } else {
    return ret;
  }
};

module.exports = {
  development: getDbConfig('DEV'),
  test: getDbConfig('TEST'),
  production: getDbConfig('PROD'),
};
