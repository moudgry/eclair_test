declare module '@env' {
  export const environment = {
    NODE_ENV: string,
    PORT: number,
    URL: string,
    DB_DRIVER: string,
    DIALECT: string,
    DB_PORT: number,
    BCRYPT_PASSWORD: string,
    SALT_ROUNDS: number,
    JWT_SECRET: string,

    DB_USER_DEV: string,
    DB_PASSWORD_DEV: string,
    DB_HOST_DEV: string,
    DB_NAME_DEV: string,

    DB_USER_TEST: string,
    DB_PASSWORD_TEST: string,
    DB_HOST_TEST: string,
    DB_NAME_TEST: string,

    DB_USER_PROD: string,
    DB_PASSWORD_PROD: string,
    DB_HOST_PROD: string,
    DB_NAME_PROD: string,

    NX_API_URL: string
  };
}
