import { ArgsType, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ArgsType()
export class UpdateUserInput extends OmitType(
  User,
  ['createdAt', 'updatedAt'],
  ArgsType,
) {}
