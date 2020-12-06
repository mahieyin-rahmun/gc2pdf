import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export default class TokenService {
  constructor(private req: NextApiRequest) {}

  async getToken() {
    return await getToken({
      req: this.req,
      secret: process.env.JWT_SECRET,
    });
  }
}
