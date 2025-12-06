import { Test } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

const mockUsersService = {};

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get(UsersResolver);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
