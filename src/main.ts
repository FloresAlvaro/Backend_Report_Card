import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { GradesModule } from './grades/grades.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { StudentSubjectsModule } from './student-subjects/student-subjects.module';
import { SeedModule } from './seeds/seed.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Report Card API')
    .setDescription('API documentation for Report Card management system')
    .setVersion('1.0')
    .addTag('Users', 'User management endpoints')
    .addTag('Roles', 'Role management endpoints')
    .addTag('Grades', 'Grade management endpoints')
    .addTag('Subjects', 'Subject management endpoints')
    .addTag('Teachers', 'Teacher management endpoints')
    .addTag('Students', 'Student management endpoints')
    .addTag(
      'Student-Subjects',
      'Student-Subject enrollment management endpoints',
    )
    .addTag('Seeds', 'Database seeding endpoints for sample data')
    .build();

  // Crear documento con todos los módulos principales
  const document = SwaggerModule.createDocument(app, config, {
    include: [
      UsersModule,
      RolesModule,
      GradesModule,
      SubjectsModule,
      TeachersModule,
      StudentsModule,
      StudentSubjectsModule,
      SeedModule,
    ],
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
