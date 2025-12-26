import { ArgsType, PickType } from '@nestjs/graphql';
import { Session } from '../entities/session.entity';

@ArgsType()
export class FindSessionInput extends PickType(Session, ['id'], ArgsType) {}
