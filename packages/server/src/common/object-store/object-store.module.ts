import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObjectStoreService } from './object-store.service';

@Module({
  imports: [ConfigModule],
  providers: [ObjectStoreService],
})
export class ObjectStoreModule {}
