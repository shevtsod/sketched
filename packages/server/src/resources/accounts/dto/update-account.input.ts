import { InputType, OmitType } from '@nestjs/graphql';
import { Account } from '../entities/account.entity';

@InputType()
export class UpdateAccountInput extends OmitType(
  Account,
  ['createdAt', 'updatedAt'],
  InputType,
) {}
