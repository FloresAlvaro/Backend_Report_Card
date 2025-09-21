import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { GradesModule } from './grades/grades.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SeedModule } from './seeds/seed.module';

@Module({
  imports: [
    RolesModule,
    UsersModule,
    TeachersModule,
    StudentsModule,
    GradesModule,
    SubjectsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
