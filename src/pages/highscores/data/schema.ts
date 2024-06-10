import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const rankingSchema = z.object({
  id: z.number(),
  name: z.string(),
  score: z.number(),
  avatar: z.string(),
});

export type Ranking = z.infer<typeof rankingSchema>;
