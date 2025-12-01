import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from '../../graphql/pagination/connection.type';
import { EdgeType } from '../../graphql/pagination/edge.type';
import { User } from './entities/user.entity';

@ObjectType()
export class UserEdge extends EdgeType(User) {}

@ObjectType()
export class UserConnection extends ConnectionType(User, UserEdge) {}
