import { AuthenticationParams } from "../usecases/authentication";
import faker from "faker";

export const MockAthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});
