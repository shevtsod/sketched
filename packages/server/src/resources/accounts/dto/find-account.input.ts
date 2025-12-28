import { InputType, PickType } from '@nestjs/graphql';
import { Account } from '../entities/account.entity';

@InputType()
export class FindAccountInput extends PickType(Account, ['id'], InputType) {}
