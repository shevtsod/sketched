import { InputType, PickType } from '@nestjs/graphql';
import { Session } from '../entities/session.entity';

@InputType()
export class FindSessionInput extends PickType(Session, ['id'], InputType) {}
