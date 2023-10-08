// src/config/config.service.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USERNAME'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: [__dirname + this.getValue('POSTGRES_ENTITIES')],
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  //PostgreSQL DATABASE
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USERNAME',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'POSTGRES_SYNCHRONIZE',
  'POSTGRES_ENTITIES',

  //APPLICATION
  'APP_NAME',
  'APP_SCHEME',
  'APP_HOST',
  'APP_PORT',
  'APP_CONTEXT_PATH',
  'APP_BANNER',
  'APP_MODE',

  //LOGGING
  'LOG_LEVEL',
  'LOG_OUTPUT',

  //PATH STRUCTRUE
  'POSTGRES_ENTITIES',
  'POSTGRES_ENTITIES_DIR',

  //Jwt
  'JWT_SECRET',
  'JWT_VALIDITY',

  //Encryption
  'ENCRYPTION_KEY',
  'IV_LENGTH',

  //Verification
  'VERIFICATION_CODE_VALIDITY',
]);

export { configService };
