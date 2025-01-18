import axios from "axios";

axios.defaults.validateStatus = () => {
  return true;
};

test("Should create a new passenger account", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const response = await axios.post("http://localhost:3000/signup", input);
  const responseData = response.data;
  expect(responseData.accountId).toBeDefined();
  const responseGet = await axios.get(
    `http://localhost:3000/accounts/${responseData.accountId}`
  );
  const responseGetData = responseGet.data;
  expect(responseGetData.name).toBe(input.name);
  expect(responseGetData.email).toBe(input.email);
  expect(responseGetData.cpf).toBe(input.cpf);
  expect(responseGetData.password).toBe(input.password);
  expect(responseGetData.is_passenger).toBe(input.isPassenger);
});

test("Should not create a duplicate passenger account", async () => {
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

test("Should not create a new passenger account with an invalid name", async () => {
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

test("Should not create a new passenger account with an invalid email", async () => {
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

test("Should not create a new passenger account with an invalid CPF", async () => {
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

test("Should not create a new driver account with an invalid car plate", async () => {
  const input = {
    name: "John Doe",
    email: `johnDoe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isDriver: true,
    carPlate: "AAA999", // Invalid size
  };
  const response = await axios.post("http://localhost:3000/signup", input);
  const responseData = response.data;
  expect(responseData.message).toBe("Invalid car plate");
});
