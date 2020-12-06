import { NextApiRequest } from "next";
import { Session, User } from "next-auth";

export type TUser = User & Record<string, any>;

export type AuthenticatedNextApiRequest = {
  accessToken: string;
} & NextApiRequest;

export type TSessionProps = {
  session: Session;
};

export type TGoogleCalendarItem = {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  timezone: string;
  backgroundColor: string;
  foregroundColor: string;
};
