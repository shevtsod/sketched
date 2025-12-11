import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccountInput {
  @Field({ description: 'User ID (FK)' })
  userId: number;

  @Field({ description: 'Account provider ID' })
  providerId: string;

  @Field({ description: 'Account ID in provider' })
  accountId: string;

  @Field(() => String, { nullable: true, description: 'Provider access token' })
  accessToken: string | null;

  @Field()
  refreshToken: string | null;

  @Field()
  accessTokenExpiresAt: Date | null;

  @Field()
  refreshTokenExpiresAt: Date;

  @Field()
  scope: string;

  @Field()
  idToken: string;

  @Field()
  password: string;
}
