import { NextApiResponse } from "next";
import GoogleCalendarService from "../../server/services/calendar.service";
import nextConnect from "next-connect";
import checkAuth from "../../server/middleware/auth.middleware";
import { AuthenticatedNextApiRequest } from "../../types/types";

const handler = nextConnect<AuthenticatedNextApiRequest, NextApiResponse>();
handler.use(checkAuth).get(async (req, res) => {
  const accessToken = req.accessToken;
  const calendarId = req.query["calendarId"] as string;
  const timeMin = req.query["timeMin"] as string;
  const timeMax = req.query["timeMax"] as string;

  const calendarService = new GoogleCalendarService(accessToken as string);
  const eventsList = await calendarService.listEvents(
    calendarId,
    timeMin,
    timeMax,
  );

  return res.json(eventsList);
});

export default handler;
