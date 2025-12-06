import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

/** Paginated API resource */
export interface Edge<T> {
  /** resource */
  node: T;

  /** cursor for this resource */
  cursor: string;
}

/**
 * Creates an Edge class for the given entity
 *
 * @param EntityClass class of entity
 * @returns class of edge
 */
export function EdgeType<T>(EntityClass: Type<T>): Type<Edge<T>> {
  @ObjectType({ isAbstract: true })
  abstract class EdgeClass {
    @Field()
    cursor: string;

    @Field(() => EntityClass)
    node: T;
  }

  return EdgeClass as Type<Edge<T>>;
}
