import { NextApiResponse } from "next";
import TokenService from "../services/token.service";
import { AuthenticatedNextApiRequest } from "../types/types";

export default async function (
  req: AuthenticatedNextApiRequest,
  res: NextApiResponse,
  next,
) {
  const tokenService = new TokenService(req);
  const jwt = await tokenService.getToken();

  if (!jwt || !jwt.accessToken) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  req.accessToken = jwt.accessToken as string;
  next();
}
