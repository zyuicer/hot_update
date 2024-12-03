import { HttpResponse } from "msw";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineRestFuiResponse(code: number, body: any, msg = "") {
  return HttpResponse.json({
    code,
    data: body,
    msg,
  });
}
