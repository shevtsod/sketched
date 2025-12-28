import { InputType, OmitType } from '@nestjs/graphql';
import { UpdateUserInput } from './update-user.input';

@InputType()
export class CreateUserInput extends OmitType(
  UpdateUserInput,
  ['id'],
  InputType,
) {}
