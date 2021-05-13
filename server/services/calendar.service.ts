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
    try {
      const response = await this.requestBuilder({
        timeMin,
        timeMax,
      }).get(this.URL_MAP.eventsList(calendarId));

      // sort by date by default
      const { items } = response.data;

      // cancelled events don't have any data with them
      const withoutCancelled = items.filter(
        (event) => event.status !== "cancelled",
      );

      const sorted = withoutCancelled.sort((event1, event2) => {
        // // sanity check for dates that do not have a start date time but just a start date
        // // e.g. Holidays
        if (
          !event1.hasOwnProperty("start") ||
          !event2.hasOwnProperty("start")
        ) {
          return -1;
        }

        let propertyNameEvent1 = "dateTime";
        let propertyNameEvent2 = "dateTime";

        if (!event1.start.hasOwnProperty(propertyNameEvent1)) {
          propertyNameEvent1 = "date";
        }

        if (!event2.start.hasOwnProperty(propertyNameEvent2)) {
          propertyNameEvent2 = "date";
        }

        const event1StartTime = new Date(event1.start[propertyNameEvent1]);
        const event2StartTime = new Date(event2.start[propertyNameEvent2]);

        return event1StartTime < event2StartTime
          ? -1
          : event1StartTime === event2StartTime
          ? 0
          : 1;
      });

      return {
        ...response.data,
        items: sorted,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
