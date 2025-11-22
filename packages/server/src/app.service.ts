import { Injectable } from '@nestjs/common';
import { DbService } from './db/db.service';

@Injectable()
export class AppService {
  constructor(private readonly dbService: DbService) {}

  async getHello(): Promise<string> {
    await this.dbService.db.query.user.findMany();
    return 'Hello World!';
  }
}
