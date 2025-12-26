import { ArgsType, Field, OmitType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Session } from '../entities/session.entity';

@ArgsType()
export class UpdateSessionInput extends OmitType(
  Session,
  ['createdAt', 'updatedAt'],
  ArgsType,
) {
  @Length(1, 256)
  @IsString()
  @Field({ description: 'Unique session token' })
  token: string;
}
