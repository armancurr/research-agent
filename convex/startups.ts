import { query } from "./_generated/server";
import { requireCurrentUserId } from "./lib/auth";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);
    const startups = await ctx.db
      .query("startups")
      .withIndex("by_owner_and_updatedAt", (q) => q.eq("ownerId", userId))
      .order("desc")
      .collect();

    return Promise.all(
      startups.map(async (startup) => {
        const runs = await ctx.db
          .query("runs")
          .withIndex("by_startup_and_createdAt", (q) =>
            q.eq("startupId", startup._id),
          )
          .order("desc")
          .collect();

        const latestRun = runs[0] ?? null;

        return {
          _id: startup._id,
          brief: startup.brief,
          createdAt: startup.createdAt,
          updatedAt: startup.updatedAt,
          latestRun: latestRun
            ? {
                _id: latestRun._id,
                status: latestRun.status,
                createdAt: latestRun.createdAt,
              }
            : null,
          runCount: runs.length,
        };
      }),
    );
  },
});
