import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import { AccountDAO } from "./AccountDAO";

export class Signup {
  
  constructor(private readonly accountDao: AccountDAO) {}

  async execute(input: any) {
    input.id = crypto.randomUUID();
    const account = await this.accountDao.getAccountByEmail(input.email);
    if (account) {
      throw new Error("Account already exists");
    }
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
      throw new Error("Invalid name");
    }
    if (!input.email.match(/^(.+)@(.+)$/)) {
      throw new Error("Invalid email");
    }
    if (!validateCpf(input.cpf)) {
      throw new Error("Invalid cpf");
    }
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
      throw new Error("Invalid car plate");
    }
    await this.accountDao.saveAccount(input);
    return {
      accountId: input.id,
    };
  }
}
