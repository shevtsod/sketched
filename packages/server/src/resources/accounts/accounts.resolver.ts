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
    @Args() createAccountInput: CreateAccountInput,
  ): Promise<Account> {
    const res = await this.accountsService.create({ data: createAccountInput });
    return plainToInstance(Account, res[0]);
  }

  @Query(() => Account)
  async account(
    @Args() findAccountInput: FindAccountInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<Account | null> {
    const res = await this.accountsService.findUnique({
      where: findAccountInput,
      ...prismaArgs,
    });
    return plainToInstance(Account, res);
  }

  @Query(() => AccountConnection)
  accounts(
    @Args() findAccountsInput: FindAccountsInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<AccountConnection> {
    const { first, after, last, before, ...input } = findAccountsInput;
    return this.accountsService.paginate(
      { first, after, last, before },
      { where: input, ...prismaArgs },
      { transformClass: Account },
    );
  }

  @Mutation(() => Account)
  async updateAccount(
    @Args()
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
    @Args() findAccountInput: FindAccountInput,
  ): Promise<Account> {
    const res = await this.accountsService.delete({ where: findAccountInput });
    return plainToInstance(Account, res[0]);
  }

  @ResolveField(() => User)
  async user(
    @Parent() account: Account,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<User | null> {
    const res = await this.usersService.findOne({
      where: { accounts: { some: { id: account.id } } },
      ...prismaArgs,
    });
    return plainToInstance(User, res);
  }
}
