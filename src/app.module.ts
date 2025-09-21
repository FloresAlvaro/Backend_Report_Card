import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { GradesModule } from './grades/grades.module';

@Module({
  imports: [RolesModule, UsersModule, GradesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
