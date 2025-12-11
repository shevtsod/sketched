import { Module } from '@nestjs/common';
import { DbModule } from '../../common/db/db.module';
import { AccountsService } from './accounts.service';

@Module({
  imports: [DbModule],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
