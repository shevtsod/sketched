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

/**
 * Creates a Connection class for the given edge
 *
 * @param EdgeClass class of edge
 * @returns class of connection
 */
export function ConnectionType<T>(
  EdgeClass: Type<Edge<T>>,
): Type<Connection<T>> {
  @ObjectType({ isAbstract: true })
  abstract class ConnectionClass {
    @Field(() => [EdgeClass])
    edges: Edge<T>[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return ConnectionClass as Type<Connection<T>>;
}
