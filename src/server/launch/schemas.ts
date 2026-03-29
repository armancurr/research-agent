export const researchSchema = {
  type: "object",
  required: ["insights"] as string[],
  properties: {
    insights: {
      type: "array",
      description: "High-signal research findings pulled from this source.",
      items: {
        type: "object",
        required: ["signal", "evidence", "whyItMatters"],
        properties: {
          signal: {
            type: "string",
            description: "Pattern, pain point, or hook worth using.",
          },
          evidence: {
            type: "string",
            description: "Short grounded evidence from the web results.",
          },
          whyItMatters: {
            type: "string",
            description: "Why this is useful for a launch script or campaign.",
          },
        },
      },
    },
  },
} as const;
