import { InputType, OmitType } from '@nestjs/graphql';
import { UpdateAccountInput } from './update-account.input';

@InputType()
export class CreateAccountInput extends OmitType(
  UpdateAccountInput,
  ['id'],
  InputType,
) {}
