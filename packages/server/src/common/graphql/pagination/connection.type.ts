import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './page-info';

/** Paginated API resource */
export interface Edge<T> {
  /** resource */
  node: T;

  /** cursor for this resource */
  cursor: string;
}

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
 * @see {@link https://docs.nestjs.com/graphql/resolvers}
 */
export function ConnectionType<T>(EntityClass: Type<T>): Type<Connection<T>> {
  @ObjectType(`${EntityClass.name}Edge`)
  abstract class EdgeClass {
    @Field()
    cursor: string;

    @Field(() => EntityClass)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class ConnectionClass {
    @Field(() => [EdgeClass])
    edges: Edge<T>[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field()
    totalCount: number;
  }

  return ConnectionClass as Type<Connection<T>>;
}
