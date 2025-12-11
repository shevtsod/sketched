import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { and, asc, eq, gt, lt } from 'drizzle-orm';
import { accounts, users } from '../../common/db/schema';
import { PaginationArgs } from '../../common/graphql/pagination/pagination.args';
import {
  Direction,
  paginate,
} from '../../common/graphql/pagination/pagination.util';
import { AccountsService } from '../accounts/accounts.service';
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
    const res = await this.usersService.create([createUserInput]);
    return res[0];
  }

  @Query(() => User)
  user(
    @Args('findUserInput') { id }: FindUserInput,
  ): Promise<User | undefined> {
    return this.usersService.findOne({ where: eq(users.id, id) });
  }

  @Query(() => UserConnection)
  async users(
    @Args() pagination: PaginationArgs,
    @Args('findUsersInput', { nullable: true }) findUsersInput?: FindUsersInput,
  ): Promise<UserConnection> {
    const where = and(
      ...Object.entries(findUsersInput ?? {}).map(([k, v]) => eq(users[k], v)),
    );

    return paginate(
      pagination,
      (user) => user.id,
      (limit, direction, cursor) => {
        const operator = direction === Direction.ASC ? gt : lt;
        const whereId = cursor ? operator(users.id, cursor) : undefined;

        return this.usersService.findManyWithCount(
          {
            where: and(where, whereId),
            limit,
            orderBy: asc(users.id),
          },
          {
            where,
          },
        );
      },
    );
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') { id, ...updateUserInput }: UpdateUserInput,
  ): Promise<User> {
    const res = this.usersService.update(eq(users.id, id), updateUserInput);
    return res[0];
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('findUserInput') { id }: FindUserInput,
  ): Promise<User> {
    const res = await this.usersService.delete(eq(users.id, id));
    return res[0];
  }

  @ResolveField(() => [Account])
  async accounts(@Parent() user: User): Promise<Account[]> {
    return this.accountsService.findMany({
      // TODO: paginate
      where: eq(accounts.userId, user.id),
    });
  }
}
