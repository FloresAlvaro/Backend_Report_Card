import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Development Swagger Configuration - Shows all DTOs and modules
  const devConfig = new DocumentBuilder()
    .setTitle('Report Card API - Development')
    .setDescription(
      'Complete API documentation for development and testing - includes all DTOs and endpoints',
    )
    .setVersion('1.0')
    .addTag('Users', 'User management endpoints')
    .addTag('Roles', 'Role management endpoints')
    .addTag('App', 'Application endpoints')
    .build();

  // Create full document with all modules for development
  const devDocument = SwaggerModule.createDocument(app, devConfig);
  SwaggerModule.setup('api/dev', app, devDocument);

  // Public/Clean Swagger Configuration - Only User and Role schemas
  const publicConfig = new DocumentBuilder()
    .setTitle('Report Card API')
    .setDescription('Clean API documentation for User and Role management')
    .setVersion('1.0')
    .addTag('Users', 'User management endpoints')
    .addTag('Roles', 'Role management endpoints')
    .build();

  // Create clean document only with Users and Roles modules
  const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
    include: [UsersModule, RolesModule],
  });

  // Filter out unwanted schemas from public documentation
  if (publicDocument.components?.schemas) {
    const allowedSchemas = ['User', 'Role'];
    const filteredSchemas: Record<string, any> = {};

    for (const schemaName of allowedSchemas) {
      if (publicDocument.components.schemas[schemaName]) {
        filteredSchemas[schemaName] =
          publicDocument.components.schemas[schemaName];
      }
    }

    publicDocument.components.schemas = filteredSchemas;
  }

  SwaggerModule.setup('api', app, publicDocument);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Development Swagger (all DTOs): http://localhost:${process.env.PORT ?? 3000}/api/dev`,
  );
  console.log(
    `Public Swagger (clean): http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
void bootstrap();
