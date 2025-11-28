import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from '../../db/db.service';
import { UsersService } from './users.service';

const mockDbService = {};

describe('UsersService', () => {
  let service: UsersService;
  let dbService: jest.Mocked<DbService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<jest.Mocked<DbService>>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
