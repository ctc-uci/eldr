import { google } from "googleapis";

export async function sendCalendarInvite(
  email: string,
  clinicDetails: {
    name: string;
    description?: string;
    location?: string;
    start_time: Date;
    end_time: Date;
    date: Date;
  }
) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      // TODO: Use refresh token from database instead of env
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    oauth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        console.log(tokens.refresh_token);
      }
      console.log(tokens.access_token);
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const { name, description, start_time, end_time, location } = clinicDetails;

    const event = {
      summary: name || "Clinic Event",
      description: description || "Thank you for registering!",
      location: location || "",
      start: {
        dateTime: new Date(start_time).toISOString(),
      },
      end: {
        dateTime: new Date(end_time).toISOString(),
      },
      attendees: [{ email }],
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
      sendUpdates: "all",
    });

    return { success: true, event: response.data };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return { success: false, error: (error as Error).message };
  }
}
