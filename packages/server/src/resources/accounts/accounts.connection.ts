import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from '../../common/graphql/pagination/connection.type';
import { EdgeType } from '../../common/graphql/pagination/edge.type';
import { Account } from './entities/account.entity';

@ObjectType()
export class AccountsEdge extends EdgeType(Account) {}

@ObjectType()
export class AccountsConnection extends ConnectionType(AccountsEdge) {}
