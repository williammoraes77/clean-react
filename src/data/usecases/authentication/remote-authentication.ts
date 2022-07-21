import { AuthenticationParams, Authentication } from "@/domain/usecases";
import { HttpPostClient, HtppStatusCode } from "@/data/protocols/http";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import { AccountModel } from "@/domain/models";

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<
      AuthenticationParams,
      AccountModel
    >
  ) {}

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params,
    });
    switch (httpResponse.statusCode) {
      case HtppStatusCode.ok:
        return httpResponse.body;
      case HtppStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      case HtppStatusCode.badRequest:
        throw new UnexpectedError();
      default:
        throw new UnexpectedError();
    }
  }
}
