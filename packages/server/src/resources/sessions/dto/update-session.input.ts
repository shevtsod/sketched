import { Field, InputType, OmitType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Session } from '../entities/session.entity';

@InputType()
export class UpdateSessionInput extends OmitType(
  Session,
  ['token', 'createdAt', 'updatedAt'],
  InputType,
) {
  @Length(1, 256)
  @IsString()
  @Field({ description: 'Unique session token' })
  token: string;
}
