import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [DbModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
