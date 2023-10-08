import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const ORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  logging: true,
  migrations: [getMigrationDirectory()],
  subscribers: ['src/subscribers/**/*.ts'],
  migrationsRun: false,
  synchronize: true,
};

function getMigrationDirectory() {
  const directory =
    process.env.NODE_ENV === 'migrations' ? 'src' : `${__dirname}`;
  return `${directory}/migrations/**/*{.ts,.js}`;
}

module.exports = ORMConfig;
