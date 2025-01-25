import axios from "axios";
import { Signup } from "../src/Signup";
import { AccountDAO, AccountDAOMemory } from "../src/AccountDAO";
import { GetAccount } from "../src/GetAccount";
import sinon from "sinon";
import { MailerGatewayMemory } from "../src/MailerGateway";

axios.defaults.validateStatus = () => {
  return true;
};

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDao = new AccountDAOMemory();
  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accountDao, mailerGateway);
  getAccount = new GetAccount(accountDao);
});

test("Should create a new passenger account", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };

  const response = await signup.execute(input);
  expect(response.accountId).toBeDefined();

  const responseGet = await getAccount.execute(response.accountId);
  expect(responseGet.name).toBe(input.name);
  expect(responseGet.email).toBe(input.email);
  expect(responseGet.cpf).toBe(input.cpf);
  expect(responseGet.password).toBe(input.password);
  expect(responseGet.is_passenger).toBe(input.isPassenger);
});

// Spy
test("Should send a email when a new passenger account is created (spy)", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };

  const mailerGatewaySpy = sinon.spy(MailerGatewayMemory.prototype, "send");
  await signup.execute(input);

  sinon.assert.calledOnce(mailerGatewaySpy);
  sinon.assert.calledWith(mailerGatewaySpy, input.email, "Welcome!", "...");
  mailerGatewaySpy.restore();
});

// Stub
test("Should send a email when a new passenger account is created (stub)", async () => {
  const mailerGatewayStub = sinon
    .stub(MailerGatewayMemory.prototype, "send")
    .resolves();
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };

  await signup.execute(input);
  
  sinon.assert.calledOnce(mailerGatewayStub);
  sinon.assert.calledWith(mailerGatewayStub, input.email, "Welcome!", "...");
  mailerGatewayStub.restore();
});

test("Should not create a duplicate passenger account", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Account already exists")
  );
});

test("Should not create a new passenger account with an invalid name", async () => {
  const input = {
    name: "John", // Too short
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Should not create a new passenger account with an invalid email", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}gmail.com`, // Without '@'
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test("Should not create a new passenger account with an invalid CPF", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "9745632155", // 10 digits instead of 11
    password: "123456",
    isPassenger: true,
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid cpf")
  );
});

test("Should not create a new driver account with an invalid car plate", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isDriver: true,
    carPlate: "AAA999", // Invalid size
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});
