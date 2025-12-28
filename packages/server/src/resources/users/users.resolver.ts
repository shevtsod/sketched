import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { PaginationArgs } from '../../common/graphql/pagination/pagination.args';
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
  async createUser(
    @Args('input') input: CreateUserInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<User> {
    const res = await this.usersService.create({
      data: input,
      ...prismaArgs,
    });
    return plainToInstance(User, res[0]);
  }

  @Query(() => User)
  async user(
    @Args('input') input: FindUserInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<User | null> {
    const res = this.usersService.findUnique({
      where: input,
      ...prismaArgs,
    });
    return plainToInstance(User, res);
  }

  @Query(() => UserConnection)
  users(
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: FindUsersInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<UserConnection> {
    return this.usersService.paginate(
      paginationArgs,
      { where: input, ...prismaArgs },
      { transformClass: User },
    );
  }

  @Mutation(() => User)
  async updateUser(
    @Args('input') { id, ...input }: UpdateUserInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<User> {
    const res = await this.usersService.update({
      where: { id },
      data: input,
      ...prismaArgs,
    });
    return plainToInstance(User, res[0]);
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('input') input: FindUserInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<User> {
    const res = await this.usersService.delete({
      where: input,
      ...prismaArgs,
    });
    return plainToInstance(User, res[0]);
  }

  @ResolveField(() => AccountConnection)
  accounts(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: FindAccountsInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<AccountConnection> {
    return this.accountsService.paginate(
      paginationArgs,
      { where: { ...input, user }, ...prismaArgs },
      { transformClass: Account },
    );
  }

  @ResolveField(() => SessionConnection)
  sessions(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: FindSessionsInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<SessionConnection> {
    return this.sessionsService.paginate(
      paginationArgs,
      { where: { ...input, user }, ...prismaArgs },
      { transformClass: Session },
    );
  }
}
