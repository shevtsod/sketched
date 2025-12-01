import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Edge } from './edge.type';
import { PageInfo } from './page-info';

/** Paginated resources and metadata */
export interface Connection<T> {
  /** Data in this page */
  edges: Edge<T>[];

  /** Pagination metadata */
  pageInfo: PageInfo;

  /** Total number of records */
  totalCount: number;
}

export function ConnectionType<T>(
  EntityClass: Type<T>,
  EdgeClass: Type<Edge<T>>,
): Type<Connection<T>> {
  @ObjectType({ isAbstract: true })
  abstract class ConnectionClass<T> {
    @Field(() => [EdgeClass])
    edges: Edge<InstanceType<typeof EntityClass>>[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return ConnectionClass as Type<Connection<T>>;
}
