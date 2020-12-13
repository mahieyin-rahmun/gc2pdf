import { NextApiResponse } from "next";
import GoogleCalendarService from "../../server/services/calendar.service";
import nextConnect from "next-connect";
import checkAuth from "../../server/middleware/auth.middleware";
import { AuthenticatedNextApiRequest } from "../../types/types";
import { constructJsonResponse } from "../../server/utils";

const handler = nextConnect<AuthenticatedNextApiRequest, NextApiResponse>();
handler.use(checkAuth).get(async (req, res) => {
  const accessToken = req.accessToken;
  const calendarService = new GoogleCalendarService(accessToken as string);
  const calendarList = await calendarService.listCalendar();
  return constructJsonResponse(res, 200, "success", calendarList);
});

export default handler;
