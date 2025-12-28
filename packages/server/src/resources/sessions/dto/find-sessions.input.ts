import { InputType, PartialType } from '@nestjs/graphql';
import { Session } from '../entities/session.entity';

@InputType()
export class FindSessionsInput extends PartialType(Session, InputType) {}
