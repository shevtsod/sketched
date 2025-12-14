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
import { AccountConnection } from '../accounts/accounts.connection';
import { AccountsService } from '../accounts/accounts.service';
import { FindAccountsInput } from '../accounts/dto/find-accounts.input';
import { Account } from '../accounts/entities/account.entity';
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
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const res = await this.usersService.create({ data: createUserInput });
    return plainToInstance(User, res[0]);
  }

  @Query(() => User)
  async user(
    @Args('findUserInput') findUserInput: FindUserInput,
  ): Promise<User | null> {
    const res = this.usersService.findOne({ where: findUserInput });
    return plainToInstance(User, res);
  }

  @Query(() => UserConnection)
  users(
    @Args() paginationArgs: PaginationArgs,
    @Args('findUsersInput', { nullable: true }) findUsersInput?: FindUsersInput,
  ): Promise<UserConnection> {
    return this.usersService.paginate(
      paginationArgs,
      { where: findUsersInput },
      { transformClass: User },
    );
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') { id, ...updateUserInput }: UpdateUserInput,
  ): Promise<User> {
    const res = this.usersService.update({
      where: { id },
      data: updateUserInput,
    });
    return plainToInstance(User, res[0]);
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('findUserInput') findUserInput: FindUserInput,
  ): Promise<User> {
    const res = await this.usersService.delete({ where: findUserInput });
    return plainToInstance(User, res[0]);
  }

  @ResolveField(() => AccountConnection)
  accounts(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args('findAccountsInput', { nullable: true })
    findAccountsInput?: FindAccountsInput,
  ): Promise<AccountConnection> {
    return this.accountsService.paginate(
      paginationArgs,
      { where: { ...findAccountsInput, user } },
      { transformClass: Account },
    );
  }
}
