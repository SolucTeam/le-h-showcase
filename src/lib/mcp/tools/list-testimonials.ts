import { defineTool } from "@lovable.dev/mcp-js";
import { testimonials } from "../data";

export default defineTool({
  name: "list_testimonials",
  title: "List testimonials",
  description: "Public client testimonials published on the LE H portfolio.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(testimonials, null, 2) }],
    structuredContent: { testimonials },
  }),
});
