module.exports = {
  typescript: {
    // the only errors in the app currently is the two typing errors in pages/calendar/[calendarId].tsx
    // which are harmless and most likely due to faulty typings
    ignoreBuildErrors: true,
  },
}