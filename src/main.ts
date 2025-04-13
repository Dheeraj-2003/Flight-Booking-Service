import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  //config
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  //Filters
  app.useGlobalFilters(new AllExceptionFilter())

  //Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen(port);
  console.log(`App is running on PORT:${port}`);
}
bootstrap();
