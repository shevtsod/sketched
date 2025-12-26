import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from '../../common/graphql/pagination/connection.type';
import { User } from './entities/user.entity';

@ObjectType()
export class UserConnection extends ConnectionType(User) {}
