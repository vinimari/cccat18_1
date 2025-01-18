import { validateCpf } from "../src/validateCpf";

test("Should validate a CPF with a digit other than zero", function () {
  const cpf = "97456321558";
  const isValid = validateCpf(cpf);
  expect(isValid).toBe(true);
});

test("Should validate a CPF with the second digit as zero", function () {
  const cpf = "71428793860";
  const isValid = validateCpf(cpf);
  expect(isValid).toBe(true);
});

test("Should validate a CPF with the first digit as zero", function () {
  const cpf = "87748248800";
  const isValid = validateCpf(cpf);
  expect(isValid).toBe(true);
});

test("Should not validate a CPF with less than 11 characters", function () {
  const cpf = "9745632155";
  const isValid = validateCpf(cpf);
  expect(isValid).toBe(false);
});

test("Should not validate a CPF with all identical characters", function () {
  const cpf = "11111111111";
  const isValid = validateCpf(cpf);
  expect(isValid).toBe(false);
});

test("Should not validate a CPF containing letters", function () {
  const cpf = "97a56321558";
  const isValid = validateCpf(cpf);
  expect(isValid).toBe(false);
});
