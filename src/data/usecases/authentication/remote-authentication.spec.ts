import { RemoteAuthentication } from "./remote-authentication";
import { HttpPostClientSpy } from "@/data/test/mock-http-client";
import { MockAthentication } from "@/domain/test/mock-authentication";
import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error";
import faker from "faker";
import { HtppStatusCode } from "@/data/protocols/http/http-response";
import { UnexpectedError } from "@/domain/errors/unexpected-error";
import { AuthenticationParams } from "@/domain/usecases/authentication";
import { AccountModel } from "@/domain/models/account-model";

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
      statusCode: HtppStatusCode.unathorized,
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
});
