import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './db/db.service';

const mockDbService = {
  db: {
    query: {
      users: {
        findMany: jest.fn(),
      },
    },
  },
};

describe('AppController', () => {
  let appController: AppController;
  let dbService: jest.Mocked<DbService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: DbService,
          useValue: mockDbService,
        },
        AppService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    dbService = app.get<jest.Mocked<DbService>>(DbService);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(await appController.getHello()).toBe('Hello World!');
      expect(dbService.db.query.user.findMany).toHaveBeenCalled();
    });
  });
});
