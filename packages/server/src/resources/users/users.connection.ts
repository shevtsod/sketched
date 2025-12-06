import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from '../../common/graphql/pagination/connection.type';
import { EdgeType } from '../../common/graphql/pagination/edge.type';
import { User } from './entities/user.entity';

@ObjectType()
export class UserEdge extends EdgeType(User) {}

@ObjectType()
export class UserConnection extends ConnectionType(UserEdge) {}
