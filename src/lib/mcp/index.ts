import { defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import listServices from "./tools/list-services";
import listTestimonials from "./tools/list-testimonials";
import draftBookingEmail from "./tools/draft-booking-email";

export default defineMcp({
  name: "le-h-showcase",
  title: "LE H Showcase",
  version: "0.1.0",
  instructions:
    "Public tools for the LE H portfolio (MC / host). Use `get_profile` for bio, languages and stats, `list_services` for the event formats he hosts, `list_testimonials` for client quotes, and `draft_booking_email` to prepare a booking enquiry addressed to lehbookingpro@gmail.com. All data is public website content; nothing is written or sent.",
  tools: [getProfile, listServices, listTestimonials, draftBookingEmail],
});
