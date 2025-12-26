import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from '../../common/graphql/pagination/connection.type';
import { Account } from './entities/account.entity';

@ObjectType()
export class AccountConnection extends ConnectionType(Account) {}
