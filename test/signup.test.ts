import axios from "axios";
import {Signup } from "../src/Signup";
import { AccountDAOMemory } from "../src/AccountDAO";
import { GetAccount } from "../src/GetAccount";

axios.defaults.validateStatus = () => {
  return true;
};

let accounDao = new AccountDAOMemory();
let signup = new Signup(accounDao);
let getAccount: GetAccount;

beforeEach(() => {
  const accounDao = new AccountDAOMemory;
  signup = new Signup(accounDao);
  getAccount = new GetAccount(accounDao);
})

test("Deve criar uma nova conta do passageiro", async () => {
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

test("Nao deve criar uma nova conta de passageiro duplicado", async () => {
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

test("Nao deve criar uma nova conta do passageiro com nome invalido", async () => {
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

test("Nao deve criar uma nova conta do passageiro com email invalido", async () => {
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

test("Nao deve criar uma nova conta do passageiro com cpf invalido", async () => {
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

test("Nao deve criar uma nova conta do motorista com placa invalida", async () => {
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
