import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from '../../common/graphql/pagination/connection.type';
import { Session } from './entities/session.entity';

@ObjectType()
export class SessionConnection extends ConnectionType(Session) {}
