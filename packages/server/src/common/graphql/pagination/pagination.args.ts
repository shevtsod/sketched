import { ArgsType, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

/** Request arguments for API resource pagination */
@ArgsType()
export class PaginationArgs {
  /** Forward pagination limit */
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field({ nullable: true })
  first?: number;

  /** Forward pagination cursor */
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  after?: string;

  /** Backward pagination limit */
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field({ nullable: true })
  last?: number;

  /** Backward pagination cursor */
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  before?: string;
}
