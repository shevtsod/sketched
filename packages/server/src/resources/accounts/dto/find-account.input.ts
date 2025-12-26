import { ArgsType, PickType } from '@nestjs/graphql';
import { Account } from '../entities/account.entity';

@ArgsType()
export class FindAccountInput extends PickType(Account, ['id'], ArgsType) {}
