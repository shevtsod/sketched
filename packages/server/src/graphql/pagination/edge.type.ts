import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

/** Paginated API resource */
export interface Edge<T> {
  /** resource */
  node: T;

  /** cursor for this resource */
  cursor: string;
}

export function EdgeType<T>(ItemType: Type<T>): Type<Edge<T>> {
  @ObjectType({ isAbstract: true })
  abstract class EdgeClass<T> {
    @Field()
    cursor: string;

    @Field(() => ItemType)
    node: T;
  }

  return EdgeClass as Type<Edge<T>>;
}
