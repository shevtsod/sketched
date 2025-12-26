import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { SessionsModule } from './sessions/sessions.module';
import { UsersModule } from './users/users.module';

/** List of modules of all resources (users, etc.) */
const resourceModules = [AccountsModule, SessionsModule, UsersModule];

@Module({
  imports: [...resourceModules],
})
export class ResourcesModule {}
