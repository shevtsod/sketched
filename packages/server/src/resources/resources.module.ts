import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

/** List of modules of all resources (users, etc.) */
const resourceModules = [UsersModule];

@Module({
  imports: [...resourceModules],
  exports: [...resourceModules],
})
export class ResourcesModule {}
