import { ArgsType, OmitType } from '@nestjs/graphql';
import { UpdateAccountInput } from './update-account.input';

@ArgsType()
export class CreateAccountInput extends OmitType(
  UpdateAccountInput,
  ['id'],
  ArgsType,
) {}
