import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { GradesModule } from './grades/grades.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentSubjectsModule } from './student-subjects/student-subjects.module';

@Module({
  imports: [RolesModule, UsersModule, GradesModule, SubjectsModule, StudentSubjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
