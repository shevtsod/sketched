import { ArgsType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ArgsType()
export class FindUserInput extends PickType(User, ['id'], ArgsType) {}
