import { NextApiRequest } from "next";
import { User } from "next-auth";

export type TUser = User & Record<string, any>;

export type AuthenticatedNextApiRequest = {
  accessToken: string;
} & NextApiRequest;
