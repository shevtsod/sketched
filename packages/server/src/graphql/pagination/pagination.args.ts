import { ArgsType, Field } from '@nestjs/graphql';

/** Arguments for API resource pagination requests */
@ArgsType()
export class PaginationArgs {
  /** Forward pagination limit */
  @Field({ nullable: true })
  first?: number;

  /** Forward pagination cursor */
  @Field({ nullable: true })
  after?: string;

  /** Backward pagination limit */
  @Field({ nullable: true })
  last?: number;

  /** Backward pagination cursor */
  @Field({ nullable: true })
  before?: string;
}
