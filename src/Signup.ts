import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import { AccountDAO } from "./AccountDAO";
import { MailerGatewayMemory } from "./MailerGateway";

export class Signup {
  constructor(
    private accountDao: AccountDAO,
    private mailerGateway: MailerGatewayMemory
  ) {}

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
    await this.mailerGateway.send(input.email, "Welcome!", "...");
    return {
      accountId: input.id,
    };
  }
}
