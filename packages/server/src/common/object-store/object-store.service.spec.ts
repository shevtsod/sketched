import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { createMockConfigService } from '../config/__mocks__/config.service.mock';
import { EnvSchemaType } from '../config/env';
import { ObjectStoreService } from './object-store.service';

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(
    class {
      send = vi.fn(() => Promise.resolve({}));
    },
  ),
  PutObjectCommand: vi.fn(class {}),
  GetObjectCommand: vi.fn(class {}),
}));

const mockEnv: Partial<EnvSchemaType> = {
  STORAGE_ENDPOINT: 'test-endpoint',
  STORAGE_REGION: 'test-region',
  STORAGE_ACCESS_KEY_ID: 'test-access-key-id',
  STORAGE_SECRET_ACCESS_KEY: 'test-secret-access-key',
  STORAGE_BUCKET: 'test-bucket',
  STORAGE_URL_EXPIRATION: 100,
};

const mockConfigService = createMockConfigService(mockEnv);

describe('ObjectStoreService', () => {
  let service: ObjectStoreService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        ObjectStoreService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = app.get(ObjectStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an S3 client', async () => {
    expect(S3Client).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: mockEnv.STORAGE_ENDPOINT,
      }),
    );
  });

  it('should put an object', async () => {
    const input = { Key: 'test' };
    await service.putObject(input);
    expect(PutObjectCommand).toHaveBeenCalledWith({
      ...input,
      Bucket: mockEnv.STORAGE_BUCKET,
    });
  });

  it('should get an object', async () => {
    const input = { Key: 'test' };
    await service.getObject(input);
    expect(GetObjectCommand).toHaveBeenCalledWith({
      ...input,
      Bucket: mockEnv.STORAGE_BUCKET,
    });
  });
});
