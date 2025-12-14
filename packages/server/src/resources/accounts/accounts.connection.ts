import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from '../../common/graphql/pagination/connection.type';
import { EdgeType } from '../../common/graphql/pagination/edge.type';
import { Account } from './entities/account.entity';

@ObjectType()
export class AccountEdge extends EdgeType(Account) {}

@ObjectType()
export class AccountConnection extends ConnectionType(AccountEdge) {}
