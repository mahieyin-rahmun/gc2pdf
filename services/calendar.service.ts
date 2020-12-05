import axios, { AxiosInstance } from "axios";
import TokenService from "./token.service";

export default class GoogleCalendarService {
  private URL_MAP = {
    calendarList: "users/me/calendarList",
    eventsList: (calendarId: string) => `calendars/${calendarId}/events`,
  };

  constructor(private accessToken: string) {}

  private requestBuilder(): AxiosInstance {
    return axios.create({
      baseURL: "https://www.googleapis.com/calendar/v3/",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  async listCalendar() {
    const response = await this.requestBuilder().get(this.URL_MAP.calendarList);
    return response.data;
  }

  async listEvents(calendarId: string) {
    const response = await this.requestBuilder().get(
      this.URL_MAP.eventsList(calendarId),
    );
    return response.data;
  }
}
