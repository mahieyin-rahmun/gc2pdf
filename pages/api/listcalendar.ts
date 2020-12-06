import { NextApiResponse } from "next";
import GoogleCalendarService from "../../services/calendar.service";
import nextConnect from "next-connect";
import checkAuth from "../../middleware/auth.middleware";
import { AuthenticatedNextApiRequest } from "../../types/types";

const handler = nextConnect<AuthenticatedNextApiRequest, NextApiResponse>();
handler.use(checkAuth).get(async (req, res) => {
  const accessToken = req.accessToken;
  const calendarService = new GoogleCalendarService(accessToken as string);
  const calendarList = await calendarService.listCalendar();
  return res.json(calendarList);
});

export default handler;
