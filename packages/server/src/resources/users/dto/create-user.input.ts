import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Length(1, 256)
  @IsEmail()
  @Field()
  email: string;

  @Length(1, 256)
  @Field()
  name: string;

  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  image?: string | null;
}
