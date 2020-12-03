import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import Providers from "next-auth/providers";
import { TUser } from "../../../types/types";

const options: NextAuthOptions = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope:
        "https://www.googleapis.com/auth/userinfo.profile \
      https://www.googleapis.com/auth/userinfo.email \
      https://www.googleapis.com/auth/calendar.events \
      https://www.googleapis.com/auth/calendar \
      https://www.googleapis.com/auth/calendar.calendarlist",
      // this is needed for re-issuing refresh tokens
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    }),
  ],
  secret: process.env.SESSION_SECRET,
  session: {
    jwt: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    jwt: async function (token, user: TUser, account, profile, isNewUser) {
      if (user) {
        // user just signed in
        token = {
          ...token,
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          exp: Date.now() + (account.expires_in as number),
        };
      }

      // TODO: implement refreshing tokens
      return token;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
