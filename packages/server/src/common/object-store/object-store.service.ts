import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Provides
 */
@Injectable()
export class ObjectStoreService {
  private readonly s3: S3Client;
  private readonly endpoint: string;
  private readonly bucket: string;
  private readonly urlExpiration: number;

  constructor(private readonly config: ConfigService) {
    this.endpoint = config.get<string>('STORAGE_ENDPOINT')!;

    // https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3
    this.s3 = new S3Client({
      endpoint: this.endpoint,
      region: config.get<string>('STORAGE_REGION'),
      forcePathStyle: !this.endpoint?.endsWith('amazonaws.com'),
      credentials: {
        accessKeyId: config.get<string>('STORAGE_ACCESS_KEY_ID')!,
        secretAccessKey: config.get<string>('STORAGE_SECRET_ACCESS_KEY')!,
      },
    });

    this.bucket = config.get<string>('STORAGE_BUCKET')!;
    this.urlExpiration = config.get<number>('STORAGE_URL_EXPIRATION')!;
  }

  /**
   * Puts an object into object store
   *
   * @param input put object command input
   * @returns object path
   */
  async putObject(
    input: Omit<PutObjectCommandInput, 'Bucket'>,
  ): Promise<string> {
    const command = new PutObjectCommand({
      ...input,
      Bucket: this.bucket,
    });

    await this.s3.send(command);
    return `${this.endpoint}/${this.bucket}/${input.Key}`;
  }

  /**
   * Gets an object from object store
   *
   * @param input get object command input
   * @returns streaming body
   */
  async getObject(
    input: Omit<GetObjectCommandInput, 'Bucket'>,
  ): Promise<GetObjectCommandOutput['Body']> {
    const command = new GetObjectCommand({
      ...input,
      Bucket: this.bucket,
    });

    const res = await this.s3.send(command);
    return res.Body;
  }

  // TODO: DeleteObject, CopyObject, HeadObject, ListObjectsV2
}
