import {
  HttpPostClient,
  HttpPostParams,
  HtppStatusCode,
  HttpResponse,
} from "@/data/protocols/http";
import {} from "@/data/protocols/http/http-response";

export class HttpPostClientSpy<T, R> implements HttpPostClient<T, R> {
  url?: string;
  body?: T;
  response: HttpResponse<R> = {
    statusCode: HtppStatusCode.ok,
  };
  async post(params: HttpPostParams<T>): Promise<HttpResponse<R>> {
    this.url = params.url;
    this.body = params.body;
    return Promise.resolve(this.response);
  }
}
