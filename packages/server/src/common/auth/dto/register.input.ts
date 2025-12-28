import { Field } from '@nestjs/graphql';
import { IsStrongPassword } from 'class-validator';
import { CreateUserInput } from '../../../resources/users/dto/create-user.input';

/**
 * DTO for registration including all User properties and account password
 * for local authentication
 */
export class RegisterInput extends CreateUserInput {
  @IsStrongPassword()
  @Field(() => String, {
    nullable: true,
    description: 'Account password (manual authentication)',
  })
  password: string;
}
