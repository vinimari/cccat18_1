import axios from "axios";

axios.defaults.validateStatus = () => {
  return true;
};

test("Deve criar uma nova conta do passageiro", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  }
  const response = await axios.post("http://localhost:3000/signup", input);
  const responseData = response.data;
  expect(responseData.accountId).toBeDefined();
  const responseGet = await axios.get(`http://localhost:3000/accounts/${responseData.accountId}`)
  const respondeGetData = responseGet.data;
  expect(respondeGetData.name).toBe(input.name);
  expect(respondeGetData.email).toBe(input.email);
  expect(respondeGetData.cpf).toBe(input.cpf);
  expect(respondeGetData.password).toBe(input.password);
  expect(respondeGetData.is_passenger).toBe(input.isPassenger);
});

test("Nao deve criar uma nova conta de passageiro duplicado", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  await axios.post("http://localhost:3000/signup", input);
  const response = await axios.post("http://localhost:3000/signup", input);
  const responseData = response.data;
  expect(responseData.message).toBe("Account already exists"); 
});

test("Nao deve criar uma nova conta do passageiro com nome invalido", async () => {
  const input = {
    name: "John", // Too short
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const response = await axios.post("http://localhost:3000/signup", input);
  const responseData = response.data;
  expect(responseData.message).toBe("Invalid name");
});

test("Nao deve criar uma nova conta do passageiro com email invalido", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}gmail.com`, // Without '@'
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const response = await axios.post("http://localhost:3000/signup", input);
  const responseData = response.data;
  expect(responseData.message).toBe("Invalid email");
});

test("Nao deve criar uma nova conta do passageiro com cpf invalido", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "9745632155", // 10 digits instead of 11
    password: "123456",
    isPassenger: true,
  };
  const response = await axios.post("http://localhost:3000/signup", input);
  const responseData = response.data;
  expect(responseData.message).toBe("Invalid cpf");
});

test("Nao deve criar uma nova conta do motorista com placa invalida", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isDriver: true,
    carPlate: "AAA999" // Invalid size
  };
  const response = await axios.post("http://localhost:3000/signup", input);
  const responseData = response.data;
  expect(responseData.message).toBe("Invalid car plate"); 
});

