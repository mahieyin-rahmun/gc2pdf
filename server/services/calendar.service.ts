import axios, { AxiosInstance } from "axios";

export default class GoogleCalendarService {
  private URL_MAP = {
    calendarList: "users/me/calendarList",
    eventsList: (calendarId: string) =>
      `calendars/${encodeURIComponent(calendarId)}/events`,
  };

  constructor(private accessToken: string) {}

  private requestBuilder(queryParams?: Record<string, string>): AxiosInstance {
    return axios.create({
      baseURL: "https://www.googleapis.com/calendar/v3/",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      params: {
        ...queryParams,
      },
    });
  }

  async listCalendar() {
    const response = await this.requestBuilder().get(this.URL_MAP.calendarList);
    return response.data;
  }

  async listEvents(calendarId: string, timeMin: string, timeMax: string) {
    const response = await this.requestBuilder({
      timeMin,
      timeMax,
    }).get(this.URL_MAP.eventsList(calendarId));
    return response.data;
  }
}
