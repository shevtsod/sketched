import { ArgsType, IntersectionType, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from '../../../common/graphql/pagination/pagination.args';
import { Account } from '../entities/account.entity';

@ArgsType()
export class FindAccountsInput extends IntersectionType(
  PaginationArgs,
  PartialType(Account),
  ArgsType,
) {}
