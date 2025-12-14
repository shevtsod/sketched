import { InputType, PartialType } from '@nestjs/graphql';
import { Account } from '../entities/account.entity';

@InputType()
export class FindAccountsInput extends PartialType(Account, InputType) {}
