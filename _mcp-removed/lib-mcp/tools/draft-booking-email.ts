import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { profile } from "../data";

export default defineTool({
  name: "draft_booking_email",
  title: "Draft a booking email",
  description:
    "Build a ready-to-send booking enquiry (mailto link, subject and body) addressed to LE H. Does not send anything.",
  inputSchema: {
    eventName: z.string().describe("Name of the event."),
    eventDate: z.string().optional().describe("Date or period of the event, e.g. 2026-09-12."),
    city: z.string().optional().describe("City / venue of the event."),
    audienceSize: z.number().int().positive().optional().describe("Expected number of attendees."),
    details: z.string().optional().describe("Any extra context: format, timings, budget range."),
    contactName: z.string().optional().describe("Name of the person enquiring."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: ({ eventName, eventDate, city, audienceSize, details, contactName }) => {
    const subject = `Booking LE H — ${eventName}`;
    const lines = [
      "Bonjour LE H,",
      "",
      `Nous souhaiterions vous réserver comme MC / host pour « ${eventName} ».`,
      eventDate ? `Date : ${eventDate}` : null,
      city ? `Lieu : ${city}` : null,
      audienceSize ? `Public attendu : ${audienceSize} personnes` : null,
      details ? `Détails : ${details}` : null,
      "",
      "Pourriez-vous nous indiquer vos disponibilités et conditions ?",
      "",
      contactName ? `Merci,\n${contactName}` : "Merci,",
    ].filter(Boolean) as string[];
    const body = lines.join("\n");
    const data = {
      to: profile.bookingEmail,
      subject,
      body,
      mailto: `mailto:${profile.bookingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    };
    return {
      content: [{ type: "text", text: `${subject}\n\n${body}\n\n${data.mailto}` }],
      structuredContent: data,
    };
  },
});
