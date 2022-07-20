export enum HtppStatusCode {
  noContent = 204,
  unathorized = 401,
}

export type HttpResponse = {
  statusCode: HtppStatusCode;
  body?: any;
};
