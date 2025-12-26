import { forwardRef, Module } from '@nestjs/common';
import { DbModule } from '../../common/db/db.module';
import { UsersModule } from '../users/users.module';
import { SessionsResolver } from './sessions.resolver';
import { SessionsService } from './sessions.service';

@Module({
  imports: [DbModule, forwardRef(() => UsersModule)],
  providers: [SessionsService, SessionsResolver],
  exports: [SessionsService],
})
export class SessionsModule {}
