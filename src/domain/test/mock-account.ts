import { AuthenticationParams } from "@/domain/usecases/authentication";
import faker from "faker";
import { AccountModel } from "../models/account-model";

export const MockAthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const MockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.uuid(),
});
