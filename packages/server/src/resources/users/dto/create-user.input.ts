import { ArgsType, OmitType } from '@nestjs/graphql';
import { UpdateUserInput } from './update-user.input';

@ArgsType()
export class CreateUserInput extends OmitType(
  UpdateUserInput,
  ['id'],
  ArgsType,
) {}
