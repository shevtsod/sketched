import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class FindUserInput extends PickType(User, ['id'], InputType) {}
