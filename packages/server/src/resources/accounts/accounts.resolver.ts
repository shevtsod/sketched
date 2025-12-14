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
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AccountConnection } from './accounts.connection';
import { AccountsService } from './accounts.service';
import { CreateAccountInput } from './dto/create-account.input';
import { FindAccountInput } from './dto/find-account.input';
import { FindAccountsInput } from './dto/find-accounts.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { Account } from './entities/account.entity';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Account)
  async createAccount(
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
  ): Promise<Account> {
    const res = await this.accountsService.create({ data: createAccountInput });
    return plainToInstance(Account, res[0]);
  }

  @Query(() => Account)
  async account(
    @Args('findAccountInput') findAccountInput: FindAccountInput,
  ): Promise<Account | null> {
    const res = await this.accountsService.findOne({ where: findAccountInput });
    return plainToInstance(Account, res);
  }

  @Query(() => AccountConnection)
  accounts(
    @Args() paginationArgs: PaginationArgs,
    @Args('findAccountsInput', { nullable: true })
    findAccountsInput?: FindAccountsInput,
  ): Promise<AccountConnection> {
    return this.accountsService.paginate(
      paginationArgs,
      { where: findAccountsInput },
      { transformClass: Account },
    );
  }

  @Mutation(() => Account)
  async updateAccount(
    @Args('updateAccountInput')
    { id, ...updateAccountInput }: UpdateAccountInput,
  ): Promise<Account> {
    const res = await this.accountsService.update({
      where: { id },
      data: updateAccountInput,
    });
    return plainToInstance(Account, res[0]);
  }

  @Mutation(() => Account)
  async deleteAccount(
    @Args('findAccountInput') findAccountInput: FindAccountInput,
  ): Promise<Account> {
    const res = await this.accountsService.delete({ where: findAccountInput });
    return plainToInstance(Account, res[0]);
  }

  @ResolveField(() => User)
  async user(@Parent() account: Account): Promise<User | null> {
    const res = await this.usersService.findOne({
      where: { accounts: { some: { id: account.id } } },
    });
    return plainToInstance(User, res);
  }
}
