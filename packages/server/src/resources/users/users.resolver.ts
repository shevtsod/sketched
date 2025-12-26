import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { PrismaArgs } from '../../common/graphql/prisma-args/prisma-args.decorator';
import { type PrismaArgsType } from '../../common/graphql/prisma-args/prisma-args.util';
import { AccountConnection } from '../accounts/accounts.connection';
import { AccountsService } from '../accounts/accounts.service';
import { FindAccountsInput } from '../accounts/dto/find-accounts.input';
import { Account } from '../accounts/entities/account.entity';
import { FindSessionsInput } from '../sessions/dto/find-sessions.input';
import { Session } from '../sessions/entities/session.entity';
import { SessionConnection } from '../sessions/sessions.connection';
import { SessionsService } from '../sessions/sessions.service';
import { CreateUserInput } from './dto/create-user.input';
import { FindUserInput } from './dto/find-user.input';
import { FindUsersInput } from './dto/find-users.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserConnection } from './users.connection';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Mutation(() => User)
  async createUser(@Args() createUserInput: CreateUserInput): Promise<User> {
    const res = await this.usersService.create({ data: createUserInput });
    return plainToInstance(User, res[0]);
  }

  @Query(() => User)
  async user(
    @Args() findUserInput: FindUserInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<User | null> {
    const res = this.usersService.findUnique({
      where: findUserInput,
      ...prismaArgs,
    });
    return plainToInstance(User, res);
  }

  @Query(() => UserConnection)
  users(
    @Args() findUsersInput: FindUsersInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<UserConnection> {
    const { first, after, last, before, ...input } = findUsersInput;
    return this.usersService.paginate(
      { first, after, last, before },
      { where: input, ...prismaArgs },
      { transformClass: User },
    );
  }

  @Mutation(() => User)
  async updateUser(
    @Args() { id, ...updateUserInput }: UpdateUserInput,
  ): Promise<User> {
    const res = this.usersService.update({
      where: { id },
      data: updateUserInput,
    });
    return plainToInstance(User, res[0]);
  }

  @Mutation(() => User)
  async deleteUser(@Args() findUserInput: FindUserInput): Promise<User> {
    const res = await this.usersService.delete({ where: findUserInput });
    return plainToInstance(User, res[0]);
  }

  @ResolveField(() => AccountConnection)
  accounts(
    @Parent() user: User,
    @Args() findAccountsInput: FindAccountsInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<AccountConnection> {
    const { first, after, last, before, ...input } = findAccountsInput;
    return this.accountsService.paginate(
      { first, after, last, before },
      { where: { ...input, user }, ...prismaArgs },
      { transformClass: Account },
    );
  }

  @ResolveField(() => AccountConnection)
  sessions(
    @Parent() user: User,
    @Args() findSessionsInput: FindSessionsInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<SessionConnection> {
    const { first, after, last, before, ...input } = findSessionsInput;
    return this.sessionsService.paginate(
      { first, after, last, before },
      { where: { ...input, user }, ...prismaArgs },
      { transformClass: Session },
    );
  }
}
