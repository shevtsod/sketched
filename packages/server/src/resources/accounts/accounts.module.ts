import { forwardRef, Module } from '@nestjs/common';
import { DbModule } from '../../common/db/db.module';
import { UsersModule } from '../users/users.module';
import { AccountsResolver } from './accounts.resolver';
import { AccountsService } from './accounts.service';

@Module({
  imports: [DbModule, forwardRef(() => UsersModule)],
  providers: [AccountsService, AccountsResolver],
  exports: [AccountsService],
})
export class AccountsModule {}
