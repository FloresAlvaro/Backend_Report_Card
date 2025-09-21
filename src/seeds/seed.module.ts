import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { RolesModule } from '../roles/roles.module';
import { GradesModule } from '../grades/grades.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { UsersModule } from '../users/users.module';
import { StudentSubjectsModule } from '../student-subjects/student-subjects.module';

@Module({
  imports: [
    RolesModule,
    GradesModule,
    SubjectsModule,
    UsersModule,
    StudentSubjectsModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
