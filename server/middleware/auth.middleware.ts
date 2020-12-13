import { NextApiResponse } from "next";
import TokenService from "../services/token.service";
import { AuthenticatedNextApiRequest } from "../../types/types";
import { constructJsonResponse } from "../utils";

export default async function (
  req: AuthenticatedNextApiRequest,
  res: NextApiResponse,
  next,
) {
  const tokenService = new TokenService(req);
  const jwt = await tokenService.getToken();

  if (!jwt || !jwt.accessToken) {
    return constructJsonResponse(res, 401, "error", {
      message: "Unauthorized",
    });
  }

  const expires_in = jwt.expires_in as number;
  const iat = jwt.iat as number;
  const currentDate = Date.now();

  // check if the access token is expired
  if ((iat + expires_in) * 1000 < currentDate) {
    return constructJsonResponse(res, 401, "error", {
      message: "Unauthorized",
    });
  }

  req.accessToken = jwt.accessToken as string;
  next();
}
