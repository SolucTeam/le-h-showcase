import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { pickLang, profile, stats } from "../data";

export default defineTool({
  name: "get_profile",
  title: "Get LE H profile",
  description: "Public profile of LE H: role, bio, languages, key stats and booking email.",
  inputSchema: {
    lang: z.enum(["fr", "en", "es"]).optional().describe("Language of the bio. Defaults to fr."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const l = pickLang(lang);
    const data = {
      name: profile.name,
      role: profile.role,
      basedIn: profile.basedIn,
      languages: profile.languages,
      bookingEmail: profile.bookingEmail,
      bio: profile.bio[l],
      skills: profile.skills,
      stats: stats.map((s) => ({ key: s.key, value: s.value, label: s.label[l] })),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  },
});
