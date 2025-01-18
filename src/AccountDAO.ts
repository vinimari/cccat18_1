import pgp from "pg-promise";

interface IAccountDAO {
  getAccountByEmail(email: string): Promise<any>;
  getAccountById(accountId: string): Promise<any>;
  saveAccount(account: any): Promise<any>;
}

export class AccountDAO implements IAccountDAO {
  async getAccountByEmail(email: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query(
      "select * from ccca.account where email = $1",
      [email]
    );
    await connection.$pool.end();
    return accountData;
  }

  async getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query(
      "select * from ccca.account where account_id = $1",
      [accountId]
    );
    await connection.$pool.end();
    return accountData;
  }

  async saveAccount(account: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        account.id,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
        account.password,
      ]
    );
    await connection.$pool.end();
  }
}

export class AccountDAOMemory implements IAccountDAO {
  memory: any[] = [];

  async getAccountByEmail(email: string) {
    return this.memory.find((account) => account.email === email);
  }

  async getAccountById(accountId: string) {
    return this.memory.find((account) => account.id === accountId);
  }

  async saveAccount(account: any) {
    const normalAccount = this.normalizeAccount(account);
    this.memory.push(normalAccount);
  }

  normalizeAccount(account: any) {
    const normalAccount = {...account}; 
    normalAccount.is_passenger = account.isPassenger;
    delete normalAccount.isPassenger;
    return normalAccount; 
  }
}
