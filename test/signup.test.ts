import axios from "axios";
import { Signup } from "../src/Signup";
import { AccountDAOMemory } from "../src/AccountDAO";
import { GetAccount } from "../src/GetAccount";

axios.defaults.validateStatus = () => {
  return true;
};

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDao = new AccountDAOMemory();
  signup = new Signup(accountDao);
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
