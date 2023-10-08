import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { configService } from './config/typeorm.config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix(configService.getValue('APP_CONTEXT_PATH'));

  const port = process.env.PORT || configService.getValue('APP_PORT');

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
