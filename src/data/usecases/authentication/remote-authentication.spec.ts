import { RemoteAuthentication } from "./remote-authentication";
import { HttpPostClientSpy } from "@/data/test";
import { MockAthentication, MockAccountModel } from "@/domain/test";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import { HtppStatusCode } from "@/data/protocols/http";
import { AuthenticationParams } from "@/domain/usecases";
import { AccountModel } from "@/domain/models";
import faker from "faker";

type SutTypes = {
  sut: RemoteAuthentication;
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<
    AuthenticationParams,
    AccountModel
  >();
  const sut = new RemoteAuthentication(url, httpPostClientSpy);
  return {
    sut,
    httpPostClientSpy,
  };
};

describe("RemoteAuthentication", () => {
  test("Should call HttpClient with correct URL", async () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);
    await sut.auth(MockAthentication());
    expect(httpPostClientSpy.url).toBe(url);
  });

  test("Should call HttpClient with correct body", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    const authenticationParans = MockAthentication();
    await sut.auth(authenticationParans);
    expect(httpPostClientSpy.body).toEqual(authenticationParans);
  });

  test("Should throw InvalidCredentialsError if HttpClient returns 401", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HtppStatusCode.unauthorized,
    };
    const promise = sut.auth(MockAthentication());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test("Should throw unexpectedError if HttpClient returns 400", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HtppStatusCode.badRequest,
    };
    const promise = sut.auth(MockAthentication());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw unexpectedError if HttpClient returns 500", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HtppStatusCode.serverError,
    };
    const promise = sut.auth(MockAthentication());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw unexpectedError if HttpClient returns 404", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HtppStatusCode.notFound,
    };
    const promise = sut.auth(MockAthentication());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw an AccountModel if HttpClient returns 200", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    const httpResult = MockAccountModel();
    httpPostClientSpy.response = {
      statusCode: HtppStatusCode.ok,
      body: httpResult,
    };
    const account = await sut.auth(MockAthentication());
    expect(account).toEqual(httpResult);
  });
});
