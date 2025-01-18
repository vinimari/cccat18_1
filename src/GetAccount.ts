import { AccountDAO } from "./AccountDAO";

export class GetAccount {
  
  constructor(private readonly accountDao: AccountDAO) {}

  async execute(accoundId: string) {
    const accountData = this.accountDao.getAccountById(accoundId);
    return accountData;
  }
}
