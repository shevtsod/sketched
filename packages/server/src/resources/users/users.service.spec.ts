import { Test } from '@nestjs/testing';
import { DbService } from '../../common/db/db.service';
import { UsersService } from './users.service';

const mockDbService = {};

describe('UsersService', () => {
  let service: UsersService;
  let dbService: jest.Mocked<DbService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get(UsersService);
    dbService = module.get<jest.Mocked<DbService>>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
