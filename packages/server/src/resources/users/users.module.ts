import { forwardRef, Module } from '@nestjs/common';
import { DbModule } from '../../common/db/db.module';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [DbModule, forwardRef(() => AccountsModule)],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
