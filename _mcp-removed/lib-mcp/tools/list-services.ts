import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { otherFormats, pickLang, services } from "../data";

export default defineTool({
  name: "list_services",
  title: "List services",
  description: "List the public event formats LE H hosts (festivals, corporate galas, clubs) with descriptions.",
  inputSchema: {
    lang: z.enum(["fr", "en", "es"]).optional().describe("Language of the descriptions. Defaults to fr."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const l = pickLang(lang);
    const data = {
      services: services.map((s) => ({ id: s.id, name: s.name[l], description: s.description[l] })),
      otherFormats,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  },
});
