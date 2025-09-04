import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration - Solo para User y Role schemas
  const config = new DocumentBuilder()
    .setTitle('Report Card API')
    .setDescription('API documentation for User and Role management')
    .setVersion('1.0')
    .addTag('Users', 'User management endpoints')
    .addTag('Roles', 'Role management endpoints')
    .build();

  // Crear documento solo con los módulos de Users y Roles
  const document = SwaggerModule.createDocument(app, config, {
    include: [UsersModule, RolesModule],
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger documentation available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
void bootstrap();
