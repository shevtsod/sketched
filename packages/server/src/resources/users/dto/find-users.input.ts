import { ArgsType, IntersectionType, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from '../../../common/graphql/pagination/pagination.args';
import { User } from '../entities/user.entity';

@ArgsType()
export class FindUsersInput extends IntersectionType(
  PaginationArgs,
  PartialType(User),
  ArgsType,
) {}
