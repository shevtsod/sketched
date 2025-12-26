import { ArgsType, IntersectionType, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from '../../../common/graphql/pagination/pagination.args';
import { Session } from '../entities/session.entity';

@ArgsType()
export class FindSessionsInput extends IntersectionType(
  PaginationArgs,
  PartialType(Session),
  ArgsType,
) {}
