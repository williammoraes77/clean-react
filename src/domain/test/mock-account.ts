import { AuthenticationParams } from "@/domain/usecases/authentication";
import { AccountModel } from "../models";
import faker from "faker";

export const MockAthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const MockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.uuid(),
});
